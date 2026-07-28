# hooks

このプラグインが提供する Claude Code フックのスクリプトを置く場所です。

フックは Claude の判断に頼らず、ツール実行を強制的に制御する仕組みです。配線は `.claude-plugin/plugin.json` の `hooks` セクションで行い、パスは `${CLAUDE_PLUGIN_ROOT}` 起点で書きます。

| ファイル | 役割 |
|---------|------|
| `protected-branch-guard.py` | 保護ブランチ（既定: main / master / develop）上での `git commit` / `git push` を `PreToolUse` でブロックし、作業ブランチを切るよう促す |

保護ブランチは環境変数 `CLAUDE_PROTECTED_BRANCHES`（スペース区切り）で変更できます。

新しいフックを書くときのひな形と考え方は `../template/hooks/README.md` を参照してください。
