from django.db import models

class Document(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField()
    coords = models.JSONField(default=list)

    def __str__(self):
        return self.name
