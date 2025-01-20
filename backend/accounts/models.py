import uuid
from django.db import models
from django.contrib.auth.models import User

class SingleUseToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='single_use_tokens')
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.token} - {self.user.username}"
