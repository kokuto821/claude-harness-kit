# リポジトリ構造とファイル配置ルール

## source of truth

すべてのコンテンツは `plugins/shared-ai-skills/` 配下が唯一の source of truth。

このディレクトリは `.claude-plugin/marketplace.json` を通じてマーケットプレイスプラグイン（`plugins/shared-ai-skills`）として読み込まれる。手動の symlink / junction 同期は行わない。

## ファイルの配置先

**新しいファイルは必ず `plugins/shared-ai-skills/<カテゴリ>/` 配下に置く。**

| 種類 | 正しい配置先 |
|------|------------|
| スキル | `plugins/shared-ai-skills/skills/<skill-name>/SKILL.md` |
| ルール | `plugins/shared-ai-skills/rules/<rule-name>/<category-rule>.md` |
| 調査・参考ドキュメント | `plugins/shared-ai-skills/documents/research/<file>.md` |
| 経験・知見メモ | `plugins/shared-ai-skills/knowledge/<category>/<file>.md` |
| サブエージェント | `plugins/shared-ai-skills/agent/<name>.md` |
| テンプレート | `plugins/shared-ai-skills/template/<category>/` |

プロジェクトルート直下や `.claude/` 配下にコンテンツの実ファイルを直接作成しない。`.claude/` は `settings.local.json` 等のローカル設定のみを置く。

## マーケットプレイス読み込み

- スキル・ルール・エージェント・ドキュメント等は `plugins/shared-ai-skills/` 配下に置けば、マーケットプレイスプラグイン経由で読み込まれる。
- 新規追加・削除後の手動同期は不要。反映には Claude Code の再起動（プラグイン再読込）で足りる。
- カタログ: `.claude-plugin/marketplace.json` ／ プラグインマニフェスト: `plugins/shared-ai-skills/.claude-plugin/plugin.json`

## よくある誤り

- ❌ プロジェクトルートに `.md` ファイルを直置きする（CLAUDE.md を除く）
- ❌ `.claude/` 配下にコンテンツの実ファイルを作成する
- ✅ `plugins/shared-ai-skills/<カテゴリ>/` 配下に置く
