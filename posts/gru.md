---
title: "GRU"
description: ""
date: "2023-07-23"
updatedDate: "July 24 2023"
---

## 数式
GRUとは、Gated Recurrent Unitの略で、RNNの一種。
通常の単純なRNNは入力$x^{(t)}$と前の時刻の隠れ層$h^{(t-1)}$を入力として、次の時刻の隠れ層$h^{(t)}$を出力する。

$$
h^{(t)} = f^{\tanh}(x^{(t)},h^{(t-1)})
$$

ここで、$f^{\tanh}$は時刻$t$の入力と前の時刻の隠れ層を重み付き和で結合し、活性化関数にtanhを用いたものである。

GRUの数式は以下の通り。

$$
\begin{align}
z^{(t)} &= f_z^{\sigma}(x^{(t)},h^{(t-1)}) \\
r^{(t)} &= f_r^{\sigma}(x^{(t)},h^{(t-1)}) \\
\tilde{h}^{(t)} &= f_h^{\tanh}(x^{(t)},r^{(t)} \odot h^{(t-1)}) \\
h^{(t)} &= (1-z^{(t)}) \odot h^{(t-1)} + z^{(t)} \odot \tilde{h}^{(t)}
\end{align}
$$

突然複雑になった。

## 説明
GRUは、通常のRNNの隠れ層を、リセットゲートと更新ゲートに分けたもの。リセットゲートは、前の時刻の隠れ層をどれだけ無視するかを決める。更新ゲートは、前の時刻の隠れ層と現在の入力をどれだけ重視するかを決める。

(4)式を見ると、 一つ前の隠れ層$h^{(t-1)}$と調整された隠れ層$\tilde{h}^{(t)}$の重み付き和を取っていることがわかる。その重み付き和のパラメータが$z^{(t)}$になっている。すなわち$z^{(t)}$は、一つ前の隠れ層$h^{(t-1)}$をどれだけ重視するか（$h$をどの程度更新するか）を決めるパラメータである。その$z^{(t)}$は入力$x^{(t)}$と前の時刻の隠れ層$h^{(t-1)}$から決まる。

(3)式を単純なRNNの式と比較すると、$\tilde{h}^{(t)}$は、前の隠れ層を$r$倍していることがわかる。これにより、以前の情報をどれだけ弱めるかを決めている。そのため$r$はリセットゲートと呼ばれる。$r$は$z$と同様に入力$x^{(t)}$と前の時刻の隠れ層$h^{(t-1)}$から決まる。

GRUは通常の単純なRNNに$r$と$z$という調整パラメータを追加したものと考えることができる。リセットゲート$r$が大きくなれば以前の情報が強く反映され、更新ゲート$z$が大きくなれば現在の情報が強く反映される。

## 参考
[【深層学習】GRU - RNN に記憶をもたせる試みその1【ディープラーニングの世界 vol. 10 】](https://youtu.be/K8ktkhAEuLM)
<iframe width="560" height="315" src="https://www.youtube.com/embed/K8ktkhAEuLM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>