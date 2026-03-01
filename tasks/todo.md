# Phase 3: REST API 実装 — Checklist

## 実装ステップ

- [x] 1. `properties/filters.py` — PropertyFilter
- [x] 2. `properties/serializers.py` — PropertyList, PropertyDetail, Unit, Image
- [x] 3. `properties/views.py` + `properties/urls.py` — 物件・部屋API
- [x] 4. `accounts/serializers.py` + `accounts/views.py` + `accounts/urls.py` — 認証API
- [x] 5. `interactions/serializers.py` + `interactions/views.py` + `interactions/urls.py` — お気に入り・レビュー
- [x] 6. `inquiries/serializers.py` + `inquiries/views.py` + `inquiries/urls.py` — 内見予約
- [x] 7. `bulletin/serializers.py` + `bulletin/views.py` + `bulletin/urls.py` — 掲示板
- [x] 8. `tests/` — conftest, factories, テストケース
- [ ] 9. HANDOFF.md 更新・Phase 3 完了コミット・main マージ

## 検証

- [ ] `python manage.py check` パス
- [ ] `pytest tests/ -v` 全テスト通過
- [ ] `curl http://localhost:8000/api/v1/properties/` で JSON 返却確認
