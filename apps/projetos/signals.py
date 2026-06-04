from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import Projeto, Avaliacao
from .email_service import enviar_email_submissao, enviar_email_avaliacao

User = get_user_model()


@receiver(post_save, sender=Projeto)
def notificar_submissao(sender, instance, created, **kwargs):
    """
    Escuta salvamentos do model Projeto.
    Só dispara email quando status muda para 'submetido'.
    """
    # Ignora criações (rascunho inicial) e outros status
    if instance.status != "submetido":
        return

    # Busca todos os professores para notificar
    professores = User.objects.filter(perfil="professor", is_active=True)
    if not professores.exists():
        return

    enviar_email_submissao(instance, professores)


@receiver(post_save, sender=Avaliacao)
def notificar_avaliacao(sender, instance, created, **kwargs):
    # created=True só na primeira vez — edições não reenviam email
    if not created:
        return
    enviar_email_avaliacao(instance)