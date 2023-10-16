---
title: Astroでドキュメントサイト風サイドバーとBreadcrumbを作る
date: "2023-10-17"
---
Astroで擬似ドキュメントサイトを作っていく。
ドキュメントサイトには階層構造を示したサイドバーと、現在のページの位置がわかるBreadcrumbがつきものだがややこしいところなので、簡易的に作成したものを示す。

## メタデータの定義
### ページの階層構造
yamlで書く。
- `slug`はurlの構成要素（`/manual/function_b/component_1/detail`等）
- `text`はサイドバーやBreadcrumbに載せる文字（`マニュアル / 機能B / 要素1 / 詳細`）
  - 「詳細」はtext要素として存在しないが、実際のページのtitleをとってくることにしてyamlには書かない

```yaml path_names.yaml
- slug: tutorial
  text: チュートリアル
  items:
    - slug: index.html
    - slug: feature_a
      text: 特徴A
      items:
        - slug: overview
        - slug: step1
    - slug: note
- slug: manual
  text: マニュアル
  items:
    - slug: index.html
    - slug: function_b
      text: 機能B
      items:
        - slug: index.html
        - slug: component_1
          text: 要素1
          items:
            - slug: index.html
            - slug: detail
```

### 階層構造の定義からTree化
上の階層構造を読み込んだものを引数にとって、サイドバーに表示させる文字と対応するURLからなる木構造のオブジェクトを生成する。

ついでに`index.html`等の実際のページのtitleをとってきて木構造の末端の文字列とする。実際のページを読むのはAstroの`getCollection`を使う。

```ts
import { getCollection } from 'astro:content';

export type TreeNode = {
  [key: string]: TreeNodeValue | string;
};

export type TreeNodeValue = {
  path: string;
  text?: string;
  children?: TreeNode;
}

export type NavItem = {
    slug: string;
    text?: string;
    items?: NavItem[];
};

export async function convertToTree(data: NavItem[]): Promise<TreeNode> {
  const tree: TreeNode = {};
  const entries = await getCollection('posts');

  function findTitleForPath(path: string): string | undefined {
    const modifiedPath = path.startsWith('/') ? path.slice(1) : path;  // 最初の'/'を削除
    let entry = entries.find(e => e.slug.endsWith(modifiedPath));
    // 末尾がindex.htmlの場合のマッチングを試みる
    if (!entry && modifiedPath.endsWith('/index.html')) {
      const shortenedPath = modifiedPath.replace(/\/[^\/]+$/, '');  // 最後の"/"以下を削除
      entry = entries.find(e => e.slug.endsWith(shortenedPath));
    }
  return entry ? entry.data.title : undefined;
  }

  function recurse(items: NavItem[], currentLevel: TreeNode, path: string = '') {
    items.forEach(item => {
      const newPath = `${path}/${item.slug}`;
      if (item.items) {
        if (!currentLevel[item.slug]) {
          currentLevel[item.slug] = {
            path: newPath,
            text: item.text,
            children: {}
          };
        }
        recurse(item.items, currentLevel[item.slug].children as TreeNode, newPath);
      } else {
        const title = findTitleForPath(newPath);
        currentLevel[item.slug] = {
          path: newPath,
          text: title || item.text
        };
      }
    });
  }

  recurse(data, tree);
  return tree;
}
```

## サイドバーの実装

木構造から、`details`要素を用いたサイドバーを作成（`/src/components/RecursiveTree.astro`）
- 再帰的なコンポーネントの利用には`Astro.self`を使っている

```jsx
---
import type { TreeNode, TreeNodeValue } from "../utils";

const node: TreeNode = Astro.props.node;
const basePath: string = Astro.props.basePath || '';
---

{Object.entries(node).map(([key, value]) => {
  const isTreeNodeValue = (val: string | TreeNodeValue): val is TreeNodeValue => typeof val !== 'string';
  
  let newPath: string;
  let displayText: string;
  let children: TreeNode | undefined;

  if (isTreeNodeValue(value)) {
    newPath = value.path;
    displayText = value.text || key;
    children = value.children;
  } else {
    newPath = value;
    displayText = key;
  }

  if (typeof children === 'object') {
    return (
      <li>
        <details open>
          <summary class="flex items-center cursor-pointer">
            {displayText}
            <span class="ml-4">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </span>
          </summary>
          <ul>
            <Astro.self node={children} basePath={newPath} />
          </ul>
        </details>
      </li>
    );
  } else {
    return (
      <li>
        <a href={newPath}>{displayText}</a>
      </li>
    );
  }
})}

<style>
  li {
    list-style: none;
  }

  details > summary {
    list-style: none;
    font-weight: bold;
  }

  details > summary::marker,
  details > summary::-webkit-details-marker {
    display: none;
  }

  summary {
    cursor: pointer;
  }

  details[open] > summary svg {
    transform: rotate(90deg);
  }

  details > summary {
      padding-inline-start: 0px;
  }

  details > ul {
      padding-inline-start: 10px;
  }

  details details > summary {
      padding-inline-start: 0px;
  }
  details details > ul {
    padding-inline-start: 10px;
  }

  details details details > summary {
      padding-inline-start: 0px;
  }
  details details details > ul {
    padding-inline-start: 10px;
  }
</style>
```

`ul`で挟まないといけないのでラッパー`/src/components/LeftSideBar.astro`を定義

```jsx
---
import RecursiveTree from "./RecursiveTree.astro";

const tree = Astro.props.tree;
---
<ul>
    <RecursiveTree node={tree} basePath="" />
</ul>
```

これでサイドバーの要素は完成。

## Breadcrumbの実装

現在のURL情報と木構造を引数にとってBreadcrumbの構成要素のテキストとリンクを返す関数を定義

```ts
export type BreadcrumbItem = {
  text: string;
  url: string;
};

export function generateBreadcrumb(url: string, tree: TreeNode): BreadcrumbItem[] {
  const parts = url.split('/').filter(p => p);
  let breadcrumbParts: BreadcrumbItem[] = [];
  let currentLevel: TreeNode | undefined = tree;
  let currentPath = "";

  for (const part of parts) {
    currentPath += `/${part}`;
    const node: string | TreeNodeValue | undefined = currentLevel && currentLevel[part];
    if (isTreeNodeValue(node) && node.text) {
      let linkUrl = currentPath;

      // Check for an "index.html" child and update the URL if found
      if (node.children && node.children["index.html"]) {
        linkUrl += "/index.html";
      }

      breadcrumbParts.push({
        text: node.text,
        url: linkUrl
      });

      currentLevel = node.children;
    } else {
      currentLevel = undefined;
    }
  }
  breadcrumbParts.unshift({
    text: 'HOME',
    url: '/'
  });

  return breadcrumbParts;
}
```

この返り値を`Astro.props`として受け取ってBreadcrumbを返す`Breadcrumb.astro`を定義

```jsx
---
import type { BreadcrumbItem } from "../utils";
const breadcrumbParts: BreadcrumbItem[] = Astro.props.breadcrumbParts;
---

<div class="breadcrumb">
  {breadcrumbParts.map((item, index) => (
    <>
      {index > 0 && " / "}
      {item.url.endsWith('/index.html') || item.text === 'HOME' ? (
        <a href={item.url}>{item.text}</a>
      ) : (
        <span>{item.text}</span>
      )}
    </>
  ))}
</div>
```

## [..slug]でcomponentを読み込み
`/src/pages/[..slug].astro`で以下の処理をする
- yamlを読み込んでTreeを生成
- TreeからBreadcrumbの要素を生成
- Treeを`<LeftSideBar />`のpropsとして渡す
- Breadcrumbの要素を`<Breadcrumb />`のpropsとして渡す

```jsx /src/pages/[..slug].astro
---
import { getCollection } from 'astro:content';

import fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import type { NavItem, BreadcrumbItem } from "../utils";
import { convertToTree, generateBreadcrumb } from "../utils";

import BaseLayout from '../layouts/BaseLayout.astro';
import LeftSideBar from "../components/LeftSideBar.astro";
import Breadcrumb from '../components/Breadcrumb.astro';

export async function getStaticPaths() {
  const entries = await getCollection('posts');
  return entries.map(entry => ({
    params: { slug: entry.slug }, props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();

function loadYAML(filepath: string): NavItem[] {
  const fileContents = fs.readFileSync(filepath, 'utf-8');
  return yaml.load(fileContents) as NavItem[];
}
const yamlPath = path.join(process.cwd(), 'src', 'path_names.yaml')
const dataObj: NavItem[] = loadYAML(yamlPath);
const tree = await convertToTree(dataObj);
const breadcrumbParts: BreadcrumbItem[] = generateBreadcrumb(entry.slug, tree);
---
<BaseLayout frontmatter={entry.data}>
  <div class="grid grid-cols-12">
    <div class="col-start-0 col-span-3 mt-16">
      <LeftSideBar tree={tree}/>
    </div>
    <article class="mt-16 col-start-4 col-end-11 max-w-none">
      <Breadcrumb breadcrumbParts={breadcrumbParts} />
      <Content />  
    </article>
  </div>
</BaseLayout>
```
これでサイドバーとBreadcrumbが完成！