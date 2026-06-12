# settings.json によるプラグイン共有

## 概要

`.claude/settings.json` に2つのキーを書いてリポジトリにコミットすることで、チームでプラグインを共有できる。

- `extraKnownMarketplaces` — マーケットプレイスの場所を登録する
- `enabledPlugins` — 有効化するプラグインを指定する

## 設定ファイルのスコープ

| ファイル | スコープ | 用途 |
|---------|---------|------|
| `~/.claude/settings.json` | ユーザー | 個人のプラグイン設定 |
| `.claude/settings.json` | プロジェクト | チーム共有。リポジトリにコミットする |
| `.claude/settings.local.json` | ローカル | コミットしないマシン個別の上書き |

チーム共有はプロジェクト設定 `.claude/settings.json` をコミットする。

## 基本の書き方

```json
{
  "extraKnownMarketplaces": {
    "my-marketplace": {
      "source": {
        "source": "directory",
        "path": "./"
      }
    }
  },
  "enabledPlugins": {
    "quality-review-plugin@my-marketplace": true
  }
}
```

`enabledPlugins` の形式は `"プラグイン名@マーケットプレイス名": true/false`。`false` で個別に無効化できる。

## source タイプ一覧

| タイプ | 用途 |
|--------|------|
| `directory` | ローカルパス（開発・ローカル共有用） |
| `github` | GitHub リポジトリ |
| `git` | 任意の Git URL |
| `hostPattern` | ホストの正規表現マッチ |

## ローカル (directory) 共有の制限と回避策

### 現状の問題

`directory` ソースに相対パス `"./"` を書いても、現状は正しく解決されない。  
`known_marketplaces.json` にパスが `"./"` のまま保存され（絶対パスに解決されない）、プラグインが見つからないエラーになる。

参考: https://github.com/anthropics/claude-code/issues （directory相対パスの既知バグ）

### 回避策（現在の採用方法）

1. `.claude/settings.json` に `extraKnownMarketplaces`（directory）と `enabledPlugins` をコミットしておく
2. リポジトリをクローンした各メンバーが **一度だけ** 手動で以下を実行する:

   ```
   /plugin marketplace add ./
   ```

3. 以降、マーケットプレイス登録済みの状態で `enabledPlugins` が自動的に有効化される

つまり「マーケットプレイスの自動登録」は手動の add が一手必要だが、「enabledPlugins による自動有効化」はコミットで効く。

## 完全自動化したい場合（git ホスティング）

手動 add も省きたいなら、git リポジトリにホストして `github` or `git` ソースを使う。相対パスの問題がなく、フォルダ信頼だけで登録〜インストールまで自動で促される。

```json
{
  "extraKnownMarketplaces": {
    "team-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  },
  "enabledPlugins": {
    "quality-review-plugin@team-tools": true
  }
}
```

## 構成の選択肢まとめ

| 構成 | 手順 | 特徴 |
|------|------|------|
| ローカル (directory) | settings.json コミット → 各自 `/plugin marketplace add ./` を一度実行 | **現在の採用方法**。git ホスティング不要 |
| git ホスティング (github/git) | settings.json コミットのみ | 手間ゼロ。リモートリポジトリが必要 |

## 個人だけオフにしたい場合

`.claude/settings.local.json`（コミットしない）に `false` を書くとマシン単位で上書きできる:

```json
{
  "enabledPlugins": {
    "quality-review-plugin@my-marketplace": false
  }
}
```
