---
title: Next.jsのgenerateStaticParamsのメモ
date: "2023-11-02"
---
Next.jsの`generateStaticParams`を使うとビルド時に動的なパスを生成することができる。
https://nextjs.org/docs/app/api-reference/functions/generate-static-params

## スニペット
例えばブログサイトで記事ごとに固有のslugを用意して`/blog/[slug]`のようなパスを生成するなら、`app/blog/[slug]/page.tsx`を作成する。

```tsx
import { getArticles, getArticleBySlug } from '@/path/to/lib.ts'

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export const dynamicParams = false

export default async function Page({ params }: Props) {
  const { slug } = params
  const article = await getArticleBySlug(slug)
  if (!article) return

  return (
    <main>
      <h1>{article.title}</h1>
      <article>
        {article.body}
      </article>
    </main>
  )
}
```

## 注意点

このように`generateStaticParams`を使うと、ビルド時にページとして生成するべきslugの値を取得して、その値を元に記事のデータを取得している。

[`dynamicParams`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams)を`false`に設定すると、もし`generateStaticParams`で定義されていないパスにアクセスされた場合、404を返すようになる。これが`true`だと、`generateStaticParams`に定義されていないパスにアクセスされた場合は動的にページを生成しようとする。ブログのような静的サイトではビルド時に生成すべきパスが全て決まっているので、`dynamicParams`は`false`で良い。定義されていないパスにアクセスされた時に予期せぬサーバエラーが発生するのを防ぐことができる。

なお上のコードは`generateStaticParams`を定義しなくても動作する。[`Page`](https://nextjs.org/docs/app/api-reference/file-conventions/page)関数は引数として`params`を指定すれば関数内でslug（`/blog/[slug]`のslug部分）を使うことができる。すなわちアクセスされたページのslugを動的に取得することができるということ。
https://nextjs.org/docs/app/api-reference/file-conventions/page#props
