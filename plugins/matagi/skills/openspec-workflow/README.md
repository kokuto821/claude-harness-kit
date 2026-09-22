# openspec-workflow

OpenSpec の explore/propose/apply/archive フェーズを統括するオーケストレータースキルを置く場所です。

CLI が生成する `openspec-apply-change`/`openspec-archive-change` は実装の委譲・レビューゲートを持たないため、apply/archive では起動せず、本スキルが `openspec` CLI を直接使って進行・委譲・レビューを担います。
