from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
    # Verificação de segurança
    if request.GET.get('secret') != 'senac2026setup':
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({'message': 'Usuário já existe!'}, status=400)
            
            # Cria o superusuário
            User.objects.create_superuser(username=username, password=password, email='admin@teste.com')
            return JsonResponse({'message': 'Admin criado com sucesso!'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Use POST'}, status=405)