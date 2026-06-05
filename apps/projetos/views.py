from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied
from .models import Projeto, Avaliacao
from apps.projetos.serializers import ProjetoSerializer, AvaliacaoSerializer


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.autor == request.user


class ProjetoViewSet(viewsets.ModelViewSet):
    queryset = Projeto.objects.all()
    serializer_class = ProjetoSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user = self.request.user

        if user.perfil == 'admin':
            return Projeto.objects.all()

        elif user.perfil == 'professor':
            return Projeto.objects.all()

        elif user.perfil == 'aluno':
            return Projeto.objects.filter(autor=user)

        return Projeto.objects.none()

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)

class IsProfessorOrAdmin(permissions.BasePermission):
    """Só professor e admin podem criar/editar avaliações."""
    def has_permission(self, request, view):
        return request.user.perfil in ["professor", "admin"]

class AvaliacaoViewSet(viewsets.ModelViewSet):
    serializer_class = AvaliacaoSerializer
    permission_classes = [permissions.IsAuthenticated, IsProfessorOrAdmin]

    def get_queryset(self):
        return Avaliacao.objects.select_related("projeto", "professor").all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        projeto_id = request.data.get("projeto")

        try:
            projeto = Projeto.objects.get(pk=projeto_id)
        except Projeto.DoesNotExist:
            raise PermissionDenied("Projeto não encontrado.")

        if hasattr(projeto, "avaliacao"):
            raise PermissionDenied(
                "Este projeto já possui avaliação. Use PATCH para editar."
            )

        avaliacao = serializer.save(
            professor=request.user,
            projeto=projeto,
        )

        
        if avaliacao.nota_final >= 7:
            projeto.status = "aprovado"
        else:
            projeto.status = "reprovado"

        projeto.save()

        return Response(
            AvaliacaoSerializer(avaliacao).data,
            status=status.HTTP_201_CREATED
        )