from rest_framework import serializers
from .models import Task, Category

class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.SlugRelatedField(
        read_only=True,
        slug_field = 'category_name'
    )
    class Meta:
        model = Task
        fields = ('id', 'title', 'category_name', 'completed')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('category_name',)
