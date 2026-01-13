import string
import random
from .models import Links


def generate_code(length=5):
    chars = string.ascii_letters + string.digits
    while True:
        code = "".join(random.choices(chars, k=length))
        if not Links.objects.filter(short_url=code).exists():
            return code
