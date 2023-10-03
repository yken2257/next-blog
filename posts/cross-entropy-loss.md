---
title: "クロスエントロピー誤差"
description: ""
date: "2023-07-24"
---

## 二値分類問題
入力ベクトル$\boldsymbol{x}$に対して、出力$y$が0か1の二値であるような分類問題を考える。定石は、重みベクトル$\boldsymbol{w}$とバイアス$b$を用いて、
出力$y$が1である確率をロジスティック回帰によって次のようにモデル化することである。

$$
q(y=1|\boldsymbol{x}) = \sigma(\boldsymbol{w}^T\boldsymbol{x} + b)
$$

ここで$\sigma(\cdot)$はシグモイド関数である（ロジスティック回帰やシグモイド関数は単なる例であり、この頁の本質ではないのでこの後登場しない）。$q(\cdot)$は予測された確率分布で、$q(y=1|\boldsymbol{x}_i)$はデータ$\boldsymbol{x}_i$が与えられたとき$y$が1となる確率、$q(y=0|\boldsymbol{x}_i)$は$y$が0となる確率を表す。なお、$q(y=1|\boldsymbol{x}_i)$と$q(y=0|\boldsymbol{x}_i)$は$q(\cdot)$という表現をしているが実際の関数の形は異なることに注意。$y$が0となる確率は

$$
q(y=0|\boldsymbol{x}) = 1 - q(y=1|\boldsymbol{x})
$$

である。また、予測される出力$\hat{y}_i$は次のようになる。

$$
\hat{y}_i = \begin{cases}
1 & (q(y=1|\boldsymbol{x}_i) \geq 0.5) \\
0 & (q(y=1|\boldsymbol{x}_i) < 0.5)
\end{cases}
$$

これに対し、実際のデータに対する現実の確率分布$p$は以下のようになる。

$$
p(y|\boldsymbol{x}_i) = \begin{cases}
y_i & (y=1) \\
1 - y_i & (y=0)
\end{cases}
$$

これは以下のように書いても良い。

$$
\left\{
\begin{array}{l}
p(y=1|\boldsymbol{x}_i) = y_i \\
p(y=0|\boldsymbol{x}_i) = 1-y_i 
\end{array}
\right.
$$

つまり$y_i=1$であれば$y$が$0,1$である確率はそれぞれ$0,1$であり、$y_i=0$であれば$y$が$0,1$である確率はそれぞれ$1,0$だということである。

データセット$\mathcal{D} = \{(\boldsymbol{x}_i, y_i)\}_{i=1}^N$があるとする。あるデータ$\boldsymbol{x}_i$について$y_i$が1である確率は$q(y=1|\boldsymbol{x}_i)$と予測され、$y_i$が0である確率は$q(y=0|\boldsymbol{x}_i)=1 - q(y=1|\boldsymbol{x}_i)$と予測される。
このとき、現実の値$y_i$が出力される確率は以下のようになる。

$$
\left [ q(y=1|\boldsymbol{x}_i) \right ]^{y_i} \left [1 - q(y=1|\boldsymbol{x}_i)\right ]^{(1-y_i)}
$$

2つの掛け算になっているが、$y_i$が1であれば$1 - y_i$が0、$y_i$が0であれば$1 - y_i$が1になるため、$y_i$が1であれば$q(y=1|\boldsymbol{x}_i)$、$y_i$が0であれば$1 - q(y=1|\boldsymbol{x}_i)$になるだけである。

これをデータセット$\mathcal{D} = \{(\boldsymbol{x}_i, y_i)\}_{i=1}^N$に含まれる全てのデータについて考えると、予測分布$q(\boldsymbol{x})$が与えられたとき、その予測分布が出力の組み合わせ$\{y_i\}_{i=1}^N$を実現する確率$L(\mathcal{D})$は次のようになる。

$$
\begin{align}
L(\mathcal{D}) &= \prod_{i=1}^N \left [ q(y=1|\boldsymbol{x}_i) \right ]^{y_i} \left [1 - q(y=1|\boldsymbol{x}_i)\right ]^{(1-y_i)} \\
&= \prod_{i=1}^N \left [ q(y=1|\boldsymbol{x}_i) \right ]^{p(y=1|\boldsymbol{x}_i)} \left [q(y=0|\boldsymbol{x}_i)\right ]^{p(y=0|\boldsymbol{x}_i)} \\
&= \prod_{i=1}^N \left [ q(y=y_i|\boldsymbol{x}_i) \right ]^{p(y=y_i|\boldsymbol{x}_i)} \\
&= \prod_{i=1}^N \left [ q(y_i|\boldsymbol{x}_i) \right ]^{p(y_i|\boldsymbol{x}_i)}
\end{align}
$$

(3)式は(2)式の掛け算を$y=y_i$と書いて一つにまとめたものである（二項の掛け算は実質一つのみであり、こう書けば一つにまとまる）。また(4)式は単に$y=$を省略した表記である。$L(\mathcal{D})$は尤度であり、これを最大化するようなパラメータ$\boldsymbol{w}, b$を求めることで、パラメータを推定することができる。
尤度の対数を取ると次のようになる。

$$
\begin{align}
\log L(\mathcal{D}) &= \sum_{i=1}^N \left\{ y_i \log q(y=1|\boldsymbol{x}_i) + (1-y_i) \log \left [1 - q(y=1|\boldsymbol{x}_i)\right ] \right\} \\
&= \sum_{i=1}^N p(y=y_i|\boldsymbol{x}_i) \log q(y=y_i|\boldsymbol{x}_i) \\
&= \sum_{i=1}^N p(y_i|\boldsymbol{x}_i) \log q(y_i|\boldsymbol{x}_i) 
\end{align}
$$

これを最大化する$\boldsymbol{w}, b$を求めることで、パラメータを推定することができる。

## クロスエントロピー

ある確率分布$p$と$q$が与えられたとき、その分布の間の距離を表す指標としてクロスエントロピーがある。クロスエントロピーは次のように定義される。

$$
\begin{aligned}
H(p, q) &= - \sum_{x} p(x) \log q(x) \\
&= - \sum_{i=1}^N p(x_i) \log q(x_i)
\end{aligned}
$$

これは対数尤度の符号を反転させたものに他ならない。上記の対数尤度を最大化することは、クロスエントロピーを最小化することと同じである。
クロスエントロピーは分布$p$と$q$が近いほど小さくなるので、実際の分布$p$と予測分布$q$が近くなるようにパラメータ$\boldsymbol{w}, b$を推定するという意味になる。

## カルバック・ライブラー情報量

分布$p$と$q$の間の距離を表す指標として、カルバック・ライブラー情報量がある。カルバック・ライブラー情報量は次のように定義される。

$$
\begin{aligned}
D_\mathrm{KL}(p||q) &= \sum_{x} p(x) \log \frac{p(x)}{q(x)} \\
&= \sum_{x} p(x) \log p(x) - \sum_{x} p(x) \log q(x) \\
&= -H(p) + H(p, q)
\end{aligned}
$$

カルバック・ライブラー情報量は、分布$p$と$q$が近いほど小さくなる。また、分布$p$と$q$が同じであれば、カルバック・ライブラー情報量は最小値0をとる。二値分類問題では分布$p$は実際の分布で$q$は予測分布なので、予測においては$-H(p)$は定数であり、クロスエントロピー誤差を最小化することはカルバック・ライブラー情報量を最小化することと同じである。