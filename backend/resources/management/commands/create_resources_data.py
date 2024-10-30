import random
from django.core.management.base import BaseCommand
from resources.models import Group, Tank, Sensor, TankType, SensorStatus
from users.models import User
from django.utils.timezone import now
from datetime import timedelta

class Command(BaseCommand):
    help = "Create comprehensive dummy data for groups, tanks, and sensors."

    def handle(self, *args, **kwargs):
        user = User.objects.first()  # Assuming there's at least one user

        if not user:
            self.stdout.write(self.style.ERROR("No user found. Please create a user first."))
            return

        # Create dummy groups
        group_types = ['Farm', 'Factory', 'Residential']
        for i, group_type in enumerate(group_types):
            group = Group.objects.create(
                name=f"{group_type} Group",
                location=f"Location {i + 1}",
                user=user,
                description=f"{group_type} group located at Location {i + 1}."
            )
            self.stdout.write(self.style.SUCCESS(f"Created {group}"))

            # Create tanks for each group
            tank_types = [TankType.STORAGE, TankType.WELL, TankType.RESERVOIR]
            for j, tank_type in enumerate(tank_types):
                tank = Tank.objects.create(
                    name=f"{tank_type} Tank of {group.name}",
                    type=tank_type,
                    capacity=random.choice([100, 250, 500]),
                    is_active=True,
                    group=group,
                    description=f"A {tank_type.lower()} tank belonging to {group.name}."
                )
                self.stdout.write(self.style.SUCCESS(f"Created {tank}"))

                # Create a sensor for each tank
                sensor = Sensor.objects.create(
                    name=f"Sensor-{tank.id}",
                    device_id=f"Device-{random.randint(1000, 9999)}",
                    status=random.choice(SensorStatus.values),
                    installation_date=now() - timedelta(days=random.randint(30, 365)),
                    is_active=True,
                    tank=tank,
                    description=f"Sensor for {tank.name}",
                    notes="Automatically generated dummy sensor."
                )
                self.stdout.write(self.style.SUCCESS(f"Created {sensor}"))

        self.stdout.write(self.style.SUCCESS("Dummy data creation completed."))
