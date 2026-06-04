from django.apps import AppConfig


class ProjetosConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.projetos"

    def ready(self):
        # Importa os signals para que sejam registrados quando o app sobe
        # Sem isso, os signals existem mas nunca são conectados
        import apps.projetos.signals  # noqa: F401