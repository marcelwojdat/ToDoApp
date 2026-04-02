from rest_framework import serializers
from .models import Task, Category

class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.SlugRelatedField(
        queryset=Category.objects.all(),
        slug_field = 'category_name'
    )
    class Meta:
        model = Task
        fields = ('id', 'title', 'category_name', 'completed')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('category_name', 'id')
