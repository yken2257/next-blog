---
title: "GitHub SSH on devcontainer"
date: "2024-01-20"
---

devcontainerでGitHubのSSH接続をするとき詰まったのでメモ。

## Snippets
バックグラウンドでssh-agentを開始

```bash
eval "$(ssh-agent -s)"
```

SSH 秘密鍵を ssh-agent に追加して、パスフレーズをキーチェーンに保存

```bash
ssh-add --apple-use-keychain ~/.ssh/id_rsa
```

SSHエージェントに登録されている鍵の一覧を表示

```bash
ssh-add -l -E sha256
```

既存のSSHキーを確認

```bash
ls -al ~/.ssh
```

GitHub SSH 接続確認
```bash
ssh -T git@github.com
ssh -vT git@github.com # デバックモード
```


## Links
- https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials
- https://docs.github.com/ja/authentication/connecting-to-github-with-ssh