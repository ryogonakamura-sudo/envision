# enVision

画像から英単語を覚える、画像連想型の単語学習アプリ。  
TOEIC・英検・日常英会話などレベルを問わず使える、シンプルなWebアプリ／PWA。

## 特徴

- 🖼 **画像連想クイズ**: Unsplashの写真を見ながら英単語を思い出す
- 🔊 **発音TTS**: 高品質ボイス選択・速度調整・自動再生
- ⭕️/❌ **習熟度トラッキング**: 周回ごとに苦手を可視化、間違いだけ再学習
- 📋 **単語管理**: アプリ内で追加・編集・削除、CSV一括インポート対応
- 📤 **バックアップ**: JSONエクスポート/インポートで端末間移動OK
- 📱 **PWA対応**: ホーム画面に追加してネイティブアプリ感覚で使える
- 💾 **完全ローカル**: データはブラウザのlocalStorageのみ。サーバ不要

## 使い方

1. アプリを開く
2. 右上 ⚙️ から **Unsplash Access Key** を登録（無料、3分: [unsplash.com/developers](https://unsplash.com/developers)）
3. ホームの **「+ 最初の単語を追加」** か **「📥 CSVから一括インポート」** で単語を入れる
4. **「学習を始める」** で画像連想クイズ開始

### CSVフォーマット

ヘッダ行に以下の列が必須:
- 英単語: `English` / `単語` / `word` のいずれか
- 日本語訳: `日本語訳` / `日本語` / `Japanese` のいずれか
- メモ: `メモ` / `note` （任意）

例:
```csv
English,日本語訳,メモ
serendipity,思いがけない幸運,
plagiarism,盗作,
```

## デプロイ（GitHub Pages）

1. GitHubで新しいリポジトリを作成（例: `envision`）
2. このフォルダをそのリポジトリにpush
   ```bash
   cd envision
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ryogonakamura-sudo/envision.git
   git push -u origin main
   ```
3. リポジトリの **Settings** → **Pages** → **Source: Deploy from a branch** → `main` / `/ (root)` → **Save**
4. 数分で `https://ryogonakamura-sudo.github.io/envision/` で公開される

### 独自ドメインを使う場合
**Settings → Pages → Custom domain** にドメインを入力し、DNSの`CNAME`レコードで `ryogonakamura-sudo.github.io` を指定。HTTPSは自動。

## ローカル開発

```bash
# 任意の静的サーバでOK。Node推奨:
node serve.mjs           # → http://127.0.0.1:8765/

# Pythonでも:
python3 -m http.server 8765
```

## 個人データの扱い

- `vocab-data.js` は**公開デフォルトで空**（誰でも自分の単語から始められる）
- ローカルで自分の単語を事前ロードしたい場合は `vocab-data.local.js` を作成（gitignored）:
  ```js
  window.VOCAB_DATA = [
    { id: 'w0001', english: 'serendipity', japanese: '思いがけない幸運', note: '' },
    // ...
  ];
  ```
- `build-data.py` は Notion CSV エクスポート → `vocab-data.local.js` 生成スクリプト（個人用）

## 技術構成

- 純粋なHTML / CSS / JavaScript（フレームワーク不使用）
- データはlocalStorageに保存
- 画像: [Unsplash API](https://unsplash.com/developers)
- 発音: Web Speech API（ブラウザ内蔵TTS）
- PWA: Service Worker + Manifest

## ライセンス

© 2026. All rights reserved.
