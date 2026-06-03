from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from apps.accounts.models import CustomUser
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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