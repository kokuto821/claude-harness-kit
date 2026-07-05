# 論文：A Systematic Survey of Prompt Engineering in Large Language Models: Techniques and Applications
Sahoo, Singh, Saha, Jain, Mondal, Chadha（IIT Patna / Stanford / Amazon AI）｜arXiv:2402.07927v2 [cs.AI]｜CC BY 4.0
🔗 https://arxiv.org/html/2402.07927v2

## 何の論文か
LLM（および VLM）向けのプロンプトエンジニアリング手法を、モデルパラメータを変更せずにタスク特化の振る舞いを引き出す技術として体系的にサーベイした論文。41種類の手法をアプリケーション領域ごとに分類し、各手法について手法の概要・適用モデル・使用データセット・強み/限界を整理している。タキソノミー図（Fig.2）とサマリー表（Table 1）を提供し、プロンプトエンジニアリング分野の見取り図として機能する。

## 1 Introduction
Zero-shot / Few-shot のような基礎的手法から "Chain of Code" のような高度な手法まで、プロンプトエンジニアリングの技術群を横断的に整理する動機を述べる。LLM 領域で先行研究（Liu et al. 2023 等）はあるが、VLM も含めた**アプリケーション中心の体系的整理**が欠けている点をギャップとして指摘。41の手法をレビューし、各手法の適用先・使用モデル・データセットを分析。論文の構成は「第2章：応用領域別のプロンプト手法」「第3章：結論と今後の課題」。

## 2 Prompt Engineering
プロンプト手法を12の応用領域（§2.1〜§2.12）に分類して解説する章。

### 2.1 New Tasks Without Extensive Training（追加学習なしで新規タスクに対応）
- **2.1.1 Zero-shot Prompting**（Radford et al., 2019）: ラベル付きデータなしで、プロンプト中のタスク記述のみを頼りにモデルの既存知識から予測させる。
- **2.1.2 Few-shot Prompting**（Brown et al., 2020）: 少数の入出力例をプロンプトに含めて理解を促す。性能は上がるがトークン消費が増え、例の選び方・構成が結果に強く影響する。

### 2.2 Reasoning and Logic（推論とロジック）
- **Chain-of-Thought (CoT) Prompting**（Wei et al., 2022）: 段階的な推論過程を明示させることで複雑な推論を改善。PaLM 540B で数学・常識推論ベンチマークにおいて精度90.2%を達成。
- **Automatic Chain-of-Thought (Auto-CoT)**（Zhang et al., 2022）: "Let's think step-by-step" により推論チェーンを自動生成し、多様なサンプリングで頑健性を高める。GPT-3で算術・記号推論タスクにおいてCoTよりそれぞれ1.33%・1.5%改善。
- **Self-Consistency**（Wang et al., 2022）: 複数の推論チェーンをサンプリングし、最も一貫した最終解を多数決的に選ぶデコーディング戦略。CoTと組み合わせ、GSM8Kで+17.9%等の大幅な精度向上。
- **Logical CoT (LogiCoT) Prompting**（Zhao et al., 2023）: 記号論理（背理法）を用いて各推論ステップを検証・修正するニューロシンボリックな think-verify-revise ループ。GSM8K・AQuAでCoTを上回る。
- **Chain-of-Symbol (CoS) Prompting**（Hu et al., 2023）: 自然言語の曖昧さを避けるため、凝縮した記号で空間関係を表現。ChatGPTのBrick World精度を31.8%→92.6%に向上、プロンプトトークンを最大65.8%削減。
- **Tree-of-Thoughts (ToT) Prompting**（Yao et al., 2023a; Long, 2023）: 中間推論（thought）を木構造で管理し、探索アルゴリズム（幅優先/深さ優先）で先読み・バックトラックを行う。Game of 24でCoTの4%に対し74%の成功率。
- **Graph-of-Thoughts (GoT) Prompting**（Yao et al., 2023b）: 推論過程を有向グラフとしてモデル化し、木構造より非線形な思考の集約・分岐・逆戻りを可能にする。GSM8KでCoTベースラインを最大5.08%上回る。
- **System 2 Attention (S2A) Prompting**（Weston and Sukhbaatar, 2023）: 無関係な文脈への注意を避けるため、入力文脈を再生成してから応答生成する2段階プロセス。事実QAで精度80.3%。
- **Thread of Thought (ThoT) Prompting**（Zhou et al., 2023）: 長大な文脈をセグメントに分割し要約→精緻化する2段階アプローチ。プラグアンドプレイで、QA・対話タスクでそれぞれ47.20%・17.8%改善。
- **Chain of Table Prompting**（Wang et al., 2024）: SQL/DataFrame操作を段階的に生成・実行し表形式データの推論を可視化。TabFactで+8.69%、WikiTQで+6.72%。
- **Self-Refine Prompting**（Madaan et al., 2023）: 「生成→自己批評→修正」の反復により出力を精緻化。GPT-4でコード最適化+8.7pt、可読性+13.9pt、感情反転タスク+21.6pt。
- **Code Prompting**（Puerto et al., 2024）: 自然言語タスクを構造化コードに変換し、外部実行なしでtext+code LLMに直接推論させる。GPT-3.5で平均+8.42 F1。
- **Self-Harmonized CoT (ECHO) Prompting**（Mekala et al., 2024）: 質問クラスタリング→代表例からの根拠生成→根拠の統一という3段階で多様な推論パターンを調和。Auto-CoTを10ベンチマーク平均+2.8%上回る。
- **Logic-of-Thought Prompting**（Liu et al., 2024）: 命題論理を抽出・拡張・自然言語へ再翻訳してプロンプトに追加するニューロシンボリック手法。ReClorでCoTを+4.35%改善。
- **Instance-adaptive Prompting (IAP)**（Yuan et al., 2024）: attention層の情報フロー分析に基づき、インスタンスごとにプロンプトを動的に調整（IAP-ss／IAP-mv）。GSM8K・SVAMPでLLaMA-3-8B/Qwen-14Bをそれぞれ+1.82%/+3.31%改善。
- **End-to-End DAG-Path (EEDP) Prompting**（Hong et al., 2024）: グラフをDAG化しバックボーンパスを優先表現することで長距離依存を保持。ZINC_test_2500のEdge Prediction Distance Predictionで+30.13%。
- **Layer-of-Thoughts (LoT) Prompting**（Fungwacharakorn et al., 2024）: 制約階層（layer thoughts / option thoughts）で段階的に候補を絞り込む階層的推論。日本の民事法検索でF2スコア0.835を達成。
- **Narrative-of-Thought (NoT) Prompting**（Zhang et al., 2024）: イベントをPythonクラスで構造化表現し、時間的に整合したナラティブでDAG生成を導く。LLaMA3-8BがF1スコア42.2を達成しGPT-3.5の45.7に近づく。
- **Buffer of Thoughts (BoT) Prompting**（Yang et al., 2024）: 汎用的な「thought-template」を蓄積するmeta-bufferと動的buffer-managerで再利用可能な高レベル推論パターンを提供。Game of 24で+11%、Checkmate-in-Oneで+51%、計算コストはToTの12%。
- **Contrastive Denoising with Noisy Chain-of-Thought (CD-CoT) Prompting**（Zhou et al., 2024）: ノイズを含む根拠とクリーンな根拠を対比し、リフレーズ・最適パス選択・投票を行う。平均+17.8%の精度改善。
- **Reverse Chain-of-Thought (R-CoT) Prompting**（Deng et al., 2024）: 高精細な幾何画像生成（GeoChain）→回答起点の質問生成（Reverse A&Q）で幾何推論データセット（GeoMM）を構築。8Bモデルが GPT-4o をMathVistaで+12.5%、GeoQAで+14.5%上回る。
- **Chain of Draft (CoD) Prompting**（Xu et al., 2025）: 各推論ステップの語数を制約し、簡潔で情報密度の高い出力にする。CoTと同等以上の精度を保ちつつ出力トークンを最大80%削減、レイテンシを平均76.2%削減。

### 2.3 Reduce Hallucination（ハルシネーション低減）
- **Retrieval Augmented Generation (RAG)**（Lewis et al., 2020）: ユーザー入力から検索クエリを組み立て、知識ベースから関連情報を取得してプロンプトを拡張する。TriviaQAでExact Match 56.8%、Natural Questionsで44.5%。
- **ReAct Prompting**（Yao et al., 2022）: 推論トレースとタスク固有アクションを交互に生成し、行動計画の追跡・更新・例外処理を可能にする。ALFWorld・WebShopでそれぞれ成功率34%・10%。
- **Chain-of-Verification (CoVe) Prompting**（Dhuliawala et al., 2023）: ベースライン応答生成→検証質問の計画→独立回答→検証を踏まえた改訂という4段階でハルシネーションを削減。
- **Chain-of-Note (CoN) Prompting**（Yu et al., 2023）: 検索文書の関連性を体系的に評価し、無関係な内容を除外して回答の頑健性を高める。ノイズ文書でExact Match +7.9、未知質問への棄却率+10.5。
- **Chain-of-Knowledge (CoK) Prompting**（Li et al., 2023d）: 推論準備→内部知識・外部データベース・プロンプトからの動的知識適応という段階的プロセスで複雑タスクを分解。

### 2.4 User Interface（ユーザーインタラクション）
- **Active-Prompting**（Diao et al., 2023）: 不確実性に基づくアクティブラーニングにより、アノテーションすべき最も影響力の大きい質問を選定。self-consistencyを平均7.0%（text-davinci-002）・1.8%（code-davinci-002）上回る。

### 2.5 Fine-Tuning and Optimization（ファインチューニングと最適化）
- **Automatic Prompt Engineer (APE)**（Zhou et al., 2022）: 候補指示文を生成し強化学習で最適なプロンプトを選定する自動プロンプト生成手法。BIG-Bench 24タスク中19タスクで人手プロンプトを上回る。

### 2.6 Knowledge-Based Reasoning and Generation（知識ベース推論と生成）
- **Automatic Reasoning and Tool-use (ART)**（Paranjape et al., 2023）: 多段階推論を構造化プログラムとして自動化し、外部ツールの出力を組み込んで再開できるようにする。BigBench・MMLUで従来のプロンプト手法を上回る。

### 2.7 Improving Consistency and Coherence（一貫性・整合性の向上）
- **Contrastive Chain-of-Thought (CCoT) Prompting**（Chia et al., 2023）: 正しい推論例と誤った推論例を両方提示し、誤りからの学習を促す。従来CoTに対し戦略的・数学的推論で4〜16%改善、self-consistency併用でさらに約5%向上。

### 2.8 Managing Emotions and Tone（感情・トーンの管理）
- **Emotion Prompting**（Li et al., 2023a）: 心理学研究に着想を得た11種の感情刺激文をプロンプトに付加する。Instruction inductionで+8.00%、BIG-Benchタスクで+115%、106名の被験者評価で平均+10.9%の性能改善。

### 2.9 Code Generation and Execution（コード生成と実行）
- **Scratchpad Prompting**（Nye et al., 2021）: 最終解を出す前に任意の中間トークン列を生成させる「スクラッチパッド」概念。MBPP-augで46.8%の成功率。
- **Program of Thoughts (PoT) Prompting**（Chen et al., 2022）: 計算ステップを外部言語インタプリタ（Python等）に委ね、推論と計算を分離。CoTに対し数学文章題・財務QAで平均約12%改善。
- **Structured Chain-of-Thought (SCoT) Prompting**（Li et al., 2023c）: プログラム構造（順次・分岐・ループ）を推論ステップに組み込みコード生成に特化。HumanEval・MBPP・MBCPPでCoTを最大13.79%上回る。
- **Chain-of-Code (CoC) Prompting**（Li et al., 2023b）: 意味的サブタスクを疑似コードとして記述させ、未定義動作を「LMulator」でシミュレートする。BIG-Bench Hardで84%の精度（+12%）。

### Table 1（要約表）
論文はプロンプト手法ごとに「応用領域・プロンプト獲得方法（Manual/LM Generated/Retrieval Based/Hybrid）・プロンプトターン（Single/Multi）・使用言語モデル・データセット・評価指標」を一覧化した表を提供している（詳細は原典参照）。

### 2.10 Optimization and Efficiency（最適化と効率）
- **Optimization by Prompting (OPRO)**（Yang et al., 2023）: LLMを最適化器として用い、自然言語プロンプトで問題記述から反復的に解を生成する。線形回帰・巡回セールスマン問題で有効性を実証し、GSM8Kで人手プロンプトを最大8%、Big-Benchの難タスクで最大50%上回る。

### 2.11 Understanding User Intent（ユーザー意図の理解）
- **Rephrase and Respond (RaR) Prompting**（Deng et al., 2023）: 人間の思考枠組みとLLMのそれとの乖離に着目し、単一プロンプト内で質問を言い換え・拡張させることで理解と応答精度を改善する。2段階版（rephrasing + response LLM）でさらに性能向上。

### 2.12 Metacognition and Self-Reflection（メタ認知と自己内省）
- **Take a Step Back Prompting**（Zheng et al., 2023）: 具体的事例から高レベルな概念・原則を抽象化してから推論する2段階（抽象化→推論）手法。PaLM-2LでMMLU物理・化学+7%、TimeQA+27%、MuSiQue+7%などの改善。

## 3 Conclusion
プロンプトエンジニアリングをAI分野における変革的な力と位置づけ、41種の手法を機能別に体系化した本サーベイが今後の研究の基盤資料となることを述べる。応用・モデル・データセットを横断した分析により各手法の強み・限界を明らかにした一方、バイアス・事実誤り・解釈可能性の課題が残ると指摘。メタ学習やハイブリッドなプロンプトアーキテクチャなど今後の展望と、責任あるプロンプト開発・展開という倫理的配慮の重要性を結びとしている。

## メモ
- 全41手法のうち本ファイルでは各手法を2〜3文で要約。数値・スコアは原典記載のものをそのまま引用。
- 参考文献一覧（Bahng et al. 2022 〜 Zhou et al. 2024）は原典を参照。