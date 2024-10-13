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
                    label=f"{measure_type.lower()}-{sensor.id}",
                    name=f"{measure_type} Measure",
                    type=measure_type,
                    sensor=sensor,
                    description=f"{measure_type} data for sensor {sensor.id}"
                )
                self.stdout.write(self.style.SUCCESS(f"Created {measure}"))

                # Create dummy channels for each measure
                for version in range(1, 4):  # Create 3 versions of each channel
                    channel = Channel.objects.create(
                        label=f"Channel-{measure.label}-{version}",
                        version=f"v{version}",
                        unit=random.choice(['Celsius', 'Bar', 'Meters']),
                        rate=random.choice([1, 10, 60]),  # Sampling rates in seconds
                        measure=measure
                    )
                    self.stdout.write(self.style.SUCCESS(f"Created {channel}"))

                    # Create time chunks and records for different time intervals
                    time_intervals = {
                        'minutes': timedelta(minutes=1),
                        'hours': timedelta(hours=1),
                        'daily': timedelta(days=1),
                    }

                    start_time = now() - timedelta(days=30)  # Start from 30 days ago
                    end_time = now()

                    for interval_name, interval_duration in time_intervals.items():
                        chunk_start_time = start_time
                        chunk_end_time = chunk_start_time + interval_duration * random.randint(10, 100)

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
                                record_time += interval_duration  # Move to next timestamp based on interval

                            chunk_start_time = chunk_end_time
                            chunk_end_time = chunk_start_time + interval_duration * random.randint(10, 100)

        self.stdout.write(self.style.SUCCESS("Dummy time-series data generation completed."))
