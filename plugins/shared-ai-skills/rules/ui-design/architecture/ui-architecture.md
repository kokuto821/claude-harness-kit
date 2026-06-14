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

## コロケーションで関連ファイルを近くに置く

コンポーネントに関するファイル（tsx・css・stories・test）は同じフォルダにまとめる。

## 共通 vs ページ固有の判断軸

「他のページ・機能でも使うか？」で判断する。


Yes → components/
No（React Router使用時） → pages/
No（React Router非使用時） → features/