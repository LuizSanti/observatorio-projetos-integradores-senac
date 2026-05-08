from rest_framework import serializers
from .models import Projeto


class ProjetoSerializer(serializers.ModelSerializer):
    autor_nome = serializers.CharField(
        source='autor.get_full_name',
        read_only=True
    )

    class Meta:
        model = Projeto
        fields = [
            'id',
            'titulo',
            'descricao',
            'turma',
            'arquivo',
            'link',
            'status',
            'autor',
            'autor_nome',
            'criado_em',
            'atualizado_em',
        ]
        read_only_fields = ['autor', 'criado_em', 'atualizado_em']