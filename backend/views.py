from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
# Create your views here.
def index(request):
    context = {}

    if request.method == 'POST' and request.POST:
        return render(request, "index.html", context)

    return render(request, "formulario_config_simulacion.html", context)