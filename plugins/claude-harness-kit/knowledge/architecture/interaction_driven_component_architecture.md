# Interaction-driven なコンポーネント設計と独立性による配置分離

**作成日**: 2026-06-14
**カテゴリ**: architecture
**タグ**: [#component-design, #react, #atomic-design, #interaction-driven, #colocation]

## 概要

UIコンポーネントの分類軸を「見た目・大きさ（Atomic Design の atoms/molecules/organisms）」から
「ユーザーの責務（button / edit / view）」へ切り替える **Interaction-driven** 設計の実践知。
分類は `<button>` 要素の有無で機械的に判断でき、さらに「独立性」を軸に `components/`（汎用部品）と
`features/<domain>/`（ドメイン固有・合成）を分離する。レイアウトの箱は `children` で受け、
List/Lane 系はデータ駆動を維持する。

## 詳細

### 1. 分類軸は「見た目」ではなく「ユーザーの責務」

Atomic Design はサイズ・粒度ベースで、責務が曖昧になりやすい。代わりに3本柱で分類する。

| 分類 | 責務 | 例 |
|------|------|----|
| `button/` | 意思決定・アクション起動 | Button, Toggle, Tab, NavItem |
| `edit/` | 情報の入力・編集 | TextInput, Select, Checkbox |
| `view/` | 表示のみ・読み取り専用 | Text, Badge, Avatar, Table |

### 2. 迷ったら `<button>` 要素の有無で判断

重心判断（実際の使われ方）で迷う場合の実務基準:

- `<button>` 要素（クリックでアクションを起こす操作）を含む → `button`
  - 表示が主目的に見えるヘッダー・カード・リスト項目でも、操作要素を持つ時点で
    アクション起動の責務を負っているため `button`。
- `<button>` を持たず表示のみ → `view`
- `div` + `role="button"` などの擬似ボタンは重心で判断（表示主体なら `view`）。

### 3. コロケーション

1コンポーネント1フォルダにし、`.tsx` / `.stories.tsx` / `.test.tsx` を同居させる
（例: `view/Text/Text.tsx`）。import は `@/components/view/Text/Text` のように
フォルダ＋ファイル名で指す（barrel/index は使わない運用も可）。

### 4. 独立性による components / features の分離

`components/` は「独立した汎用部品」に保つ。

- 他の自作コンポーネントに依存しない、または汎用基礎部品（Text/Icon 等）のみ依存する汎用UI
  → `components/<button|edit|view>/`
- 特定ドメインの概念・データに依存、または複数を組み合わせた合成コンポーネント
  → `features/<domain>/`（例: topic / course / stock / sushi / navigation）

「他のページで使うか」に加え「他の自作コンポーネントを組み合わせているか（独立しているか）」も
切り出しの判断材料にする。なお features は React Router 非使用時のドメイン固有配置先で、
Router 使用時は `pages/` を使う。

### 5. 合成の方針: children化 vs データ駆動

- 子を**固定的に並べるレイアウトの箱**は、子をハードコードせず `children` / slot で受ける。
  箱は汎用部品として `components/` に残し、具体的な中身は利用側（features）で組み立てる。
  - 例: 汎用 `NavBar`（children を `<nav>` でラップするだけ）＋ `features/navigation/BottomNavigationBar`
    （`NavBar` に `NavItem` を children で渡し、タブ構成という固有知識を1箇所に集約）。
- **List / Lane 系**（data 配列を受けて `map` で項目を生成）は children 化しない。
  data 駆動を維持し、ソート・フィルタ等の利点を保つ。

### なぜこのアプローチか

- 責務ベース分類は「このコンポーネントは何をするものか」を場所で表現でき、肥大化を防ぐ。
- `<button>` 基準により分類の属人性・迷いを減らせる。
- 独立性による分離で `components/` の再利用性が保たれ、ドメイン変更の影響が `features/` に閉じる。

## 参考・関連情報

- ルール: `shared-rules/ui-design/architecture/ui-architecture.md`（本知見を判断基準として明文化済み）
- 適用事例: 回転寿司トークテーマアプリ（wadai-sushi）で Atomic Design から本構成へ移行
