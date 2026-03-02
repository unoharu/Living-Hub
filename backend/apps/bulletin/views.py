"""
Bulletin board API views: article list, create, and detail.
"""
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Article
from .serializers import ArticleSerializer


class ArticleListView(ListAPIView):
    """GET /api/v1/bulletin/articles/"""
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Article.objects.select_related("author").order_by("-created_at")


class ArticleCreateView(CreateAPIView):
    """POST /api/v1/bulletin/articles/"""
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Article.objects.none()


class ArticleDetailView(RetrieveAPIView):
    """GET /api/v1/bulletin/articles/{id}/"""
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Article.objects.select_related("author")
