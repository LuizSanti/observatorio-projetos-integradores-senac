import resend
from django.conf import settings


resend.api_key = settings.RESEND_API_KEY


def _send(to: str, subject: str, html: str) -> None:
    """
    Função base de envio. Centralizada para facilitar troca de provedor no futuro.
    Falhas de email nunca devem quebrar a operação principal — por isso o try/except.
    """
    try:
        resend.Emails.send({
            "from":    settings.EMAIL_FROM,
            "to":      [to],
            "subject": subject,
            "html":    html,
        })
    except Exception as e:
        # Loga o erro mas não propaga — submissão/avaliação continuam funcionando
        # mesmo se o email falhar
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Falha ao enviar email para {to}: {e}")


def enviar_email_submissao(projeto, professores) -> None:
    """
    Disparado quando aluno submete um projeto.
    Notifica todos os professores cadastrados no sistema.
    """
    for professor in professores:
        if not professor.email:
            continue

        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1A3A6C; padding: 24px; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px;">
                    Observatório de Projetos — Senac
                </h1>
            </div>

            <div style="background-color: #f9f9f9; padding: 32px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #1A3A6C; margin-top: 0;">
                    Novo projeto submetido para avaliação
                </h2>

                <p style="color: #444;">Olá, <strong>{professor.get_full_name() or professor.username}</strong>!</p>

                <p style="color: #444;">
                    Um novo projeto foi submetido e está aguardando sua avaliação.
                </p>

                <div style="background-color: white; border: 1px solid #e0e0e0;
                            border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0 0 8px 0;">
                        <strong>Título:</strong> {projeto.titulo}
                    </p>
                    <p style="margin: 0 0 8px 0;">
                        <strong>Aluno:</strong> {projeto.autor.get_full_name() or projeto.autor.username}
                    </p>
                    <p style="margin: 0 0 8px 0;">
                        <strong>Turma:</strong> {projeto.turma}
                    </p>
                    <p style="margin: 0;">
                        <strong>Status:</strong> Submetido
                    </p>
                </div>

                <p style="color: #444;">
                    Acesse a plataforma para visualizar e avaliar o projeto.
                </p>

                <div style="margin-top: 32px; padding-top: 20px;
                            border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
                    Este é um email automático do Observatório de Projetos Integradores — Senac.
                </div>
            </div>
        </div>
        """

        _send(
            to=professor.email,
            subject=f"[Observatório] Novo projeto: {projeto.titulo}",
            html=html,
        )


def enviar_email_avaliacao(avaliacao) -> None:
    """
    Disparado quando professor avalia um projeto.
    Notifica o aluno autor do projeto.
    """
    aluno = avaliacao.projeto.autor
    if not aluno.email:
        return

    aprovado = float(avaliacao.nota_final) >= 6
    status_texto = "aprovado ✓" if aprovado else "abaixo da média"
    status_cor   = "#2E7D32"   if aprovado else "#C62828"

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1A3A6C; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">
                Observatório de Projetos — Senac
            </h1>
        </div>

        <div style="background-color: #f9f9f9; padding: 32px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1A3A6C; margin-top: 0;">
                Seu projeto foi avaliado
            </h2>

            <p style="color: #444;">
                Olá, <strong>{aluno.get_full_name() or aluno.username}</strong>!
            </p>

            <p style="color: #444;">
                O professor <strong>{avaliacao.professor.get_full_name() or avaliacao.professor.username}</strong>
                avaliou seu projeto.
            </p>

            <div style="background-color: white; border: 1px solid #e0e0e0;
                        border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 8px 0;">
                    <strong>Projeto:</strong> {avaliacao.projeto.titulo}
                </p>
                <p style="margin: 0 0 8px 0;">
                    <strong>Turma:</strong> {avaliacao.projeto.turma}
                </p>

                <div style="margin: 16px 0; padding: 16px;
                            background-color: #f0f4ff; border-radius: 6px;">
                    <p style="margin: 0 0 6px 0;">
                        <strong>Apresentação:</strong> {avaliacao.nota_apresentacao}
                    </p>
                    <p style="margin: 0 0 6px 0;">
                        <strong>Documentação:</strong> {avaliacao.nota_documentacao}
                    </p>
                    <p style="margin: 0 0 6px 0;">
                        <strong>Inovação:</strong> {avaliacao.nota_inovacao}
                    </p>
                    <p style="margin: 0 0 6px 0;">
                        <strong>Técnica:</strong> {avaliacao.nota_tecnica}
                    </p>
                </div>

                <p style="margin: 12px 0 8px 0; font-size: 18px;">
                    <strong>Nota Final:
                        <span style="color: {status_cor};">
                            {avaliacao.nota_final} — {status_texto}
                        </span>
                    </strong>
                </p>
            </div>

            <div style="background-color: white; border: 1px solid #e0e0e0;
                        border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0;"><strong>Feedback do Professor:</strong></p>
                <p style="margin: 0; color: #444; line-height: 1.6;">
                    {avaliacao.feedback}
                </p>
            </div>

            <p style="color: #444;">
                Acesse a plataforma para ver os detalhes completos da avaliação.
            </p>

            <div style="margin-top: 32px; padding-top: 20px;
                        border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
                Este é um email automático do Observatório de Projetos Integradores — Senac.
            </div>
        </div>
    </div>
    """

    _send(
        to=aluno.email,
        subject=f"[Observatório] Seu projeto foi avaliado — Nota: {avaliacao.nota_final}",
        html=html,
    )