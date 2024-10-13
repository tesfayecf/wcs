import random
from django.core.management.base import BaseCommand
from resources.models import Group, Tank, Sensor
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "Create dummy data for groups, tanks, and sensors."

    def handle(self, *args, **kwargs):
        user = User.objects.first()  # Assuming there's at least one user

        if not user:
            self.stdout.write(self.style.ERROR("No user found. Please create a user first."))
            return

        # Create dummy groups
        for i in range(5):  # Create 5 groups
            group = Group.objects.create(
                name=f"Group {i + 1}",
                location=f"Location {i + 1}",
                user=user
            )
            self.stdout.write(self.style.SUCCESS(f"Created {group}"))

            # Create tanks for each group
            for j in range(random.randint(1, 3)):  # Each group can have 1 to 3 tanks
                tank = Tank.objects.create(
                    name=f"Tank {j + 1} of {group.name}",
                    type=random.choice(['Storage', 'Well', 'Reservoir']),
                    capacity=random.randint(50, 500),
                    is_active=random.choice([True, False]),
                    group=group
                )
                self.stdout.write(self.style.SUCCESS(f"Created {tank}"))

                # Randomly decide whether to create a sensor for the tank
                if random.choice([True, False]):
                    sensor = Sensor.objects.create(
                        sensor_id=f"Sensor-{tank.id}",
                        is_active=True,
                        tank=tank
                    )
                    self.stdout.write(self.style.SUCCESS(f"Created {sensor}"))