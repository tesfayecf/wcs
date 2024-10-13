from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()

class Command(BaseCommand):
    help = "Create a superuser, a staff user, and a regular user."

    def handle(self, *args, **kwargs):
        # Create a superuser
        superuser_email = "adminuser@gmail.com"
        superuser_password = "superuserpassword"  # Change this to a secure password
        superuser, created = User.objects.get_or_create(
            email=superuser_email,
            defaults={
                'first_name': 'Admin',
                'last_name': 'User',
                'is_superuser': True,
                'is_staff': True,
                'is_active': True,
            }
        )
        if created:
            superuser.set_password(superuser_password)
            superuser.save()
            self.stdout.write(self.style.SUCCESS(f"Created superuser: {superuser_email}"))
        else:
            self.stdout.write(self.style.WARNING(f"Superuser {superuser_email} already exists."))

        # Create a staff user
        staff_user_email = "staffuser@gmail.com"
        staff_user_password = "staffuserpassword"  # Change this to a secure password
        staff_user, created = User.objects.get_or_create(
            email=staff_user_email,
            defaults={
                'first_name': 'Staff',
                'last_name': 'User',
                'is_superuser': False,
                'is_staff': True,
                'is_active': True,
            }
        )
        if created:
            staff_user.set_password(staff_user_password)
            staff_user.save()
            self.stdout.write(self.style.SUCCESS(f"Created staff user: {staff_user_email}"))
        else:
            self.stdout.write(self.style.WARNING(f"Staff user {staff_user_email} already exists."))

        # Create a regular user
        regular_user_email = "regularuser@gmail.com"
        regular_user_password = "regularuserpassword"  # Change this to a secure password
        regular_user, created = User.objects.get_or_create(
            email=regular_user_email,
            defaults={
                'first_name': 'Regular',
                'last_name': 'User',
                'is_superuser': False,
                'is_staff': False,
                'is_active': True,
            }
        )
        if created:
            regular_user.set_password(regular_user_password)
            regular_user.save()
            self.stdout.write(self.style.SUCCESS(f"Created regular user: {regular_user_email}"))
        else:
            self.stdout.write(self.style.WARNING(f"Regular user {regular_user_email} already exists."))

        # Create groups and assign users to them
        group1, _ = Group.objects.get_or_create(name='Admin Group')
        group2, _ = Group.objects.get_or_create(name='Staff Group')
        group3, _ = Group.objects.get_or_create(name='Regular Group')

        superuser.groups.add(group1)
        staff_user.groups.add(group2)
        regular_user.groups.add(group3)

        self.stdout.write(self.style.SUCCESS(f"Assigned users to their respective groups."))