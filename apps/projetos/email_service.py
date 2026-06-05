import resend
from django.conf import settings
import logging

resend.api_key = settings.RESEND_API_KEY
logger = logging.getLogger(__name__)

EMAIL_FROM = "Resend <no-reply@resend.dev>"


def _send(to: str, subject: str, html: str) -> None:
    try:
        resend.emails.send({
            "from": EMAIL_FROM,
            "to": [to],
            "subject": subject,
            "html": html,
        })
        logger.info(f"📧 Email enviado para {to}")
    except Exception as e:
        logger.error(f"❌ Falha ao enviar email para {to}: {e}")


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
    <p><strong>Feedback:</strong></p>
    <p>{avaliacao.feedback}</p>
    """

    _send(
        to=aluno.email,
        subject=f"[Observatório] Avaliação do projeto {avaliacao.projeto.titulo}",
        html=html,
    )

def enviar_email_submissao(projeto, professores):
    for professor in professores:
        if not professor.email:
            continue

        html = f"""
        <p>Olá {professor.get_full_name() or professor.username},</p>
        <p>Um novo projeto foi submetido:</p>
        <ul>
            <li><strong>Título:</strong> {projeto.titulo}</li>
            <li><strong>Aluno:</strong> {projeto.autor.get_full_name() or projeto.autor.username}</li>
            <li><strong>Turma:</strong> {projeto.turma}</li>
        </ul>
        """

        _send(
            to=professor.email,
            subject=f"[Observatório] Novo projeto: {projeto.titulo}",
            html=html,
        )