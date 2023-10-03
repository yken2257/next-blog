---
title: "混同行列"
description: ""
date: "2023-07-23"
---

## 二値分類の４象限
混同行列（confusion matrix）は、分類問題の評価指標の一つ。
二値分類問題で出力された結果を以下の4種類の結果に分類し、それぞれの結果の数を表にしたものである。

- TP: True Positive
    - 正しい陽性：「感染症に罹っている人が検査で陽性と判定された」
    - 真の値（Positive）を正しく（True） Positiveと予測した数
- TN: True Negative
    - 正しい陰性：「感染症に罹っていない人が検査で陰性と判定された」
    - 偽の値（Negative）を正しく（True） Negativeと予測した数
- FP: False Positive
    - 誤った陽性：「感染症に罹っていない人が検査で陽性と判定された」
    - 偽の値（Negative）を誤って（False） Positiveと予測した数
        - Positiveという名前だが本当はNegative
- FN: False Negative
    - 誤った陰性：「感染症に罹っている人が検査で陰性と判定された」
    - 真の値（Positive）を誤って（False） Negativeと予測した数
        - Negativeという名前だが本当はPositive

これを表にすると以下のようになる。

| | 予測が真 | 予測が偽 |
| --- | --- | --- |
| 実際が真 | TP (True Positive) | FN (False Negative) |
| 実際が偽 | FP (False Positive) | TN (True Negative) |


## 評価指標
混同行列から計算できる評価指標は以下の通り。

- 正解率（accuracy）
    - 全体の中で正しく分類できた割合
    - $\mathrm{accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$
- 適合率（precision）
    - 陽性だと予測したサンプルの中で、実際の値が本当に陽性であった割合
        - 予測を母数として、その予測の適合 (precision) の度合を表す
    - $\mathrm{precision} = \frac{TP}{TP + FP}$
- 再現率（recall）
    - 実際の値が陽性であるサンプルの中で、陽性だと正しく予測できた割合
        - 実際の陽性の数を母数として、モデルが陽性をどれだけ再現できているか (recall) の度合を表す
    - $\mathrm{recall} = \frac{TP}{TP + FN}$
- F値（F-measure）
    - 適合率と再現率の調和平均
    - $F = \frac{2 \times precision \times recall}{precision + recall}$
- 特異度（specificity）
    - Negativeと予測した中で、正しくNegativeと予測できた割合
    - $\mathrm{specificity} = \frac{TN}{TN + FP}$
- 偽陽性率（false positive rate）
    - Negativeと予測した中で、誤ってPositiveと予測した割合
    - $\mathrm{false positive rate} = \frac{FP}{TN + FP}$
- 偽陰性率（false negative rate）
    - Positiveと予測した中で、誤ってNegativeと予測した割合
    - $\mathrm{false negative rate} = \frac{FN}{TP + FN}$
- 偽陽性率と偽陰性率の和
    - $\mathrm{false positive rate} + \mathrm{false negative rate} = 1$