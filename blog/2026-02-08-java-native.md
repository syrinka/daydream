---
title: Java Native 注册
---

### 静态注册

注册是将 Native 层函数挂载到 Java 上的过程。
Java 通过类似于 `public native ...` 的字样来声明这是一个 Native 层函数，挂载后就可以当作正常函数来调用。

使用例

```java
package who.care;

public class Cls {
    static {
        System.loadLibrary("util"); // libutil.so
    }
    public native void sayHello();
}
```

静态注册，有命名约定，其函数声明如下：
`Java_<packagename>_<classname>_<methodname>(JNIEnv* env, jclass clazz, <params>)`

若文件载入了 Jni.h，则会收集命名符合该模式的函数自动注册。

若是重载函数，需要额外追加双下划线 + 参数签名，对签名中特殊字符需要进行转义。
`Java_<packagename>_<classname>_<methodname>__<signature>`

- `/ -> _`
- `_ -> _1`
- `; -> _2`
- `[ -> _3`
- ...

动态注册，则是提供一个包含上面信息的表，在 JNI_Onload 函数中手动注册
JNI_Onload 是载入 Jni.h 后执行的第一个函数。
动态注册不会有命名的限制

如果发现 so 文件里没有多少以 `Java_` 开头在函数，可考虑是否为动态注册，

### 动态注册的流程

一个 so 文件被连接，其中的 .init 与 .init_array 段会首先被依次执行。

#### JavaVM & JNIEnv

JavaVM 是虚拟机在 JNI 层的表示，一个进程只有一个 JavaVM，所有线程共用一个 JavaVM。
JavaVM 通常只是用来获取 JNIEnv。

JNIEnv 表示 Java 调用 native 语言的环境，是一个封装了几乎全部 JNI 方法的指针。
native 层可以通过 JNIEnv 调用 Java 层函数。
不同线程的 JNIEnv 彼此独立。

动态注册需要重写 `JNI_Onload`，并使用 `RegisterNatives` 手动注册函数，以下是一个示例。

```c
// 1. 重写 JNI_OnLoad 方法
// jint 是 Java int
JNIEXPORT jint JNI_OnLoad(JavaVM* jvm, void* reserved){
 // 2. 获取 JNIEnv
 JNIEnv* env = NULL;
 if(jvm->GetEnv((void**)&env, JNI_VERSION_1_6) != JNI_OK){
  return JNI_FALSE;
 }
 // 3. 获取注册方法所在 Java 类的引用
 jclass clazz = env->FindClass("com/curz0n/MainActivity");
 if (!clazz){
  return JNI_FALSE;
 }
 // 4. 动态注册 native 方法
 if(env->RegisterNatives(clazz, gMethods, sizeof(gMethods)/sizeof(gMethods[0]) )){
  return JNI_FALSE;
 } 
 return JNI_VERSION_1_6;
}
```

其中第四步 `gMethods` 变量是 `JNINativeMethod` 结构体，用于映射 Java 方法与 C/C++ 函数的关系，其定义如下:

```c
typedef struct {
    const char* name; // 动态注册的 Java 方法名
    const char* signature; // 方法签名，使用 smali 语法描述
    void* fnPtr; // 指向实现 Java 方法的 C/C++ 函数指针
} JNINativeMethod;
```

`RegisterNatives` 函数声明如下

```c
jint RegisterNatives(
 jclass clazz, // 目标 Java 类
 const JNINativeMethod* methods, // Methods 列表
    jint nMethods // 一共有几个 Method 需要注册
)
```

一个 native 方法示例如下：

```c
JNIEXPORT void JNICALL sayHello(JNIEnv *env, jobject a1, jint a2) {
   printf("Hello World!\n");
   return;
}
```

可见 native 函数第一个参数总是 JNIEnv，在函数体中就可以通过：

```c
(*env)->funcname()
```

调用 Java 层函数。

### 反汇编的情况

源码被编译后，其中变量类型信息几乎会全部丢失。反汇编后需要手动恢复变量的类型。

在反汇编的代码中，指针通常被视为 `int` 或 `__int64` 类型。

```c
// 这里 a1 可能是一个指针
char v1 = *(char *)a1;

// 这里 a2 可能是一个双指针，v2 可能是指针
// 取双字长，即 64 位
__int64 v2 = *(_DWORD *)a2; 
```

native 函数反汇编后的特征如下：

```c
(*(int (__fastcall **)(void))(*(_DWORD *)a1 + 676))
```

可见，a1 为双指针，寻址一次后加上 +676 的偏移，强制类型转换为函数指针。

如 a1 正好是函数的第一个入参，且这个参数在函数中存在 `寻址 + 偏移 + 类型转换 (+ 再寻址)` 的操作时，则基本可以确定 a1 类型正是 JNIEnv。通过确定类型可以使莫名奇妙的偏移值转换为有名字的 JNI 层函数。

[Java Native Interface Specification: 2 - Design Overview (oracle.com)](https://docs.oracle.com/en/java/javase/11/docs/specs/jni/design.html)
