# Living Hub — 3D 内見ができる不動産物件検索サービス

> React + Django REST Framework + Three.js で作る、3D ウォークスルー内見付き賃貸物件検索プラットフォーム。

<img width="2940" height="1602" alt="image" src="https://github.com/user-attachments/assets/a24d7111-fd16-40b7-a3ad-32a50a375e61" />

---

## 概要

**Living Hub** は、物件の 3D ウォークスルー内見・多言語対応・コミュニティ掲示板を備えた賃貸物件検索プラットフォームです。

共通の趣味やライフスタイルに合わせた物件情報を提供し、同じ興味を持つ人々が集まるコミュニティ形成をサポートします。

---

## 主な機能

| 機能 | 説明 |
|------|------|
| 物件検索 | エリア・賃料・間取り・駅徒歩分数などで絞り込み |
| 3D 内見 | WebGL（Three.js）によるルームウォークスルー |
| お気に入り | 気になる物件をワンクリックで保存（楽観的更新） |
| 内見予約 | 空室ユニットに対して希望日時を送信 |
| 掲示板 | ユーザー間の情報共有・投稿機能 |
| 多言語対応 | 日本語 / English / 简体中文 を切り替え |
| JWT 認証 | アクセストークン自動リフレッシュ付き |

---

## 技術スタック

### Frontend

| カテゴリ | 技術 |
|---------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Routing | React Router 7 |
| State | Zustand（永続化）|
| Data Fetching | TanStack Query v5 |
| 3D | Three.js / React Three Fiber / Drei |
| Styling | Tailwind CSS v4 |
| i18n | i18next |
| HTTP | Axios（JWT インターセプター付き）|

### Backend

| カテゴリ | 技術 |
|---------|------|
| Framework | Django 5.2 + Django REST Framework 3.16 |
| 認証 | SimpleJWT（Access 60 分 / Refresh 7 日）|
| フィルタ | django-filter |
| 画像処理 | Pillow |
| テスト | pytest + factory-boy |

---

## ディレクトリ構成

```
Living-Hub/
├── backend/                  # Django REST API
│   ├── apps/
│   │   ├── accounts/         # ユーザー認証・プロフィール
│   │   ├── properties/       # 物件・ユニット管理
│   │   ├── interactions/     # お気に入り
│   │   ├── inquiries/        # 内見予約
│   │   └── bulletin/         # 掲示板
│   ├── config/               # Django 設定・URL ルーティング
│   └── tests/                # pytest テスト群
└── frontend/                 # React SPA
    └── src/
        ├── api/              # API クライアント（axios）
        ├── components/       # UI コンポーネント
        │   ├── layout/       # Header / Footer / Layout
        │   ├── property/     # 物件カード・フィルターバー・予約モーダル
        │   ├── three/        # 3D ビューア
        │   └── ui/           # 共通 UI
        ├── hooks/            # カスタムフック
        ├── pages/            # ルートページ
        ├── stores/           # Zustand ストア
        ├── types/            # TypeScript 型定義
        └── i18n/             # 翻訳ファイル（ja / en / zh）
```

---

## API エンドポイント

```
POST   /api/v1/accounts/register/          ユーザー登録
POST   /api/v1/accounts/login/             ログイン（JWT 発行）
POST   /api/v1/accounts/token/refresh/     トークンリフレッシュ
GET    /api/v1/accounts/me/               自分のプロフィール取得

GET    /api/v1/properties/                 物件一覧（フィルタ・ページネーション）
GET    /api/v1/properties/:id/             物件詳細

GET    /api/v1/interactions/favorites/     お気に入り一覧
POST   /api/v1/interactions/favorites/toggle/  お気に入り切り替え

POST   /api/v1/inquiries/                  内見予約作成
GET    /api/v1/inquiries/mine/             自分の予約一覧

GET    /api/v1/bulletin/articles/          掲示板記事一覧
POST   /api/v1/bulletin/articles/create/   記事投稿
```

---

## ローカル環境でのセットアップ

### 必要な環境

- Python 3.11 以上
- Node.js 20 以上

### 1. リポジトリをクローン

```bash
git clone https://github.com/unoharu/Living-Hub.git
cd Living-Hub
```

### 2. バックエンドのセットアップ

```bash
cd backend

# 仮想環境を作成・有効化
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存パッケージをインストール
pip install -r requirements.txt

# 環境変数を設定
cp ../.env.example .env
# .env を開いて DJANGO_SECRET_KEY に任意の文字列を設定

# データベースのマイグレーション
python manage.py migrate

# 初期データを投入（任意）
python manage.py loaddata fixtures/initial_data.json

# 開発サーバー起動
python manage.py runserver
```

### 3. フロントエンドのセットアップ

```bash
cd frontend

# 依存パッケージをインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

### 4. テストの実行

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

---

## 環境変数

`.env.example` をコピーして `backend/.env` を作成してください。

| 変数名 | 説明 | 例 |
|--------|------|----|
| `DJANGO_SECRET_KEY` | Django シークレットキー（必須） | `django-insecure-xxxxx` |
| `DJANGO_SETTINGS_MODULE` | 使用する設定モジュール | `config.settings.development` |
| `ALLOWED_HOSTS` | 許可するホスト（本番用） | `example.com` |
| `CORS_ALLOWED_ORIGINS` | CORS 許可オリジン（本番用） | `https://example.com` |

---

## 受賞歴

- **金賞** — HAL 東京 進級制作展（HAL EVENT WEEK）2024/03/08
- **最多得票賞** — HAL 東京 進級制作展（HAL EVENT WEEK）2024/03/08

---

## ライセンス

MIT License
