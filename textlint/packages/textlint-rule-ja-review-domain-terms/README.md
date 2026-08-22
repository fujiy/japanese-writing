# @fujiy/textlint-rule-ja-review-domain-terms

専門語や制度語が，本来の文脈外で比喩的に使われていないか確認するtextlint規則である．
文字列照合だけを行い，すべての一致を警告する．文脈は自動判定しない．

## 設定

組み込み辞書を使う場合は，規則を有効にするだけでよい．独自辞書を使う場合は，
`dictionaryPath`にYAMLファイルのパスを指定する．辞書は`version: 1`と`entries`を持ち，
各項目には`term`と`allowed_context`を記述する．`rewrite_hint`も追加できる．

これらの項目は，警告を確認する人またはモデルへの説明であり，機械的な許可条件や除外条件ではない．
