# 開発環境構築・トラブルシューティング（Antigravity, WSL, etc.）

**作成日**: 2026-02-26
**カテゴリ**: coding
**タグ**: #Antigravity, #WSL, #GoogleDrive, #pnpm, #WindowsTerminal, #Troubleshooting

## 概要

開発環境のセットアップおよびトラブルシューティングに関する有用な知見のまとめ。Antigravityのエラー対応、WSLでのGoogle Driveマウント手順、便利なショートカットキー、Gemini CLIの併用、Windows TerminalへのUbuntu追加、およびWSL環境へのpnpm導入に関する実践的な内容を含みます。

## 詳細

### 1. Antigravity & Gemini 3.1 Pro のエラー対応

- **事象**: `Gemini 3.1 Pro is not available on this version.` というエラーが発生。
- **原因**: Antigravityのバージョンが古く、新モデルに対応できていないため。
- **解決策**: 公式サイトから最新のインストーラーをダウンロードし、**上書きインストール**を行う（アンインストール不要）。

### 2. WSLでGoogle Driveをマウントする

- **解決したい課題**: Windows側のGドライブ（Google Drive）をWSLから直接操作したい。
- **手動マウント手順**:
  ```bash
  # マウント先のディレクトリ作成
  sudo mkdir -p /mnt/g
  # drvfsを使ってGドライブをマウント
  sudo mount -t drvfs G: /mnt/g
  ```
- **アクセスを楽にするための設定**:

  ```bash
  # ホームディレクトリにショートカットを作成
  ln -s "/mnt/g/マイドライブ/dev_workspace/wadai-sushi" ~/wadai-sushi

  # 再起動後も一発でマウントできるエイリアスを .bashrc に登録
  echo 'alias mount-g="sudo mount -t drvfs G: /mnt/g"' >> ~/.bashrc
  source ~/.bashrc
  ```

- **⚠️ 注意点**: Google Driveの仮想ドライブ上で `npm install` やビルドを行うと、非常に遅くなったり、権限エラーが発生したりする可能性がある。

### 3. Antigravityの画面切り替えショートカット

VS Codeベースのショートカットキーがそのまま使用可能。

- **別ウィンドウ（プロジェクト）への切り替え**: `Ctrl` + `R` （最近開いた項目から選択）
- **同じウィンドウ内のタブ切り替え**: `Ctrl` + `Tab` （または `Ctrl` + `PageUp` / `PageDown`）
- **分割したエディタグループの切り替え**: `Ctrl` + `1`, `2`, `3`...

### 4. Gemini CLI と Antigravity の併用について

- **同時使用**: 可能。独立したツールとして競合せずに動作する。
- **Google AI Proプランの適用**: APIキー（Googleアカウント）に紐付くため、Antigravity・CLIの両方でProプランの枠（トークン数制限などを緩和）を利用可能。
- **注意点**: 両方で同時に重い処理を走らせると、APIのレート制限に引っかかる可能性がある。

### 5. Windows Terminal に Ubuntu を追加・表示する

- **GUIでの設定**: 「設定」> プロファイル一覧から「Ubuntu」を選び、「このプロファイルを非表示にする」をオフにする。
- **`settings.json` での設定**: `profiles.list` に以下を追記。
  ```json
  {
    "name": "Ubuntu",
    "commandline": "wsl.exe -d Ubuntu",
    "startingDirectory": "\\\\wsl.localhost\\Ubuntu\\home\\ihcia",
    "hidden": false
  }
  ```

### 6. WSL環境への pnpm 導入

`npm install -g pnpm` で `command not found` になる場合は `$PATH` 設定の問題。以下のいずれかで導入推奨。

- **方法A: 公式スクリプトを使用（推奨）**
  ```bash
  curl -fsSL https://get.pnpm.io/install.sh | sh -
  source ~/.bashrc
  ```
- **方法B: Node.js内蔵のCorepackを使用**
  ```bash
  corepack enable pnpm
  ```
- **⚠️ Google Drive上でのpnpm使用に関する注意**:
  pnpmの「ハードリンク/シンボリックリンク」機能がGoogle Drive（`/mnt/g`）上で拒否されエラーになる可能性が高い。回避するには、プロジェクトを `~` 配下に移すか、`.npmrc` に `node-linker=hoisted` を追記してリンク機能を無効化する必要がある。

## 参考・関連情報

- Antigravityスキル: `record_knowledge`
