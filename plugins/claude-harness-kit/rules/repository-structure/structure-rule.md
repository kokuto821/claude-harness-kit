# リポジトリ構造とファイル配置ルール

## source of truth

すべてのコンテンツは `plugins/claude-harness-kit/` 配下が唯一の source of truth。

このディレクトリは `.claude-plugin/marketplace.json` を通じてマーケットプレイスプラグイン（`plugins/claude-harness-kit`）として読み込まれる。コンテンツを複製する手動の symlink / junction 同期は行わない（コアルールの単一実体参照は例外。「コアルールの symlink 例外」節を参照）。

## ファイルの配置先

**新しいファイルは必ず `plugins/claude-harness-kit/<カテゴリ>/` 配下に置く。**

| 種類 | 正しい配置先 |
|------|------------|
| スキル | `plugins/claude-harness-kit/skills/<skill-name>/SKILL.md` |
| コアルール（必読・毎セッション自動ロード） | `plugins/claude-harness-kit/rules/<topic>/<category-rule>.md` |
| 参照ルール（任意タイミングで参照） | `plugins/claude-harness-kit/shared-rules/<topic>/<category-rule>.md` |
| 調査・参考ドキュメント | `plugins/claude-harness-kit/documents/research/<file>.md` |
| 経験・知見メモ | `plugins/claude-harness-kit/knowledge/<category>/<file>.md` |
| サブエージェント | `plugins/claude-harness-kit/agent/<name>.md` |
| フックスクリプト | `plugins/claude-harness-kit/hooks/<name>.<ext>`（配線は `.claude-plugin/plugin.json` の `hooks`） |
| テンプレート | `plugins/claude-harness-kit/template/<category>/` |

プロジェクトルート直下や `.claude/` 配下にコンテンツの実ファイルを直接作成しない。`.claude/` は `settings.local.json` 等のローカル設定と、コアルールの symlink（`.claude/rules` → `plugins/.../rules`、実体は plugins 側）のみを置く。

## マーケットプレイス読み込み

- スキル・ルール・エージェント・ドキュメント等は `plugins/claude-harness-kit/` 配下に置けば、マーケットプレイスプラグイン経由で読み込まれる。
- 新規追加・削除後の手動同期は不要。反映には Claude Code の再起動（プラグイン再読込）で足りる。
- カタログ: `.claude-plugin/marketplace.json` ／ プラグインマニフェスト: `plugins/claude-harness-kit/.claude-plugin/plugin.json`

## よくある誤り

- ❌ プロジェクトルートに `.md` ファイルを直置きする（CLAUDE.md を除く）
- ❌ `.claude/` 配下にコンテンツの実ファイルを作成する（実ファイルの直置きは不可。コアルールのディレクトリ symlink は「コアルールの symlink 例外」節の条件下でのみ可）
- ✅ `plugins/claude-harness-kit/<カテゴリ>/` 配下に置く

## コアルールの symlink 例外

ルールは2層で扱う。`rules/`（コア）はタスク領域を問わず毎セッション効くルール、`shared-rules/`（参照層）は任意タイミングで参照する共通ルール。

- コア（`rules/`）は、この kit をカレントディレクトリで開発する際に確実に読ませるため、`.claude/rules` → `plugins/claude-harness-kit/rules` の**ディレクトリ symlink** で native 自動ロード対象にする。
- 実体は plugins 側のまま（source of truth 単一）。symlink はコンテンツの複製・同期ではなく単一実体への参照。
- 対象は WSL 内完結の開発時のみ。marketplace 経由の導入先には配られない。
- 参照層（`shared-rules/`）は symlink せず、CLAUDE.md 索引と `[[link]]` で必要時に参照する（コンテキスト圧迫を避ける）。
