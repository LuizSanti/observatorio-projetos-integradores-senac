from rest_framework import serializers
from .models import Projeto, Avaliacao


class AvaliacaoSerializer(serializers.ModelSerializer):
    professor_nome = serializers.SerializerMethodField()

    def get_professor_nome(self, obj):
        if obj.professor:
            full_name = obj.professor.get_full_name()
            return full_name if full_name.strip() else obj.professor.username
        return None

    class Meta:
        model = Avaliacao
        fields = [
            'id',
            'projeto',
            'nota_apresentacao',
            'nota_documentacao',
            'nota_inovacao',
            'nota_tecnica',
            'nota_final',
            'feedback',
            'professor_nome',
            'avaliado_em',
        ]
        read_only_fields = ["nota_final", "professor_nome", "avaliado_em"]
        extra_kwargs = {
            "projeto": {"write_only": True}
        }


class ProjetoSerializer(serializers.ModelSerializer):
    autor_nome = serializers.SerializerMethodField()
    avaliacao = AvaliacaoSerializer(read_only=True)

    def get_autor_nome(self, obj):
        full_name = obj.autor.get_full_name()
        return full_name if full_name.strip() else obj.autor.username

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