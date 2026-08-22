# hooks

このプラグインが提供する Claude Code フックのスクリプトを置く場所です。

フックは Claude の判断に頼らず、ツール実行を強制的に制御する仕組みです。配線は `.claude-plugin/plugin.json` の `hooks` セクションで行い、パスは `${CLAUDE_PLUGIN_ROOT}` 起点で書きます。

| ファイル | 役割 |
|---------|------|
| `protected-branch-guard.py` | 保護ブランチ上での `git commit` / `git push`（Bash）と、編集系ツール（Edit / Write / NotebookEdit 等）によるファイル変更を `PreToolUse` でブロックし、作業ブランチを切るよう促す |

**ブロックしないもの**（意図的な範囲外）:

- git 管理外のパス（スクラッチパッド等）、`.gitignore` 済みのパス、`.git` 配下
- **Bash 経由のファイル書き込み**（`sed -i` / リダイレクト / `tee` 等）。シェルの網羅は原理的に不完全なため追いません。変更が保護ブランチへ着地することは commit / push の拒否で防ぎます

保護ブランチの既定値はスクリプト冒頭の `DEFAULT_PROTECTED_BRANCHES` を参照してください。環境変数 `CLAUDE_PROTECTED_BRANCHES`（スペース区切り）で変更できます。

新しいフックを書くときのひな形と考え方は `../template/hooks/README.md` を参照してください。
