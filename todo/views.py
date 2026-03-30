from rest_framework import viewsets
from .serializers import TaskSerializer, CategorySerializer
from .models import Task, Category

class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

class CategoryView(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()