from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjetoViewSet, AvaliacaoViewSet

router = DefaultRouter()
router.register(r'projetos', ProjetoViewSet, basename='projeto')
router.register(r"avaliacoes", AvaliacaoViewSet, basename="avaliacao")

urlpatterns = [
    path('', include(router.urls)),
]