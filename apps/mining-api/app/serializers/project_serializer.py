from rest_framework import serializers
from ..models import Project
from . import MineralSerializer, CompanySerializer, DocumentSerializer
from ..models import Mineral, Company, Document

class ProjectSerializer(serializers.ModelSerializer):
    minerals = serializers.PrimaryKeyRelatedField(queryset=Mineral.objects.all(), many=True)
    companies = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), many=True)
    documents = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all(), many=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'budget', 'coords', 'minerals', 'companies', 'documents']

    def to_representation(self, instance):
            representation = super().to_representation(instance)

            representation['minerals'] = MineralSerializer(instance.minerals.all(), many=True).data
            representation['companies'] = CompanySerializer(instance.companies.all(), many=True).data
            representation['documents'] = DocumentSerializer(instance.documents.all(), many=True).data

            return representation
