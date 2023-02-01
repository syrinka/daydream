---
title: CronJob 笔记
---

写 cron in docker 时小小复习了一遍 cronjob，整理一下以便日后查阅

:::info
Migrated from old blog
:::

<!--truncate-->

使用 Ubuntu 22.04

## 复习一下语法

```bash
# an example of cronjob
* * * * * command
```

```txt
| | | | |
| | | | +----- 周 (0 - 7) (0 与 7 均表示周日)
| | | +------- 月 (1 - 12)
| | +--------- 日 (1 - 31)
| +----------- 时 (0 - 23)
+------------- 分 (0 - 59)
```

以 `#` 开头的行是注释。

`%` 是命令换行，可使用反斜杠转义之。

## 命令行

```bash
# print your crontab
crontab -l

# edit
crontab -e

# *replace* your crontab with given file
crontab FILE

# add a new cronjob (not available in sh)
crontab -l | {
    cat
    echo "new cronjob"
} | crontab -

# run cron daemon
# by the way, in alpine it is `crond`
cron
```

## 权限

两个配置文件，`/etc/cron.allow` 与 `/etc/cron.deny`。

用户有权限设置 cronjob，当：

1. allow 存在，且用户在 allow 中
2. allow 不存在，且用户不在 deny 中

## 环境变量

在 cron 中有以下几个环境变量会被自动设置：

- `HOME`
- `LOGNAME`（即 `USER`）
- `SHELL=/bin/sh`
- `PATH=/bin:/usr/bin`

但其它的都没有了。所以 cronjob 的执行环境是缺失的，能绝对路径就不要用相对路径。

可以在 crontab 中通过 `key=value` 来覆盖或设置新的环境变量。

```bash
MSG=114514
* * * * * echo $MSG
```

例如，cronjob 默认是使用 `$SHELL -c`，即 `sh -c` 来执行的，会出现奇奇怪怪的语法问题（比如它竟然不支持 `&>>`），所以我几乎一定会加上一行 `SHELL=/bin/bash`。

crontab 是自上而下解析的，旧的环境变量会被新的覆盖：

```bash
MSG=114
1 * * * * echo $MSG

MSG=514
# msg changed
2 * * * * echo $MSG
```

### key=value 的行为

crontab 中 `key=value` 的解析方式与命令行中的有所不同：

- 等号左右可以有任意数量的空格
- value 可以用单引号或双引号括起
- 一条一行，**不允许换行**
- 所有字符都是字面量，**没有转义**

这会造诸多限制：

- 不能用多行环境变量
- 不能用 `\r` `\n` 等字符
- 不能用 ANSI-C 格式
- 不能用变量替换

以及导致一些比较奇怪的行为：

```bash
# good
var1 = aaa
var2 = "bbb"

# good, but will be parsed into var3="\$'ccc'"
var3 = $'ccc'

# bad, wrapping is not supported
var4 = "aaa
bbb"
```

```bash
# good
var5 = mmm"
```

```bash
# bad
var6 = "mmm
```

## 环境变量 +

在某些情景下我们需要向 cron 传递一些不可控的环境变量（比如 `cron in docker`）、甚至多行的环境变量。

显然这没法直接写进 crontab 里。

该怎么做呢。

```bash
export -p > /envfile
```

此命令可以把当前所有环境变量以 `export key=value` 的格式输出到 `/envfile` 里。然后在 cronjob 里 source 它，就可以传递所有环境变量了。

source 的方法常见的有两种：

### 方法一，&&

```bash
* * * * * source /envfile && command
```

### 方法二，BASH_ENV

在 crontab 里加一行 `BASH_ENV=/envfile`，这样所有用 bash 执行的 cronjob 都会自动 `source /envfile` 了。

不过这是 bash 的特性，对用 sh 或其它别的 shell 执行的 cronjob 没有效果。

让 cronjob 用 bash 执行一般有两种方法：

1. `#!/bin/bash`
2. 与 `SHELL=/bin/bash` 搭配

## 输出重定向

> cronjob 的输出不见了！

正常的。

cron 会捕获来自标准输出和标准错误的所有内容，然后以邮件形式发送给 crontab 的所有者。所以 cronjob 一般是找不到输出的。如果需要有，那就得手动把 cronjob 输出重定向到日志文件。

```bash
* * * * * echo "hello" &>> /var/somelog
```

> 看许多人说 cronjob 一定要输出重定向，不然若是主机没有邮件服务的话，邮件会成为死信，慢慢积压在一起把系统盘撑爆。
> 
> 不确定是不是真的。

另一方面，若是主机启动了邮件服务，但又不想 cron 发送邮件，可以设置 `MAILTO=`。

## 其它

`/var/spool/cron/crontabs/${USER}` 是各个用户的 crontab 文件。

如你希望监视 cronjob 的执行情况，可以尝试 `grep CRON /var/log/syslog`，但我更推荐使用将执行情况输出到单独的文件。可以在 `/etc/rsyslog.d/50-default.conf` 中增加一行 `cron.* /var/log/cron.log`，然后 `service rsyslog restart`。

## Fin.

今日小雨。

听闻国庆节克扣假期，痛不欲生。
