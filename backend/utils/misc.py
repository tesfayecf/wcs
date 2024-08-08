from django.utils import timezone
from datetime import timedelta

def _get_seconds_until_next_hour() -> int:
    """Calculate the number of seconds until the next hour."""
    now = timezone.now()
    next_hour = (now + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)
    return int((next_hour - now).total_seconds())


def model_to_dict(model):
    model_dict = {}
    for field in model._meta.fields:
        model_dict[field.name] = getattr(model, field.name)
    return model_dict