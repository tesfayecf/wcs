from typing import Union, Dict, Any

from .types import *

class MQTTMessage:
    def __init__(self, topic: Topic, action_type: ActionType, action_name: Union[RegisterAction, DataAction, CommandAction], payload: list[Any], payload_count: int, meta: Dict[MetaParam, Any]):
        self.topic = topic
        self.action_type = action_type
        self.action_name = action_name
        self.payload = payload
        if len(payload) != payload_count:
            raise ValueError("Payload count mismatch")
        self.payload_count = payload_count
        self.meta = meta

    def to_dict(self) -> Dict[str, Any]:
        # Convert the MQTTMessage object to a dictionary representation
        return {
            MessageParam.ACTION.value: {
                # Convert action-related attributes to their corresponding values
                ActionParam.TYPE.value: self.action_type.value,
                ActionParam.NAME.value: self.action_name.value,
                ActionParam.PAYLOAD.value: self.payload,
                ActionParam.PAYLOAD_COUNT.value: len(self.payload)
            },
            MessageParam.META.value: {
                # Convert meta information to a dictionary, using enum values as keys
                k.value: v for k, v in self.meta.items()
            }
        }

    @classmethod
    def from_dict(cls, topic: str, data: Dict[str, Any]) -> 'MQTTMessage':
        # Convert the topic string to its corresponding Topic enum
        topic_enum = {
            Topic.REGISTER.value: Topic.REGISTER,
            Topic.DATA.value: Topic.DATA,
            Topic.COMMAND.value: Topic.COMMAND
        }[topic]
        
        # Extract action and meta data from the input dictionary
        action_data = data[MessageParam.ACTION.value]
        meta_data = data[MessageParam.META.value]
        
        # Convert the action type string to its corresponding ActionType enum
        action_type = ActionType(action_data[ActionParam.TYPE.value])
        
        # Determine the correct action enum based on the action type
        action_enum = {
            ActionType.REGISTER: RegisterAction,
            ActionType.DATA: DataAction,
            ActionType.COMMAND: CommandAction
        }[action_type]
        
        # Convert the action name string to its corresponding action enum
        action = action_enum(action_data[ActionParam.NAME.value])
        
        # Extract the payload from the action data
        payload = action_data[ActionParam.PAYLOAD.value]

        # Extract the payload count form the action data
        payload_count = action_data[ActionParam.PAYLOAD_COUNT.value]
        
        # Convert meta data keys to their corresponding MetaParam enums
        meta = {MetaParam(k): v for k, v in meta_data.items()}
        
        # Create and return a new MQTTMessage instance with the parsed data
        return cls(topic_enum, action_type, action, payload, payload_count, meta)