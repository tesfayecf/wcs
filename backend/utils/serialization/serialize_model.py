from dataclasses import dataclass
from django.db import models

@dataclass
class ModelData:
    # Define a dataclass representing the JSON data for any model
    # You can customize this dataclass to include or exclude specific fields
    # based on your requirements.
    # For example, you can add 'exclude' or 'include' parameters to the dataclass.

    # Note: For DateField and DateTimeField, you may need to handle date parsing properly.
    # For the sake of simplicity, we are assuming date fields are provided as strings.
    # You may want to use a library like 'dateutil' to handle date parsing and formatting.

    # Map model field names to their corresponding data types
    field_mapping = {
        models.CharField: str,
        models.IntegerField: int,
        models.BooleanField: bool,
        models.DateField: str,
        models.DateTimeField: str,
        models.DecimalField: float,
        # Add more mappings for other model field types as needed
    }

    def __post_init__(self):
        # Convert attribute types to match the model field types
        for field_name, field_type in self.__annotations__.items():
            if not isinstance(getattr(self, field_name), field_type):
                setattr(self, field_name, field_type(getattr(self, field_name)))

def create_model_instance(model_class, json_data):
    model_data = ModelData(**json_data)
    model_instance = model_class(**vars(model_data))
    model_instance.save()
    return model_instance

def update_model_instance(model_instance, json_data):
    model_data = ModelData(**json_data)
    for field_name, field_value in vars(model_data).items():
        setattr(model_instance, field_name, field_value)
    model_instance.save()
    return model_instance
