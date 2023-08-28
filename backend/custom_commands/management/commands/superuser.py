from django.core.management.base import BaseCommand, CommandError

from django.contrib.auth import get_user_model
from users.models import UserAccount

DJANGO_SUPERUSER_FNAME = "admin"
DJANGO_SUPERUSER_LNAME = "admin"
DJANGO_SUPERUSER_EMAIL = "admin_test@gmail.com"
DJANGO_SUPERUSER_PASSWORD = 1234

class Command(BaseCommand):
    help = 'Create superuser'

    def handle(self, *args, **options):
        try:
            user = UserAccount(
                first_name=DJANGO_SUPERUSER_FNAME,
                last_name=DJANGO_SUPERUSER_LNAME,
                email=DJANGO_SUPERUSER_EMAIL,
                password=DJANGO_SUPERUSER_PASSWORD,
                is_superuser=True,
                is_staff=True,
                is_active=True
            )
            user.save()
            self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
        except Exception as e:
            raise CommandError(e)