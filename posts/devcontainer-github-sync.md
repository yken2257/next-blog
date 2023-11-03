---
title: VSCodeのdevcontainerでGitHubの同期
date: "2023-11-03"
---

ローカルのPCでdevcontainerを使って開発を行う場合、コンテナ内でGitHubの認証を行う必要がある。VSCodeの[ドキュメント](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)に記載があるが、コンテナ内での認証は面倒なのでローカルのPCで認証を行い、コンテナ内での認証をスキップする方法をまとめる。

## ローカルでの初期設定
ローカルでGitHub連携を行っていない場合は、以下の手順でGitHub連携を行う。
### GitHubアカウント連携

まずGitHub CLIをインストールする。

```bash
$ brew install gh # Macの場合
```

アカウントにログイン、SSHによるセットアップを行う。

```bash
$ gh auth login
? What account do you want to log into? GitHub.com
? What is your preferred protocol for Git operations? SSH
? Upload your SSH public key to your GitHub account? /Users/username/.ssh/id_rsa.pub
? Title for your SSH key: MacbookAir
? How would you like to authenticate GitHub CLI? Login with a web browser
```

### Git config
ローカルでユーザー名とメールアドレスを設定する。

```bash 
$ git config --global user.name "username"
$ git config --global user.email "your@email"
```

### SSH Agentの設定

ssh-agentをバックグラウンドで起動する。

```bash
$ eval "$(ssh-agent -s)"
Agent pid 97716
```

SSHの秘密鍵を登録する。

```bash
$ ssh-add --apple-use-keychain ~/.ssh/id_rsa # Macの場合
Identity added: /Users/username/.ssh/id_rsa (MacbookAir)
```

ssh-agentがログイン時に起動されるよう、`~/.zprofile`に以下を追記する。

```bash
if [ -z "$SSH_AUTH_SOCK" ]; then
   # Check for a currently running instance of the agent
   RUNNING_AGENT="`ps -ax | grep 'ssh-agent -s' | grep -v grep | wc -l | tr -d '[:space:]'`"
   if [ "$RUNNING_AGENT" = "0" ]; then
        # Launch a new instance of the agent
        ssh-agent -s &> $HOME/.ssh/ssh-agent
   fi
   eval `cat $HOME/.ssh/ssh-agent`
fi
```

この辺りの手順はVSCodeドキュメントの[Sharing Git credentials with your container](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)を参照。

## devcontainerの開発環境の構築

### リポジトリのクローン

```bash
gh repo clone user-name/repository-name
```

### Dockerfileの作成
Node.jsの開発環境を構築するDockerfileを作成する。これはNode.jsのバージョン18を指定した最小限の設定。

```dockerfile
FROM node:18
WORKDIR /app
COPY ./package.json /app
RUN npm install
COPY ./ /app
```

### devcontainer.jsonの作成
`.devcontainer/devcontainer.json`を作成する。
- Copilotのextensionをインストールする

```json
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
    }
}
```

### devcontainerの起動
VScodeの画面上で、左下の`><`をクリックしてVSCodeのコマンドパレットから`Reopen in Container`を選択する。

### コンテナ内でGitHub連携の確認

何もしなくても、SSH接続ができることを確認する。

```bash
ssh -T git@github.com
```