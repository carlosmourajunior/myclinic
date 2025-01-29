from django.contrib import admin
from .models import Cliente, Fisioterapeuta, Matricula, Modalidades, Pagamentos

admin.site.register(Cliente)
admin.site.register(Fisioterapeuta)
admin.site.register(Matricula)
admin.site.register(Modalidades)
admin.site.register(Pagamentos)

