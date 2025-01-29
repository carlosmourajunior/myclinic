from datetime import datetime
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from .models import Cliente, Fisioterapeuta, Matricula, Modalidades, Pagamentos
from .serializers import ClienteSerializer, FisioterapeutaSerializer, MatriculaDoMesSerializer, MatriculaSerializer, ModalidadesSerializer, PagamentosSerializer
from rest_framework.exceptions import ValidationError
from django.db.models import OuterRef, Subquery, Value, CharField, Exists, F
from django.db.models.functions import Coalesce
from django.db.models import Sum
from django.utils import timezone





class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):

        print(request.query_params)	
        print("Listando clientes")
        queryset = self.get_queryset()
        print(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ModalidadesViewSet(viewsets.ModelViewSet):
    queryset = Modalidades.objects.all()
    serializer_class = ModalidadesSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    

class FisioterapeutaViewSet(viewsets.ModelViewSet):
    queryset = Fisioterapeuta.objects.all()
    serializer_class = FisioterapeutaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class MatriculaViewSet(viewsets.ModelViewSet):
    queryset = Matricula.objects.all()
    serializer_class = MatriculaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class MatriculasDoMesView(generics.ListAPIView):

    serializer_class = MatriculaDoMesSerializer

    def get_queryset(self):
        mes = int(self.request.query_params.get('mes', datetime.now().month))
        ano = int(self.request.query_params.get('ano', datetime.now().year))

        # Filtrar matrículas anteriores ao mês e ano fornecidos
        matriculas = Matricula.objects.filter(data_cadastro__month__lte=mes, data_cadastro__year__lte=ano)

        # Subquery para buscar o status do pagamento mais recente para cada matrícula
        pagamentos_subquery = Pagamentos.objects.filter(
            matricula=OuterRef('pk'),
            mes_referencia=mes,
            ano_referencia=ano
        ).order_by('-data_pagamento')

        # Anotar o status do pagamento mais recente, considerando como 'pendente' se não houver pagamento
        matriculas = matriculas.annotate(
            status_pagamento=Coalesce(Subquery(pagamentos_subquery.values('status')[:1]), Value('False'), output_field=CharField())
        )

        return matriculas

class PagamentosViewSet(viewsets.ModelViewSet):
    queryset = Pagamentos.objects.all()
    serializer_class = PagamentosSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
        

@api_view(['POST'])
def marcar_como_pago(request):
    matricula_id = request.data.get('matricula_id')
    mes = request.data.get('mes')
    ano = request.data.get('ano')
    try:
        pagamento, created = Pagamentos.objects.get_or_create(
            matricula_id=matricula_id,
            mes_referencia=mes,
            ano_referencia=ano,
            defaults={'status': False, 'valor': 0}  # Ajuste os valores padrão conforme necessário
        )
        pagamento.status = True
        pagamento.save()
        return Response({'status': 'Pagamento marcado como pago'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def dashboard_data(request):
    fisioterapeutas = Fisioterapeuta.objects.all()
    data = []

    for fisioterapeuta in fisioterapeutas:
        alunos_matriculados = Matricula.objects.filter(fisioterapeuta=fisioterapeuta).count()
        total_recebido = Pagamentos.objects.filter(
            matricula__fisioterapeuta=fisioterapeuta,
            status='True',
            mes_referencia=timezone.now().month,
            ano_referencia=timezone.now().year
        ).aggregate(Sum('valor'))['valor__sum'] or 0

        # Subquery para verificar se há pagamentos associados à matrícula no mês e ano atual
        pagamentos_subquery = Pagamentos.objects.filter(
            matricula=OuterRef('pk'),
            mes_referencia=timezone.now().month,
            ano_referencia=timezone.now().year
        )

        for matricula in Matricula.objects.filter(fisioterapeuta=fisioterapeuta):
            print(timezone.now().replace(day=1))
            print(matricula.data_cadastro)

        # Filtrar matrículas com data de cadastro anterior ao mês atual e sem pagamentos associados
        matriculas_sem_pagamento = Matricula.objects.filter(
            fisioterapeuta=fisioterapeuta,
            data_cadastro__lt=timezone.now()
        ).annotate(
            has_pagamento=Exists(pagamentos_subquery)
        ).filter(
            has_pagamento=False
        )

        count = matriculas_sem_pagamento.count()
        print(count)

        # Somar os valores das modalidades das matrículas filtradas
        total_a_receber = matriculas_sem_pagamento.aggregate(
            total=Sum(F('modalidade__valor'))
        )['total'] or 0

        data.append({
            'fisioterapeuta_nome': fisioterapeuta.nome_completo,
            'alunos_matriculados': alunos_matriculados,
            'total_recebido': total_recebido,
            'total_a_receber': total_a_receber
        })

    return Response(data)