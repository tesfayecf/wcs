from typing import List
from django.db import models

def serialize_model(model_instance, keys: List[str], related_keys: List[str] = None):
    """
    Deserialize a Django model instance by extracting the specified keys and handling related models with recursion.

    Args:
        model_instance: The Django model instance to serialize.
        keys (List[str]): A list of attribute names to extract from the model.
        related_keys (List[str], optional): A list of attribute names for related models.

    Returns:
        dict: A dictionary containing the extracted attribute names and their values.
    """
    if related_keys is None:
        # If related_keys is not provided, use all the keys of the model_instance
        related_keys = [field.name for field in model_instance._meta.get_fields()]

    data = {}
    try:
        for key in keys:
            if key in related_keys and hasattr(model_instance, key):
                related_model = getattr(model_instance, key)
                if related_model is not None and isinstance(related_model, models.Model):
                    data[key] = serialize_model(related_model, related_keys)
                else:
                    data[key] = related_model
            elif hasattr(model_instance, key):
                data[key] = getattr(model_instance, key)
        return data
    except:
        return False

"""
# Assuming you have a Django model called 'MyModel' with attributes 'name', 'age', 'email', and 'related_model'
# 'related_model' is a ForeignKey to another model

my_model_instance = MyModel(name="John", age=30, email="john@example.com", related_model=my_related_model_instance)

# Extract specific keys from the model instance, and handle the 'related_model' with recursion
keys_to_extract = ["name", "email"]
related_keys_to_extract = ["name", "email"]  # Specify the keys to extract from the related model, or None for all keys
extracted_data = deserialize_model(my_model_instance, keys_to_extract, related_keys_to_extract)

print(extracted_data)

"""