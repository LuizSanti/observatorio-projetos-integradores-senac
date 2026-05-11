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

class Avaliacao(models.Model):
    projeto = models.OneToOneField(
        Projeto,
        on_delete=models.CASCADE,
        related_name='avaliacao'
    )
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='avaliacoes'
    )
    nota_apresentacao = models.DecimalField(max_digits=4, decimal_places=1)
    nota_documentacao = models.DecimalField(max_digits=4, decimal_places=1)
    nota_inovacao = models.DecimalField(max_digits=4, decimal_places=1)
    nota_tecnica = models.DecimalField(max_digits=4, decimal_places=1)
    nota_final = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    feedback = models.TextField(blank=True)
    avaliado_em = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.nota_final = round(
            (self.nota_apresentacao + self.nota_documentacao +
             self.nota_inovacao + self.nota_tecnica) / 4, 1
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Avaliação — {self.projeto.titulo}"