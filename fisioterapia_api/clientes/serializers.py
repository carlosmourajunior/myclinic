from rest_framework import serializers
from .models import Matricula, Cliente, Fisioterapeuta, Modalidades, Pagamentos

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class FisioterapeutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fisioterapeuta
        fields = '__all__'

class ModalidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modalidades
        fields = '__all__'

class MatriculaSerializer(serializers.ModelSerializer):
    cliente_nome = serializers.CharField(source='cliente.nome_completo', read_only=True)
    fisioterapeuta_nome = serializers.CharField(source='fisioterapeuta.nome_completo', read_only=True)
    modalidade_nome = serializers.CharField(source='modalidade.nome', read_only=True)
    horario_aula = serializers.TimeField(format='%H:%M', required=False, allow_null=True)
    class Meta:
        model = Matricula
        fields = ['id', 'cliente', 'cliente_nome', 'fisioterapeuta', 'fisioterapeuta_nome', 'modalidade', 'modalidade_nome', 'data_cadastro', 'porcentagem_comissao', 'dia_pagamento', 'horario_aula', 'dias_semana', 'status']
    
    # def get_horario_aula(self, obj):
    #     return obj.horario_aula.strftime('%H:%M') if obj.horario_aula else None
    
class MatriculaDoMesSerializer(serializers.ModelSerializer):
    cliente_nome = serializers.CharField(source='cliente.nome_completo', read_only=True)
    fisioterapeuta_nome = serializers.CharField(source='fisioterapeuta.nome_completo', read_only=True)
    modalidade_nome = serializers.CharField(source='modalidade.nome', read_only=True)
    horario_aula = serializers.SerializerMethodField()
    status_pagamento = serializers.SerializerMethodField()

    class Meta:
        model = Matricula
        fields = ['id', 'cliente', 'cliente_nome', 'fisioterapeuta', 'fisioterapeuta_nome', 'modalidade', 'modalidade_nome', 'data_cadastro', 'porcentagem_comissao', 'dia_pagamento', 'horario_aula', 'dias_semana', 'status', 'status_pagamento']
    
    def get_horario_aula(self, obj):
        return obj.horario_aula.strftime('%H:%M') if obj.horario_aula else None

    def get_status_pagamento(self, obj):
        return obj.status_pagamento == 'pago'

class PagamentosSerializer(serializers.ModelSerializer):
    matricula_id = serializers.IntegerField(source='matricula.id', read_only=True)
    cliente_nome = serializers.CharField(source='matricula.cliente.nome_completo', read_only=True)
    fisioterapeuta_nome = serializers.CharField(source='matricula.fisioterapeuta.nome', read_only=True)
    modalidade_nome = serializers.CharField(source='matricula.modalidade.nome', read_only=True)

    class Meta:
        model = Pagamentos
        fields = ['id', 'matricula_id', 'cliente_nome', 'fisioterapeuta_nome', 'modalidade_nome', 'data_pagamento', 'status']