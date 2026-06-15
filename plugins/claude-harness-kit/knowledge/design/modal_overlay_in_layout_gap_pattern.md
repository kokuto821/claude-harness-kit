# レイアウトのスキマ内にカードを重ねるモーダルオーバーレイ実装パターン（React + Tailwind）

**作成日**: 2026-06-15
**カテゴリ**: design
**タグ**: [#react, #tailwind, #modal, #overlay, #layout]

## 概要

「画面内の特定領域（スキマ）にカードを表示しつつ、背景は薄暗くしてどこをタップしても閉じる」モーダルを実装する際の構成パターン。背景ディムと表示位置のスコープを分離するのがポイント。

- **背景ディム**: `fixed inset-0 bg-black/50` で画面全体を覆い、`onClick` で閉じる（どこをタップしても閉じる）。
- **カード本体**: 表示したい領域（relative な親）を基準に `absolute` で配置し、高さは領域と共通の定数で揃える。
- 閉じる手段は **×ボタン / 背景タップ / Escキー** の3系統を用意する。

## 詳細

### 背景の問題

`TopicDisplay`（お皿タップで開く話題カード）を「寿司レーン上のスキマ（白い帯）」に表示したいが、同時に「背景を薄暗くしてどこをタップしても閉じたい」という要件。ディムを領域内に閉じ込めると画面全体が暗くならず、逆にカードを画面中央に出すと指定位置に置けない。

### 解決：ディムと位置を別スコープにする

```tsx
// 親（スキマ枠）: 配置基準を作る
<div className={`relative bg-white w-full ${TOPIC_AREA_HEIGHT} shrink-0`}>
  <TopicDisplay />
</div>

// TopicDisplay 内
return (
  <>
    {/* 背景ディム: 画面全体（viewport基準）。どこをタップしても閉じる */}
    <div
      className="fixed inset-0 z-40 bg-black/50 animate-in fade-in duration-200"
      onClick={handleClose}
      role="presentation"
      data-testid="topic-backdrop"
    />
    {/* カード: スキマ（relative な親）基準に絶対配置・上端中央寄せ */}
    <div
      className={`absolute left-1/2 top-0 z-50 w-full max-w-sm -translate-x-1/2 p-3 ${TOPIC_AREA_HEIGHT} animate-in zoom-in-95 duration-200`}
      role="dialog"
      aria-modal="true"
      aria-label="..."
    >
      <Card ... />
    </div>
  </>
);
```

### 効いている設計判断

- **ディムは `fixed`、カードは `absolute`**: `fixed` は viewport 基準なので親が小さくても全画面を暗くできる。`absolute` は relative な親（スキマ枠）基準なので、狙った領域にカードを置ける。役割ごとに position を使い分ける。
- **高さ定数の共通化**: スキマのスペーサーとカードで同じ Tailwind クラス（例 `TOPIC_AREA_HEIGHT = "h-80"`）を共有し、ズレを防ぐ。`src/styles/layout.ts` 等に切り出す。Tailwind v4 は `.ts` も走査するのでクラス文字列リテラルが定義ファイルにあれば JIT で生成される。
- **カードをスキマより少し低くしたい**: ラッパーの高さは定数のまま、padding を横だけ（`px-3`）→ 全方向（`p-3`）に変えると、`h-full` の子（border-box）が padding 分だけ縮み、上下に余白が生まれる。
- **クリックで閉じる対象の区別**: ディムとカードは親子関係にない兄弟要素なので、カードをタップしてもディムの `onClick` は発火しない（バブリングは DOM ツリー上方向のみ）。`stopPropagation` は不要。
- **z-index**: ディム `z-40` < カード `z-50`。フッター等より前面に出す。
- **アニメーション**: `tw-animate-css` の `animate-in fade-in` / `zoom-in-95 duration-200`（0.1〜0.3s 推奨）。

### テスト観点

- `data-testid` をディムに付けて「背景タップで閉じる」を検証。
- `role="dialog"` のカードをクリックしても閉じないことを検証（兄弟要素なので非伝播）。

## 参考・関連情報

- 対象: `wadai-sushi` プロジェクト `apps/web/src/pages/TopicDisplay.tsx`, `src/styles/layout.ts`
- 関連: `architecture/interaction_driven_component_architecture.md`
