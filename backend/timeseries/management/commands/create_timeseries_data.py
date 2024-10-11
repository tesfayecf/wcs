import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone  # Import timezone
from data.models import Sensor
from timeseries.models import SensorReading, SensorLog  # Ensure these models exist in your timeseries app

class Command(BaseCommand):
    help = "Create dummy sensor readings and logs data."

    def handle(self, *args, **kwargs):
        # Get all sensors
        sensors = Sensor.objects.all()

        if not sensors:
            self.stdout.write(self.style.ERROR("No sensors found. Please create sensors first."))
            return

        # Create dummy readings for the last year at a 1-minute interval
        end_time = timezone.now()  # Use timezone.now() for the current time
        start_time = end_time - timedelta(days=31)

        for sensor in sensors:
            current_time = start_time
            while current_time <= end_time:
                reading_value = random.uniform(0, 100)  # Random reading value between 0 and 100
                SensorReading.objects.create(
                    sensor=sensor,
                    distance=reading_value,  # Use the correct field name for the reading value
                    time=current_time  # Use the correct field name for the timestamp
                )
                current_time += timedelta(minutes=1)

            self.stdout.write(self.style.SUCCESS(f"Created dummy readings for sensor: {sensor.sensor_id}"))

            # Create dummy logs for the last year at a 1-hour interval
            current_time = start_time
            while current_time <= end_time:
                log_message = f"Log entry at {current_time.strftime('%Y-%m-%d %H:%M:%S')}"
                SensorLog.objects.create(
                    status=random.choice(['INFO', 'WARNING', 'ERROR']),  # Random status
                    status_message=log_message,
                    signal_strength=random.randint(-100, 0),  # Simulating signal strength
                    battery_voltage=random.uniform(3.0, 4.2),  # Simulating battery voltage
                    battery_percentage=random.randint(0, 100),  # Simulating battery percentage
                    sensor=sensor,  # Linking the log to the sensor
                    time=current_time  # Use the correct field name for the timestamp
                )

                current_time += timedelta(hours=1)

            self.stdout.write(self.style.SUCCESS(f"Created dummy logs for sensor: {sensor.sensor_id}"))

        self.stdout.write(self.style.SUCCESS("Created dummy timeseries data."))
