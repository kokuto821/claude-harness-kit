# リポジトリ構造とファイル配置ルール

## source of truth

すべてのコンテンツは `plugins/claude-harness-kit/` 配下が唯一の source of truth。

このディレクトリは `.claude-plugin/marketplace.json` を通じてマーケットプレイスプラグイン（`plugins/claude-harness-kit`）として読み込まれる。手動の symlink / junction 同期は行わない。

## ファイルの配置先

**新しいファイルは必ず `plugins/claude-harness-kit/<カテゴリ>/` 配下に置く。**

| 種類 | 正しい配置先 |
|------|------------|
| スキル | `plugins/claude-harness-kit/skills/<skill-name>/SKILL.md` |
| ルール | `plugins/claude-harness-kit/rules/<rule-name>/<category-rule>.md` |
| 調査・参考ドキュメント | `plugins/claude-harness-kit/documents/research/<file>.md` |
| 経験・知見メモ | `plugins/claude-harness-kit/knowledge/<category>/<file>.md` |
| サブエージェント | `plugins/claude-harness-kit/agent/<name>.md` |
| テンプレート | `plugins/claude-harness-kit/template/<category>/` |

プロジェクトルート直下や `.claude/` 配下にコンテンツの実ファイルを直接作成しない。`.claude/` は `settings.local.json` 等のローカル設定のみを置く。

## マーケットプレイス読み込み

- スキル・ルール・エージェント・ドキュメント等は `plugins/claude-harness-kit/` 配下に置けば、マーケットプレイスプラグイン経由で読み込まれる。
- 新規追加・削除後の手動同期は不要。反映には Claude Code の再起動（プラグイン再読込）で足りる。
- カタログ: `.claude-plugin/marketplace.json` ／ プラグインマニフェスト: `plugins/claude-harness-kit/.claude-plugin/plugin.json`

## よくある誤り

- ❌ プロジェクトルートに `.md` ファイルを直置きする（CLAUDE.md を除く）
- ❌ `.claude/` 配下にコンテンツの実ファイルを作成する
- ✅ `plugins/claude-harness-kit/<カテゴリ>/` 配下に置く
