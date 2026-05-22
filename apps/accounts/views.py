from django.contrib.auth.models import User # Importante adicionar este import!
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def setup_view(request):
    # Verificação simples de segurança para ninguém mais usar
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