from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def _send(to: str, subject: str, html: str) -> None:
    try:
        message = Mail(
            from_email=settings.EMAIL_FROM,
            to_emails=to,
            subject=subject,
            html_content=html,
        )

        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)

        logger.info(
            f"📧 Email enviado para {to} | status={response.status_code}"
        )
    except Exception as e:
        logger.error(f"❌ Erro ao enviar email para {to}: {e}")


def enviar_email_avaliacao(avaliacao) -> None:
    aluno = avaliacao.projeto.autor
    if not aluno.email:
        return

    aprovado = float(avaliacao.nota_final) >= 6
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
        html=html,
    )