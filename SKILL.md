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
- 日本語中の半角英数字および略語の前後には，半角空白を入れない．

`textlint/packages/textlint-rule-ja-review-domain-terms/dictionary.yml`，
`textlint/packages/textlint-rule-ja-review-ai-overstatement/dictionary.yml`，および
`references/terminology.yml`はtextlint専用の辞書であり，通常会話の生成時には読み込まない．

## 文脈プロファイル

文章の用途に応じて，次のプロファイルを選ぶ．必要なら複数を組み合わせる．

- `common`：共通規則だけを適用する．通常の会話ではこれを既定とする．
- `logical`：数学的，論理的，または技術的な説明を会話で行う場合に，
  `references/logical-explanation.md` を読む．
- `technical`：技術的内容を含むレポート，解説，または保存される原稿を扱う場合に，
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

短い応答を除き，論理的説明，保存される文書，および校正対象のファイルでは，完成前に利用可能なら
textlintを実行する．

論理的説明では，次のいずれかに該当する返答を検査対象とする．

- 複数の前提，条件，または根拠を用いて説明する．
- 数式の導出，論証，因果関係，または手順を説明する．
- 複数の案を比較し，選択理由または注意点を述べる．
- 複数の段落にわたって説明する．

確認，了承，簡単な状況報告，単一の事実または定義だけを答える短い返答，ユーザーへの短い質問，
および作業中の簡潔な進捗報告では実行しない．
実行の要否は文字数だけで決めない．短くても論証や比較を含む場合は実行し，長くても引用や
定型情報だけの場合は省略してよい．

```bash
node scripts/lint-writing.mjs --profile <logical|general|technical|academic> <file...>
```

- 会話中の論理的説明には`logical`を使う．
- 会話の返答を検査する場合は，返答案を一時的なMarkdownファイルとして検査し，検査後に削除する．
- 非技術的な保存文書には`general`，技術文書には`technical`，学術文書には`academic`を使う．
- `logical`では会話の文体を維持し，だ・である調，学術用句読点，および一文一行を要求しない．
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
