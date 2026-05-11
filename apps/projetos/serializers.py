from rest_framework import serializers
from .models import Projeto, Avaliacao


class AvaliacaoSerializer(serializers.ModelSerializer):
    professor_nome = serializers.CharField(
        source='professor.get_full_name',
        read_only=True
    )

    class Meta:
        model = Avaliacao
        fields = [
            'id',
            'nota_apresentacao',
            'nota_documentacao',
            'nota_inovacao',
            'nota_tecnica',
            'nota_final',
            'feedback',
            'professor_nome',
            'avaliado_em',
        ]


class ProjetoSerializer(serializers.ModelSerializer):
    autor_nome = serializers.CharField(
        source='autor.get_full_name',
        read_only=True
    )
    avaliacao = AvaliacaoSerializer(read_only=True)

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
            'avaliacao',
            'criado_em',
            'atualizado_em',
        ]
        read_only_fields = ['autor', 'criado_em', 'atualizado_em']