# Reading List

読書リストの進捗を管理するスマホ用 Web アプリです。オフラインでも動きます。

## ファイル
| ファイル | 役割 |
|---|---|
| index.html | アプリ本体（List / Edit の2画面） |
| sw.js | オフライン用キャッシュ |
| manifest.json | ホーム画面に追加したときの名前とアイコン |
| icon.svg / icon-180.png / icon-192.png / icon-512.png | アイコン |

## GitHub Pages への公開
1. GitHub で新しいリポジトリを作る（例：`reading-list`、Public）
2. このフォルダのファイルをすべてリポジトリの一番上にアップロード
3. Settings → Pages → Source を「Deploy from a branch」、Branch を `main` / `(root)` にして Save
4. 数分後に `https://<アカウント名>.github.io/reading-list/` で開けます
5. スマホで開き「ホーム画面に追加」すると、アプリとして使えます

## 計算ルール
- Days = Due − Start（読了前）
- Days = Finished − Start（Finished を入力した後）

## データ
- データはスマホのブラウザ内（localStorage）に保存されます
- Backup → Export で .json ファイルに書き出し、Import で読み込み（置き換え）

## 更新するとき
index.html を上書きアップロードすれば、スマホは次に開いたとき（またはアプリに戻ったとき）に自動で新しい版になります。
アイコンなど index.html 以外を変えたときは、`sw.js` の `CACHE` の番号も上げてアップロードしてください。
