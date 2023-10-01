---
title: "GitHub Actionsを使ってプッシュするたびにCloudflare Pagesにデプロイする方法"
description: "Cloudflare Pagesの公式GitHub Actionを使ってプッシュごとにCloudflare Pagesにデプロイできるようにする手順をまとめます"
date: "2023-06-10"
updatedDate: "June 12 2023"
---

## Table of Contents

Cloudflareが公式に公開している「[Cloudflare Pages GitHub Action](https://github.com/cloudflare/pages-action)」というGitHub Actionsを使って、プッシュするごとにGitHub Actions経由でCloudflare Pagesにデプロイする手順をまとめます。
基本的にはCloudflare公式ページに記載されている手順に従って進めます。以下のどちらでもOKです。
- https://github.com/cloudflare/pages-action
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/

## Step 1: Cloudflareの認証情報をGitHubのSecretsに登録する
Cloudflare Pagesの公式GitHub Actionを使うためには、Cloudflareの認証情報（Account IDとAPIトークン）が必要です。
### APIトークンの取得
APIトークンはこの[画面](https://dash.cloudflare.com/profile/api-tokens)から作成できます。色々な権限が設定できますが、今回はCloudflare Pagesの権限があれば十分です。
「Custom token」から、Pagesの編集権限だけを付与したトークンを作成します。

### Account IDの取得
Account IDは、CloudflareのダッシュボードのURLに含まれています。
`https://dash.cloudflare.com/<ACCOUNT_ID>`

### GitHubのSecretsに登録
GitHubのリポジトリの「Settings」 > 「Secrets and variables」 > 「Actions」から、2つのSecretsを登録します。名前は`CLOUDFLARE_API_TOKEN`と`CLOUDFLARE_ACCOUNT_ID`にします。

## Step 2: GitHub Actionsの設定
GitHub Actionsの設定ファイルは、以下のようになります。`.github/workflows/publish.yml`に以下の内容を記載します。
Cloudflareの[公式ドキュメント](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)のままです。

```yaml
name: Cloudflare Pages
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    name: Deploy to Cloudflare Pages
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      # Run your project's build step
      - name: Build
        run: npm install && npm run build
      - name: Publish
        uses: cloudflare/pages-action@1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: YOUR_PROJECT_NAME # e.g. 'my-project'
          directory: YOUR_DIRECTORY_OF_STATIC_ASSETS # e.g. 'dist'
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

projectNameはCloudflare Pagesのプロジェクト名、directoryはビルドした静的ファイルのディレクトリを指定します。
`secrets.GITHUB_TOKEN`は特に設定する必要はありません。GitHubが自動的に設定してくれます。

## Step 3: デプロイ
GitHub Actionsの設定が完了したら、GitHubにプッシュするだけでCloudflare Pagesにデプロイされます🎉