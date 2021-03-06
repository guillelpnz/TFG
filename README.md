# TFG: Simulación de red de colas usando CanvasJS

## Introducción

Este proyecto fue desarrollado como TFG del grado en Ingeniería Informática por el alumno Guillermo Lupiáñez.
Consiste en una animación que simula el transcurso de las peticiones por las distintas estaciones de servicio
dentro de un servidor. Tiene fines didácticos y de optimización de servidores.

## Dependencias

Para poder ejecutar el proyecto, se debe descargar el gestor de paquetes pip3. Para esto podemos ejecutar 

```bash

sudo apt install python3-pip

```

También se debe descargar el framework django, así como la librería python-decouple,
que sirve para ocultar la SECRET_KEY automáticamente generada por Django. Además, instalaremos también el paquete numpy.
Esto puede hacerse mediante el comando:

```bash

pip3 install django python-decouple numpy

```

Posteriormente, lo que se debe hacer es crear una SECRET_KEY. Labores de la clave:

- Firma de datos serializados (por ejemplo, documentos JSON).

- Tokens únicos para una sesión de usuario, solicitud de restablecimiento de contraseña, mensajes, etc.

- Prevención de ataques entre sitios o de repetición agregando (y luego esperando) valores únicos para la solicitud.

- Generar una sal única para funciones hash.

Más información sobre la SECRET_KEY de Django en: https://docs.djangoproject.com/en/dev/ref/settings/#secret-key

Para no revelarla, una práctica usual es introducirla en un archivo oculto, que llamamos
.env. Para poder hacer esto, podemos hacer uso del siguiente comando:

```bash

echo "SECRET_KEY=valorSecreto" >> .env

```

## Inicialización del proyecto

Para inicializar el proyecto, se debe de estar en el mismo directorio en el que está el fichero: manage.py,
posteriormente, se debe ejecutar el comando:

```bash
  python3 manage.py runserver
```

## Acceso a la web del proyecto

Tal y como indica la consola, el proyecto se encuentra alojado en la dirección web local: http://127.0.0.1:8000/

## Formulario inicial

Lo primero que se debe hacer hacer es elegir si introducir la configuración del servidor mediante un archivo JSON,
o mediante un formulario web. 

### Mediante archivo json

En la carpeta /configs puede encontrarse una plantilla de JSON válida para su subida al servidor.

## Valores permitidos

- Se podrán introducir de 1 a 8 CPUS, y de 0 a 4 HDD, SSD y NIC. Nunca podrá haber 0 CPUS ni 0 HDD, SSD o NIC. 

- Los tiempos de servicio aceptan un valor mínimo de 0,001 y como máximo de 5. Esto es por motivos gráficos
referentes a la simulación.

- Las razones de visita deben tener un valor entre 0,001 y 10 si la casilla: constante no está marcada,
mientras que si está marcada, la entrada debe ser un número entero entre 1 y 10.

- La razón de visita acepta un valor entre 0,001 y 100.

## Información adicional

Marcar la casilla como constante en los tiempos de servicio o tasa de llegada, hará que estos valores
nunca cambien dentro de la simulación. Si no se marca, el tiempo será tomado a partir de una 
distribución exponencial.

Marcar esta casilla en la razón de visita, hará que los destinos que visita cada petición que entra al
servidor lo hagan exactamente el número de veces introducido. Si no se marca, los destinos de cada petición
se inicializan a partir de una distribución de Poisson.
