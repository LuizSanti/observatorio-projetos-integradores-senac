from django.contrib import admin
from .models import Projeto, Avaliacao

@admin.register(Projeto)
class ProjetoAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'autor', 'turma', 'status', 'criado_em']
    list_filter = ['status', 'turma']
    search_fields = ['titulo', 'autor__username']
    list_editable = ['status']

@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ['projeto', 'professor', 'nota_final', 'avaliado_em']