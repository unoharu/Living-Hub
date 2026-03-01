# Living Hub — Phase Handoff Document

3Dで内見できる物件検索サイトのリファクタリング引き継ぎ書。
セッションをまたいでも状態を正確に把握できるようにする。

---

## プロジェクト概要

| 項目 | 内容 |
|------|------|
| 目的 | 旧Djangoモノリスを DRF REST API + React SPA に刷新 |
| DB | SQLite（ローカル専用・本番品質設計） |
| 3Dモデル | `3DRoom/public/hewroom.glb` → 1物件のみ対応 |
| Admin | Django Admin `/admin/` のみ（サーバーレンダリング） |
| SPA | 上記以外はすべて React が担当 |

---

## ディレクトリ構造

```
living-hub/
├── HANDOFF.md
├── .env.example
├── .gitignore
├── README.md
├── 3DRoom/                      # 3Dルームデータ（hewroom.glb）
│
├── backend/
│   ├── manage.py
│   ├── pytest.ini
│   ├── .env                     # .gitignore 対象
│   ├── requirements/
│   │   ├── base.txt
│   │   ├── development.txt
│   │   └── production.txt
│   ├── config/
│   │   ├── urls.py              # /admin/ + /api/v1/ + SPA fallback
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   │   └── settings/
│   │       ├── base.py          # SECRET_KEY は require_env() で強制
│   │       ├── development.py   # SQLite, DEBUG=True, CORS 許可
│   │       └── production.py    # WhiteNoise, DEBUG=False
│   └── apps/
│       ├── accounts/            # カスタムUser（email認証）
│       ├── properties/          # 旧stores: 物件・部屋管理
│       ├── interactions/        # 旧like: お気に入り・レビュー
│       ├── inquiries/           # 内見予約（旧contractsを置き換え）
│       └── bulletin/            # 旧dashboard: 居住者掲示板
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── types/               # API レスポンス型定義
        ├── api/                 # axios クライアント + 各リソース
        ├── hooks/               # TanStack Query カスタムフック
        ├── stores/              # Zustand グローバル状態
        ├── i18n/                # react-i18next (ja/en/zh)
        ├── components/
        │   ├── ui/
        │   ├── layout/
        │   ├── property/
        │   └── three/           # 3D コンポーネント
        └── pages/
```

---

## 技術スタック

### バックエンド
| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| Django | 5.2.1 (LTS) | Webフレームワーク |
| djangorestframework | 3.16.1 | REST API |
| djangorestframework-simplejwt | 5.5.1 | JWT認証 |
| django-cors-headers | 4.7.0 | CORS |
| django-filter | 25.1 | フィルタリング |
| Pillow | 11.2.1 | 画像処理 |
| python-dotenv | 1.1.0 | .env読み込み |
| pytest-django | 4.10.0 | テスト |
| factory-boy | 3.3.3 | テストデータ生成 |

### フロントエンド
| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| React | 19 | UIライブラリ |
| TypeScript | 5 | 型付き |
| Vite | 6 | ビルドツール |
| React Router | v7 | SPA ルーティング |
| TanStack Query | v5 | サーバー状態管理 |
| Zustand | v5 | クライアント状態管理 |
| TailwindCSS | v4 | スタイリング（CSS-based config）|
| axios | latest | HTTP クライアント |
| react-i18next | latest | 多言語 (ja/en/zh) |
| Three.js | 0.177+ | 3D |
| @react-three/fiber | v9 | Three.js React bindings |
| @react-three/drei | v10 | Three.js ヘルパー |

---

## DB 設計

### ER 概要

```
City (都道府県) → Ward (区市町村)
PropertyType → Property (建物) → PropertyImage (写真)
Property → Unit (部屋) → UnitImage (写真)
Unit → UnitAmenity ← Amenity ← AmenityCategory
User → Favorite (物件単位)
User → Review (物件単位)
User → ViewingRequest (部屋単位の内見予約)
User → Article (掲示板)
```

### 重要設計判断

| 判断 | 理由 |
|------|------|
| `stores` → `properties` | 意味が明確 |
| `like` → `interactions` | お気に入り+レビューを包含 |
| `dashboard` → `bulletin` | 掲示板機能であることを明示 |
| `contracts` → `inquiries` | Webで完結できるのは内見予約まで。実際の契約は対面 |
| `Bathroom/Kitchen/...` 4テーブル → `Amenity` M2M | 設備追加時にマイグレーション不要 |
| `purchase_status: bool` → `Unit.availability: TextChoices` | 「予約中」状態を表現 |
| `Unit.has_3d_model: bool` | 3D対応の1物件のみTrue。フロントで制御 |
| `User.contract_property` 削除 | `ViewingRequest` で代替。複数履歴対応 |

### Key Models (Phase 2 実装予定)

```python
# apps/properties/models.py
AmenityCategory → Amenity
City → Ward → PropertyType
Property (建物) → PropertyImage
Unit (部屋, has_3d_model=BooleanField) → UnitImage → UnitAmenity

# apps/interactions/models.py
Favorite (user + property, unique_together)
Review (user + property, rating 1-5)

# apps/inquiries/models.py
ViewingRequest (user + unit, Status: pending/confirmed/completed/cancelled)

# apps/bulletin/models.py
Article (user + title + content)
```

---

## API エンドポイント (Phase 3 実装済み)

```
POST  /api/v1/accounts/register/
POST  /api/v1/accounts/login/
POST  /api/v1/accounts/token/refresh/
GET   /api/v1/accounts/me/
PATCH /api/v1/accounts/me/

GET   /api/v1/properties/                   # フィルタ・ページネーション
GET   /api/v1/properties/{id}/
GET   /api/v1/properties/{id}/units/
GET   /api/v1/properties/units/{id}/

GET   /api/v1/interactions/favorites/       # 要認証
POST  /api/v1/interactions/favorites/       # toggle
POST  /api/v1/interactions/reviews/

POST  /api/v1/inquiries/                    # 要認証
GET   /api/v1/inquiries/mine/

GET   /api/v1/bulletin/articles/
POST  /api/v1/bulletin/articles/            # 要認証
GET   /api/v1/bulletin/articles/{id}/
```

---

## 3D モデル対応

- `3DRoom/public/hewroom.glb` が唯一の3Dモデル
- DB上で `Unit.has_3d_model = True` の部屋のみ3Dボタンを表示
- その他の部屋は `has_3d_model = False`（デフォルト）→ 3Dボタン非表示
- フロントエンド: `if (!unit.has_3d_model) return null;`
- `city.glb`（38MB 未最適化）は使用しない

---

## 環境セットアップ

```bash
# バックエンド
cd backend
python3.13 -m venv venv          # Python 3.13 必須（Django 5.2 は 3.10+ 要求）
source venv/bin/activate
pip install -r requirements/development.txt
cp ../.env.example .env           # DJANGO_SECRET_KEY を設定
python manage.py migrate
python manage.py runserver        # :8000

# フロントエンド
cd frontend
npm install
npm run dev                       # :5173
```

---

## 命名規約

| 対象 | 規約 | 例 |
|------|------|-----|
| Python ファイル | snake_case | `property_filters.py` |
| Django モデル | PascalCase | `PropertyImage` |
| DRF シリアライザ | `{Model}Serializer` | `PropertySerializer` |
| DRF ビュー | `{Resource}{Action}View` | `PropertyListView` |
| TSX コンポーネント | PascalCase | `PropertyCard.tsx` |
| その他 TS | camelCase | `useProperties.ts` |
| API エンドポイント | kebab-case・複数形 | `/api/v1/properties/` |
| 環境変数 | SCREAMING_SNAKE_CASE | `DJANGO_SECRET_KEY` |
| Vite 環境変数 | `VITE_` prefix | `VITE_API_BASE_URL` |

---

## フェーズ進捗

- [x] **Phase 1**: ディレクトリ構造・設定分割・環境整備
- [x] **Phase 2**: バックエンドモデル実装・マイグレーション・Admin登録
- [x] **Phase 3**: REST API 実装（シリアライザ・ビュー・URL・フィルタ・テスト）
- [x] **Phase 4**: フロントエンド実装（型定義・API連携・ページ・認証）
- [x] **Phase 5**: 3Dビューア実装・統合検証・本番ビルド確認（2026-03-01）

---

## Phase 2 チェックリスト ✅ 完了

- [x] `apps/properties/models.py` — AmenityCategory, Amenity, City, Ward, PropertyType, Property, PropertyImage, Unit, UnitAmenity, UnitImage
- [x] `apps/interactions/models.py` — Favorite, Review
- [x] `apps/inquiries/models.py` — ViewingRequest
- [x] `apps/bulletin/models.py` — Article
- [x] 全アプリの `admin.py` 実装
- [x] `python manage.py makemigrations`
- [x] `python manage.py migrate`
- [x] 初期フィクスチャ作成（Ward, PropertyType, AmenityCategory x4, Amenity x14, 1 Property + 1 Unit with has_3d_model=True）
- [x] `python manage.py check` でエラーなし確認

## Phase 3 チェックリスト ✅ 完了

### accounts
- [x] `serializers.py`: RegisterSerializer（パスワード確認・バリデーション）, MeSerializer
- [x] `views.py`: RegisterView（JWT即時発行）, MeView（GET/PATCH）
- [x] `urls.py`: register, login(simplejwt), token/refresh, me

### properties
- [x] `filters.py`: PropertyFilter（ward, property_type, layout, min/max_rent, walk_minute, amenity, pet_allowed, parking, availability）
- [x] `serializers.py`: PropertyListSerializer（is_favorite付き）, PropertyDetailSerializer（画像+ユニットネスト）, UnitSerializer（設備カテゴリ別グループ）
- [x] `views.py`: PropertyListView, PropertyDetailView, PropertyUnitListView, UnitDetailView
- [x] `urls.py`: エンドポイント登録

### interactions
- [x] `serializers.py`: FavoriteSerializer, FavoriteToggleSerializer, ReviewSerializer（重複チェック）
- [x] `views.py`: FavoriteListView, FavoriteToggleView（add/remove toggle）, ReviewCreateView
- [x] `urls.py`: favorites/, favorites/toggle/, reviews/

### inquiries
- [x] `serializers.py`: ViewingRequestSerializer（status_display付き）
- [x] `views.py`: ViewingRequestCreateView, MyViewingRequestListView
- [x] `urls.py`: "", mine/

### bulletin
- [x] `serializers.py`: ArticleSerializer（author_name付き）
- [x] `views.py`: ArticleListView, ArticleDetailView, ArticleCreateView
- [x] `urls.py`: articles/, articles/create/, articles/{id}/

### テスト（28テスト全通過）
- [x] `tests/conftest.py`: api_client, user, other_user, auth_client, other_auth_client
- [x] `tests/factories.py`: 全モデルのfactory_boy factory
- [x] `tests/test_accounts/test_views.py`: register, login, me の正常/異常系（9テスト）
- [x] `tests/test_properties/test_views.py`: 一覧・詳細・フィルタ・is_favorite（8テスト）
- [x] `tests/test_interactions/test_views.py`: favorite toggle, review create（11テスト）

## Phase 4 チェックリスト ✅ 完了 (2026-03-01)

### 型定義
- [x] `src/types/api.ts`: Property, PropertyDetail, Unit, User, AuthTokens, PaginatedResponse 等

### API クライアント
- [x] `src/api/client.ts`: axios + JWT interceptor（401 時 token refresh → retry）
- [x] `src/api/auth.ts`: login, register, refreshToken, fetchMe, updateMe
- [x] `src/api/properties.ts`: fetchProperties, fetchPropertyDetail, toggleFavorite, fetchFavorites

### 状態管理
- [x] `src/stores/authStore.ts`: Zustand v5 + localStorage persist

### カスタムフック
- [x] `src/hooks/useAuth.ts`: useLogin, useRegister, useMe
- [x] `src/hooks/useProperties.ts`: useProperties, usePropertyDetail, useFavorites, useToggleFavorite（楽観的更新）

### ルーティング
- [x] `src/App.tsx`: createBrowserRouter + PrivateRoute + lazy loading

### コンポーネント
- [x] `src/components/layout/Header.tsx`: ナビ + 認証状態切り替え
- [x] `src/components/layout/Layout.tsx`: Header + Outlet
- [x] `src/components/ui/Spinner.tsx`, `Button.tsx`, `ErrorMessage.tsx`
- [x] `src/components/property/PropertyCard.tsx`: お気に入りトグル付き
- [x] `src/components/property/PropertyFilterBar.tsx`: エリア・賃料・間取りフィルタ（URL クエリ同期）

### ページ
- [x] `src/pages/PropertyListPage.tsx`: 一覧 + フィルタ + ページネーション
- [x] `src/pages/PropertyDetailPage.tsx`: 詳細 + 画像ギャラリー + 部屋一覧
- [x] `src/pages/LoginPage.tsx`, `RegisterPage.tsx`
- [x] `src/pages/MyPage.tsx`: お気に入り一覧 + プロフィール
- [x] `src/pages/NotFoundPage.tsx`

## Phase 5 チェックリスト ✅ 完了 (2026-03-01)

### 3D ビューア
- [x] `frontend/public/hewroom.glb`: `3DRoom/public/hewroom.glb` をコピー（66MB）
- [x] `src/components/three/RoomViewer.tsx`: Canvas + Hewroom モデル + CameraController（lerp/slerp 補間）
- [x] `src/components/three/RoomModal.tsx`: フルスクリーンオーバーレイ + ESC キー閉じる + カメラ位置切り替えボタン
- [x] `src/pages/PropertyDetailPage.tsx`: 「3Dで内見」ボタンを有効化・RoomModal 組み込み

### 統合検証
- [x] `npm run build` でビルド成功（TypeScript 型エラーなし）
- [ ] バックエンド + フロントエンド E2E 動作確認（手動検証）

### 実装メモ
- Bloom エフェクト（`@react-three/postprocessing`）は未インストールのため省略
- カメラプリセット: リビング / キッチン / バスルーム / 寝室 / 上面（5箇所）
- `isOpen=false` でコンポーネントをアンマウント → WebGL コンテキストを解放
- `useGLTF.preload('/hewroom.glb')` でモジュールインポート時にプリロード開始

---

## 既知の注意点

1. **TailwindCSS v4**: `tailwind.config.ts` は不要。CSSでの設定（`@import "tailwindcss"` のみ）
2. **React Router v7**: `createBrowserRouter` + `RouterProvider` API（v6 の `<BrowserRouter>` は非推奨）
3. **TanStack Query v5**: `useQuery` の `onSuccess` / `onError` コールバックが削除された
4. **Zustand v5**: `create` の型付け方法が変更（`create<State>()(...)` パターン）
5. **Python 3.13**: システムPython（3.9.6）は使用不可。`/opt/homebrew/bin/python3.13` を使用
6. **venv場所**: `backend/venv/`（gitignore済み）
