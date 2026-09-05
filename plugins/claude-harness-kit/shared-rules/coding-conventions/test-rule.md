# テストルール

テストの命名・構造・分割・ヘルパー・記述スタイルを定める。`coding-rule.md` から分離した、テスト専用の規約。

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| テストファイル | 対象ファイル名 + `.test.ts` | `swipeUtils.test.ts` |
| テストヘルパーファイル | camelCase + `Helpers.ts` サフィックス | `swipeTestHelpers.ts` |
| テストヘルパー関数 | `create` / `make` / `build` プリフィックス | `createSwipeParams`, `buildMockMap` |

---

## 構造・記述スタイル

- `describe` のネストは **1層まで**とする
- テストケースは `it()` ではなく **`test()`** で記述する

```typescript
// ✅ 良い例
describe('determineSwipeDirection', () => {
  test('deltaXが閾値を超えた場合、右スワイプを返す', () => { ... });
  test('disableUpSwipeがtrueの場合、上スワイプを返さない', () => { ... });
});

// ❌ 悪い例（ネストが深い）
describe('determineSwipeDirection', () => {
  describe('右スワイプ', () => {
    describe('閾値超過時', () => {
      it('右を返す', () => { ... });
    });
  });
});
```

---

## 同一構造テストのまとめ方

- 入力のみ異なり構造同一 複数テスト → `test.each` でまとめる

```typescript
// ✅ 良い例
describe('determineSwipeDirection', () => {
  test.each([
    { deltaX: 20, threshold: 10, expected: 'right' },
    { deltaX: -20, threshold: 10, expected: 'left' },
  ])('deltaX=$deltaX の場合、$expected を返す', ({ deltaX, threshold, expected }) => {
    const params = createSwipeParams({ deltaX, threshold });
    expect(determineSwipeDirection(params)).toBe(expected);
  });
});

// ❌ 悪い例（構造重複）
describe('determineSwipeDirection', () => {
  test('deltaXが20の場合、rightを返す', () => {
    const params = createSwipeParams({ deltaX: 20, threshold: 10 });
    expect(determineSwipeDirection(params)).toBe('right');
  });

  test('deltaXが-20の場合、leftを返す', () => {
    const params = createSwipeParams({ deltaX: -20, threshold: 10 });
    expect(determineSwipeDirection(params)).toBe('left');
  });
});
```

---

## ファイル分割

- テストファイルが **500行を超えた場合**、関心ごとに別ファイルへの分割を検討する

```
feature/map/utils/__tests__/
├── swipeUtils.test.ts             # 500行以内に収まる単位で管理
├── swipeUtils.direction.test.ts   # 分割が必要になった場合
└── swipeUtils.threshold.test.ts
```

---

## テストヘルパーの共通化

- 複数のテストで使い回せるロジックは **テストヘルパー**として切り出す
- ヘルパーファイルは `__tests__/helpers/` ディレクトリに配置する

```typescript
// __tests__/helpers/swipeTestHelpers.ts

/**
 * スワイプイベントのモックパラメータを生成するヘルパー
 */
export const createSwipeParams = (
  overrides: Partial<DetermineSwipeDirectionParams> = {}
): DetermineSwipeDirectionParams => ({
  deltaX: 0,
  deltaY: 0,
  threshold: 10,
  disableUpSwipe: false,
  ...overrides,
});
```

---

## AAA パターン

- テストは **Arrange（準備）→ Act（実行）→ Assert（検証）** の3ステップで記述する
- 各ステップをコメントで明示する

```typescript
test('deltaXが閾値を超えた場合、右スワイプを返す', () => {
  // Arrange
  const params = createSwipeParams({ deltaX: 20, threshold: 10 });

  // Act
  const result = determineSwipeDirection(params);

  // Assert
  expect(result).toBe('right');
});
```

---

## アサーション

- オブジェクト全体検証 → `toEqual` でなく `toStrictEqual` 使う（余分プロパティ混入も検知）

```typescript
// ✅ 良い例
expect(params).toStrictEqual(createSwipeParams({ deltaX: 20, threshold: 10 }));

// ❌ 悪い例（余分プロパティを見逃す）
expect(params).toEqual(createSwipeParams({ deltaX: 20, threshold: 10 }));
```
