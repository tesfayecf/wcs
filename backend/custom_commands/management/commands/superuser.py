from django.core.management.base import BaseCommand, CommandError

from django.contrib.auth import get_user_model
from decouple import config

User = get_user_model()

DJANGO_SUPERUSER_PASSWORD = config('DJANGO_SUPERUSER_PASSWORD', cast=str)
DJANGO_SUPERUSER_EMAIL = config('DJANGO_SUPERUSER_EMAIL', cast=str)


class Command(BaseCommand):
    help = 'Create superuser'

    def handle(self, *args, **options):
        try:
            user = User(
                email=DJANGO_SUPERUSER_EMAIL,
                password=DJANGO_SUPERUSER_PASSWORD,
            )
            user.save()
            self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
        except Exception as e:
            raise CommandError(e)