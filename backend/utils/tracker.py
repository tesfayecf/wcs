# singleton.py

class RequestHandler:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(RequestHandler, cls).__new__(cls, *args, **kwargs)
            cls._instance.initialize()
        return cls._instance

    def initialize(self):
        # Initialize any required variables or resources here
        self.request_count = 0
        self.cache = {}

    def process_request(self, request):
        # Process the request here, accessing the database and other functions as needed
        self.request_count += 1
        print(f"Request #{self.request_count} processed")