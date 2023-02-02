---
title: 速通量子力学
tags:
- note
- active
---

唏，可以和解吗？

由于考完了，没动力再写了，所以日后再补充

:::info
Migrated from old blog
:::

<!--truncate-->

## 第一章

### 德布罗意假说

$$
E = \hbar \omega
$$

$$
p = \hbar k
$$

### 波函数

波函数 $\psi(\vec{r}, t)$ 描述一个体系的状态。该体系中，粒子在 $(\vec{r}, t)$ 出现的几率为波函数值的**模平方**：$w(\vec{r}, t) = |\psi(\vec{r}, t)|^2$

#### 常数因子不定性

波函数 $\psi(\vec{r}, t)$ 与 $C\psi(\vec{r}, t)$ 描述同一种状态，其中 $C$ 是任意常数

#### 归一性

若波函数满足条件：

$$
\int |\psi(\vec{r}, t)|^2 \ \text{d}\tau = 1
$$

则称该波函数为**归一化波函数**。由于常数因子不定性的存在，任何波函数均可归一化，即：

$$
C = \sqrt{
    \frac{1}{\int |\psi(\vec{r}, t)|^2 \ \text{d}\tau}
}
$$

> 题目里出现的任何波函数，没说就是没归一化

#### 相位因子不定性

波函数 $\psi(\vec{r}, t)$ 与 $e^{ia}\psi(\vec{r}, t)$ 描述同一种状态，因为它们的模平方相同

#### 状态叠加原理

波函数间可以线性叠加，即：

$$
\psi = c_1 \psi_1 + c_2 \psi_2 + \cdots + c_n \psi_n
$$

但是显然，对于模平方有：

$$
|\psi|^2 \neq |c_1 \psi_1|^2 + |c_2 \psi_2|^2 + \cdots + |c_n \psi_n|^2
$$

### 薛定谔方程

#### 一维自由粒子的波函数

$$
\psi(x, t) = \frac{1}{\sqrt{2\pi\hbar}} e^{\frac{i}{\hbar} (px-Et)}
$$

#### 哈密顿算符

引入哈密顿算符：

$$
\hat{H} = - \frac{\hbar^2}{2\mu} \nabla^2 + V
$$

则薛定谔方程为：

$$
i\hbar \frac{\partial{\psi}}{\partial{t}} = \hat{H} \psi
$$

两侧均是求体系能量的算符

### 几率密度与几率流密度

$$
j=-\frac{i\hbar}{2\mu}(\psi^*\nabla\psi - \psi\nabla\psi^*)
$$

### 定态薛定谔方程

对于一个波函数 $\psi(\vec{r}, t)$，我们总能将它分离变量为 $\psi(\vec{r})f(t)$

> 谁知道为什么，反正就是可以

若 $\hat{H}$ 中的势能 $V$ 与时间 $t$ 无关，则 $\hat{H}$ 也与时间无关

在此情况下，通过波函数分离变量，可求解得到 $f(t)=e^{-\frac{i}{\hbar}Et}$，又即：

$$
\psi(\vec{r}, t) = \psi(\vec{r})e^{-\frac{i}{\hbar}Et}
$$

对应薛定谔方程为：

$$
\left[ - \frac{\hbar^2}{2\mu} \nabla^2 + V(\vec{r}) \right] \psi(\vec{r}) = E\psi(\vec{r})
$$

不含 $t$ 的方程称为**定态方程**，由此该方程也称为**定态薛定谔方程**

### 势阱

- 列出不同势能区域对应的薛定谔方程（定态的）
- 解出 $\psi$
- 边界条件求定解

#### 一维无限深势阱

$$
V(x) = \begin{cases}
    0 \ \ \ & x\in(0, a) \\
    \infty & x\not\in(0, a)
\end{cases}
$$

在势阱外，$V(x)=\infty$，故 $\psi(x)=0,\ x\not\in(0, a)$

在势阱内，有：

$$
-\frac{\hbar^2}{2\mu} \frac{\text{d}^2}{\text{d}x^2} \psi = E\psi
,\ x\in(0, a)
$$

令 $\frac{2\mu E}{\hbar} = k^2$，有：

$$
\frac{\text{d}^2}{\text{d}x^2} \psi + k^2 = 0
$$

$$
\psi(x) = A\sin(kx) + B\cos(kx)
$$

其中 $A$、$B$ 为待定常数

由于波函数应连续，于是应有 $\psi(0)=\psi(a)=0$，最终解得：

$$
\begin{aligned}
A &= \sqrt{\frac{2}{a}} \ \text{（归一化常数）} \\
B &= 0 \\
k &= \frac{n\pi}{a} \\
E &= \frac{\pi^2 \hbar^2 n^2}{2\mu a^2}, \ (n=1,2,3,\cdots) \\
\psi(x) &= \begin{cases}
    A\sin(\frac{n\pi}{a}x) & x \in (0, a) \\
    0 \ \ \ & x \not\in (0, a)
\end{cases}
\end{aligned}
$$

#### 一维有限深势阱

$$
V(x) = \begin{cases}
    m & x \le -a \\
    0 \ \ \ & x \in (-a, a) \\
    n & x \ge a
\end{cases}
$$

列出三个区域的波函数：

$$
\begin{aligned}
-\frac{\hbar^2}{2\mu} \frac{\text{d}^2}{\text{d}x^2} \psi_1 + m\psi_1 &= E\psi_1 \\
-\frac{\hbar^2}{2\mu} \frac{\text{d}^2}{\text{d}x^2} \psi_2 &= E\psi_2 \\
-\frac{\hbar^2}{2\mu} \frac{\text{d}^2}{\text{d}x^2} \psi_3 + n\psi_3 &= E\psi_3
\end{aligned}
$$

阱内的粒子处于束缚态，而对于束缚态粒子，它的能量总比周围势垒的势能低，即有 $E<V$，因此：

$$
\begin{aligned}
\frac{\text{d}^2}{\text{d}x^2} \psi_1 - k_1^2 = 0 \\
\frac{\text{d}^2}{\text{d}x^2} \psi_2 + k_2^2 = 0 \\
\frac{\text{d}^2}{\text{d}x^2} \psi_3 - k_3^2 = 0
\end{aligned}
$$

其中：

$$
\begin{aligned}
k_1^2 &= \frac{2\mu(m - E)}{\hbar^2} \\
k_2^2 &= \frac{2\mu E}{\hbar^2} \\
k_3^2 &= \frac{2\mu(n - E)}{\hbar^2}
\end{aligned}
$$

上述方程的通解为：

$$
\begin{aligned}
\psi_1 &= A_1 e^{k_1x} + B_1 e^{-k_1x} \\
\psi_2 &= A_2\sin(k_2x) + B_2\cos(k_2x) \\
\psi_3 &= A_3 e^{k_3x} + B_3 e^{-k_3x}
\end{aligned}
$$

由于波函数应有限，考虑到不同段落 $x$ 的取值，有 $B_1=0, A_3=0$：

$$
\begin{aligned}
\psi_1 &= A_1 e^{k_1x} \\
\psi_2 &= A_2\sin(k_2x) + B_2\cos(k_2x) \\
\psi_3 &= B_3 e^{-k_3x}
\end{aligned}
$$

由于此问题中势能函数对称，因此波函数也应对称（奇函数/偶函数），由此得到两组解，即奇函数解 $\psi_2 = A_2\sin(k_2x)$ 或偶函数解 $\psi_2 = B_2\cos(k_2x)$

在此仅考虑 $x=a$ 处的限制；由于波函数连续，其端点处取值及一次导数取值应相等：

$$
\begin{aligned}
\psi_2(a) &= \psi_3(a) \\
\frac{\text{d}\psi_2}{\text{d}x}|_{x=a} &= \frac{\text{d}\psi_3}{\text{d}x}|_{x=a}
\end{aligned}
$$

因为 $\frac{\text{d}\ln f}{\text{d}x} = \frac{1}{f} \frac{\text{d}f}{\text{d}x}$，该条件也可写为：

$$
\frac{\text{d}\ln\psi_2}{\text{d}x}|_{x=a} = \frac{\text{d}\ln\psi_3}{\text{d}x}|_{x=a}
$$

> 此也被称为对数导数连续性条件

由此可以列出 $k_1$ 与 $k_2$ 满足的条件，考虑到它们的意义，可消去 $k_1$；于是最后有：

$$
\ctg^2(k_2 a)=-1+\frac{2\mu V_0}{\hbar^2k_2^2} \text{（奇函数解）}
$$

$$
\tg^2(k_2 a)=-1+\frac{2\mu V_0}{\hbar^2k_2^2} \text{（偶函数解）}
$$

其中 $k_2$ 取分立值

> 👆（超越方程）

#### 三维无限深势阱

分离变量：

$$
\psi(x,y,z) = \psi_1(x)\psi_2(y)\psi_3(z)
$$

其中每一个分量都是一维无限深势阱的情况，波函数是它们的乘积，能量是它们的加和

能量：$E=\frac{\pi^2 \hbar^2}{2\mu}(\frac{n_1^2}{a^2}+\frac{n_2^2}{b^2}+\frac{n_3^2}{c^2})$

### 谐振子

谐振子的波函数：

$$
\psi_n(x) = A_n H_n(x) e^{-\frac{1}{2}x^2}
$$

有一个量子数 $n$

式中，$A_n$ 为归一化系数，$H_n$ 为厄米多项式

{% collapse "$A$ 与 $H$ 的真身" %}

$$
H_n(\xi) = (-1)^n e^{\xi^2} \frac{\text{d}^n}{\text{d} \xi^n} e^{-\xi^2}
$$

$$
A_n = \left( \frac{a}{\sqrt{\pi 2^n n!}} \right)^\frac{1}{2}
$$

其中 $a = \frac{\mu\omega}{\hbar}$

{% endcollapse %}

谐振子能量：

$$
E_n = (n+\frac{1}{2}) \hbar\omega, \ (n=0,1,2,\cdots)
$$

其中可取 $n=0$ 是因为此时能量不为零，是有效的状态

有另一种表示方法：$E_n = (n-\frac{1}{2}) \hbar\omega, \ (n=1,2,3,\cdots)$，它们事实上是等效的

### 隧穿

## 第二章

### 常见算符

| 力学量 | 算符 |
| --- | --- |
| 坐标 | $\hat{r}=r$
| 动量 | $\hat{p}=-i\hbar\nabla$
| 动能 | $\hat{T}=-\frac{\hbar^2}{2\mu}\nabla^2$
| 势能 | $\hat{V}=V(\vec{r})$
| 能量 | $\hat{E}=i\hbar\frac{\partial}{\partial t}$
| 哈密顿 | $\hat{H}=-\frac{\hbar^2}{2\mu}\nabla^2+V$

以及，角动量：

$$
\begin{aligned}
\hat{L}_x &= y\hat{p}_z - z\hat{p}_y \\
\hat{L}_y &= z\hat{p}_x - x\hat{p}_z \\
\hat{L}_z &= x\hat{p}_y - y\hat{p}_x \\
\hat{L} &= \vec{e}_x \hat{L}_x + \vec{e}_y \hat{L}_y + \vec{e}_z \hat{L}_z
\end{aligned}
$$

#### 运算顺序

若算符 $\hat{F}$ 与 $\hat{G}$ 不对易，则：

$$
\hat{F}\hat{G}\psi = \hat{F}(\hat{G}\psi) \neq \hat{G}\hat{F}\psi
$$

#### 线性

$$
\hat{F}(c_1\phi_1 + c_2\phi_2) = c_1\hat{F}\phi_1 + c_2\hat{F}\phi_1
$$

#### 厄密

对任意两个函数 $\psi$ 与 $\phi$ 定义标积：

$$
(\psi, \phi) = \int\psi^*\phi \ \text{d}\tau
$$

由此定义，有下列关系存在：

$$
\begin{aligned}
(\psi, \psi) &\ge 0 \\
(\psi, \phi)^* &= (\phi, \psi) \\
(\psi, c_1\phi_1 + c_2\phi_2) &= c_1(\psi, \phi_1) + c_2(\psi, \phi_2) \\
(c_1\psi_1 + c_2\psi_2, \phi) &= c_1^*(\psi_1, \phi) + c_2^*(\psi_2, \phi)
\end{aligned}
$$

若算符 $\hat{F}$ 满足：

$$
(\psi, \hat{F}\phi) = (\hat{F}\psi, \phi)
$$

则称该算符是**厄密的**

量子力学中表示力学量的算符**都是厄密算符**。厄密算符的本征值为实数，故力学量也都是实数

### Ex. 本征函数与波函数

算符 $\hat{A}$ 的……

- 本征方程：$\hat{A}\phi = \lambda\phi$
- 本征函数 $\phi$
- 本征值 $\lambda$

本征函数是一个函数系 $\{\phi_n\}$，它们是正交归一的，即：

- 任意函数可表示为一个本征函数（系）的线性组合
- 
$$
(\phi_m, \phi_n) = \begin{cases}
    0, m \ne n \\
    1, m = n
\end{cases}
$$

不同力学量的算符一般有不同的本征函数系，当且仅当算符的本征函数系是同一个，它们才能同时精确求值

一般用 $\phi$ 表示本征函数（念作 phi），而用 $\psi$ 表示波函数（念作 psi）

### 力学量的测量

考虑一个体系的正交归一本征函数系 $\{\phi_n\}$

当体系处于本征态时，波函数恰为某一本征函数

当处于一般态（非本征态）时，波函数总可以向 $\{\phi_n\}$ 线性展开，此时有：

$$
\psi = \sum c_n\phi_n
$$

其中 $c_n = (\phi_n, \psi)$，同时有：

$$
\sum |c_n|^2 = 1
$$

力学量仅能对处于本征态的体系进行准确测量，否则，会得到一系列可能的本征值

每次测量，只得到可能取值的一个，测量得到波函数 $\phi_i$ 的本征值的几率为 $|c_i|^2$

#### 本征态平均值

现有本征方程 $\hat{X}\phi = x\phi$：

$$
\begin{aligned}
\bar{x} &= \int x |\phi|^2 \text{d}x \\
&= \int \phi^* x \phi \text{d}x \\
&= \int \phi^* \hat{X} \phi \text{d}x \\
&= (\phi, \hat{X}\phi)
\end{aligned}
$$

#### 非本征态平均值

现有波函数：

$$
\psi = c_1\phi_1 + c_2\phi_2 + \cdots
$$

与本征方程 $\hat{X}\phi_n = x_n\phi_n$

$$
\bar{x} = \sum x_n |c_n|^2
$$

推广到连续谱：

$$
\bar{x} = \int x_n |c_x|^2 \text{d} x
$$

### 对易与确定值

定义对易子：

$$
[\hat{F}, \hat{G}] = \hat{F}\hat{G} - \hat{G}\hat{F}
$$

当 $[\hat{F}, \hat{G}]=0$ 时，称两算符**对易**

两个力学量，当且仅当其算符对易时，它们才能同时被准确求值

对易子有以下关系存在：

$$
\begin{aligned}
[\hat{F}, \hat{F}] &= 0 \\
[\hat{F}, \hat{G}] &= -[\hat{G}, \hat{F}] \\
[\hat{F}, \hat{G}_1+\hat{G}_2] &= [\hat{F}, \hat{G}_1] + [\hat{F}, \hat{G}_2] \\
[\hat{F}_1+\hat{F}_2, \hat{G}] &= [\hat{F}_1, \hat{G}] + [\hat{F}_2, \hat{G}] \\
[\hat{F}, c\hat{G}] &= [c\hat{F}, \hat{G}] = c[\hat{F}, \hat{G}] \text{（坐标算符不能作 $c$）}\\
[\hat{F}, \hat{G}_1\hat{G}_2] &= [\hat{F}, \hat{G}_1]\hat{G}_2 + \hat{G}_1[\hat{F}, \hat{G}_2] \\
[\hat{F}_1\hat{F}_2, \hat{G}] &= \hat{F}_1[\hat{F}_2, \hat{G}] + [\hat{F}_1, \hat{G}]\hat{F}_2
\end{aligned}
$$

> 对易不具有传递性

#### 常见对易子

坐标算符

$$
[\hat{x}, \hat{y}] = 0
$$

动量算符

$$
\begin{aligned}
[\hat{p}_x, \hat{p}_y] &= 0 \\
[\hat{x}, \hat{p}_x] &= i\hbar \\
[\hat{x}, \hat{p}_y] &= 0
\end{aligned}
$$

角动量算符

$$
\begin{aligned}
[\hat{L}_x, \hat{L}_y] &= i\hbar\hat{L}_z \\
[\hat{L}_y, \hat{L}_x] &= -i\hbar\hat{L}_z \text{（顺序对正负有影响）} \\ 
[\hat{L}^2, \hat{L}_x] &= 0
\end{aligned}
$$

### 角动量本征方程

考虑由 $x, y, z$ 到 $r, \theta, \phi$ 的变换

> 此处省略一页半球谐函数的推导

本征函数 $Y_{lm}(\theta, \phi)$，由两个量子数决定

$\hat{L}^2$ 的本征值为 $l(l+1)\hbar^2$

$\hat{L}_z$ 的本征值为 $m\hbar$

{% collapse "$Y_{lm}$ 真面目" %}

好长，有时间再腾上来

{% endcollapse %}

## 第三章

### 有心力场定态问题

#### 库仑场中的粒子

氢原子与类氢原子指原子核外仅有一个电子的粒子，如 $\ce{H}$，$\ce{He+}$，$\ce{Li^2+}$

考虑原子核带电荷 $+Ze$ 的类氢原子在库伦场中的势：

$$
V(\vec{r}) = - \frac{Ze_s^2}{r}
$$

其中 $e_s^2 = \frac{e^2}{4\pi\epsilon_0}$

由此求得的波函数与能量：

$$
\psi_{nlm}(r, \theta, \phi) = R_{nl}(r)Y_{lm}(\theta, \phi)
$$

$$
E_n=-\frac{\mu Z^2 e_s^4}{2\hbar^2 n^2}
$$

三个量子数，能量只与主量子数 $n$ 有关。它们的取值范围如下：

$$
\begin{aligned}
n&=1,2,3,\cdots \\
l&=0,1,2,\cdots,(n-1) \\
m&=0,\pm1,\pm2,\cdots,\pm l
\end{aligned}
$$

$R_{nl}$ 反映了有心力场的具体特征 $V(\vec{r})$

##### 能量的简并度

能量仅与 $n$ 有关。而对于一个确定的 $n$，$(l, m)$ 有 $\sum_0^{n-1} (2a-1)=n^2$ 种取值，故其简并度为 $n^2$

#### 氢原子中的电子

在氢原子中，$Z=1$，于是能量：

$$
E_n=-\frac{\mu e_s^4}{2\hbar^2 n^2}
$$

##### 径向几率分布函数

电子出现在半径 $r$ 处的几率 $w(r)$，即：

$$
\int_{r<\xi<r+\text{d}r} | \psi_{nlm}(r, \theta, \phi) |^2 \ \text{d}\xi = R_{nl}^2(r) r^2
$$

又即：$w_{nl}(r) = R_{nl}^2(r) r^2$

##### 最可几半径

电子云密度最大的位置，该半径也称玻尔半径

### 电子自旋

电子由绕核运动造成轨道磁矩 $M_l$，对应于磁量子数 $m$

这也是为何角量子数 $l=0$ 时，磁量子数 $m=0$ 的原因：电子不运动时无电流，不产生磁矩

同时，电子也具有另一种自旋磁矩 $M_s$，对应于自旋量子数 $m_s$

#### 自旋角动量与自旋磁矩

电子具有自旋角动量 $S$，它只能取两个数值 $\pm\frac{\hbar}{2}$

电子具有自旋磁矩 $M_s$，且 $M_s=-\frac{e}{\mu}S$

> 自旋是电子本身固有的属性，没有经典模型对应，与空间坐标的运算无关

#### 自旋算符

$L$ 与 $M_l$，$S$ 与 $M_s$ 对应

自旋算符同样有以下关系存在：

$$
\begin{aligned}
[\hat{S}_x, \hat{S}_y] &= i\hbar\hat{S}_z \\
[\hat{S}_y, \hat{S}_x] &= -i\hbar\hat{S}_z \text{（顺序对正负有影响）} \\ 
[\hat{S}^2, \hat{S}_x] &= 0
\end{aligned}
$$

#### 本征值

$\hat{S}_x$、$\hat{S}_y$、$\hat{S}_z$ 的本征值均为 $\pm\frac{\hbar}{2}$，引入自旋量子数 $m_s=\pm\frac{1}{2}$，则本征值为 $m_s\hbar$

$\hat{S}^2$ 的本征值为 $\frac{3}{4}\hbar^2$

> 事实上，它的本征值和 $\hat{L}^2$ 类似，也是 $m_s(m_s+1)\hbar^2$，不过因为 $m_s$ 的限制成为了定值

## 第四章

### 微扰

求哈密顿算符 $\hat{H}$ 的本征函数与本征值，考虑一个很小的微扰 $\hat{H'}$，即 $\hat{H} = \hat{H}_0 + \hat{H}'$

#### 波函数一级近似

$$
\psi_n = \psi_n^{(0)} + \sum_{k \ne n} \frac{H'_{kn}}{E_n^{(0)} - E_k^{(0)}} \psi_k^{(0)}
$$

其中：

$$
H'_{kn}=(\psi_k^{(0)}, \hat{H'}\psi_n^{(0)})
$$

#### 本征值二级近似

一级近似：

$$
E_n = E_n^{(0)} + H'_{nn}
$$

二级近似：

$$
E_n = E_n^{(0)} + H'_{nn} + \sum_{k \ne n} \frac{|H'_{kn}|^2}{E_n^{(0)} - E_k^{(0)}}
$$

### 简并微扰

### 全同

全同粒子：质量、电荷、自旋、etc. 一切固有性质完全相同的微观粒子

> 施工中

## Ex. 常见二阶齐次常微分方程

$$
\begin{aligned}
f''(x) + k^2f(x)&=0, \ \Delta<0 \\
f(x) &= A\cos{kx} + B\sin{kx} \\
f(x) &= Ce^{ikx} + De^{-ikx} \\
\\
f''(x) - k^2f(x)&=0, \ \Delta>0\\
f(x) &= Ce^{kx} + De^{-kx} \ \text{(no more $i$)}
\end{aligned}
$$

势阶/势垒题适用于三角函数解，势阱题适用于指数形式解（当然也并不绝对）

## Ex. 填空题

- 乌伦贝克和哥德斯密脱关于自旋的两个基本假设是
  - 电子具有自旋角动量，它在任意方向投影为 ±ħ/2
  - 电子具有自旋磁矩，其旋磁比（磁矩：角动量 $z$ 分量）为轨道旋磁比的2倍 

## Ex. 在 Hexo 里写 MathJax

> Hexo 写 LaTeX 真是太折磨了哼啊啊啊啊啊啊
>> 喔不对是 MathJax，哼啊啊啊啊啊啊

使用了 `hexo-filter-mathjax` 插件。同样功能的还有另一个 `hexo-math` 插件，但它用的是 Hexo 专有语法，所以 pass

在 `_config.yml` 里配置：

```yml
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
plugins:
- hexo-filter-mathjax # https://github.com/next-theme/hexo-filter-mathjax
```

在需要启用 MathJax 的文章的 Front-matter 上加一行 `mathjax: true`，就这样

然后，如果没有用文档推荐的 `hexo-renderer-pandoc`，Markdown 语法优先于 MathJax，注意回避或转义，下列要点：

- 使用 `\\` 而非 `\\` 换行
- 行开头使用 `-`、`+`、`*` 可能会与列表语法冲突
- 方括号 `[]` 可能会让你的内容消失
- `(r)` 会被替换成 &reg;，`(c)` 替换成 &copy;

## Fin.

量子力学哼啊啊啊啊
