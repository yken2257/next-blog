---
title: "いろいろなプラットフォームのアイコンを使えるReact Icons"
date: "2023-09-29"
---

[React Icons](https://react-icons.github.io/react-icons)は、AntDesign Icons, Bootstrap Icons, FontAwesomeなど、いろいろなプラットフォームのアイコンを一挙に使える。

## 使い方

① インストールする
  ```bash
  npm install react-icons --save
  ```

② [React Iconsのページ](https://react-icons.github.io/react-icons)で探したいアイコンを検索

③ 使いたいアイコンをクリックしてimportすべき名前をコピー（e.g., `FaBeer`）

④ そのアイコンがどのプラットフォーム（FontAwesome etc）か名前から推測して、左カラムの各プラットフォームのページに行ってどこからimportするのか確認
  - なぜかというと、例えば`react-icons/fa`の`fa`の部分は検索からはわからないので

⑤ Reactでimportして使う
  ```jsx
  import { FaBeer } from 'react-icons/fa';

  class Question extends React.Component {
    render() {
      return <h3> Lets go for a <FaBeer />? </h3>
    }
  }
  ```