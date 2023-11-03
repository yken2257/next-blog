---
title: "Vercel CLIの基本的な使い方"
date: "2023-11-04"
---

Vercel CLIの基本的な使い方をまとめる。
公式ドキュメント：https://vercel.com/docs/cli

## コマンド集

### インストール

まずはインストール。

```bash
$ npm install -g vercel
```

### Vercelにログイン

以下はGitHubアカウントでのログイン。ブラウザが開いて認証を行う。

```bash
$ vercel login --github
```

### プロジェクト一覧
  
```bash
$ vercel project ls
```

### プロジェクトの作成
#### 作成するだけ

```bash
$ vercel project add sample-project-by-cli
Vercel CLI 32.5.0
> Success! Project sample-project-by-cli added (your-username) [332ms]
```

#### デプロイも一緒に
https://vercel.com/docs/cli/project-linking

オプションなしで`vercel`コマンドを実行すると、プロジェクトの作成、デプロイを行うことができる。

```bash
$ vercel
Vercel CLI 32.5.0
? Set up and deploy “/workspaces/my-lovely-project”? [Y/n] y
? Which scope do you want to deploy to? <<your-username>>
? Link to existing project? [y/N] n
? What’s your project’s name? my-lovely-project
? In which directory is your code located? ./
Local settings detected in vercel.json:
Auto-detected Project Settings (Next.js):
```

### Vercel公式のexampleからコードを持ってくる

[ここ](https://github.com/vercel/vercel/tree/main/examples)で公開されているexampleからサンプルコードを引っ張ることができる。

```bash
$ vercel init nextjs new-directory-name
```

`nextjs`がサンプルコードの名前、`new-directory-name`が引っ張ってくるローカルのディレクトリ名。

### 環境変数の設定

アプリケーションで用いるAPIキーなどの環境変数を設定する。環境変数はプロジェクト単位。`vercel secrets`は別物なので注意。

```bash
$ vercel env add
Vercel CLI 32.5.0
? What’s the name of the variable? API_KEY
? What’s the value of API_KEY? XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
? Add API_KEY to which Environments (select multiple)? Production, Preview, Development
✅  Added Environment Variable API_KEY to my-lovely-project [839ms]
```

pullするとローカル上の`.env`にも反映される。

```bash
$ vercel env pull
```

なお、環境変数の追加や変更を本番環境のアプリケーションで読めるようにするには、アプリのデプロイが必要。


## Vercel CLIを用いたVercelプロジェクトの初期セットアップ
Next.jsの初期アプリをVercelにデプロイまでの順序をまとめる。

### Vercel CLIのインストール

```bash
$ npm i -g vercel
```

### VercelにGitHubアカウントでログイン

```bash
$ vercel login --github
> Success! GitHub authentication complete for your@email
Congratulations! You are now logged in. In order to deploy something, run `vercel`.
💡  Connect your Git Repositories to deploy every branch push automatically (https://vercel.link/git).
```

### Next.jsのプロジェクトを作成

```bash
$ npx create-next-app@latest
```

### Vercel CLIを用いてVercelプロジェクトを作成

```bash
$ vercel project add sample-vercel-project-by-cli
Vercel CLI 32.5.0
> Success! Project sample-vercel-project-by-cli added (your-username) [332ms]
```

### 作成したVercelプロジェクトに紐付け

```bash
$ vercel link
Vercel CLI 32.5.0
? Set up “/workspaces/sample-vercel-project-by-cli”? [Y/n] y
? Which scope should contain your project? your-username
? Found project “your-username/sample-vercel-project-by-cli”. Link to it? [Y/n] y
✅  Linked to your-username/sample-vercel-project-by-cli (created .vercel)
```

### 環境変数の設定（もしあれば）

```bash
$ vercel env add
Vercel CLI 32.5.0
? What’s the name of the variable? TEST_VAR
? What’s the value of TEST_VAR? TEST_VAL
? Add TEST_VAR to which Environments (select multiple)? Production, Preview, Development
✅  Added Environment Variable TEST_VAR to Project sample-vercel-project-by-cli [243ms]
```

### 環境変数をローカルにpull

```bash
$ vercel env pull
Vercel CLI 32.5.0
> Downloading `development` Environment Variables for Project sample-vercel-project-by-cli
✅  Created .env.local file  [207ms]
```

### GitHubリポジトリとVercelプロジェクトを紐付け

```bash
$ vercel git connect
```

### デプロイ

```bash
$ vercel
Vercel CLI 32.5.0
🔍  Inspect: https://vercel.com/username/projectname/xxxxxxxxxxxxx [4s]
✅  Preview: https://projectpreviewname.vercel.app [4s]
📝  Deployed to production. Run `vercel --prod` to overwrite later (https://vercel.link/2F).
💡  To change the domain or build command, go to https://vercel.com/username/projectname/settings
```

あるいは、GitHubリポジトリと連携済みなら普通にコミットしても良い。