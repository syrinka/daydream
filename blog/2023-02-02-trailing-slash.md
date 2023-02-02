---
title: Trailing Slash
---

一个 301 引发的血案。

<!--truncate-->

> 这是很久以前的一篇草稿，最近才翻找了出来。看了看内容发现现在也有点懵，遂重新补完

## 起因

之前不是在整 QQ bot 嘛。

以前用一些自动打卡的定时任务，都是通过 server 酱来推送通知的。但 server 酱每日推送限额、非赞助不得直接查看内容之类的限制果然还是不太行，加上我也不怎么用微信，体验不佳。于是考虑着往 bot 上加上类似的功能，可以通过 webhook 向用户发送消息，实现通知推送自由。

啊对，插件已经发布了，[在这里](https://github.com/syrinka/nonebot-plugin-report)，或者在[商店](https://v2.nonebot.dev/store)里搜**推送钩子**也能找到喔。

在开发环境下插件使用都没什么大问题，很顺滑，很符合我对消息推送机器人的想象。

但一到生产环境上就出怪事了。

一会儿是 `Method Not Allowed`，一会儿是 POST body 丢失。开发环境的时候什么事都没有，仿佛是什么灵异事件。

## 前置知识，Trailing Slash

不是很确定 trailing slash 该怎么翻译，字面意思大概是“后继斜杠”之类的？比如 `/path/to/url/` 右边的最后一个 `/`。果然还是先不翻译了。

有 trailing slash 的路径比如 `/folder/`，没有的比如 `/file`。通常加了 trailing slash 的路径有文件夹的语义。

## 一、proxy_pass 与 Trailing Slash

在 Nginx 的配置文件中，trailing slash 对转发语义有十分微妙的影响。请看下例：

```nginx
# 1.
location /path/to/this {
    proxy_pass http://localhost:5000;
}
# 2.
location /path/to/that/ {
    proxy_pass http://localhost:6000/;
}
```

访问 `/path/to/this/a`，会转发到 `http://localhost:5000/path/to/this/a`，没问题

访问 `/path/to/that/b`，却会转发到 `http://localhost:6000/b`

忘记从哪里看过的一篇文档里，称第一种为完全转发，第二种为截断转发。

> 只要 `proxy_pass` 的值带有路径（即使只是一个 `/`）就会触发截断转发
>
> 当触发截断转发时，它将从 URL 中截掉 `location` 匹配的部分，然后余下部分**直接**拼接到 `proxy_pass` 后面
>
> 因为这个原因，如果 `proxy_pass` 带有 trailing slash，那么 `location` 必须也有，比如说二例中写的是 `/path/to/that/` 而不能是 `/path/to/that`，不然就拼接成 `http://localhost:6000//b` 了

此为其一。

## 二、301 与 307

301 和 307 有什么区别呢，前者是永久重定向，后者是临时重定向。

在 [RFC2616](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) 对响应码的定义中，301 的描述有这么一段话：

> If the 301 status code is received in response to a request **other than GET or HEAD**, the user agent **MUST NOT** automatically redirect the request unless it can be confirmed by the user, since this might change the conditions under which the request was issued.

简而言之，如果我朝一个地址发送了 POST 请求，服务器返回了 301，那么我应该转而向重定向地址发送一个 **GET** 请求（？）。

试验了一下，curl 和 requests 都是这么实现的，真是令人高兴。

> 在 curl 中，有 `--post301` 可以关闭这个行为，当然了，不是默认开启的。

莫问，问就是向后兼容，再问就是特性的一部分。

此为其二。

## 三、location 与 Trailing Slash

其三我憋不出来了。

在插件中我有写这么一段代码：

```python
app = FastAPI()

@app.post('/', status_code=200) # mapped to /report/
async def push(r: Report):
    ...

driver.server_app.mount('/report', app)
```

简而言之是把一个子 app 挂到 `/report` 路由上，其中核心方法 `push` 的对应路由为 `/report/`。

不过直接访问 `/report` 其实也可以到 `push` 方法上，因为对于没有匹配的路由，FastAPI 会尝试在后面加一个 `/`，进行一个 307 重定向。

在生产环境，我的配置是：

```nginx
location / {
    proxy_pass https://127.0.0.1:65000/;
}

location /report/ {
    proxy_pass http://127.0.0.1:65000/report/;
}
```

嗯好，那么如果我 POST `/report`，应该是：

1. send **POST** `/report`
2. recv **307** `/report/`
3. send **POST** `/report/`

这样子对吧？天衣无缝，不愧是我。于是立即拉起生产环境，进行一个验证：

```python
import requests as rq
rq.post('https://bot.example.com/report').history
# [<Response 301>, <Response 405>]
```

**¿**

经过一上午的快乐网上冲浪，我找到一个将近十年前的 [Issue](https://github.com/alibaba/tengine/issues/407)。

Issue 是国人的，有兴趣可以看一看。主要内容如下：

> Nginx 会为有 trailing slash 的 `location` 自动设置 `auto_redirect` 标志，影响如下：
>
> 假如你访问了 `/index` 路径，在配置文件中没有匹配的块，但是刚好有另一个 `/index/` 的块，就会 **301** 重定向到 `/index/`。

**301** 啊？Nginx，您是否清醒？

这下情况清晰了，

1. send **POST** `/report`
2. recv **301** `/report/`
3. send **GET** `/report/`
4. recv **405** `Method Not Allowed`

> 笑死，debug 了一整天，原来是特性啊

## 后续

这事从各种意义上讲都太邪门了，能碰到我都佩服我自己。

后来把代码改了：

```python
app = FastAPI()

@app.post('/report', status_code=200) # mapped to /report
async def push(r: Report):
    ...

driver.server_app.mount('/', app)
```

```nginx
location /report {
    proxy_pass http://127.0.0.1:65000/report;
}
```

大家都没有 trailing slash 了，生产环境不报错了，皆大欢喜，皆大欢喜。
