from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def _send(to: str, subject: str, message: str) -> None:
    try:
        send_mail(
            subject=subject,
            message="",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to],
            html_message=message,
            fail_silently=False,
        )
        logger.info(f"📧 Email enviado para {to}")
    except Exception as e:
        logger.error(f"❌ Erro ao enviar email para {to}: {e}")


def enviar_email_avaliacao(avaliacao) -> None:
    aluno = avaliacao.projeto.autor
    if not aluno.email:
        return

    aprovado = avaliacao.nota_final >= 6
    status = "Aprovado ✅" if aprovado else "Reprovado ❌"

    html = f"""
    <p>Olá, {aluno.get_full_name() or aluno.username}</p>
    <p>Seu projeto <strong>{avaliacao.projeto.titulo}</strong> foi avaliado.</p>
    <p><strong>Nota final:</strong> {avaliacao.nota_final} — {status}</p>
    <p>{avaliacao.feedback}</p>
    """

    _send(
        to=aluno.email,
        subject="[Observatório] Avaliação do seu projeto",
        message=html,
    )