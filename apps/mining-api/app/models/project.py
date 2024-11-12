from django.db import models
from . import Mineral, Company, Document

class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    budget = models.DecimalField(max_digits=15, decimal_places=2)
    coords = models.JSONField(default=list)
    minerals = models.ManyToManyField(Mineral, related_name="projects", blank=True)
    companies = models.ManyToManyField(Company, related_name="projects", blank=True)
    documents = models.ManyToManyField(Document, related_name="projects", blank=True)

    def __str__(self):
        return self.name
