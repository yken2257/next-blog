---
title: Markdownをプレーンテキストに変換する
date: "2023-10-24"
---

## 方法

`remove-markdown`を使う。

```js
import removeMarkdown from 'remove-markdown'

const rawText = removeMarkdown(markdownString);
```

これだけ。Markdownで使っているコードブロックや強調、リンク等のマークアップを削除して返してくれる。ただし、コードブロック内にhtmlタグを書いていたりするとそれも取り除かれてしまうようだ。



なお、remarkjsから`strip-markdown`という同様のライブラリも出ている。

https://unifiedjs.com/explore/package/strip-markdown/

こちらは[デモ](http://remarkjs.github.io/strip-markdown/)で挙動確認もできる。
デモを触る限り、コードブロックを改行を用いて以下のように書くと全て取り除かれてしまうようだった。
````
```js
import removeMarkdown from 'remove-markdown'
```
````

## 参考

- 「[React で Markdown を扱うときに便利な react-markdown と remove-markdown](https://lightbulbcat.hatenablog.com/entry/2019/08/02/034206)」