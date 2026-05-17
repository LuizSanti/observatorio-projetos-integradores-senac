from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
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

@csrf_exempt
def create_admin(request):
    if request.method == 'POST':
        secret = request.GET.get('secret')
        if secret != 'senac2026setup':
            return JsonResponse({'error': 'Não autorizado'}, status=403)
        
        from apps.accounts.models import CustomUser
        data = json.loads(request.body)
        
        if CustomUser.objects.filter(username=data['username']).exists():
            return JsonResponse({'error': 'Usuário já existe'})
        
        user = CustomUser.objects.create_superuser(
            username=data['username'],
            password=data['password'],
            perfil='admin'
        )
        return JsonResponse({'success': f'Usuário {user.username} criado'})
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)