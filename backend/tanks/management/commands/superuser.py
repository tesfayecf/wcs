from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand, CommandError
from users.models import UserAccount

DJANGO_SUPERUSER_FNAME = "admin"
DJANGO_SUPERUSER_LNAME = "admin"
DJANGO_SUPERUSER_EMAIL = "admin@gmail.com"
DJANGO_SUPERUSER_PASSWORD = "1234"

class Command(BaseCommand):
    help = 'Create superuser'

    def handle(self, *args, **options):
        try:
            user = UserAccount.objects.create_superuser(
                first_name=DJANGO_SUPERUSER_FNAME,
                last_name=DJANGO_SUPERUSER_LNAME,
                email=DJANGO_SUPERUSER_EMAIL,
                password=make_password(DJANGO_SUPERUSER_PASSWORD),
            )
            self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
        except Exception as e:
            raise CommandError(e)
