"""
Inquiry API views: viewing request creation and personal listing.
"""
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated

from .models import ViewingRequest
from .serializers import ViewingRequestSerializer


class ViewingRequestCreateView(CreateAPIView):
    """POST /api/v1/inquiries/"""
    serializer_class = ViewingRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ViewingRequest.objects.none()


class MyViewingRequestListView(ListAPIView):
    """GET /api/v1/inquiries/mine/

    Returns the authenticated user's own viewing requests.
    """
    serializer_class = ViewingRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            ViewingRequest.objects.filter(user=self.request.user)
            .select_related("unit__property")
            .order_by("-created_at")
        )
