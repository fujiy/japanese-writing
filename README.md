
# Japanese Writing Skill

日本語の会話，論理的説明，技術文書，レポート，学位論文，および論文の作成，修正，校正，
レビューに用いるCodex skillである．
文章の用途を表す文脈プロファイルと，変更範囲を表す作業モードを別々に選択する．

## 構成

- `SKILL.md`には，共通規則，プロファイルとモードの選択基準，およびtextlintの実行条件がある．
- `references/`には，論理的説明，技術文書，学術文書，校正，および対訳辞書がある．
- `scripts/lint-writing.mjs`は，指定したプロファイルでtextlintを実行する．
- `textlint/profiles/`には，`logical`，`general`，`technical`，および`academic`の設定がある．
- `textlint/packages/`には，npm workspaceとして管理する自作規則とプリセットがある．

## 文脈プロファイルと作業モード

skillが文章を扱うときは，次の文脈プロファイルを選ぶ．

| プロファイル | 対象 | textlint |
|---|---|---|
| `common` | 通常の会話を含むすべての日本語出力 | 通常は実行しない |
| `logical` | 数学的，論理的，または技術的な会話中の説明 | 短い応答を除き`logical`を使う |
| `technical` | 技術的内容を含むレポート，解説，保存される原稿 | `technical`を使う |
| `academic` | 論文，学位論文，投稿原稿，数式を含む学術文書 | `academic`を使う |

作業モードは，文脈プロファイルとは独立して選ぶ．

| モード | 変更範囲 |
|---|---|
| `draft` | 新規作成であり，構成から設計してよい |
| `revise` | 意味を保ちながら，構成や表現を改善してよい |
| `proofread` | 原文をできるだけ保ち，必要な修正だけを行う |
| `review` | 原文を変更せず，問題点と必要な修正案を示す |

## textlint実行環境のセットアップ

### 必要な環境

- Node.js 20以上
- npm
- macOSまたはLinuxなどのUnix系環境

textlintはskillの補助機能であり，短い通常会話では必要ない．
Node.jsを実行できない環境ではtextlintを省略し，skillの規則に基づいて目視で確認する．
skill実行中にその場でnpmパッケージをインストールすることは想定していない．

### skillの配置

Codexから自動的に検出する場合は，skillのディレクトリを次の位置に置くか，この位置から
リポジトリへシンボリックリンクを作る．

```text
~/.codex/skills/japanese-writing/
```

### 依存関係のインストール

skillのルートから次を実行する．

```bash
cd textlint
npm ci
cd ..
```

`package-lock.json`で依存関係を固定している．

インストール状態は次のコマンドで確認できる．

```bash
cd textlint
npm ls --depth=0
cd ..
```

## textlintの実行方法

skillのルートで，対象に応じたプロファイルを指定する．

```bash
node scripts/lint-writing.mjs --profile logical response.md
node scripts/lint-writing.mjs --profile general notes.md
node scripts/lint-writing.mjs --profile technical report.md
node scripts/lint-writing.mjs --profile academic paper.tex
```

複数のファイルを同時に指定してもよい．

```bash
node scripts/lint-writing.mjs --profile academic introduction.tex method.tex
```

校正では`proofread`モードを指定する．

```bash
node scripts/lint-writing.mjs --profile academic --mode proofread paper.tex
```

利用可能なオプションは次のとおりである．

| オプション | 内容 |
|---|---|
| `--profile logical\|general\|technical\|academic` | textlintプロファイルを選ぶ |
| `--mode draft\|revise\|proofread\|review` | 作業モードを選ぶ．既定値は`revise`である |
| `--format <name>` | textlintの出力形式を指定する．既定値は`stylish`である |
| `--cache` | 変更されていないファイルの再検査を省略する |
| `--fix` | 修正可能な規則による自動修正を行う |

`proofread`と`review`では，原文を機械的に変更しないため，`--fix`を指定すると終了コード2で拒否する．
それ以外のモードでも，`--fix`はユーザーが自動修正を求めた場合に限って使う．

終了コードの扱いは次のとおりである．

| 終了コード | 意味 |
|---|---|
| `0` | `error`がない．`warning`または`info`が含まれる場合がある |
| `1` | textlintが`error`を検出した |
| `2` | 引数，依存関係，または禁止された`--fix`など，実行条件に問題がある |

`warning`と`info`は修正命令ではない．
原文の意味と文脈を確認し，必要なものだけを反映する．

## textlintプロファイル

### `logical`

会話中の論理的説明に使う．
複数の前提や根拠を扱う説明，数式の導出，論証，因果関係，手順，または複数案の比較を含む返答を
検査する．
確認，了承，簡単な状況報告，短い質問，および単一の事実だけを答える短い返答では実行しない．
`general`の規則に加えて，既知の英語専門用語が日本語へ置き換えられているかを確認する．
会話に対して，だ・である調，学術用句読点，または一文一行を要求しない．
会話の返答を検査する場合は，返答案を一時的なMarkdownファイルとして検査し，検査後に削除する．

### `general`

保存される一般的な日本語文書に使う．
Unicode上の異常，明確な日本語の誤り，AI生成文に多い表現，およびこのskill固有の避ける表現を確認する．

### `technical`

`general`の規則に加えて，だ・である調，学術用の句読点，数字表記，技術文書で避ける表現，
一文一行，および既知の英語専門用語などを確認する．

### `academic`

`technical`の規則に加えて，形式名詞，副詞，補助動詞，同義語，工学論文向け表記，およびSI単位を確認する．

Markdown，プレーンテキスト，およびTeXを扱える．
TeXの解析には`textlint-plugin-latex2e`を使う．

## 既存のtextlint規則

severityは，`error`を要修正，`warning`を要確認，`info`を参考情報として設定している．

### 全プロファイル

`textlint-rule-preset-japanese`から，次の規則を使う．

| 規則 | severity | 内容 |
|---|---|---|
| `no-double-negative-ja` | `warning` | 二重否定を検出する |
| `no-dropping-the-ra` | `warning` | ら抜き言葉を検出する |
| `no-nfd` | `error` | 分離した濁点など，NFD由来の文字を検出する |
| `no-invalid-control-character` | `error` | 不要な制御文字を検出する |
| `no-zero-width-spaces` | `error` | ゼロ幅空白を検出する |
| `no-kangxi-radicals` | `error` | 通常の漢字に似た康煕部首を検出する |

`textlint-rule-ja-space-between-half-and-full-width`から，次の規則を使う．

| 規則 | severity | 内容 |
|---|---|---|
| `ja-space-between-half-and-full-width` | `warning` | 日本語と半角英数字の間にある半角空白を検出する．`space: never`で使用する |

spacingプリセット全体は使わず，この個別規則だけを有効にしている．
括弧，斜線，インラインコードなどの周囲へ，意図しない空白規則を追加しないためである．

`@textlint-ja/textlint-rule-preset-ai-writing`から，次の規則を使う．

| 規則 | severity | 内容 |
|---|---|---|
| `no-ai-list-formatting` | `info` | 太字ラベルや絵文字など，機械的な箇条書き表現を検出する |
| `no-ai-hype-expressions` | `warning` | 過度な誇張，絶対性，抽象的効果などを示す表現を検出する |
| `no-ai-emphasis-patterns` | `info` | 太字や見出しによる機械的な強調を検出する |
| `no-ai-colon-continuation` | `info` | 述語の後のコロンからブロックへ続く英語的な構造を検出する |

文書全体に対して広い改善提案を行う`ai-tech-writing-guideline`は，誤検知と過剰な書き換えを避けるため
無効にしている．

`textlint-filter-rule-comments`も有効にしている．
意図した用例を局所的に除外する必要がある場合は，textlintの無効化コメントを使えるが，
除外理由を確認した上で必要な範囲だけに使う．

### `technical`と`academic`

`textlint-rule-preset-ja-technical-writing`から，次の規則を追加する．

| 規則 | severity | 内容 |
|---|---|---|
| `arabic-kanji-numbers` | `warning` | 算用数字と漢数字の使い分けを確認する |
| `no-mix-dearu-desumasu` | `warning` | 本文と箇条書きを，だ・である調へ統一する |
| `no-doubled-conjunctive-particle-ga` | `info` | 同一文中で逆接の接続助詞「が」が重複する箇所を検出する |
| `no-doubled-conjunction` | `info` | 同じ接続詞が連続して現れる箇所を検出する |
| `no-exclamation-question-mark` | `info` | 感嘆符と疑問符を検出する |
| `no-hankaku-kana` | `error` | 半角カナを検出する |
| `ja-no-weak-phrase` | `info` | `かもしれない`などの弱い表現を検出する |
| `ja-no-successive-word` | `error` | 入力ミスと考えられる同一語の連続を検出する |
| `ja-no-abusage` | `warning` | よくある日本語や技術表現の誤用を検出する |
| `ja-no-redundant-expression` | `info` | 「することができる」などの冗長表現を検出する |
| `ja-unnatural-alphabet` | `error` | IME入力ミスなどによる不自然な英字を検出する |
| `no-unmatched-pair` | `error` | 対応する閉じ記号がない括弧などを検出する |

次の規則は，現在の文章方針との競合または誤検知を避けるため無効にしている．

- `sentence-length`：文を細かく分割しすぎる可能性があるため無効にしている．
- `max-comma`，`max-ten`：読点数だけで文の良否を決めないため無効にしている．
- `max-kanji-continuous-len`：専門用語と固有名詞の誤検知が多いため無効にしている．
- `no-doubled-joshi`：正しい文でも検出される場合があるため，初期設定では無効にしている．
- `ja-no-mixed-period`：このskill固有の`scientific-punctuation`で「，」「．」を確認するため無効にしている．

### `academic`

`textlint-rule-preset-ja-engineering-paper`から，次の規則を追加する．

| 規則 | severity | 内容 |
|---|---|---|
| `ja-hiragana-fukushi` | `warning` | 漢字よりひらがなが適切な副詞を検出する |
| `ja-hiragana-keishikimeishi` | `warning` | 「こと」「もの」など，ひらがなが適切な形式名詞を検出する |
| `ja-hiragana-hojodoushi` | `warning` | ひらがなが適切な補助動詞を検出する |
| `no-synonyms` | `info` | 同じ文書で用語の同義語が混在している可能性を示す |
| `prh` | `warning` | 工学論文向け辞書に基づいて表記を確認する |
| `use-si-units` | `info` | 非SI単位またはSI単位表記を確認する |

工学論文プリセットの`unify-kuten-and-touten`は，このskill固有の句読点規則と重複するため無効にしている．

## このskill用に作成した規則

<!-- textlint-disable @fujiy/japanese-writing/review-domain-terms -->
<!-- textlint-disable @fujiy/japanese-writing/review-ai-overstatement -->

自作規則は`textlint/packages/`のnpm workspaceで管理し，
`@fujiy/textlint-rule-preset-japanese-writing`としてまとめている．
skillの設定はnpmパッケージ名を参照するが，開発中はworkspaceにあるローカル実装が使われる．

### `review-domain-terms`

`@fujiy/textlint-rule-ja-review-domain-terms`が，専門語や制度語の文脈外使用を文字列として検出する．
組み込み辞書は`textlint/packages/textlint-rule-ja-review-domain-terms/dictionary.yml`に置く．

辞書の各項目には，次の情報を記述する．

- `term`：検出する語である．
- `allowed_context`：本来の意味で許容される文脈である．
- `common_misuse`：特に多い乱用形態である．必要な場合だけ記述する．
- `rewrite_hint`：語の置換ではなく，関係や操作を文単位で書き直すためのヒントである．

`allowed_context`は機械的な除外条件ではない．
この規則はすべての一致を`warning`として報告し，モデルまたは人間が実際の文脈を確認する．
`憲法的`と`憲法`のように語が重なる場合は，長い語を優先し，同じ範囲へ複数の警告を出さない．

### `review-ai-overstatement`

`@fujiy/textlint-rule-ja-review-ai-overstatement`が，AI生成文で多用されやすい強調表現を
文字列として検出する．
組み込み辞書は`textlint/packages/textlint-rule-ja-review-ai-overstatement/dictionary.yml`に置く．

辞書の各項目には`term`だけを記述する．
この規則はすべての一致を`warning`として簡潔に報告し，代替表現の提示と自動修正は行わない．

### `preferred-terminology`

`references/terminology.yml`にある英語の専門用語を文字列として検出し，日本語の推奨表記候補を示す．
辞書の`policy`には次の2種類がある．

- `translate`：英語のまま残っている場合に警告し，`preferred`にある候補を示す．
- `keep`：英語のまま使う語であり，警告しない．

この規則は`logical`，`technical`，および`academic`で`warning`として有効にし，`general`では無効にする．
大文字と小文字を区別せず，より長い語を先に照合する．
英数字，アンダースコア，またはハイフンが前後に続く部分一致は検出しない．

推奨表記が複数ある場合は候補をすべて示す．
例えば`component`には，文脈に応じて`成分`と`座標成分`の候補を示すが，自動的には置き換えない．
severityは`warning`であり，候補が1つの場合も含めて自動修正しない．

textlintの文字列ノードだけを対象とするため，通常のコードブロックとインラインコードは検出しない．
引用文などの通常テキストに意図的な英語表記がある場合は警告する可能性があるため，文脈を確認する．

<!-- textlint-disable @fujiy/japanese-writing/sentence-per-line -->

### `scientific-punctuation`

技術文書と学術文書で，日本語の句読点`、`と`。`を検出し，それぞれ`，`と`．`を使うよう警告する．
severityは`warning`であり，自動修正しない．

textlintの構文木にある文章ノードを対象とするため，通常のコードブロック自体は検査対象にならない．
ただし，引用した文章や固有の表記規則を持つ箇所では意図的な句読点を検出する可能性がある．

### `sentence-per-line`

MarkdownおよびTeXで，1つの物理行に複数の文が書かれている可能性を検出する．
段落の中で`．`または`。`の後に改行がない場合に`info`を出す．

引用符や括弧内の句点を文末と誤認しにくくするため，直後に`」』）］】〕〉》`が続く句点は除外する．
この規則は段落の文字列を単純化して調べるため，インラインコード内の句点も数える．
引用や特殊な記法でも誤検知する可能性がある．

<!-- textlint-enable @fujiy/japanese-writing/sentence-per-line -->

### workspaceと公開

`textlint/package.json`の`workspaces`に`packages/*`を指定している．
各規則は独立したパッケージ名と版を持ち，プリセットは通常のnpm依存関係としてそれらを参照する．
`npm install`を実行すると，開発中のパッケージはローカルのworkspaceへ接続される．

現在は誤って公開しないよう，各自作パッケージを`private: true`としている．
公開前にnpmの`@fujiy`スコープへの公開権限とライセンスを確定し，対象パッケージだけ
`private`を解除する．GitHubリポジトリの作成やsubmoduleは必要ない．

<!-- textlint-enable @fujiy/japanese-writing/review-ai-overstatement -->
<!-- textlint-enable @fujiy/japanese-writing/review-domain-terms -->

## 規則と辞書の変更

- 専門語や制度語の文脈外使用は`textlint/packages/textlint-rule-ja-review-domain-terms/dictionary.yml`へ追加する．
- AI生成文で多用されやすい強調表現は`textlint/packages/textlint-rule-ja-review-ai-overstatement/dictionary.yml`へ追加する．
- 英語の専門用語と推奨表記は`references/terminology.yml`へ追加する．
- プロファイルのseverityや有効・無効は`textlint/config-shared.cjs`と`textlint/profiles/`で変更する．
- 自作規則は対応する`textlint/packages/`内のパッケージで変更する．
- npm依存関係を変更した場合は，`textlint/package-lock.json`も更新する．

変更後は，正常なMarkdownとTeX，警告を期待する文章，および`error`を期待する文章で動作を確認する．
校正モードについては，`--mode proofread --fix`が終了コード2で拒否されることも確認する．
## ChatGPT Web向けのZIP作成

スキルディレクトリからアップロード用ZIPを作成するには，次を実行する．

```bash
./scripts/package-skill.sh
```

既定の出力先は`skills/japanese-writing.zip`である．別の出力先を使う場合は，第1引数に指定する．

```bash
./scripts/package-skill.sh /tmp/japanese-writing.zip
```

アーカイブには最上位の`japanese-writing/`ディレクトリを含め，`.git`および`node_modules`ディレクトリを除外する．
