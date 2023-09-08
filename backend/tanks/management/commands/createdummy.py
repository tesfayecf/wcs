from django.core.management.base import BaseCommand
from users.models import UserAccount
from django.contrib.auth.hashers import make_password

from tanks.models import TankGroup, Tank
from sensors.models import Sensor, TankSensor

class Command(BaseCommand):
    help = 'Create dummy data if it does not exist'

    def handle(self, *args, **options):
        if not UserAccount.objects.filter(email='tesfayecarreras02@gmail.com').exists():
            self.stdout.write(self.style.SUCCESS('User not found'))
            return
        
        user = UserAccount.objects.get(email='tesfayecarreras02@gmail.com')
                
        name = 'Dummy Tank Group'
        location = 'Dummy Location'
        description = 'Dummy Description'
        
        tank_group, created = TankGroup.objects.get_or_create(name=name, location=location, description=description, user=user)
        if not created:
            self.stdout.write(self.style.SUCCESS('Tank Group already exists.'))
        
        tank1, created = Tank.objects.get_or_create(name='Tank 1', type='Storage', capacity=100, tankGroup=tank_group)
        if not created:
            self.stdout.write(self.style.SUCCESS('Tank 1 already exists.'))
        
        tank2, created = Tank.objects.get_or_create(name='Tank 2', type='Reservoir', capacity=200, tankGroup=tank_group)
        if not created:
            self.stdout.write(self.style.SUCCESS('Tank 2 already exists.'))
        
        sensor, created = Sensor.objects.get_or_create(
            serial_number='123456',
            manufacturer='Dummy Manufacturer',
            model='Dummy Model',
            is_active=True,
            installation_date='2022-01-01',
            calibration_date='2022-01-01'
        )
        if not created:
            self.stdout.write(self.style.SUCCESS('Sensor already exists.'))
        
        tank_sensor, created = TankSensor.objects.get_or_create(sensor=sensor, tank=tank1)
        if not created:
            self.stdout.write(self.style.SUCCESS('Tank Sensor already exists.'))

        self.stdout.write(self.style.SUCCESS('Dummy data created successfully.'))