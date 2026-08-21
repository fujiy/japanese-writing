---
name: japanese-writing
description: "Apply consistent Japanese writing conventions to conversation, logical explanations, technical documents, reports, theses, and papers. Use when Codex drafts, revises, proofreads, or reviews Japanese prose."
---

# Japanese Writing

日本語の文章を作成，修正，校正，またはレビューするときに使用する．
文脈プロファイルと作業モードを別々に選び，必要な規則だけを適用する．

## 共通規則

次の規則は，通常の会話を含むすべての日本語出力に適用する．

- 会話はです・ます調とする．文書は，ユーザーまたはテンプレートの指定がなければ，だ・である調とする．
- ユーザー，投稿先，所属機関，または指定テンプレートの規則を優先する．
- 不要な比喩，暗喩，擬人法，誇張表現，および印象を強めるだけの形容詞を避ける．
- 他分野の術語を，単なる方針，重要性，関係性などの比喩として安易に転用しない．
- 細部の説明中に，大局的な意義，主観的評価，または一般化を突然挿入しない．
- 太字，絵文字，定型的な見出し，まとめ，対比構文，および箇条書きを機械的に追加しない．
- 口語表現や崩した言い方を避けるが，会話を不必要に硬くしない．
- 強調は，具体的な比較または根拠がある場合に限る．
- `references/discouraged-expressions.yml` の `forbid` は使用せず，`review` は本来の意味で必要か確認する．

## 文脈プロファイル

文章の用途に応じて，次のプロファイルを選ぶ．必要なら複数を組み合わせる．

- `common`：共通規則だけを適用する．通常の会話ではこれを既定とする．
- `logical`：数学的，論理的，または技術的な説明を会話で行う場合に，
  `references/logical-explanation.md` を読む．
- `technical`：レポート，技術文書，解説，または保存される原稿を扱う場合に，
  `references/technical-document.md` を読む．
- `academic`：論文，学位論文，投稿原稿，または数式を含む学術文書を扱う場合に，
  `references/technical-document.md` と `references/academic-writing.md` を読む．

会話で論理的な説明をする場合は，通常 `common + logical` とし，文書用の句読点や改行規則を
自動的には加えない．

## 作業モード

文脈プロファイルとは別に，依頼内容から作業モードを選ぶ．

- `draft`：新規作成であり，構成から設計してよい．
- `revise`：意味を保ちながら，構成，段落，文，および用語を改善してよい．
- `proofread`：原文をできるだけ保ち，必要な修正だけを行う．
- `review`：原文を変更せず，問題点と必要に応じて修正案を示す．

`proofread`または`review`では，`references/proofreading.md` を読む．
ユーザーが「校正」「誤字脱字」「表記確認」などを求めた場合は，指定がなければ`proofread`とする．

## textlint

通常の会話および短い論理的説明ではtextlintを実行しない．
保存されるMarkdown文書，技術文書，学術文書，または校正対象のファイルでは，完成前に利用可能なら
次を実行する．

```bash
node scripts/lint-writing.mjs --profile <general|technical|academic> <file...>
```

- `technical`文書には`technical`，`academic`文書には`academic`，それ以外の保存文書には`general`を使う．
- `proofread`では`--mode proofread`を加える．このモードでは自動修正を許可しない．
- textlintは原則として完成前に1回だけ実行する．修正した場合だけ，必要に応じてもう1回実行する．
- `error`は原則として修正し，`warning`と`info`は文脈を確認する．警告をゼロにすることを目的にしない．
- `--fix`はユーザーが自動修正を求め，かつ原文保持の制約がない場合に限って明示的に使う．
- Node.jsまたは依存関係が利用できない環境では実行せず，同じ規則を目視で確認する．実行のために
  その場で依存関係をインストールしない．

## 完成前の確認

- 適用した文脈プロファイルと作業モードに反していないか確認する．
- 文体上の修正と内容上の修正を区別する．不明点や矛盾を推測で補わない．
- 文体，句読点，用語，数式，記号，引用，および段落構成を全文で確認する．
- 推敲または校正では，原文の意味と論理関係が保たれていることを確認する．
