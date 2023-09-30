---
title: "Next.jsでMarkdown->html変換時にnext/linkを利用したい"
date: "2023-09-30"
---

## 動機
- Next.jsでMarkdownブログを作成するとき、記述したサイト内リンクを`<Link>`にしたい
- ついでに外部リンクは別タブにしたい

参考ページはあるけどこの通りにはいかないつまずきポイントがあった（App Routerではない、という違いだけでもない）
- [Markdownのサイト内リンクをNext.jsの<Link>にしたい](https://zenn.dev/thiragi/articles/ce13a4be4110c0)
- [Next.jsを利用した初めての本格的Markdownブログサイトの構築](https://reffect.co.jp/react/nextjs-markdown-blog)

## rehypeReactのつまずきポイント
### 事象
`createElement`や`Fragment`を指定すると、

```js
import {createElement, Fragment} from react;

unified()
  .use(rehypeParse, {fragment: true})
  .use(rehypeReact, {
    createElement,
    Fragment,
    components: {
      a: CustomLink,
    },
  })
```

Type errorが出る。

```text
Type error: Argument of type '[{ createElement: { (type: "input", props?: (InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>) | null | undefined, ...children: ReactNode[]): DetailedReactHTMLElement<...>; <P extends HTMLAttributes<...>, T extends HTMLElement>(type: keyof ReactHTML, props?: (ClassAttributes<...> & P) | ... ...' is not assignable to parameter of type '[boolean] | [Options]'.
  Type '[{ createElement: { (type: "input", props?: (InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>) | null | undefined, ...children: ReactNode[]): DetailedReactHTMLElement<...>; <P extends HTMLAttributes<...>, T extends HTMLElement>(type: keyof ReactHTML, props?: (ClassAttributes<...> & P) | ... ...' is not assignable to type '[boolean]'.
    Type '{ createElement: { (type: "input", props?: (React.InputHTMLAttributes<HTMLInputElement> & React.ClassAttributes<HTMLInputElement>) | null | undefined, ...children: React.ReactNode[]): React.DetailedReactHTMLElement<...>; <P extends React.HTMLAttributes<...>, T extends HTMLElement>(type: keyof React.ReactHTML, props?...' is not assignable to type 'boolean'.
```

[Issue](https://github.com/rehypejs/rehype-react/issues/39)があって最新verでは大丈夫だよと書いてあるけど、

> it works with latest @types/react and rehype-react in a sandbox.
https://codesandbox.io/s/rehype-react-types-b5pe22?file=/src/App.tsx

上のcodesandboxも最新バージョン（`rehype-parse: 9.0.0` `rehype-react: 8.0.0`）にするとエラーになっちゃう

### 解決方法
rehype-reactのREADME見たら`@ts-expect-error`で無視してた。
https://github.com/rehypejs/rehype-react#use

```js
import * as prod from 'react/jsx-runtime'

// @ts-expect-error: the react types are missing.
const production = {createElement: prod.createElement, Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs, }
unified()
  .use(rehypeParse, {fragment: true})
  .use(rehypeReact, production)
```

この`jsx`も指定してあげないと`Expected jsx in production options`という[エラー](https://github.com/syntax-tree/hast-util-to-jsx-runtime#expected-jsx-in-production-options)になる。

けっこう時間を溶かしたが、READMEをちゃんと読みましょうということー