from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied
from django.core.mail import send_mail
from django.conf import settings
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
        if user.perfil in ['admin', 'professor']:
            return Projeto.objects.all()
        elif user.perfil == 'aluno':
            return Projeto.objects.filter(autor=user)
        return Projeto.objects.none()

    def perform_create(self, serializer):
        projeto = serializer.save(autor=self.request.user)

        # Notifica todos os professores sobre novo projeto
        from apps.accounts.models import CustomUser
        professores = CustomUser.objects.filter(
            perfil='professor'
        ).exclude(email='')

        emails_professores = list(professores.values_list('email', flat=True))

        if emails_professores:
            send_mail(
                subject=f'Novo projeto submetido: {projeto.titulo}',
                message=(
                    f'O aluno {self.request.user.get_full_name() or self.request.user.username} '
                    f'submeteu o projeto "{projeto.titulo}" ({projeto.turma}).\n\n'
                    f'Acesse o sistema para avaliar: https://observatorio-projetos-integradores.vercel.app'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=emails_professores,
                fail_silently=True,
            )


class IsProfessorOrAdmin(permissions.BasePermission):
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

        # Notifica o aluno sobre a avaliação
        aluno = projeto.autor
        if aluno.email:
            resultado = "aprovado" if avaliacao.nota_final >= 7 else "reprovado"
            send_mail(
                subject=f'Seu projeto "{projeto.titulo}" foi avaliado',
                message=(
                    f'Olá, {aluno.get_full_name() or aluno.username}!\n\n'
                    f'Seu projeto "{projeto.titulo}" foi avaliado.\n'
                    f'Nota final: {avaliacao.nota_final}\n'
                    f'Resultado: {resultado.upper()}\n\n'
                    f'Acesse o sistema para ver o feedback completo: '
                    f'https://observatorio-projetos-integradores.vercel.app'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[aluno.email],
                fail_silently=True,
            )

        return Response(
            AvaliacaoSerializer(avaliacao).data,
            status=status.HTTP_201_CREATED
        )