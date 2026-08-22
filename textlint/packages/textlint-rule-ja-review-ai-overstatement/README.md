# @fujiy/textlint-rule-ja-review-ai-overstatement

AI生成文で多用されやすい日本語の強調表現を警告するtextlint規則である．
文字列照合だけを行い，すべての一致を警告する．代替表現の提示と自動修正は行わない．

## 設定

組み込み辞書を使う場合は，規則を有効にするだけでよい．独自辞書を使う場合は，
`dictionaryPath`にYAMLファイルのパスを指定する．辞書は`version: 1`と`entries`を持ち，
各項目には`term`だけを記述する．
