---
title: "Next.js App RouterでKatexのCSSをimportしたい"
date: "2023-09-28"
---

## 前提
- Next.jsのApp Routerを使って、$\TeX$の数式をMarkdown内で書いてブログ記事を生成したい
- `remark-math`や`rehype-katex`を使う

```js
const processedContent = await unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeHighlight)
  .use(rehypeStringify)
  .process(matterResult.content);
const contentHtml = processedContent.toString();
```

## 問題

- [Katex](https://katex.org/docs/browser)には`head`に`stylesheet`を入れろと書いてある

```html
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">
</head>
```

- が、Next.jsのApp Routerでは`head`を自由に編集できない
  - [Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Issue](https://github.com/vercel/next.js/issues/46785)にもなってた
- `<link rel="stylesheet" />`は[Unsupportedとのこと](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#unsupported-metadata)

## 解決策
`layout.tsx`で`import 'katex/dist/katex.min.css'`した

- [React Markdownでやってたやり方](https://github.com/remarkjs/react-markdown#use-remark-and-rehype-plugins-math)

最初からReact Markdown使えよという話かもしれない