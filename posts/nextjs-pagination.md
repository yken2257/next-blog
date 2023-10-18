---
title: Next.js App Routerでページネーション
date: "2023-10-18"
---

## 概要

- Next.jsのApp Routerでブログサイトを構築
- `/pages/1` `/pages/2`のようなURLで記事を並べたページネーションを実装

## 手順

### 記事一覧ページのはじめの一歩

`/app/pages/[pageNum]/page.tsx`を作って以下のようにする。

```tsx
export default function Page({ params }: { params: { pageNum: number } }) {
  return <div>My Post: {params.pageNum}</div>
}
```

参考：https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#example

これで`/pages/1``/pages/2`にアクセスして表示できれば最初の一歩はOK。これを修正していく。

### 記事一覧の実装

- `ITEMS_SIZE`で1ページに表示する記事数を指定
- 全ての記事のメタデータの配列を取ってくる関数を定義（詳細は略）
- 現在のページ番号と`ITEMS_SIZE`をもとに、表示すべき記事を選別（配列をスライス）
- スライスした配列をmapで回して、メタデータを表示（`PostCard`を定義してカード表示させる）

```tsx
import { getSortedPostsData } from '@/utils/posts'
import PostCard from '@/app/components/PostsCard';

const ITEMS_SIZE = 5;

export default async function Page({ params }: { params: { pageNum: number } }) {
  const allPostsData = await getSortedPostsData();
  const currentPage = params.pageNum;

  const slicedPosts = allPostsData.slice(
    ITEMS_SIZE * (currentPage - 1),
    ITEMS_SIZE * currentPage
  );

  return (
    <>
      <h2>Posts</h2>
      {slicedPosts.map(({slug, date, title}) => (
        <PostCard key={slug} title={title} slug={slug} date={date}/>
      ))}
    </>
  )
}
```

### ページネーションコンポーネントの定義

- 記事一覧ページの番号の最大値を引数にとり、各記事一覧ページへのリンクを貼る
- 現在のページの番号を引数にとって、現在どの番号のページにいるかわかるようCSSを調整する

```tsx
import Link from 'next/link';

const Pagination = ({ maxPageNum, currentPageNum = 1 }) => {
  const pageNumArray = Array.from({ length: maxPageNum }, (_, i) => i + 1);

  return (
    <div className="flex items-center space-x-1 mt-8">
      {pageNumArray.map((page) => (
        <Link 
          href={`/pages/${page}`} 
          key={page}
          className={`px-4 py-2 border hover:bg-sky-900 hover:text-white ${
            currentPageNum == page && 'bg-sky-900 text-white'
          }`}
        >
          {page}
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
```

### ページネーションを記事一覧ページ内に

記事一覧ページの番号の最大値を計算して、`Pagination`の引数に渡せばOK。

```tsx
export default async function Page({ params }: { params: { pageNum: number } }) {
  // 追加
  const maxPageNum = Math.ceil(allPostsData.length / ITEMS_SIZE)

  return (
    <>
      // 追加
      <Pagination maxPageNum={maxPageNum} currentPageNum={currentPage} />
    </>
  )
}
```

Page routerの時にあった`getStaticProps`がなくなって記述がシンプルになった？