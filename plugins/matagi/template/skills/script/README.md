# skills/script

スキルが実行するスクリプトを置くディレクトリ。

## ファイル種別と用途

| 拡張子 | 用途 |
|--------|------|
| `.sh` | Bash コマンド実行全般（セットアップ・ビルド・デプロイなど） |
| `.js` | Dynamic Workflow（条件分岐・ループを含む複雑な処理フロー） |

## 使い方

SKILL.md の手順内で `Bash` ツールを通じて呼び出す。

```markdown
## 手順
1. `Bash` で `script/setup.sh` を実行する
```

## ここに置かないもの

- Claude への指示文（→ SKILL.md 本文）
- 参照用ドキュメント（→ `reference/`）