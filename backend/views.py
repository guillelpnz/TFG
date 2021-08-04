from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import logging
import json
logger = logging.getLogger(__name__)
# Get an instance of a logger

# Create your views here.
def index(request):
    
    context = {}

    if request.method == 'POST' and request.POST:
        context = {'context':{

        }}

        context['context']["duracionSimulacion"] = ''
        context['context']["numHdds"] = ''
        context['context']["numSsds"] = ''
        context['context']["numNics"] = ''
        context['context']["numCpus"] = ''
        context['context']["eleccion_formulario"] = ''
        context['context']["eleccion_json"] = ''
        context["context"]["valores_erroneos"] = ''
        context["context"]["archivo_no_valido"] = ''

        # logger.error(request.POST)

        if request.POST.get("eleccion_formulario") and not request.POST.get("eleccion_json"):
            return render(request, "formulario_config_simulacion.html", context)
        elif request.POST.get("eleccion_json") and not request.POST.get("eleccion_formulario"):
            return render(request, "formulario_json.html", context)

        if request.POST.get("numCpus") and \
           request.POST.get("numCpus") != '' and \
           int(request.POST.get("numCpus")) >= 1 and \
           int(request.POST.get("numCpus")) <= 8:
            context["context"]["numCpus"] = request.POST.get("numCpus")
        
        if request.POST.get("duracionSimulacion") and \
           request.POST.get("duracionSimulacion") != '' and \
           int(request.POST.get("duracionSimulacion")) >=15 and \
           int(request.POST.get("duracionSimulacion")) <= 180:
            context["context"]["duracionSimulacion"] = request.POST.get("duracionSimulacion")
        
        archivo_json = ''
        archivo = ''

        if request.POST.get("archivo_json") and request.POST.get("archivo_json") != '':
            try:
                archivo = open('configs/'+request.POST.get("archivo_json"), "r")
            except:
                print('aaaaaaaaaaaaa')
                print(archivo)
                print(request.POST.get("archivo_json"))
            try:
                archivo_json = json.load(archivo)
                logger.error(archivo_json)
            except:
                context["context"]["archivo_no_valido"] = "El archivo no es válido"
                
            try: 
                num_cpus = int(archivo_json['numCpus'])
                num_hdds = int(archivo_json['HDDs'])
                num_ssds = int(archivo_json['SSDs'])
                num_nics = int(archivo_json['NICs'])
                duracion_simulacion = int(archivo_json['duracionSimulacion'])
            except KeyError:
                context["context"]["archivo_no_valido"] = "El archivo no es válido"
            
            if num_cpus <= 0 or num_cpus > 8 or num_hdds < 0 or num_ssds < 0 or num_nics < 0 or \
            duracion_simulacion < 15 or duracion_simulacion > 120 or num_ssds + num_hdds + num_nics <= 0:

                context["context"]["valores_erroneos"] = "No ha introducido valores dentro del rango especificado"

            if context["context"]["valores_erroneos"] or context["context"]["archivo_no_valido"] \
                or context["context"]["archivo_no_valido"]:

                return render(request, "formulario_json.html", context)
            else:
                context["context"]["numCpus"] = num_cpus
                context["context"]["numHdds"] = num_hdds
                context["context"]["numSsds"] = num_ssds
                context["context"]["numNics"] = num_nics
                context["context"]["duracionSimulacion"] = duracion_simulacion

                return render(request, "index.html", context)

        if request.POST.get("numHdds") and request.POST.get("numHdds") != '':
            context["context"]["numHdds"] = request.POST.get("numHdds")
        if request.POST.get("numSsds") and request.POST.get("numSsds") != '':
            context["context"]["numSsds"] = request.POST.get("numSsds")
        if request.POST.get("numNics") and request.POST.get("numNics") != '':
            context["context"]["numNics"] = request.POST.get("numNics")

        if context['context']["numHdds"] != '' and context['context']["numSsds"] != '' and context['context']["numNics"] != '':
            if context['context']["numHdds"] and context['context']["numSsds"] and context['context']["numNics"]:
                if int(context['context']["numHdds"]) + int(context['context']["numSsds"]) + int(context['context']["numNics"]) >= 1:
                    return render(request, "index.html", context)
                else:
                    context = {"context":{
                        "error": "Debes establecer al menos una estación de servicio"
                    }}
                    return render(request, "formulario_config_simulacion.html", context)
        else:
            context = {"context":{
                "error": "Debes establecer al menos una estación de servicio"
            }}

            return render(request, "formulario_config_simulacion.html", context)
        # elif request.POST.get("eleccion_json"):

    return render(request, "formulario_eleccion.html", context)