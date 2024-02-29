---
title: "GitHub on devcontainer②"
date: "2024-03-01"
---

devcontainerでGitHubのSSH接続をするとき詰まったのでメモ。②
普段使っていてほぼ支障なしだが、何かしらのきっかけでSSHキーが参照できなくなって困った。


もう一度[VS Codeの公式](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)を見ると、「Using SSH keys」セクションの前に「Using a credential helper」とある。

[Git Credential Manager](https://docs.github.com/ja/get-started/getting-started-with-git/caching-your-github-credentials-in-git#git-credential-manager)なるものを入れておけば、
SSH接続で問題になることはなさそう。

https://code.visualstudio.com/docs/devcontainers/containers#_working-with-git

インストールして

```bash
brew install --cask git-credential-manager
```

認証管理の設定を確認して下のようにGCMが使われていることを確認。

```bash
% git config --show-origin credential.helper
file:/Users/username/.gitconfig	/usr/local/share/gcm-core/git-credential-manager
ssh-add -l -E sha256
```

以上、これでコンテナ上で接続可能。
