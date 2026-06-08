# コーディングルール

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネントファイル | PascalCase | `NeiButton.tsx`, `DrawerHeader.tsx` |
| hooks / utils ファイル | camelCase | `useInitializeMap.ts`, `swipeUtils.ts` |
| 型定義ファイル | camelCase + `Types.ts` サフィックス | `geoparkTypes.ts`, `hyakumeizanTypes.ts` |
| boolean 変数 | `is` / `has` プリフィックス | `isExpanded`, `isVectorVisible` |
| state 更新関数 | `set` プリフィックス | `setSelectedFeature`, `setLoading` |
| コールバック関数 | `on` / `handle` プリフィックス | `onClickLoading`, `handleMapClick` |
| プロジェクト固有コンポーネント | `Nei` プリフィックス | `NeiCard`, `NeiButton`, `NeiCloseButton` |
| 定数（オブジェクト/レイアウト） | UPPER_SNAKE_CASE | `LAYOUT_HORIZONTAL_PADDING`, `MAX_ZOOM_LEVEL` |
| テストファイル | 対象ファイル名 + `.test.ts` | `swipeUtils.test.ts` |
| テストヘルパーファイル | camelCase + `Helpers.ts` サフィックス | `swipeTestHelpers.ts` |
| テストヘルパー関数 | `create` / `make` / `build` プリフィックス | `createSwipeParams`, `buildMockMap` |

- 省略しない完全な名前を使用する

---

## ディレクトリ構造

```
app/
├── components/
│   ├── atoms/           # 最小単位のUI要素
│   └── molecules/       # atomsを組み合わせた要素
├── feature/
│   └── map/             # 機能単位のディレクトリ
│       ├── components/  # 機能特有のコンポーネント
│       ├── hooks/       # 機能特有のカスタムhooks
│       ├── types/       # 機能特有の型定義
│       ├── utils/       # 機能特有のユーティリティ
│       └── shared/      # 共有ユーティリティ
├── hooks/               # グローバルhooks
├── utils/               # グローバルユーティリティ
├── css/                 # 色定数・グローバルCSS
└── styles/              # レイアウト定数
```

- **Atomic Design** を採用（atoms / molecules の2段構成）
- 機能単位のコードは `feature/<機能名>/` 配下に集約する

---

## TypeScript

- `interface` は使わず `export type` を使用する
- **`any` 型は使用しない**。型が不明な場合は `unknown` を使用し、型ガードで絞り込む

```typescript
// ✅ 良い例
const parseResponse = (data: unknown): ResponseType => {
  if (!isResponseType(data)) throw new Error('Invalid response');
  return data;
};

// ❌ 悪い例
const parseResponse = (data: any) => { ... };
```

- コンポーネントは `FC<Props>` パターンで統一する
- `type` のプロパティには**必ずコメントで説明を付与する**

```typescript
export type NeiButtonProps = {
  /** ボタンクリック時のコールバック */
  onClick?: () => void;
  /** アクティブ状態のフラグ */
  isActive?: boolean;
  /** ボタンに表示するラベル文字列 */
  label?: string;
};

export const NeiButton: FC<NeiButtonProps> = ({ onClick, isActive, label }) => {...};
```

- 型ガード関数（`is〇〇`）を活用する

```typescript
export const isWGeopark = (f: FeatureType): f is WGeoparkFromSelected => {
  return (f as WGeoparkFromSelected).comment !== undefined;
};
```

- `tsconfig.json` で `strict: true` を維持する
- Union 型で複数のデータ型を表現する

---

## 定数

- マジックナンバーや固定文字列は **UPPER_SNAKE_CASE** で定数化する
- 定数はスコープに応じて配置先を使い分ける
  - グローバルに使用するものは `app/styles/layoutConstants.ts` または `app/css/color.ts`
  - 機能固有のものは `feature/<機能名>/` 配下に定義する

```typescript
// ✅ 良い例
const MAX_ZOOM_LEVEL = 18;
const DEFAULT_TILE_SIZE = 256;

map.setMaxZoom(MAX_ZOOM_LEVEL);

// ❌ 悪い例
map.setMaxZoom(18);
```

---

## スタイリング

- **Tailwind CSS を主流**として使用する
- CSS変数（`--darkGreen` 等）を `globals.css` に定義し、`tailwind.config.ts` で橋渡しする

```typescript
// tailwind.config.ts
colors: {
  ecruWhite: 'var(--ecruWhite)',
  darkGreen: 'var(--darkGreen)',
}
```

- スタイルはコンポーネント内で `const style = {}` オブジェクトとして定義する

```typescript
const style = {
  button: 'bg-ecruWhite rounded-lg cursor-pointer border-4 px-2',
  activeButton: 'border-accentOrange',
};
```

- レスポンシブは `md:` ブレークポイントで統一する
- 色定数は `app/css/color.ts` に集約する
- レイアウト定数は `app/styles/layoutConstants.ts` に集約する

---

## コンポーネント設計

- ドロワーは `createPortal` で `document.body` に注入する
- アニメーションは **Framer Motion** を使用する（`AnimatePresence` + `motion.div`）

```typescript
const variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
};
```

---

## Export パターン

- **Named export を基本**とする（`export const`）
- `default export` は page コンポーネントのみ
- Path alias `@/` を使用する

```typescript
import { NeiButton } from '@/app/components/molecules/NeiButton';
```

---

## カスタムhooks

- 命名は `use` プリフィックス必須、機能を明確に表現する
- 戻り値は**オブジェクト**で返す

```typescript
export const useInitializeMap = (): MapHookReturn => {
  return { map, mapRef, setMap, activeLayer, switchBaseLayer, baseLayers };
};
```

- `useCallback` を活用し、依存配列を明示する
- `useEffect` では必ずクリーンアップ関数を返す

```typescript
useEffect(() => {
  map.on('click', handleMapClick);
  return () => {
    map.un('click', handleMapClick);
  };
}, [map, handleMapClick]);
```

---

## 関数設計

- 単一責任の原則に従う
- 副作用のない純粋関数を推奨する
- 引数が多い場合はオブジェクト形式にする
- 関数は**アロー関数**で定義する

```typescript
// ✅ 良い例
export const greet = (name: string): string => {
  return `Hello, ${name}`;
};

// ❌ 悪い例
export function greet(name: string): string {
  return `Hello, ${name}`;
}
```

```typescript
export const determineSwipeDirection = ({
  deltaX,
  deltaY,
  threshold,
  disableUpSwipe,
}: DetermineSwipeDirectionParams): SwipeDirection | null => {...};
```

---

## コメント・デバッグ

- コメントは**日本語のみ**使用する
- 関数の説明は TSDOC 形式（`/** */`）で記述する

```typescript
/**
 * スワイプ方向を判定する純粋関数
 * deltaX / deltaY と閾値、各方向の無効フラグから方向を返す。
 */
```

- `console.log` には絵文字で状態を示す

```typescript
console.log('🔄 Supabaseからデータを取得中...');
console.log('✅ データを取得しました');
```

---

## Linting / Formatting

- ESLint: TypeScript strict + React Hooks + a11y
- Prettier: `semi: true`, `singleQuote: true`, `printWidth: 80`
- Stylelint: Tailwind CSS 設定

---

## テスト

### 構造・記述スタイル

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

### ファイル分割

- テストファイルが **500行を超えた場合**、関心ごとに別ファイルへの分割を検討する

```
feature/map/utils/__tests__/
├── swipeUtils.test.ts             # 500行以内に収まる単位で管理
├── swipeUtils.direction.test.ts   # 分割が必要になった場合
└── swipeUtils.threshold.test.ts
```

### テストヘルパーの共通化

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

### AAA パターン

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