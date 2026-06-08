# VMagic Mirror 外部制御の調査まとめ

**作成日**: 2026-04-12
**更新日**: 2026-04-13
**カテゴリ**: research
**タグ**: #vmagic-mirror #vrm #osc #vmcp #python #ai-tuber #midi

## 概要

VMagic MirrorをPythonから外部制御してVRMアバターの表情を変える方法を調査した。
Automation UDP APIはファイル読み込みのみ対応。VMCP（OSC）はリップシンクと競合するため不採用。
**最終的に `pygame.midi` + loopMIDI + WordToMotion の組み合わせで解決した。**
リップシンクと表情制御の両立が実現できる唯一の方法。

## 詳細

### 試したアプローチとその結果

#### ❌ Automation UDP API（ポート56131）
- VMagic MirrorはUDPポート56131でAutomation APIを待ち受ける
- **対応コマンドは `load_setting_file` のみ**（WordToMotionのトリガーは不可）
- 公式ドキュメント: https://malaybaku.github.io/VMagicMirror/en/docs/setting_files/

```json
{ "command": "load_setting_file", "args": { "index": 1, "load_character": true, "load_non_character": false } }
```

#### ❌ キーボードシミュレーション（`keyboard` ライブラリ）
- WordToMotionの「キーボード」モードを `keyboard.write()` でトリガーしようとした
- VMagic MirrorはUnityのInput Systemを使っているため、ソフトウェアキー入力を検知しない
- 管理者権限でも同様に効果なし

#### ❌ VMCP（OSC）でブレンドシェイプを直接制御
- 表情の変更自体は成功するが、**VMCP受信を有効にするとリップシンクが完全に止まる**
- VMagic Mirror側でVMCP受信をONにした時点でリップシンクが無効化される（送信の有無に関わらず）
- 単発送信・連続送信どちらを試みても解決しなかった

#### ❌ ctypes/winmm で直接MIDI送信
- `midiOutOpen` でハンドルを `c_uint`（32bit）で受け取るとハンドルが切り捨てられ `MMSYSERR_INVALHANDLE`（code=5）になる
- `c_void_p` に変えても `MMSYSERR_BADDEVICEID`（code=2）が発生
- ctypesでのMIDI制御は64bit環境で安定しないため非推奨

#### ✅ pygame.midi + loopMIDI + WordToMotion（解決策）
- **リップシンクと表情制御が共存できる唯一の方法**
- WordToMotionはブレンドシェイプレイヤーが別のためリップシンクに干渉しない
- loopMIDIのポートはPCの再起動後も `pygame.midi` から見えた（ctypesでは見えなかったが pygame では問題なし）

```python
import pygame.midi
import time

pygame.midi.init()

# loopMIDI Portを自動検出
port_id = None
for i in range(pygame.midi.get_count()):
    info = pygame.midi.get_device_info(i)
    name = info[1].decode()
    is_output = info[3]
    if is_output and "loopMIDI" in name:
        port_id = i
        break

output = pygame.midi.Output(port_id)

# ノートON → 少し待つ → ノートOFF でWordToMotionをトリガー
note = 61  # joy
output.note_on(note, velocity=100)
time.sleep(0.1)
output.note_off(note)
```

### VMagic Mirror WordToMotion MIDI設定手順
1. VMagic Mirror → Word To Motion タブ → デバイスを「MIDI」に変更
2. 各ワードにMIDIノート番号を割り当て（下記参照）
3. loopMIDIを起動しておく

### ワードとMIDIノート番号の対応表
| ワード | ノート番号 |
|---|---|
| reset | 60 |
| joy | 61 |
| angry | 62 |
| sorrow | 63 |
| fun | 64 |
| wave | 65 |
| good | 66 |
| nodding | 67 |
| shaking | 68 |
| clap | 69 |

### MIDI出力ポート構成（check_midi.py で確認）
| ポート番号 | デバイス名 | 用途 |
|---|---|---|
| 0 | Microsoft GS Wavetable Synth | 不使用 |
| 1 | loopMIDI Port | **Pythonから送信するポート** |
| 2 | VMagicMirror | VMagic Mirrorが出力するポート（送信先ではない） |

### WSL注意点
- WSLからWindows上のVMagic Mirrorへは `127.0.0.1` では届かない
- **Windowsのconda環境からスクリプトを実行するのが確実**

## 参考・関連情報

- [VMagicMirror公式ドキュメント](https://malaybaku.github.io/VMagicMirror/en/)
- [Setting Files | VMagicMirror](https://malaybaku.github.io/VMagicMirror/en/docs/setting_files/)
- プロジェクト: `ai-tuber-mashimon` / `src/vrm_controller.py`
