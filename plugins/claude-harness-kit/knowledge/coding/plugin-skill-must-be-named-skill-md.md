# プラグインのスキルはファイル名が SKILL.md でないと読み込まれない

**作成日**: 2026-06-14
**カテゴリ**: coding
**タグ**: [#claude-code, #plugin, #skill, #marketplace]

## 概要

Claude Code のプラグインスキルは、各スキルディレクトリ内のマークダウンファイルが必ず `SKILL.md` という名前である必要がある。ファイル名がディレクトリ名と同じ（例: `git-submodule-operations/git-submodule-operations.md`）になっていると、フロントマターが正しくてもスキル一覧に表示されず認識されない。対処は `SKILL.md` へのリネーム。

## 詳細

- **問題の背景**: `settings.json` でマーケットプレイス登録・プラグイン有効化を正しく行い、`marketplace.json` / `plugin.json` も正しいのに、一部のスキルだけ表示されなかった。
- **原因**: スキルディレクトリ内のファイル名が `SKILL.md` でなかった。
  - `git-submodule-operations/git-submodule-operations.md` ❌
  - `git-submodule-troubleshooting/git-submodule-troubleshooting.md` ❌
  - 他のスキルは `SKILL.md` だったため正常に読み込まれていた。
- **切り分けのポイント**: 「設定は正しいのに一部スキルだけ出ない」場合、まず各スキルディレクトリ内のファイル名が `SKILL.md` ちょうどになっているかを確認する。フロントマター（`name` / `description`）の中身が正しくてもファイル名が違えば読み込まれない。
- **対処手順**: 履歴を保つため `git mv` でリネーム。
  ```bash
  git mv skills/<dir>/<dir>.md skills/<dir>/SKILL.md
  ```
- **反映タイミング**: プラグインのスキル一覧はセッション起動時に読み込まれるため、リネーム後は Claude Code の再起動（または `/plugin` で再読み込み）が必要。
- **なぜ**: Claude Code はスキルディレクトリを走査する際、エントリポイントとして固定名 `SKILL.md` を探すため。命名規約として徹底する。

## 参考・関連情報

- 命名規則ルール: `shared-rules/naming-conventions/naming-rule.md`
- 補足: 上記の例として挙げた `git-submodule-operations` / `git-submodule-troubleshooting` スキルは後に削除済み（この知見自体は固定名 `SKILL.md` の原則として有効）
