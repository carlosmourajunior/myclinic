from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings

def fill_email(apps, schema_editor):
    Fisioterapeuta = apps.get_model('clientes', 'Fisioterapeuta')
    for fisioterapeuta in Fisioterapeuta.objects.all():
        if not fisioterapeuta.email or fisioterapeuta.email == 'default@example.com':
            email_base = fisioterapeuta.nome_completo.replace(' ', '').lower()
            fisioterapeuta.email = f'{email_base}@gmail.com'
            fisioterapeuta.save()

class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('clientes', '0008_pagamentos_ano_referencia'),
    ]

    operations = [
        migrations.AddField(
            model_name='fisioterapeuta',
            name='email',
            field=models.EmailField(default='default@example.com', max_length=254),
        ),
        migrations.AddField(
            model_name='fisioterapeuta',
            name='tipo_usuario',
            field=models.CharField(choices=[('admin', 'Admin'), ('fisioterapeuta', 'Fisioterapeuta')], default='fisioterapeuta', max_length=15),
        ),
        migrations.AddField(
            model_name='fisioterapeuta',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.RunPython(fill_email),
    ]