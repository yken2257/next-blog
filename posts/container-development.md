---
title: VSCodeのdevcontainerで開発環境を構築する
date: "2023-10-28"
---

VSCodeのdevcontainerを使って開発環境を構築するやり方をまとめる。

## Docker Desktop代替
Docker Desktopでも良いが、諸般の事情により幾つかの別の選択肢を検討。まあどれでも良い。
- Podman
- Rancher Desktop
- OrbStack

## Dockerfileの作成
Node.jsの開発環境を構築するDockerfileを作成する。これはNode.jsのバージョン18を指定した最小限の設定。

```dockerfile
FROM node:18
WORKDIR /app
COPY ./package.json /app
RUN npm install
COPY ./ /app
```

## devcontainer.jsonの作成
`.devcontainer/devcontainer.json`を作成する。
- Copilotのextensionをインストールする
- GitHub CLIをインストールする

```json:devcontainer.json
{
    "name": "Existing Dockerfile",
    "build": {
        "dockerfile": "Dockerfile"
    },
    "customizations": {
        "vscode": {
            "extensions": [
                "GitHub.copilot"
            ]
        }
    },
    "features": {
        "ghcr.io/devcontainers/features/github-cli:1": {}
    }
}
```

## devcontainerの起動
左下の`><`をクリックしてVSCodeのコマンドパレットから`Reopen in Container`を選択する。

## GitHub CLIの認証
GitHub CLIの認証を行う。`gh auth login`を実行するとブラウザが開いて認証を行うことができる。

```bash
$ gh auth login
```

## GitHubリポジトリのpull
GitHub CLIを使ってリポジトリをpullする。`gh repo clone`を実行するとリポジトリをpullすることができる。

```bash
$ gh repo clone
```
