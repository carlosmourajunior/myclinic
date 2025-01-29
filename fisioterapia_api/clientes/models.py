import datetime
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User


class Cliente(models.Model):
    nome_completo = models.CharField(max_length=100)
    data_nascimento = models.DateField()
    cpf = models.CharField(max_length=11, unique=True)
    telefone = models.CharField(max_length=15)
    endereco = models.TextField()
    historico_medico = models.TextField(blank=True, null=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome_completo
    

class Modalidades(models.Model):
    nome = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=5, decimal_places=2)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nome

class Fisioterapeuta(models.Model):
    TIPO_USUARIO_CHOICES = [
        ('admin', 'Admin'),
        ('fisioterapeuta', 'Fisioterapeuta'),
    ]

    nome_completo = models.CharField(max_length=100)
    cpf = models.CharField(max_length=11, unique=True)
    telefone = models.CharField(max_length=15)
    email = models.EmailField(unique=True, default='default@example.com')
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    tipo_usuario = models.CharField(max_length=15, choices=TIPO_USUARIO_CHOICES, default='fisioterapeuta')

    def __str__(self):
        return self.nome_completo

    def save(self, *args, **kwargs):
        if not self.user:
            user = User.objects.create_user(username=self.email, email=self.email, password='defaultpassword')
            self.user = user
        super(Fisioterapeuta, self).save(*args, **kwargs)
    

class Matricula(models.Model):
    status_choices = [
        (True, 'Ativa'),
        (False, 'Inativa')
    ]

    dias_semana_choices = [
        ('Segunda', 'Segunda'),
        ('Terça', 'Terça'),
        ('Quarta', 'Quarta'),
        ('Quinta', 'Quinta'),
        ('Sexta', 'Sexta'),
        ('Sábado', 'Sábado'),
        ('Domingo', 'Domingo')
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fisioterapeuta = models.ForeignKey(Fisioterapeuta, on_delete=models.CASCADE)
    modalidade = models.ForeignKey(Modalidades, on_delete=models.CASCADE)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    porcentagem_comissao = models.DecimalField(max_digits=5, decimal_places=2)
    dia_pagamento = models.PositiveSmallIntegerField(blank=True, null=True)
    horario_aula = models.TimeField(blank=True, null=True)
    dias_semana = ArrayField(models.CharField(max_length=10, choices=dias_semana_choices), blank=True, default=list)
    status = models.BooleanField(default=False, choices=status_choices)

    def __str__(self):
        return f"{self.cliente} - {self.modalidade} - {self.fisioterapeuta}"


class Pagamentos(models.Model):
    status_choices = [
        (True, 'Pago'),
        (False, 'Pendente')
    ]

    matricula = models.ForeignKey(Matricula, on_delete=models.CASCADE)
    data_pagamento = models.DateField(default=datetime.date.today)
    mes_referencia = models.IntegerField(choices=[(i, i) for i in range(1, 13)], default=datetime.datetime.now().month)
    ano_referencia = models.IntegerField(default=datetime.datetime.now().year)
    status = models.BooleanField(default=False, choices=status_choices)
    valor = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        if not self.valor:
            self.valor = self.matricula.modalidade.valor
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.matricula.cliente.nome_coompleto} - {self.data_pagamento} - {self.valor}"