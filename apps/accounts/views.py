from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from apps.accounts.models import CustomUser
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from apps.projetos.models import Projeto
from apps.projetos.serializers import ProjetoSerializer
from .serializers import Userializer
import json

# --- Funções Originais ---

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'accounts/login.html', {'form': {'errors': True}})
    return render(request, 'accounts/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def dashboard_view(request):
    return render(request, 'accounts/dashboard.html')

# --- Função de Setup (Temporária) ---

@csrf_exempt
def setup_view(request):
    if request.GET.get('secret') != 'senac2026setup':
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if CustomUser.objects.filter(username=username).exists():
                return JsonResponse({'message': 'Usuário já existe!'}, status=400)
            
            CustomUser.objects.create_superuser(
                username=username,
                password=password,
                email='admin@teste.com',
                perfil='admin'
            )
            return JsonResponse({'message': 'Admin criado com sucesso!'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Use POST'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'perfil': user.perfil,
    })

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.autor == request.user


class IsOwnerOrProfessorOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.perfil in ['professor', 'admin']:
            return True
        return obj.autor == request.user


class ProjetoViewSet(viewsets.ModelViewSet):
    serializer_class = ProjetoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrProfessorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.perfil in ['professor', 'admin']:
            return Projeto.objects.all().order_by('-criado_em')
        return Projeto.objects.filter(autor=self.request.user).order_by('-criado_em')

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)

class IsAdmin(permissions.BasePermission):
    """Só admin acessa o CRUD de usuários."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.perfil == "admin"


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        # Permite filtrar por perfil via query param: /api/users/?perfil=aluno
        queryset = CustomUser.objects.all().order_by("first_name", "last_name")
        perfil = self.request.query_params.get("perfil")
        if perfil:
            queryset = queryset.filter(perfil=perfil)
        return queryset