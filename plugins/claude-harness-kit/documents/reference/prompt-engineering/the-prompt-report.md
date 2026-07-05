# 論文：The Prompt Report: A Systematic Survey of Prompt Engineering Techniques
Schulhoff, Ilie, Balepur, Kahadze, Liu, Si, Li, Gupta, Han, Schulhoff, Dulepet, Vidyadhara, Ki, Agrawal, Pham, Kroiz, Li, Tao, Srivastava, Da Costa, Gupta, Rogers, Goncearenco, Sarli, Galynker, Peskoff, Carpuat, White, Anadkat, Hoyle, Resnik（University of Maryland / Learn Prompting / OpenAI / Stanford / Microsoft / Vanderbilt / Princeton 他）｜arXiv:2406.06608v6 [cs.CL]｜CC BY 4.0
🔗 https://arxiv.org/abs/2406.06608

## 何の論文か
プロンプトエンジニアリングの用語・分類が乱立し断片化している状況に対し、PRISMAに基づく機械支援の系統的レビューにより、33のプロンプト用語、テキストベースのLLMプロンプト手法58種、他モダリティ向け40種を含む体系的なタキソノミーと語彙集を提示する論文。ベストプラクティスやChatGPT等SOTA LLM向けの助言、自然言語プレフィックスプロンプティング全体のメタ分析、MMLUでの手法ベンチマーク、実世界タスク（自殺危機兆候検出）でのプロンプトエンジニアリング事例研究も含む、現時点で最も包括的なプロンプトエンジニアリングサーベイ。

## 1 Introduction
LLMは「プロンプト」への応答として出力を生成する形で広く使われており、良いプロンプトがタスク性能を大きく左右する。しかし分野が新しいため用語・手法の理解は断片的で、著者らはこの分野の頑健な用語・手法集を作るべく大規模レビューを実施したと述べる。

### Scope of Study
研究範囲を、cloze（穴埋め）ではなくprefix（接頭）プロンプトに、soft（連続値）ではなくhard（離散トークン）プロンプトに、勾配更新（ファインチューニング）を伴わない手法に、タスク非依存の手法に限定している。

### Sections Overview
PRISMAに基づくレビューで58のテキストベース手法とタキソノミーを構築（§2.1, 1.2）。多言語（§3.1）・マルチモーダル（§3.2）技術、エージェント（§4.1）、出力評価（§4.2）、セキュリティ（§5.1）・安全性（§5.2）、MMLUベンチマークと自殺危機兆候検出の実践事例研究（§6.1, 6.2）、プロンプティングの性質に関する議論（§8）で構成。

### 1.1 What is a Prompt?
プロンプトはGenAIモデルの出力を導くための入力（テキスト・画像・音声等）。プロンプトテンプレートは変数を含む関数で、変数に具体的な媒体（通常テキスト）を代入したものがプロンプトのインスタンスとなる。

### 1.2 Terminology
プロンプティング分野の用語が定義の食い違い・混乱を抱えている点を踏まえ、堅牢な語彙集を提示（詳細語はAppendix A.2）。
- **Prompting**: GenAIにプロンプトを与えて応答を生成させる行為そのもの。
- **Prompt Chain**: 複数のプロンプトテンプレートを連続して使用し、前段の出力で後段のテンプレートをパラメータ化する構成。
- **Prompting Technique**: プロンプト（群）の構造化や複数プロンプトの動的な連鎖方法を規定する設計図。条件分岐・並列処理なども含みうる。
- **Prompt Engineering**: 使用しているプロンプティング技術を変更・修正しながらプロンプトを反復的に開発するプロセス。
- **Prompt Engineering Technique**: プロンプトを改善するために反復する戦略（文献では自動化手法が多いが、消費者利用では手動が一般的）。
- **Exemplar**: プロンプト内でモデルに提示される、タスク遂行例。
- **1.2.1 Components of a Prompt**: Directive（指示・質問という核となる意図）、Examples（実演例）、Output Formatting（CSV/Markdown/XML等の出力形式指定）、Style Instructions（文体指定）、Role/Persona（役割設定）、Additional Information（署名に使う氏名等の補足情報、いわゆる"context"）に整理。

### 1.3 A Short History of Prompts
自然言語プレフィックスでLLMの挙動を引き出す発想はGPT-3/ChatGPT以前から存在し、GPT-2（Radford et al., 2019a）や Fan et al. (2018) に遡る。「Prompt Engineering」という用語自体はRadford et al. (2021)、続いてReynolds and McDonell (2021) 頃に登場。Brown et al. (2020) は当初「プロンプト」をタスク記述と区別し例（"llama"）自体を指していたが、現在は入力全体を指す用語として定着している。

## 2 A Meta-Analysis of Prompting

### 2.1 Systematic Review Process
PRISMAプロセスに基づき、arXiv・Semantic Scholar・ACLを44のキーワードで検索。人手アノテーション（1,661件、2人一致率92%）と GPT-4（gpt-4-1106-preview）による分類（精度89%・再現率75%・F1 81%）を組み合わせ、最終的に1,565本の論文を収集。データセットはHuggingFaceで公開。

### 2.2 Text-Based Techniques
58のテキストベース手法を6つの大分類に整理（Fig 2.2）。

#### 2.2.1 In-Context Learning (ICL)
重みの更新なしに、プロンプト内の実演例や指示からタスクを遂行する能力。
- **Few-Shot Prompting**（Brown et al., 2020）: 少数の実演例でタスクを完了させる。

**2.2.1.1 Few-Shot Prompting Design Decisions**（設計上の6つの要点）
- Exemplar Quantity: 例を増やすと概ね性能向上（20例超で頭打ちの場合もあるが、long-context LLMでは増加が続くこともある）。
- Exemplar Ordering: 順序で精度が50%未満〜90%超まで変動しうる。
- Exemplar Label Distribution: ラベルの偏りがモデルのバイアスを誘発しうる。
- Exemplar Label Quality: 誤ラベルの影響は諸説あり（無視できるという報告もあれば、大きく影響するという報告もある。大規模モデルほど誤ラベルに頑健）。
- Exemplar Format: "Q: A:"形式が一般的だが、学習データ中に頻出する形式ほど良い可能性。
- Exemplar Similarity: テスト例に類似した例を選ぶのが基本有効だが、多様な例が有利な場合もある。
- Instruction Selection: few-shotでは汎用的な指示（タスク特化でない）の方が精度が高くなる場合がある。

**2.2.1.2 Few-Shot Prompting Techniques**
- **K-Nearest Neighbor (KNN)**（Liu et al., 2021）: テスト例に類似した例を選択（コスト大）。
- **Vote-K**（Su et al., 2022）: 未ラベル候補をモデルが提案しアノテータがラベル付け、多様性も確保。
- **Self-Generated In-Context Learning (SG-ICL)**（Kim et al., 2022）: GenAI自身に例を生成させる（実データには劣る）。
- **Prompt Mining**（Jiang et al., 2020）: コーパス分析で最適な「中間語」（プロンプトテンプレート）を発見。
- その他: LENS、UDR、Active Example Selection（反復フィルタリング・埋め込み検索・強化学習を活用）。

**2.2.1.3 Zero-Shot Prompting Techniques**
- **Role Prompting**（persona prompting）: GenAIに役割を付与し出力を改善。
- **Style Prompting**（Lu et al., 2023a）: 文体・トーン・ジャンルを指定。
- **Emotion Prompting**（Li et al., 2023a）: 心理的重要性を訴える文言を追加。
- **System 2 Attention (S2A)**（Weston and Sukhbaatar, 2023）: 無関係情報を除いてプロンプトを書き直してから応答。
- **SimToM**（Wilf et al., 2023）: 特定人物が知る事実のみに基づき回答する2段階プロセス。
- **Rephrase and Respond (RaR)**（Deng et al., 2023）: 質問を言い換え・拡張してから回答。
- **Re-reading (RE2)**（Xu et al., 2023）: 「質問をもう一度読んで」を追加。
- **Self-Ask**（Press et al., 2022）: フォローアップ質問の要否をまず判断し、必要なら生成・回答してから最終回答。

#### 2.2.2 Thought Generation
問題を解く過程の推論を言語化させる手法群。
- **Chain-of-Thought (CoT) Prompting**（Wei et al., 2022b）: few-shotで推論過程を明示させる。

**2.2.2.1 Zero-Shot-CoT**
- 標準形は「Let's think step by step」等の思考誘導フレーズを付加。
- **Step-Back Prompting**（Zheng et al., 2023c）: 具体的推論の前に高レベルな一般的質問を挟む。
- **Analogical Prompting**（Yasunaga et al., 2023）: CoTを含む例を自動生成。
- **Thread-of-Thought (ThoT)**（Zhou et al., 2023）: 「順を追って歩きながら要約・分析する」という誘導フレーズ。
- **Tabular CoT (Tab-CoT)**（Jin and Lu, 2023）: 推論をMarkdown表として出力させる。

**2.2.2.2 Few-Shot CoT**（Manual-CoT / Golden CoT とも）
- **Contrastive CoT**（Chia et al., 2023）: 正誤両方の説明例を提示。
- **Uncertainty-Routed CoT**（Google, 2023）: 複数推論パスをサンプリングし、多数決が閾値超なら採用、そうでなければ貪欲サンプリング。
- **Complexity-based Prompting**（Fu et al., 2023b）: 複雑な例を選び、長い推論チェーンほど質が高いと仮定し閾値超で多数決。
- **Active Prompting**（Diao et al., 2023）: 不確実性の高い例を人手で書き直す。
- **Memory-of-Thought Prompting**（Li and Qiu, 2023b）: 未ラベルの学習例で事前にCoT推論を行い、テスト時に類似例を検索。
- **Auto-CoT**（Zhang et al., 2022b）: Zero-Shot CoTで自動生成した推論をFew-Shot CoTプロンプトに利用。

#### 2.2.3 Decomposition
複雑な問題をサブ問題に分解する手法群。
- **Least-to-Most Prompting**（Zhou et al., 2022a）: サブ問題に分解してから逐次解く。
- **Decomposed Prompting (DECOMP)**（Khot et al., 2022）: 文字列分割・検索等の関数呼び出しにサブ問題を振り分ける。
- **Plan-and-Solve Prompting**（Wang et al., 2023f）: 「まず問題を理解し計画を立ててから段階的に解く」という改良Zero-Shot CoT。
- **Tree-of-Thought (ToT)**（Yao et al., 2023b）: 思考を木構造で探索し評価しながら進める。
- **Recursion-of-Thought**（Lee and Kim, 2023）: 複雑なサブ問題を別プロンプト/LLM呼び出しに送り再帰的に解く。
- **Program-of-Thoughts**（Chen et al., 2023d）: コード生成をコードインタプリタで実行し推論。
- **Faithful Chain-of-Thought**（Lyu et al., 2023）: 自然言語と記号言語（Python等）を組み合わせた推論。
- **Skeleton-of-Thought**（Ning et al., 2023）: 回答の骨子（サブ問題群）を作り並列に解いて結合、高速化。
- **Metacognitive Prompting**（Wang and Zhao, 2024）: 質問の明確化・予備判断・応答評価・決定確認・信頼度評価の5段階チェーン。

#### 2.2.4 Ensembling
複数プロンプトで同一問題を解き、応答を集約する手法群（多くは多数決）。分散低減・精度向上の一方、呼び出し回数が増える。
- **Demonstration Ensembling (DENSE)**（Khalifa et al., 2023）: 訓練例の異なる部分集合を持つ複数プロンプトを集約。
- **Mixture of Reasoning Experts (MoRE)**（Si et al., 2023d）: 推論タイプごとに専門化した複数プロンプト（RAG・CoT・生成知識等）を用い一致度で選択。
- **Max Mutual Information Method**（Sorensen et al., 2022）: プロンプトと出力間の相互情報量を最大化するテンプレートを選択。
- **Self-Consistency**（Wang et al., 2022）: 非ゼロ温度で複数のCoT推論をサンプリングし多数決。
- **Universal Self-Consistency**（Chen et al., 2023e）: 多数決の判定をプログラム的カウントではなくLLM自身に行わせる。
- **Meta-Reasoning over Multiple CoTs**（Yoran et al., 2023）: 複数の推論チェーンを1つのプロンプトに挿入し最終回答を生成。
- **DiVeRSe**（Li et al., 2023i）: 複数プロンプト×Self-Consistencyでステップごとにスコアリング。
- **COSP**（Wan et al., 2023a）: Zero-Shot CoT + Self-Consistencyで高一致度の出力を例として選び最終プロンプトに使用。
- **USP**（Wan et al., 2023b）: COSPを全タスクへ汎用化、未ラベルデータとより複雑なスコア関数を利用。
- **Prompt Paraphrasing**（Jiang et al., 2020）: 意味を保ったまま文言を変えるデータ拡張技術。

#### 2.2.5 Self-Criticism
LLMに自らの出力を批判・評価させる手法群。
- **Self-Calibration**（Kadavath et al., 2022）: 回答の正しさをモデル自身に問い直させ確信度を測る。
- **Self-Refine**（Madaan et al., 2023）: 「生成→フィードバック→改善」を停止条件まで反復。
- **Reversing CoT (RCoT)**（Xue et al., 2023）: 生成した回答から問題を再構築し原問題と比較して矛盾を検出・修正。
- **Self-Verification**（Weng et al., 2022）: 複数解を生成し、質問の一部をマスクして残りの情報から予測できるかで採点。
- **Chain-of-Verification (CoVe)**（Dhuliawala et al., 2023）: 回答生成→検証質問の生成→個別回答→最終改訂の4段階。
- **Cumulative Reasoning**（Zhang et al., 2023b）: 候補ステップを生成・評価（採用/棄却）し最終解に達するまで反復。

### 2.3 Prompting Technique Usage
58手法のうち実際に研究・実務で使われるのは一部。データセット内の被引用数上位25本を分析すると多くが新規手法提案であり、Few-Shot・CoTの引用の多さは分野の基盤としての重要性を裏付ける。

#### 2.3.1 Benchmarks
新手法提案時は複数モデル・データセットでベンチマークするのが通例。GPT-4-1106-previewでモデル・データセット名を論文本文から抽出し、Semantic Scholarの被引用数で使用頻度を測定した。

### 2.4 Prompt Engineering
プロンプトを自動最適化する手法群（一部は勾配更新を伴う）。
- **Meta Prompting**: LLM自身にプロンプト（テンプレート）の生成・改善を指示する。
- **AutoPrompt**（Shin et al., 2020b）: 凍結LLM＋逆伝播で更新される「トリガートークン」を含むテンプレート（soft-promptingの一種）。
- **Automatic Prompt Engineer (APE)**（Zhou et al., 2022b）: 例からZero-Shot指示プロンプトを生成、スコアリングし最良のものを言い換えて反復改善。
- **GrIPS**（Prasad et al., 2023）: 削除・追加・入れ替え・言い換え等の操作でプロンプトのバリエーションを作成。
- **ProTeGi**（Pryzant et al., 2023）: 入力→出力・正解・批判プロンプトで元プロンプトを批判→新プロンプト生成→バンディットアルゴリズムで選択。APE・GrIPSを上回る。
- **RLPrompt**（Deng et al., 2022）: 凍結LLM＋未凍結モジュールをSoft Q-Learningで更新（文法的に意味不明な text が最適解になることも）。
- **DP2O**（Li et al., 2023b）: 強化学習・カスタムスコア関数・LLMとの対話を組み合わせた最も複雑な手法。

### 2.5 Answer Engineering
LLM出力から正確な回答を抽出するアルゴリズムを開発・選択する反復プロセス。プロンプトエンジニアリングとは別だが密接に関連。
- **2.5.1 Answer Shape**: 出力の物理的形式（トークン・スパン・画像等）。
- **2.5.2 Answer Space**: 出力が取りうる値の定義域。
- **2.5.3 Answer Extractor**: 出力空間を完全制御できない場合に最終回答を抽出するルール（正規表現や別LLM）。
  - **Verbalizer**: トークン/スパンとラベルを相互写像する。
  - **Regex**: 最初/最後の出現を抽出。
  - **Separate LLM**: 複雑な出力を別LLMに評価・抽出させる（"The answer (Yes or No) is"等のanswer trigger使用）。

## 3 Beyond English Text Prompting

### 3.1 Multilingual
英語中心の学習データにより非英語（特に低資源言語）での性能が劣る問題への対処。
- **Translate First Prompting**: 非英語入力を先に英語へ翻訳してから処理。

**3.1.1 Chain-of-Thought**
- **XLT**（Huang et al., 2023a）: 役割割り当て・言語横断思考・CoTを含む6指示からなるテンプレート。
- **CLSP**（Qin et al., 2023a）: 異なる言語で推論パスを構築するアンサンブル手法。

**3.1.2 In-Context Learning**
- **X-InSTA Prompting**（Tanwar et al., 2023）: 意味的整合・タスク整合・両者併用の3方式で文脈内例を選択。
- **In-CLT**（Kim et al., 2023）: 原言語と目標言語両方を使って文脈内例を作成。

**3.1.2.1 In-Context Example Selection**: 意味的に類似した例（あるいは意図的に異質な例）の選択が性能に影響。
- **PARC**（Nie et al., 2023）: 高資源言語から関連例を検索し低資源言語への転移性能を高める。

**3.1.3 Prompt Template Language Selection**: プロンプトテンプレートを英語で書くかタスク言語で書くかの選択（事前学習データとの重なりの観点から英語が有利な場合が多いが、タスクやモデルにより異なる）。

**3.1.4 Prompting for Machine Translation**
- **MAPS**（He et al., 2023b）: 知識マイニング→複数翻訳生成→最良選択という人間の翻訳プロセスを模倣。
- **Chain-of-Dictionary (CoD)**（Lu et al., 2023b）: 単語の多言語訳を辞書から抽出しプロンプトに前置。
- **DiPMT**（Ghazvininejad et al., 2023）: CoDに類似、原言語・目標言語の定義のみ付与。
- **DecoMT**（Puduppully et al., 2023）: 原文をチャンク分割しfew-shotで個別翻訳後に統合。

**3.1.4.1 Human-in-the-Loop**
- **Interactive-Chain-Prompting (ICP)**（Pilault et al., 2023）: 曖昧性についてサブ質問を生成し人間が回答して翻訳に反映。
- **Iterative Prompting**（Yang et al., 2023d）: 下訳を生成し検索/人間フィードバックで精緻化。

### 3.2 Multimodal
テキスト以外のモダリティ向けにテキストベース手法を拡張、または新規に考案された手法群。

**3.2.1 Image Prompting**
- **Prompt Modifiers**（Oppenlaender, 2023）: 画像生成を変化させる付加語（媒体・照明等）。
- **Negative Prompting**: 特定要素の重みを負にして生成を抑制。

**3.2.1.1 Multimodal In-Context Learning**
- **Paired-Image Prompting**: 変換前後の画像ペアを見せ、新しい画像に同じ変換を適用させる。
- **Image-as-Text Prompting**（Hakimov and Schlangen, 2023）: 画像のテキスト記述を生成しテキストプロンプトに組み込む。

**3.2.1.2 Multimodal Chain-of-Thought**
- **Duty Distinct CoT (DDCoT)**（Zheng et al., 2023b）: Least-to-Mostをマルチモーダルに拡張、サブ質問生成→解決→統合。
- **Multimodal Graph-of-Thought**（Yao et al., 2023c）: 画像キャプションを付加してGraph-of-Thoughtを拡張。
- **Chain-of-Images (CoI)**（Meng et al., 2023）: 思考過程でSVG画像を生成し視覚的に推論。

**3.2.2 Audio Prompting**: 音声でのICLは成否が混在し発展途上。

**3.2.3 Video Prompting**: text-to-video生成・動画編集・video-to-text生成への応用。画像系のPrompt Modifiers等が動画生成にも転用可能。

**3.2.4 Segmentation Prompting**: セマンティックセグメンテーション等へのプロンプト応用。

**3.2.5 3D Prompting**: 3Dオブジェクト合成・3Dサーフェステクスチャリング・4Dシーン生成（テキスト・画像・アノテーション・3Dオブジェクトを入力として使用）。

## 4 Extensions of Prompting

### 4.1 Agents
LLMが外部システムと連携して目標を達成する「エージェント」の定義とその手法群。数学計算・推論・事実性の弱点を補う。

**4.1.1 Tool Use Agents**
- **MRKL System**（Karpas et al., 2022）: 複数ツールへのアクセスを提供するLLMルーターによる最もシンプルなエージェント構成。
- **CRITIC**（Gou et al., 2024a）: 応答生成→自己批判→ツール（検索・コード実行等）による検証・修正。

**4.1.2 Code-Generation Agents**
- **PAL**（Gao et al., 2023b）: 問題を直接コードに変換しPythonインタプリタで実行。
- **ToRA**（Gou et al., 2024b）: コード生成と推論ステップを必要なだけ交互に行う。
- **TaskWeaver**（Qiao et al., 2023）: ユーザー要求をコード化、ユーザー定義プラグインも利用可能。

**4.1.3 Observation-Based Agents**
- **ReAct**（Yao et al., 2022）: 思考→行動→観測を繰り返しプロンプトに履歴として蓄積。
- **Reflexion**（Shinn et al., 2023）: ReActに内省層を追加、成功/失敗評価から振り返りを生成し作業記憶として活用。

**4.1.3.1 Lifelong Learning Agents**
- **Voyager**（Wang et al., 2023a）: 自己タスク提案→コード生成実行→長期記憶への保存という3部構成のMinecraftエージェント。
- **GITM**（Zhu et al., 2023）: 目標を再帰的にサブゴール分解し構造化テキストで逐次実行、外部知識ベースと経験記憶を活用。

**4.1.4 Retrieval Augmented Generation (RAG)**
- **Verify-and-Edit**（Zhao et al., 2023a）: 複数CoTを生成し外部情報検索で一部を編集し改善。
- **Demonstrate-Search-Predict**（Khattab et al., 2022）: 質問をサブ質問に分解しクエリで解決・統合。
- **IRCoT**（Trivedi et al., 2023）: CoTと検索を交互に行うマルチホップQA手法。
- **Iterative Retrieval Augmentation**（FLARE、IRP等）: 長文生成中に検索を繰り返す3段階の反復プロセス。

### 4.2 Evaluation
LLMを評価者として使うための4要素（プロンプト手法・出力形式・評価パイプライン・その他設計判断）を議論。

**4.2.1 Prompting Techniques**: In-Context Learning、Role-based Evaluation（役割を変えて多様な評価を生成、マルチエージェント討論にも応用）、CoT、Model-Generated Guidelines（LLM自身に評価基準やCoT評価ステップを生成させる：G-EVAL、AutoCalibrate）。

**4.2.2 Output Format**: Styling（XML/JSON形式化で精度向上）、Linear Scale（1-5等の数値評価）、Binary Score（Yes/No）、Likert Scale。

**4.2.3 Prompting Frameworks**
- **LLM-EVAL**（Lin and Chen, 2023）: 評価変数のスキーマ・範囲指定・評価対象を含む単一プロンプト。
- **G-EVAL**（Liu et al., 2023d）: AutoCoTステップをプロンプトに含め、トークン確率で重み付け。
- **ChatEval**（Chan et al., 2024）: 役割の異なる複数エージェントによる討論フレームワーク。

**4.2.4 Other Methodologies**: 明示的スコアリングだけでなく、確信度・生成尤度・説明（エラー数のカウント）・代理タスク（entailmentによる事実整合性等）を用いた暗黙的スコアリングも存在。Batch Prompting（複数インスタンスを一括評価、ただし性能劣化のリスク）、Pairwise Evaluation（直接比較よりも個別スコア化の方が信頼性が高い場合が多く、順序も評価に影響）。

## 5 Prompting Issues

### 5.1 Security

**5.1.1 Types of Prompt Hacking**
- **Prompt Injection**: 開発者の元指示をユーザー入力で上書きする攻撃。LLMが開発者指示とユーザー指示を区別できないアーキテクチャ上の問題。
- **Jailbreaking**: プロンプトによりGenAIに意図しない言動をさせる行為（開発者指示の有無を問わない）。

**5.1.2 Risks of Prompt Hacking**
- **5.1.2.1 Data Privacy**: Training Data Reconstruction（ChatGPTに単語を無限反復させ学習データを吐き出させた例）、Prompt Leaking（アプリのプロンプトテンプレートを抽出）。
- **5.1.2.2 Code Generation Concerns**: Package Hallucination（存在しないパッケージ名をLLMが生成し、攻撃者がそれを悪意あるパッケージとして公開）、Bugs（LLM生成コードに脆弱性が生じやすい）。
- **5.1.2.3 Customer Service**: 企業チャットボットへのプロンプトインジェクションによるブランド毀損（航空会社チャットボットが誤った返金情報を提示し訴訟で顧客が勝訴した事例等）。

**5.1.3 Hardening Measures**: Prompt-based Defenses（プロンプト内に悪意ある出力を禁止する指示を含めるが、完全な防御にはならない）、Detectors（悪意ある入力を検知する専用ツール）、Guardrails（対話フロー全体を管理するルール・フレームワーク、ダイアログマネージャー等）。プロンプトハッキングは未解決かつ根本的解決が困難な問題として位置づけられている。

### 5.2 Alignment

**5.2.1 Prompt Sensitivity**: LLMは入力プロンプトの些細な変化（スペース・大文字小文字・区切り文字・同義語置換）に非常に敏感で、性能が大きく変動しうる（LLaMA2-7Bで0〜0.804まで変動した例）。Task Format（質問形式の違いでGPT-3の精度が最大30%変化）、Prompt Drift（APIの背後のモデル更新により同一プロンプトの出力が変化する現象）。

**5.2.2 Overconfidence and Calibration**: LLMは確信度を言語化させると過信しがち。Verbalized Score（信頼度を数値で表明させる手法だが有効性に議論あり）、Sycophancy（ユーザーの意見や誤った前提に迎合し、元の正しい回答を覆してしまう傾向。大規模・指示チューニング済みモデルほど顕著）。

**5.2.3 Biases, Stereotypes, and Culture**: Vanilla Prompting（バイアスを排除するよう単純に指示）、Selecting Balanced Demonstrations（公平性指標で最適化した例を選ぶ）、Cultural Awareness（文化的適応を促す指示）、AttrPrompt（合成データ生成時に属性を意図的に変化させ偏りを回避）。

**5.2.4 Ambiguity**: 曖昧な質問は複数の解釈が可能でモデルには難しい。Ambiguous Demonstrations（曖昧なラベル集合を持つ例を含めるとICL性能が向上）、Question Clarification（曖昧性を検知し明確化質問を生成してからユーザーの回答を踏まえ再生成）。

## 6 Benchmarking

### 6.1 Technique Benchmarking
MMLU（2,800問の代表サブセット、gpt-3.5-turbo使用）で6つの手法を比較。
- Zero-Shot（ベースライン）、Zero-Shot-CoT（Let's think step by step / ThoT / Plan and Solve の3種の思考誘導）、Few-Shot、Few-Shot-CoT を、2種の質問フォーマット・複数のbase instruction・Self-Consistency（温度0.5、3反復）で検証。
- **結果**: 手法が複雑になるほど概ね性能が向上する一方、Zero-Shot-CoTはZero-Shotより大きく性能が落ちるという意外な結果に。Few-Shot CoTが最良。プロンプト手法選択はハイパーパラメータ探索に近い難しさがあると指摘。

### 6.2 Prompt Engineering Case Study
Reddit（r/SuicideWatch）の投稿から「entrapment（八方塞がり感）」というSuicide Crisis Syndromeの主要指標を検出する実世界タスクで、熟練プロンプトエンジニアの手作業プロセスを記録。
- 221件中121件を開発用に用い、47段階・約20時間の作業を経て、0%（構造化された応答すら得られない状態）からF1 0.53（precision 0.86 / recall 0.38）まで改善。
- 過程では、entrapmentの定義提示、モデルがメンタルヘルス支援メッセージを返してしまう問題への対処（GPT-4-32Kへの切り替え）、Few-Shot・CoT・**AutoDiCoT**（誤ラベル例に対し「なぜそう判断したか」を尋ねて自動生成したCoT根拠を、悪い推論のexemplarとして使うオリジナル手法）、メールの重複という偶発的要因が性能に大きく影響した点など、プロンプトエンジニアリングが「説明しづらいブラックアート」的性質を持つことを具体的に示している。
- 比較として自動プロンプト最適化フレームワーク**DSPy**（Khattab et al., 2023）も適用し、人手のプロンプトを上回るF1 0.548（precision 0.385 / recall 0.952）を達成、自動プロンプトエンジニアリングの有望性を示した。
- 考察として、(1) プロンプトエンジニアリングは「プログラムする」のではなく「説得する」作業に近い、(2) データを深く分析することが重要、(3) プロンプトエンジニアとドメイン専門家の密な連携が最も重要、という3点を教訓として挙げている。

## 7 Related Work
Liu et al. (2023b) 等の既存サーベイ（ChatGPT以前のプロンプトエンジニアリング、CoT系手法、プロンプトパターンのタキソノミー、医療・ソフトウェア工学等ドメイン特化のレビュー）を概観し、本論文はPRISMAという広く使われる系統的レビュー標準に基づく点、タキソノミーと用語標準化の出発点を提供する点で既存研究と差別化されると位置づける。

## 8 Conclusions
GenAIは新しい技術であり、その能力と限界の理解はまだ限定的。本論文は200種類超のプロンプティング手法・関連フレームワーク・安全性やセキュリティ上の留意点を体系的に分類する初期の試みであり、完全な網羅は主張しない。評価手法が未成熟な分野であるため、いかなる主張も鵜呑みにせず、手法が他のモデル・問題・データセットに転移するとは限らない点を読者に促している。初学者には「問題の理解を出発点にする」「シンプルな手法から試す」「性能に関する主張に懐疑的であれ」と助言し、既存の実践者にはタキソノミーが手法間の関係を明らかにする一助となること、新手法の開発者には本タキソノミーに位置づけて生態学的妥当性のある事例研究を添えることを推奨している。

## メモ
- 本ファイルは全58種のテキストベース手法＋マルチリンガル/マルチモーダル/エージェント/評価/セキュリティ/アライメント関連手法を見出し単位で要約したもの。数値・スコアは原典記載のものをそのまま引用。
- Appendix（用語の詳細定義、データシート、系統的レビュー用プロンプト、評価手法一覧表、entrapmentケーススタディの詳細ログ、プロンプトの形式的定義、ICL定義の食い違いの解説、著者貢献一覧）は原典を参照。