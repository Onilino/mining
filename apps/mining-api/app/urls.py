from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, CompanyViewSet, MineralViewSet, DocumentViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'minerals', MineralViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
