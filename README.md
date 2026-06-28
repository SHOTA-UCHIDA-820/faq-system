# 社内FAQシステム

設計書（設計書_社内FAQシステム.docx v1.1）に基づく実装です。`client`（React／Vite）と`server`（Node.js／Express）の2プロジェクトで構成されています。

## 構成

```
faq-system/
  client/   … フロントエンド（React + Vite、SPA、画面は1枚のみ）
  server/   … バックエンド（Express、読み取り専用のAPIを3つ提供）
    data/
      faq.json         … FAQ本体（総務部が直接編集する運用データ）
      categories.json  … カテゴリ一覧（表示順を含む）
      config.json      … 問い合わせ先メールアドレス等の設定
```

## 前提環境

- Node.js 18以上（推奈: 20以上）
- npm

※ このプロジェクトは社内ネットワーク限定・認証なしを前提とした設計です（要件定義書の方針通り）。

## セットアップ・起動方法

### 1. バックエンド（server）

```bash
cd server
npm install
npm start
```

`http://localhost:3001` でAPIサーバーが起動します。

提供するAPI（すべてGET・読み取り専用）：

- `GET /api/faqs` … FAQ一覧（`?category=カテゴリ名` で絞り込み可能）
- `GET /api/categories` … カテゴリ一覧
- `GET /api/config` … 問い合わせ先などの設定

### 2. フロントエンド（client）

別のターミナルで：

```bash
cd client
npm install
npm run dev
```

`http://localhost:5173` をブラウザで開くと画面が表示されます。

APIの接続先は`client/.env.example`を参考に`client/.env`を作成し、`VITE_API_BASE_URL`で変更できます（デフォルトは`http://localhost:3001`）。

### 3. 本番ビルド（client）

```bash
cd client
npm run build
```

`client/dist`に静的ファイルが生成されます。社内サーバーに配置してください。

## FAQデータの更新について

`server/data/faq.json`の編集方法は、別途お渡しした「FAQデータ更新手順書」をご参照ください。サーバーは起動中でもファイルを再読み込みするため、再起動なしで編集内容が反映されます（保存後、ブラウザの再読み込みが必要です）。

## 補足

このプロジェクトの雛形は、ネットワーク制限のある作業環境で作成したため、`npm install`の動作確認ができていません。お手元の環境で`npm install`を実行した際にエラーが出た場合はお知らせください。
