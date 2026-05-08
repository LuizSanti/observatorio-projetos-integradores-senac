from django.db import models
from django.conf import settings


class Projeto(models.Model):
    STATUS_CHOICES = [
        ('rascunho', 'Rascunho'),
        ('submetido', 'Submetido'),
        ('em_avaliacao', 'Em Avaliação'),
        ('aprovado', 'Aprovado'),
    ]

    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    turma = models.CharField(max_length=100)
    arquivo = models.FileField(upload_to='projetos/')
    link = models.URLField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='rascunho'
    )
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projetos'
    )
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.titulo} — {self.autor.username}"