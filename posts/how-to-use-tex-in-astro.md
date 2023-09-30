---
title: "AstroのMarkdownに数式を書く方法"
description: "AstroのMarkdownファイルにTeXの数式を書いてレンダリングできるようにする手順をまとめます"
date: "2023-06-09"
---
[Astro](https://astro.build/)のMarkdownファイルに$\KaTeX$の数式を書けるようにする手順をまとめます。
## Step 1: パッケージのインストール
必要なパッケージをインストールします。

```shell
$ npm install remark-math rehype-katex
```

## Step 2: Astroのconfigファイルを編集
`astro.config.mjs`を編集します。

- 必要なパッケージをインポート
```js
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
```

- `defineConfig`にMarkdownの項目を以下のように記載
```js
export default defineConfig({
    //すでに書かれている部分は略
    markdown: {
        remarkPlugins: [
            remarkMath,
        ],
        rehypePlugins: [
            [rehypeKatex, {
            // Katex plugin options
            }]
        ]
    }
});
```

## Step 3: MarkdownファイルのheadタグでKaTexのスタイルシートを読むようにする
AstroのMarkdownレイアウトファイルのheadタグに$\KaTeX$スタイルシートを追加します。
形式は[KaTeXのドキュメント](https://katex.org/docs/browser.html)を参照してください。
Markdownレイアウトファイルは、`npm create astro@latest`によるAstroブロジェクト新規作成時にブログテンプレートを選んだ場合は、`src/layouts/BlogPosts.astro`です。

```html
<head>
    <!-- 以下をheadタグに追加 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.css" integrity="sha384-3UiQGuEI4TTMaFmGIZumfRPtfKQ3trwQE2JgosJxCnGmQpL/lJdjpcHkaaFwHlcI" crossorigin="anonymous">
    <!-- The loading of KaTeX is deferred to speed up page rendering -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.js" integrity="sha384-G0zcxDFp5LWZtDuRMnBkk3EphCK1lhEf4UEyEM693ka574TZGwo4IWwS6QLzM/2t" crossorigin="anonymous"></script>
    <!-- To automatically render math in text elements, include the auto-render extension: -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous"
        onload="renderMathInElement(document.body);"></script>
    <!-- 以上をheadタグに追加 -->
</head>
```

## Step 4: Markdownファイル内で数式を書く
これで、Markdownファイル内に数式を書くことができます。

```tex
$$
\begin{aligned}
I(A,B)&=\sum_{a\in A} \sum_{b\in B}p(a,b)\log\frac{p(a,b)}{p(a)p(b)}\\
&=\sum_{a\in A} \sum_{b\in B} p(a,b)\log p(a|b)-\sum_{a\in A} \sum_{b\in B} p(a,b)\log  p(a)\\
&=-H(A|B)-\sum_{a\in A}p(a)\log  p(a)\\
&=H(A)-H(A|B)
\end{aligned}
$$
```

これは以下のようにレンダリングされます。

$$
\begin{aligned}
I(A,B)&=\sum_{a\in A} \sum_{b\in B}p(a,b)\log\frac{p(a,b)}{p(a)p(b)}\\
&=\sum_{a\in A} \sum_{b\in B} p(a,b)\log p(a|b)-\sum_{a\in A} \sum_{b\in B} p(a,b)\log  p(a)\\
&=-H(A|B)-\sum_{a\in A}p(a)\log  p(a)\\
&=H(A)-H(A|B)
\end{aligned}
$$