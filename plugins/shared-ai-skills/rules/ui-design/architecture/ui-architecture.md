# コンポーネント設計思想
Interaction-driven component architecture(インタラクション責務ベースの分類)

個人で考えた思想

## ディレクトリ構造

種類別とコロケーションを組み合わせた構造。

components/
  button/          ← 意思決定・アクション起動
    PrimaryButton/
      PrimaryButton.tsx
      PrimaryButton.module.css
      PrimaryButton.stories.tsx
    IconButton/
      IconButton.tsx
      IconButton.module.css
  edit/            ← 情報の入力・編集
    TextInput/
      TextInput.tsx
      TextInput.module.css
    SelectInput/
      SelectInput.tsx
  view/            ← 表示のみ・読み取り専用
    Badge/
      Badge.tsx
    Avatar/
      Avatar.tsx

pages/             ← React Router使用時、ページ固有コンポーネント
  Dashboard/
    DashboardChart/
    DashboardSummary/

features/          ← React Router非使用時、ドメイン固有コンポーネント
  dashboard/
  settings/

layouts/
hooks/
utils/

## 分類の3本柱

分類軸はユーザーの責務（見た目・大きさではない）

種類責務例button意思決定・アクション起動PrimaryButton, IconButton, Toggleedit情報の入力・編集TextInput, SelectInput, Checkbox, DatePickerview表示のみ・読み取り専用Badge, Avatar, ProgressBar, Table

## 境界はファジーでいい、重心で判断

どちらの性質も持つコンポーネントは「実際の使われ方の重心」で分類する。

コンポーネント分類理由TogglebuttonON/OFFの意思決定がメインCheckboxeditフォーム内での値選択がメインTableview基本は表示、編集機能は別コンポーネントが担うEditableTableedit編集がメインの用途

## 実装での判断基準: `<button>` 要素の有無

重心判断で迷う場合の実務的な基準。

- コンポーネントが `<button>` 要素（クリックでアクションを起こす操作）を含むなら `button` に分類する。表示が主目的に見えても、ユーザーが操作してアクションを起こす要素を持つ時点でアクション起動の責務を負っている。
  - 例: ヘッダー（戻る/閉じるボタンを持つ）、カード（ストック/削除ボタンを持つ）、リスト項目（選択ボタンを持つ）は `button`。
- `<button>` を持たず表示のみなら `view`。
- `<button>` 要素ではなく `div` + `role="button"` など擬似ボタンの場合は、重心で判断する（表示が主体なら `view`）。

## コロケーションで関連ファイルを近くに置く

コンポーネントに関するファイル（tsx・css・stories・test）は同じフォルダにまとめる。

## 共通 vs ページ固有の判断軸

「他のページ・機能でも使うか？」で判断する。


Yes → components/
No（React Router使用時） → pages/
No（React Router非使用時） → features/