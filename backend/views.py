from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import logging
import json
import numpy as np
logger = logging.getLogger(__name__)
# Get an instance of a logger

# Create your views here.
def index(request):
    
    context = {}

    dict_archivo = {
        "CPUS": [],
        "HDDS": [],
        "SSDS": [],
        "NICS": [],
        "tasaLlegada": None,
    }

    if request.method == 'POST' and request.POST:
        context = {'context':{
            'CPUS': [],
            'HDDS': [],
            'SSDS': [],
            'NICS': [],
            'errores':{},
        }}

        # context['context']["numHdds"] = ''
        # context['context']["numSsds"] = ''
        # context['context']["numNics"] = ''
        # context['context']["numCpus"] = ''
        # context['context']["eleccion_formulario"] = ''
        # context['context']["eleccion_json"] = ''
        # context["context"]["valores_erroneos"] = ''
        # context["context"]["archivo_no_valido"] = ''
        logger.error(request.POST)

        if request.POST.get("eleccion_formulario") and not request.POST.get("eleccion_json"):
            return render(request, "formulario_config_simulacion.html", context)
        elif request.POST.get("eleccion_json") and not request.POST.get("eleccion_formulario"):
            return render(request, "formulario_json.html", context)



        # if request.POST.get("numCpus") and \
        #    request.POST.get("numCpus") != '' and \
        #    int(request.POST.get("numCpus")) >= 1 and \
        #    int(request.POST.get("numCpus")) <= 8:
        #     context["context"]["numCpus"] = request.POST.get("numCpus")
        
        # if request.POST.get("duracionSimulacion") and \
        #    request.POST.get("duracionSimulacion") != '' and \
        #    int(request.POST.get("duracionSimulacion")) >=15 and \
        #    int(request.POST.get("duracionSimulacion")) <= 180:
        #     context["context"]["duracionSimulacion"] = request.POST.get("duracionSimulacion")
        
        archivo_json = ''
        archivo = ''

        if request.POST.get("archivo_json") and request.POST.get("archivo_json") != '':
            ok = True
            try:
                archivo = open('configs/'+request.POST.get("archivo_json"), "r")
            except:
                ok = False
            try:
                archivo_json = json.load(archivo)
            except:
                context["context"]["errores"]["archivo_no_valido"] = "El archivo no es válido"
                ok = False
            
            lista = []
            
            if ('CPUS' in archivo_json):
                lista = archivo_json['CPUS']
                i = 0
                
                for cpu in lista:
                    if not 'tiempoServicio' in cpu or not cpu['tiempoServicio'] > 0 or not cpu['tiempoServicio'] <= 5:
                        context["context"]["errores"][f"falta_tiempo_servicio_cpu{i}"] = "Debes introducir un tiempo de servicio dentro de (0,5] a las CPUS"
                        ok = False
                    
                    if not 'tiempoServicioConstante' in cpu and not type(cpu['tiempoServicioConstante']) is bool:
                        context["context"]["errores"][f"falta_tiempo_servicio_constante_cpu{i}"] = f"Debes especificar si el tiempo de servicio es constante o no para la CPU{i}"
                        ok = False
                    
                    if ok:
                        context["context"]["CPUS"].append(cpu)

                    i = i + 1
                if i == 0:
                    context["context"]["errores"]["falta_cpus"] = "Debe introducir al menos una CPU"
                    ok = False
            else:
                context["context"]["errores"]["falta_cpus"] = "Debe introducir al menos una CPU"
                ok = False
            
            lista = []
            contador = 0
            if ('HDDS' in archivo_json):
                lista = archivo_json['HDDS']
                i = 0
                
                for hdd in lista:
                    if not 'tiempoServicio' in hdd or not hdd['tiempoServicio'] > 0 or not hdd['tiempoServicio'] <= 5:
                        context["context"]["errores"][f"falta_tiempo_servicio_hdd{i}"] = "Debes introducir un tiempo de servicio dentro de (0,5] a las HDDS"
                        ok = False
                    
                    if not 'tiempoServicioConstante' in hdd or not type(hdd['tiempoServicioConstante']) is bool:
                        context["context"]["errores"][f"falta_tiempo_servicio_constante_hdd{i}"] = f"Debes especificar si el tiempo de servicio es constante o no para la HDD{i}"
                        ok = False
                    
                    if not 'razonVisita' in hdd or not hdd['razonVisita'] >= 0 or not hdd['razonVisita'] <= 10:
                        context["context"]["errores"][f"falta_razon_visita_hdd{i}"] = f"Debes introducir una razon de visita entre 0 y 10 para la HDD{i}"
                        ok = False
                    
                    if not 'razonVisitaConstante' in hdd or not type(hdd['razonVisitaConstante']) is bool:
                        context["context"]["errores"][f"falta_razon_visita_constante_hdd{i}"] = f"Debes especificar si la razon de visita es constante o no para la HDD{i}"
                        ok = False
                    if ok:
                        context["context"]["HDDS"].append(hdd)

                    i = i + 1
                    contador = contador + 1

            lista = []    
            if ('SSDS' in archivo_json):
                lista = archivo_json['SSDS']
                i = 0
                
                for ssd in lista:
                    if not 'tiempoServicio' in ssd or not ssd['tiempoServicio'] > 0 or not ssd['tiempoServicio'] <= 5:
                        context["context"]["errores"][f"falta_tiempo_servicio_ssd{i}"] = "Debes introducir un tiempo de servicio dentro de (0,5] a las SSDS"
                        ok = False
                    
                    if not 'tiempoServicioConstante' in ssd or not type(ssd['tiempoServicioConstante']) is bool:
                        context["context"]["errores"][f"falta_tiempo_servicio_constante_ssd{i}"] = f"Debes especificar si el tiempo de servicio es constante o no para la SSD{i}"
                        ok = False
                    
                    if not 'razonVisita' in ssd or not ssd['razonVisita'] >= 0 or not ssd['razonVisita'] <= 10:
                        context["context"]["errores"][f"falta_razon_visita_ssd{i}"] = f"Debes introducir una razon de visita entre 0 y 10 para la SSD{i}"
                        ok = False
                    
                    if not 'razonVisitaConstante' in ssd or not type(ssd['razonVisitaConstante']) is bool:
                        context["context"]["errores"][f"falta_razon_visita_constante_ssd{i}"] = f"Debes especificar si la razon de visita es constante o no para la SSD{i}"
                        ok = False
                    if ok:
                        context["context"]["SSDS"].append(ssd)

                    i = i + 1
                    contador = contador + 1
            
            lista = []
            if ('NICS' in archivo_json):
                lista = archivo_json['NICS']
                i = 0
                
                for nic in lista:
                    if not 'tiempoServicio' in nic or not nic['tiempoServicio'] > 0 or not nic['tiempoServicio'] <= 5:
                        context["context"]["errores"][f"falta_tiempo_servicio_nic{i}"] = "Debes introducir un tiempo de servicio dentro de (0,5] a las NICS"
                        ok = False
                    
                    if not 'tiempoServicioConstante' in nic or not type(nic['tiempoServicioConstante']) is bool:
                        context["context"]["errores"][f"falta_tiempo_servicio_constante_nic{i}"] = f"Debes especificar si el tiempo de servicio es constante o no para la NIC{i}"
                        ok = False
                    
                    if not 'razonVisita' in nic or not nic['razonVisita'] >= 0 or not nic['razonVisita'] <= 10:
                        context["context"]["errores"][f"falta_razon_visita_nic{i}"] = f"Debes introducir una razon de visita entre 0 y 10 para la NIC{i}"
                        ok = False
                    
                    if not 'razonVisitaConstante' in nic or not type(nic['razonVisitaConstante']) is bool:
                        context["context"]["errores"][f"falta_razon_visita_constante_nic{i}"] = f"Debes especificar si la razon de visita es constante o no para la NIC{i}"
                        ok = False
                    if ok:
                        context["context"]["NICS"].append(nic)

                    i = i + 1
                    contador = contador + 1
            
            if 'tasaLlegada' in archivo_json:
                if not 'cantidad' in archivo_json['tasaLlegada'] or not archivo_json['tasaLlegada']['cantidad'] >= 0.001 or not archivo_json['tasaLlegada']['cantidad'] <= 100:
                    context["context"]["errores"]["falta_tasa_llegada_cantidad"] = "Debes introducir una cantidad entre 0,001 y 100 para la tasa de llegada"
                    ok = False
                if not 'constante' in archivo_json['tasaLlegada']:
                    context["context"]["errores"]["falta_tasa_llegada_constante"] = "Debes especificar si la tasa de llegada es constante o no"
                    ok = False
                context["context"]["tasaLlegada"] = archivo_json['tasaLlegada']
            else:
                context["context"]["errores"]["falta_tasa_llegada"] = "Debes especificar una tasa de llegada"
                ok = False


            if contador == 0 or contador > 12:
                context["context"]["errores"]["fallo_numero_estaciones"] = "Debes introducir un número de estaciones de servicio entre 1 y 12"
                ok = False
            if (ok):
                return render(request, "index.html", context)
            else:
                logger.error(context)
                return render(request, "formulario_json.html", context)

            # if num_cpus <= 0 or num_cpus > 8 or num_hdds < 0 or num_ssds < 0 or num_nics < 0 or \
            #    num_ssds + num_hdds + num_nics <= 0:

            #     context["context"]["valores_erroneos"] = "No ha introducido valores dentro del rango especificado"
        else:
            for k,v in request.POST.items():
                context["context"][k] = v
            return render(request, "index.html", context)

        # if request.POST.get("numHdds") and request.POST.get("numHdds") != '':
        #     context["context"]["numHdds"] = request.POST.get("numHdds")
        # if request.POST.get("numSsds") and request.POST.get("numSsds") != '':
        #     context["context"]["numSsds"] = request.POST.get("numSsds")
        # if request.POST.get("numNics") and request.POST.get("numNics") != '':
        #     context["context"]["numNics"] = request.POST.get("numNics")

        # if context['context']["numHdds"] != '' and context['context']["numSsds"] != '' and context['context']["numNics"] != '':
        #     if context['context']["numHdds"] and context['context']["numSsds"] and context['context']["numNics"]:
        #         if int(context['context']["numHdds"]) + int(context['context']["numSsds"]) + int(context['context']["numNics"]) >= 1:
        #             for k,v in request.POST.items():
        #                 context["context"][k] = v
        #             return render(request, "index.html", context)
                # else:
                #     context = {"context":{
                #         "error": "Debes establecer al menos una estación de servicio"
                #     }}
        #             return render(request, "formulario_config_simulacion.html", context)
        # else:
        #     context = {"context":{
        #         "error": "Debes establecer al menos una estación de servicio"
        #     }}

            # s
        # elif request.POST.get("eleccion_json"):

    return render(request, "formulario_eleccion.html", context)