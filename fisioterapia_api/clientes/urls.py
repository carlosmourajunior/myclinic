from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, FisioterapeutaViewSet, MatriculaViewSet, MatriculasDoMesView, ModalidadesViewSet, PagamentosViewSet, dashboard_data, marcar_como_pago

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'modalidades', ModalidadesViewSet)
router.register(r'fisioterapeutas', FisioterapeutaViewSet)
router.register(r'matriculas', MatriculaViewSet)
router.register(r'pagamentos', PagamentosViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('matriculas-do-mes/', MatriculasDoMesView.as_view(), name='matriculas-do-mes'),
    path('dashboard-data/', dashboard_data, name='dashboard-data'),
    path('marcar-como-pago/', marcar_como_pago, name='marcar-como-pago'),

]