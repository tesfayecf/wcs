import random
from django.core.management.base import BaseCommand
from django.utils.timezone import now, timedelta
from resources.models import Sensor
from timeseries.models import Measure, MeasureType, Channel, Chunk, Record

class Command(BaseCommand):
    help = "Generate dummy data with varying time rates (seconds to daily) for measures, channels, chunks, and records."

    def handle(self, *args, **kwargs):
        sensors = Sensor.objects.all()  # Get all sensors

        if not sensors.exists():
            self.stdout.write(self.style.ERROR("No sensors found. Please create some sensors first."))
            return

        for sensor in sensors:
            # Create dummy measures for each sensor
            measure_types = [MeasureType.TEMPERATURE, MeasureType.PRESSURE, MeasureType.LEVEL]
            for measure_type in measure_types:
                measure = Measure.objects.create(
                    label=f"{random.randint(1000, 9999)}-{sensor.id}",
                    name=f"{measure_type} Measure",
                    type=measure_type,
                    sensor=sensor,
                    description=f"{measure_type} data for sensor {sensor.id}"
                )
                self.stdout.write(self.style.SUCCESS(f"Created {measure}"))

                # Create dummy channel for each measure
                channel = Channel.objects.create(
                    label=f"Channel-{measure.label}",
                    version=f"v1",
                    unit=random.choice(['Celsius', 'Bar', 'Meters']),
                    rate=random.choice([1, 10, 60]),  # Sampling rates in seconds
                    measure=measure
                )
                self.stdout.write(self.style.SUCCESS(f"Created {channel}"))

                # Create time chunks and records for 1 minute time intervals
                start_time = now() - timedelta(days=5)  # Start from 5 days ago
                end_time = now()

                interval = timedelta(minutes=1)
                chunk_start_time = start_time
                chunk_end_time = chunk_start_time + interval * 30

                while chunk_end_time <= end_time:
                    # Create a time chunk
                    chunk = Chunk.objects.create(
                        measure=measure,
                        start_time=chunk_start_time,
                        end_time=chunk_end_time
                    )
                    self.stdout.write(self.style.SUCCESS(f"Created {chunk}"))

                    # Generate records for the chunk at the specified time rate
                    record_time = chunk_start_time
                    while record_time <= chunk_end_time:
                        record_value = random.uniform(0, 100)  # Random float values for records
                        Record.objects.create(
                            time=record_time,
                            value=record_value,
                            channel=channel,
                            chunk=chunk
                        )
                        record_time += interval  # Move to next timestamp based on interval

                    chunk_start_time = chunk_end_time
                    chunk_end_time = chunk_start_time + interval * random.randint(10, 100)

        self.stdout.write(self.style.SUCCESS("Dummy time-series data generation completed."))
