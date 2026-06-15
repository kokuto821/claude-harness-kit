# クリック可能な行の中の子ボタンはイベント伝播で親ハンドラを誤発火する

**作成日**: 2026-06-15
**カテゴリ**: coding
**タグ**: [#react, #event, #stopPropagation, #ui-bug]

## 概要

`onClick` を持つ行（リストアイテム）の内側に削除ボタン等の子ボタンを置くと、子ボタンのクリックが**親へバブリング**して親の `onClick`（行選択など）も発火してしまう。子ボタンのハンドラで `event.stopPropagation()` を呼んで伝播を止めるのが定石。

## 詳細

### 症状

ストック一覧で行の×（削除）ボタンを押すと、削除されると同時に「行タップ＝選択→Home遷移＋カード表示」まで起きてしまう。

### 原因

行ラッパーが選択ハンドラを持ち、その内側に削除ボタンがある構造：

```tsx
// 親: 行タップで onSelect
<div onClick={() => onSelect?.(topic)} role="button" tabIndex={0}>
  <StockListItem onDelete={() => onDelete?.(topic.id)} />
</div>

// 子（StockListItem 内）: 削除ボタン
<button onClick={onDelete} aria-label="削除">...</button>
```

子ボタンの click は DOM ツリーを上方向にバブリングし、親 `div` の `onClick`（= `onSelect`）も発火する。

### 修正：子ハンドラで stopPropagation

```tsx
import type { MouseEvent } from "react";

const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
  event.stopPropagation(); // 親行への伝播を止める
  onDelete?.();
};
// ...
<button onClick={handleDelete} aria-label="削除">...</button>
```

### ポイント・教訓

- 「親が clickable、子も clickable」の入れ子は伝播バグの定番。子の操作が親に波及していないか必ず確認する。
- 止める責務は**子ボタン側**に置く（親は自分のハンドラを素直に書ける）。
- 逆に、兄弟要素（親子関係でない overlay とカード等）では伝播しないので `stopPropagation` は不要。構造を見て要否を判断する。
- 回帰テストでは「削除しても画面遷移・選択状態が変わらない」ことを併せて検証すると、誤発火の再発を防げる。

```tsx
await userEvent.click(deleteButtons[0]);
expect(store.get(currentScreenAtom)).toBe("stock");   // 遷移しない
expect(store.get(selectedTopicAtom)).toBeNull();       // 選択もされない
```

## 参考・関連情報

- 対象: `wadai-sushi` `apps/web/src/features/stock/StockListItem/StockListItem.tsx`
