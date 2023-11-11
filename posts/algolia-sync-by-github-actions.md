---
title: "プッシュごとに Algolia に同期する GitHub Actions"
date: "2023-11-10"
---

MarkdownをGitHubリポジトリにプッシュする形式で更新するブログサイトで、検索機能を実現したい。Algoliaを用いて、ブログ記事がプッシュされるごとに、記事の内容をGitHub Actions経由でAlgoliaに連携する例をまとめる。流れは以下のようになる。

1. Markdown形式のデータを取得して適当に加工し、AlgoliaのAPIを呼んでデータを登録（更新）するスクリプトを書く
2. GitHub Actionsで1.のスクリプトを実行する

## Algoliaの設定

Algoliaに新規登録して、インデックスを作成する。インデックス名は`posts`とする。APIキーの画面に表示される`Application ID`と`Admin API Key`、それとインデックス名は後で必要になる。

Algoliaには、ブログ記事ごとにJSON形式のデータを登録していく。今回、JSONのスキーマは以下のようにする。

```typescript
type AlgoliaIndexData = {
  objectID: string;
  title: string;
  date: string;
  description?: string;
  content: string;
};
```

objectIDはAlgoliaのインデックスにおいて一意のIDとなる。今回はブログ記事のファイル名（.mdを除く）をそのまま使うことにする。AlgoliaのAPIでデータを投入する際、同じobjectIDが存在する場合は上書きされ、存在しない場合は新規に登録される。titleはブログ記事のタイトル、dateはブログ記事の日付、descriptionはブログ記事の概要、contentはブログ記事の本文を表す。

## Algoliaにデータを登録するスクリプトの作成

ブログ記事は、以下のような形式でMarkdownファイルとして保存しているとする。

- ブログ記事のMarkdownファイルは、`/posts`に配置している
- 各Markdownファイルの先頭には、`---`で囲まれたYAML形式のメタデータ（上のtitle、data、description）がある

スクリプトでは以下のような処理を行う。

- 全ての記事のパスを取り出し、各ファイルを読み込み、`gray-matter`でメタデータを取り出す。`gray-matter`は、Markdownファイルのメタデータを取り出すライブラリで、`gray-matter`の`data`プロパティにメタデータが格納される。`gray-matter`の`content`プロパティには、メタデータを除いたMarkdownの本文が格納される。
- `remove-markdown`を使って、Markdownの本文からMarkdown記法を除去する。`remove-markdown`は、Markdownの本文からMarkdown記法を除去するライブラリで、`removeMarkdown`の戻り値はMarkdown記法を除去した文字列となる。
- `AlgoliaIndexData`の形式にデータを変換する。`AlgoliaIndexData`の`content`プロパティには、`removeMarkdown`の戻り値を格納する。以下のスクリプトでは、記事内の改行やタブをスペースに置換している。
- `algoliasearch`を使って、AlgoliaのAPIを呼び出し、データを登録する。APIキーは`.env`ファイルから読み込む。


```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import 'dotenv/config';
import removeMarkdown from 'remove-markdown'
import { MatterData, AlgoliaIndexData } from 'types';
import algoliasearch from 'algoliasearch';

const postsDirectory = path.join(process.cwd(), 'posts');

const algolia = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID as string,
  process.env.ALGOLIA_ADMIN_API_KEY as string,
)

const index = algolia.initIndex(
  process.env.ALGOLIA_PRIMARY_INDEX as string,
)

export async function getRawContentsForAlgolia() {
  const fileNames = fs.readdirSync(postsDirectory);
  const indexData: AlgoliaIndexData[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const rawText = removeMarkdown(matterResult.content);
    const contentText = rawText.replace(/[\n\t]/g, ' ');
    return {
      objectID: slug,
      content: contentText,
      ...matterResult.data as MatterData,
    };
  });
  return indexData;
}

async function syncAlgolia() {
  const res = await getRawContentsForAlgolia();
  console.log(res);

  try {
    await index.saveObjects(res);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

syncAlgolia();
```

これを`sync.ts`として保存する。`sync.ts`を実行すると、Algoliaにデータが登録される。

## ts-nodeを用いたスクリプトの実行

`sync.ts`を実行するには、`ts-node`を使う。`ts-node`は、TypeScriptを実行するためのライブラリで、`ts-node`を使うと、TypeScriptのコードをそのまま実行できる。`ts-node`をインストールする。

```bash
npm install -D ts-node
```

`sync.ts`を実行する際に適用する、`tsconfig.sync.json`を作成する。

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "dist",
    "noEmit": false
  },
  "exclude": ["node_modules"],
  "include": ["sync.ts"]
}
```

これで`sync.ts`を実行して、Algoliaにデータが登録されるか確認する。

```bash
./node_modules/.bin/ts-node --project tsconfig.sync.json ./sync.ts
```

`package.json`の`scripts`に`sync`を追加しておく。

```json
{
  "scripts": {
    "sync": "./node_modules/.bin/ts-node --project tsconfig.sync.json ./sync.ts"
  }
}
```

## GitHub Actionsで、プッシュごとの実行を設定

`.github/workflows/algolia.yml`を以下のように定義する。流れは以下の通り。

- mainブランチの`/posts`配下のファイルがプッシュされた場合に、`sync.ts`を実行する
- GitHub Actionの環境変数にあるAlgoliaの`Application ID`、`Admin API Key`、インデックス名を`.env`に書き込む
- `npm run sync`を実行する

```yaml
name: Sync Algolia

on:
  push:
    branches:
      - main 
    paths:
      - 'posts/*'

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x]

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm ci
    - name: Create .env file
      run: |
        echo "ALGOLIA_ADMIN_API_KEY=${{ secrets.ALGOLIA_ADMIN_API_KEY }}" >> .env
        echo "ALGOLIA_APPLICATION_ID=${{ secrets.ALGOLIA_APPLICATION_ID }}" >> .env
        echo "ALGOLIA_PRIMARY_INDEX=${{ secrets.ALGOLIA_PRIMARY_INDEX }}" >> .env
    - name: Sync Algolia
      run: npm run sync
```

Algoliaの`Application ID`、`Admin API Key`、インデックス名は、GitHubの`Settings`→`Secrets`から設定する。`ALGOLIA_ADMIN_API_KEY`、`ALGOLIA_APPLICATION_ID`、`ALGOLIA_PRIMARY_INDEX`という名前で設定する。これを設定すると、GitHub Actionsがプッシュごとに`sync.ts`を実行するようになる。