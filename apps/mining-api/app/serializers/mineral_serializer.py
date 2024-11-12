from rest_framework import serializers
from ..models import Mineral

class MineralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mineral
        fields = ['id', 'name']