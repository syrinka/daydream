---
title: Docker 技巧杂记
tags:
- active
- docker
- note
---

一些零零碎碎的要点

:::info
Migrated from old blog
:::

<!--truncate-->

> 清理草稿中……这篇是什么时候写的来着？
> 
> ……六月份？

## 入网出网

众所周知，容器有四种网络模式：

- host
- none
- bridge
- container

个中差别就不多说了，直接瞄准最常用的 `bridge` 模式。

Docker 会为每个容器/ compose 分配一个单独的 B 级子网，其中每个容器都有唯一的 IP。从宿主机访问容器，一可以使用端口转发，二也可以通过 IP 访问。容器也可以如此，通过 IP 访问宿主机。

容器出网是默认无限制的，但一般没有 DNS 解析（当然也视镜像而定）。若希望在容器内解析域名，可挂载宿主机的 `/etc/resolv.conf`；若希望能通过域名访问同子网的另一容器，可以使用 `link` 选项，它在隐式指定容器间依赖关系的同时，会将域名解析到对应容器的 IP 上。

## 内外用户

众所周知，Linux 只靠 `UID/GID` 标识用户。在容器内，无法使用宿主机中的用户名/组名。

同时，容器内外相同的 `UID/GID` 权限是一样的，在 Linux 看来，它们是同一名用户。

直接使用 `root` 运行容器是危险的，这意味着他人只要获得了容器的控制权，就可以通过挂载卷获得宿主机的 `root` 权限。

若希望在容器内仍能使用宿主机的用户名/组名，可简单挂载 `/etc/passwd`、`/etc/group` 两个文件，记得设置只读。

## 容器保活

每个容器都要有一个前台进程。Docker 只以这个进程判断容器的状态，进程活，则容器活 (Running)；进程死，则容器亦死 (Exited)。

所谓重启容器 (Restart)，也只是针对这个前台进程而言的。

如果想不到该用什么作为前台进程，`tail -f /var/log/syslog` 总是个不会错的选择。

## Use anchor in compose file

使用 `docker compose` 时，常常会有多处相同配置项的需求——比如拉起十数个 CTF 环境，同时为每个环境设置资源限制。每处都复制一遍肯定不是什么好主意。

在 compose file 里，仍可以使用 yaml 的 Anchor 语法。

```yml
# docker-compose.yml
version: '3.6'

# 自定义的键名请使用 `x-*` 的形式
x-general: &general
  restart: on-failure
  deploy:
    resources:
      cpus: 0.20
      memory: 256M
    reservations:
      memory: 64M

services:
  env1:
    <<: *general
    image: ctf/env1
    ports:
    - 20001:80
  env2:
    <<: *general
    image: ctf/env2
    ports:
    - 20002:80
  env3:
    <<: *general
    image: ctf/env3
    ports:
    - 20003:80
# ...
```

## Dive into Image

> A tool for exploring a docker image, layer contents, and discovering ways to shrink the size of your Docker/OCI image.
>
> —— [wagoodman/dive](https://github.com/wagoodman/dive)

一个用来探索镜像内部文件的小工具，比 `history` 好用多了。仍在摸索中。

## Save & Load

备份容器。并不是很常用的命令，但在某次不慎彻底把 VPS 玩坏的危机中拯救了我的数据。

虽然没有备份数据卷来得规范，但它命令短啊（正论）。

```bash
docker commit -m "commit message" CONTAINER IMAGE
docker save IMAGE > backup.tar

docker load < backup.tar
```

## ENTRYPOINT & CMD

感觉这两个指令取名得有些随意……以其作用而言，`EXECUTABLE` 与 `ARGUMENTS` 可能是更符合直觉的称呼：`ENTRYPOINT` 应是容器主程序的入口点，`CMD` 则向主程序传入参数以改变其行为，在命令行里写 `docker run IMAGE a b c` 其中的 `a b c` 其实正是覆盖了 `CMD` 的值。

`ENTRYPOINT` 与 `CMD` 都有两种书写形式，Exec form `["top", "-b"]` 与 Shell form `top -b`。

[官方文档](https://docs.docker.com/engine/reference/builder/#understand-how-cmd-and-entrypoint-interact)有展示不同形式搭配两个指令的解析结果，但我在测试时却发现与预期不符，很怪。

以下是我测试得到的结果：

> Docker version 20.10.18, build b40c2f6

| | No ENTRYPOINT | ENTRYPOINT `entry param` | ENTRYPOINT `["entry", "param"]` |
|--|--|--|--|
| **No CMD** | not allowed | `/bin/sh -c "entry param"` | `entry param` |
| **CMD `cmd arg`** | `/bin/sh -c "cmd arg"` | `/bin/sh -c "entry param cmd arg"` | `entry param cmd arg` |
| **CMD `["cmd", "arg"]`** | `cmd arg` | `/bin/sh -c "entry param cmd arg"` | `entry param cmd arg`

另外有一些小细节：

- 当一个新的 `ENTRYPOINT` 被设置，则旧的 `CMD` 将会失效
- 若环境中没有 sh，则两个指令都只能使用 Exec form
- 若容器启动前的工作较复杂，可以包装为脚本文件，以将其作为 `ENTRYPOINT`，入口脚本常命名为 `/docker-entrypoint.sh`

## run before entrypoint

小 trick，适用于在 `ENTRYPOINT` 前执行若干命令的需求。

```yml
# docker-compose.yml
entrypoint: /bin/bash -c
command:
- |
    crontab /app/cronfile  \
    mkdir -p /app/log      \
    touch /app/log/run.log \
    touch /app/log/err.log \
    /docker-entrypoint.sh
```
