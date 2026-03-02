"""
Account API views.

RegisterView  — public, creates a new user and returns JWT tokens
MeView        — requires authentication, reads/updates own profile
JWT token endpoints are provided by simplejwt and wired in urls.py.
"""
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import MeSerializer, RegisterSerializer


class RegisterView(APIView):
    """POST /api/v1/accounts/register/

    Creates a new user and returns access + refresh tokens so the client
    can authenticate immediately without a separate login step.
    """
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": MeSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class MeView(RetrieveUpdateAPIView):
    """GET / PATCH /api/v1/accounts/me/"""
    serializer_class = MeSerializer
    permission_classes = [IsAuthenticated]
    # PATCH (partial update) is allowed; PUT (full update) is not needed.
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return self.request.user
