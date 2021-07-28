/*
DUDAS
¿Qué es lo que hace el cliente y qué el servidor?
¿Dónde poner botones de añadir más CPU o más estaciones de servicio?
¿Desde la salida del servidor hacia donde se van? ¿Los que se van a la basura cómo los represento?
¿Las estaciones de servicio tienen que ir variando? He supuesto que sí
¿Tamaño y scroll en general todo bien?
*/

var canvas = document.getElementById('canvas');
canvas.width = 4 * window.innerWidth;
canvas.height = 4 * window.innerHeight;
var ctx = canvas.getContext('2d');

// recurso fisico o servidor

class RecursoFisico {
    constructor(x, y, vx, vy, radius = 5, color = 'blue', texto) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.texto = texto;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        ctx.font = (this.radius / 4).toString() + "pt Georgia";
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(this.texto, this.x, this.y - 25);
        ctx.fill();
        ctx.closePath();

    }
}

class EspacioCola {
    constructor(x, y, dx, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.dx, this.dx);
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.dx, this.dx);
        ctx.stroke();
        ctx.closePath();
    }
}

class Cola {
    constructor(x, y, tam, tamCuadrito, color) {
        this.x = x;
        this.y = y;
        this.tam = tam;
        this.cola = new Array(this.tam);
        this.color = color;

        for (var i = 0; i < this.tam; ++i) {
            let espacioCola = new EspacioCola(this.x + tamCuadrito * i, this.y, tamCuadrito, color)
            this.cola[i] = espacioCola;
        }
    }
    draw() {
        for (var i = 0; i < this.tam; ++i) {
            this.cola[i].draw();
        }
    }
}

class EstacionServicio {
    static nHuecos = 3;
    static tamHuecos = 50;
    constructor(nombreEstacion, xCola, yCola, numHuecos, tamHuecos, colorCola) {
        let grosorLinea = 0.3;
        EstacionServicio.nHuecos = numHuecos;
        //Tuberia más larga si es CPU
        if (nombreEstacion == 'CPU') {
            this.tuberiaEntrada = new Tuberia(xCola - 100.5, yCola + Tuberia.ancho / 2, xCola, yCola + Tuberia.ancho / 2, false, true);
        }
        else {
            this.tuberiaEntrada = new Tuberia(xCola - 80, yCola + Tuberia.ancho / 2, xCola, yCola + Tuberia.ancho / 2, false, true);
        }

        this.cola = new Cola(xCola, yCola, numHuecos, tamHuecos, colorCola);
        let xRecurso = numHuecos * tamHuecos + xCola + tamHuecos + grosorLinea;
        let yRecurso = yCola + tamHuecos / 2;
        this.recursoFisico = new RecursoFisico(xRecurso, yRecurso, 0, 0 + grosorLinea, tamHuecos, 'orange', nombreEstacion);

        this.tuberiaSalida = new Tuberia(xRecurso + this.recursoFisico.radius, yRecurso - tamHuecos / 4, xRecurso + this.recursoFisico.radius * 2 + 10.25, yRecurso - tamHuecos / 4, false, true);
        
        this.tiempoServicio = 2000; // ms
    }

    draw() {
        this.tuberiaEntrada.draw();
        this.recursoFisico.draw();
        this.cola.draw();
        this.tuberiaSalida.draw();
    }

}

// class Tuberia deberia de usar class Linea
class Tuberia {
    static ancho = 25;
    constructor(fromx, fromy, tox, toy, vertical, linea_blanca = false) {
        this.fromx = fromx;
        this.fromy = fromy;
        this.tox = tox;
        this.toy = toy;
        this.vertical = vertical;
        this.linea_blanca = linea_blanca;
    }

    draw() {
        ctx.strokeStyle = "black";
        ctx.fillStyle = 'black';
        ctx.lineWidth = '1';
        let linea = new Linea(this.fromx, this.fromy, this.tox, this.toy, 'black');
        linea.draw();

        if (this.vertical) {
            let linea = new Linea(this.fromx + Tuberia.ancho, this.fromy,
                this.tox + Tuberia.ancho, this.toy,
                'black'
            )
            linea.draw();

            //lineas blancas
            // ctx.strokeStyle = 'red';

            if (this.linea_blanca) {
                linea = new Linea(this.fromx, this.fromy, this.fromx + Tuberia.ancho, this.fromy, 'white');
                linea.draw();

                linea = new Linea(this.tox, this.toy, this.tox + Tuberia.ancho, this.toy, 'white');
                linea.draw();
            }

            // ctx.lineTo(this.fromx+Tuberia.ancho, this.fromy);

            // ctx.stroke();
        }
        else {
            // ctx.strokeStyle = 'black';
            // ctx.moveTo(this.fromx, this.fromy+Tuberia.ancho);
            // ctx.lineTo(this.tox, this.toy+Tuberia.ancho);
            let linea = new Linea(this.fromx, this.fromy + Tuberia.ancho, this.tox, this.toy + Tuberia.ancho, 'black');
            linea.draw();
            // ctx.stroke();

            // ctx.strokeStyle = 'red';

            if (this.linea_blanca) {
                linea = new Linea(this.fromx, this.fromy, this.fromx, this.fromy + Tuberia.ancho, 'white');
                linea.draw();

                linea = new Linea(this.tox, this.toy, this.tox, this.toy + Tuberia.ancho, 'white');
                linea.draw();
            }

            // ctx.moveTo(this.tox, this.toy);
            // ctx.lineTo(this.tox, this.toy+Tuberia.ancho);

            // ctx.stroke();

            //lineas blancas
        }
        ctx.stroke();
        ctx.closePath();

    }
}

class Linea {
    constructor(fromx, fromy, tox, toy, color) {
        this.fromx = fromx;
        this.fromy = fromy;
        this.tox = tox;
        this.toy = toy;
        this.color = color
    }
    draw() {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.fromx, this.fromy);
        ctx.lineTo(this.tox, this.toy);
        ctx.stroke();
        // ctx.strokeStyle = 'black';
        ctx.closePath();
    }
}

class Esquina {
    constructor(x, y, esquina) {
        ctx.strokeStyle = 'black'
        if (esquina == 'sup_izda') {
            let linea = new Linea(x, y, x, y - Tuberia.ancho);
            linea.draw();
            linea = new Linea(x, y - Tuberia.ancho, x + Tuberia.ancho, y - Tuberia.ancho);
            linea.draw();
        }
        else if (esquina == 'sup_dcha') {
            let linea = new Linea(x, y, x + Tuberia.ancho, y);
            linea.draw();
            linea = new Linea(x + Tuberia.ancho, y, x + Tuberia.ancho, y + Tuberia.ancho);
            linea.draw();
        }
        else if (esquina == 'inf_izda') {
            let linea = new Linea(x, y, x, y + Tuberia.ancho);
            linea.draw();
            linea = new Linea(x, y + Tuberia.ancho, x + Tuberia.ancho, y + Tuberia.ancho);
            linea.draw();
        }
        else if (esquina == 'inf_dcha') {
            let linea = new Linea(x, y, x, y + Tuberia.ancho);
            linea.draw();
            linea = new Linea(x, y + Tuberia.ancho, x - Tuberia.ancho, y + Tuberia.ancho);
            linea.draw();
        }
    }
}


function calcularPosicionesEstaciones(numCpu, numEstaciones) {
    let inicioDefecto = 160;
    let pos = {}
    if (numCpu > numEstaciones) {
        pos['cpus'] = inicioDefecto;
        let yMedio = (numCpu * inicioDefecto) / 2;

        let sumaMitad = (numEstaciones * pos['cpus']) / 2;
        pos['estaciones'] = pos['cpus'] + yMedio - sumaMitad;
        pos['medio'] = yMedio + inicioDefecto / 2 + Tuberia.ancho / 2;
    }
    else if (numCpu < numEstaciones) {
        pos['estaciones'] = inicioDefecto;
        let yMedio = (numEstaciones * inicioDefecto) / 2;
        let sumaMitad = (numCpu * pos['estaciones']) / 2;
        pos['cpus'] = pos['estaciones'] + yMedio - sumaMitad;
        pos['medio'] = yMedio + inicioDefecto / 2 + Tuberia.ancho / 2;
    }
    else {
        pos['cpus'] = pos['estaciones'] = inicioDefecto;
        pos['medio'] = (numEstaciones * pos['estaciones'] + inicioDefecto + Tuberia.ancho) / 2
    }

    pos['defecto'] = inicioDefecto;
    pos['separacion'] = inicioDefecto;
    return pos;
}

function dibujarCpus(pos, numCpu) {
    //dibujar cpus
    let inicioX = 280;

    var cpus = [new EstacionServicio('CPU', inicioX, pos['cpus'], EstacionServicio.nHuecos, 50, 'white')];

    cpus[0].draw();

    for (let i = 1; i < numCpu; ++i) {
        cpus.push(new EstacionServicio('CPU', inicioX, i * pos['separacion'] + pos['cpus'] + 0.5, EstacionServicio.nHuecos, 50, 'white'));
        cpus[i].draw();

        // abrir huecos

    }

    var tuberiaIntermediaIzda;
    var tuberiaIntermedia;

    if (numCpu > 1) {
        tuberiaIntermediaIzda = new Tuberia(cpus[0].tuberiaEntrada.fromx - Tuberia.ancho, cpus[0].tuberiaEntrada.fromy + Tuberia.ancho, cpus[cpus.length - 1].tuberiaEntrada.fromx - Tuberia.ancho, cpus[cpus.length - 1].tuberiaEntrada.fromy, true, false);
        tuberiaIntermediaIzda.draw();

        tuberiaIntermedia = new Tuberia(cpus[0].tuberiaSalida.tox, cpus[0].tuberiaSalida.toy + Tuberia.ancho, cpus[cpus.length - 1].tuberiaSalida.tox, cpus[cpus.length - 1].tuberiaSalida.toy, true, false);
        tuberiaIntermedia.draw();

        for (let i = 1; i < numCpu; ++i) {
            let espacio = new Linea(cpus[i].tuberiaEntrada.fromx, cpus[i].tuberiaEntrada.fromy,
                cpus[i].tuberiaEntrada.fromx, cpus[i].tuberiaEntrada.fromy + Tuberia.ancho,
                'white'
            );
            espacio.draw();

            espacio = new Linea(cpus[i].tuberiaSalida.tox, cpus[i].tuberiaSalida.toy,
                cpus[i].tuberiaSalida.tox, cpus[i].tuberiaSalida.toy + Tuberia.ancho,
                'white'
            );
            espacio.draw();
        }
    }
    return datos = {
        "cpus": cpus,
        "tuberiaIntermediaIzdaCpus": tuberiaIntermediaIzda,
        "tuberiaIntermediaDchaCpus": tuberiaIntermedia
    };
}

// sólo se llama si hay mas de 1 CPU
function dibujarEntradaCpus(cpus, numCpu, pos) {
    //esquina arriba izda principio
    let esquina = new Esquina(cpus[0].tuberiaEntrada.fromx - Tuberia.ancho, cpus[0].tuberiaEntrada.fromy + Tuberia.ancho, 'sup_izda');

    //esquina abajo izda principio
    esquina = new Esquina(cpus[cpus.length - 1].tuberiaEntrada.fromx - Tuberia.ancho, cpus[cpus.length - 1].tuberiaEntrada.fromy, 'inf_izda');


    //entrada a circuito

    //200 es la longitud de tuberia
    if (numCpu % 2 != 0) {
        var tuberiaPrincipio = new Tuberia(cpus[0].tuberiaEntrada.fromx - 160, cpus[(1 + cpus.length) / 2 - 1].tuberiaEntrada.fromy,
            cpus[0].tuberiaEntrada.fromx - Tuberia.ancho, cpus[(1 + cpus.length) / 2 - 1].tuberiaEntrada.fromy,
            false, true);
        tuberiaPrincipio.draw();
    }
    else {
        tuberiaPrincipio = new Tuberia(cpus[0].tuberiaEntrada.fromx - 160, pos['medio'] + Tuberia.ancho / 2,
            cpus[0].tuberiaEntrada.fromx - Tuberia.ancho, pos['medio'] + Tuberia.ancho / 2,
            false, true);
        tuberiaPrincipio.draw();
    }

    //esquinas cpus

    new Esquina(cpus[0].tuberiaSalida.tox, cpus[0].tuberiaSalida.toy, 'sup_dcha');

    new Esquina(cpus[numCpu - 1].tuberiaSalida.tox + Tuberia.ancho, cpus[numCpu - 1].tuberiaSalida.toy, 'inf_dcha');

    return tuberiaPrincipio;
}


//
function dibujarEstaciones(pos, listaEtiquetas,) {
    let iniCpusX = 300;
    let iniEstX = iniCpusX + 700.5
    var estaciones = [new EstacionServicio(listaEtiquetas[0], iniEstX, pos['estaciones'], 3, 50, 'white')];
    let dict = {}
    estaciones[0].draw();
    for (let i = 1; i < listaEtiquetas.length; ++i) {
        estaciones.push(new EstacionServicio(listaEtiquetas[i], iniEstX, i * pos['separacion'] + pos['estaciones'], 3, 50, 'white'));
        estaciones[i].draw();

        //100 = longitud tuberiaFinal

        //rellenar huequitos estaciones de servicio
        if (i < listaEtiquetas.length - 1) {
            let linea = new Linea(estaciones[i].tuberiaEntrada.fromx - Tuberia.ancho, estaciones[i].tuberiaEntrada.toy,
                estaciones[i].tuberiaEntrada.fromx - Tuberia.ancho, estaciones[i].tuberiaEntrada.toy + Tuberia.ancho,
                'black');
            linea.draw();
        }
    }

    var tuberiaIntermediaIzda, tuberiaIntermedia, tuberiaFinal;

    if (estaciones.length > 1) {
        tuberiaIntermediaIzda = new Tuberia(estaciones[0].tuberiaEntrada.fromx - Tuberia.ancho, estaciones[0].tuberiaEntrada.fromy + Tuberia.ancho, estaciones[estaciones.length - 1].tuberiaEntrada.fromx - Tuberia.ancho, estaciones[estaciones.length - 1].tuberiaEntrada.fromy, true, true);
        tuberiaIntermediaIzda.draw();

        //tuberia vertical de la derecha del todo
        tuberiaIntermedia = new Tuberia(estaciones[0].tuberiaSalida.tox, estaciones[0].tuberiaSalida.toy + Tuberia.ancho, estaciones[estaciones.length - 1].tuberiaSalida.tox, estaciones[estaciones.length - 1].tuberiaSalida.toy, true, true);
        tuberiaIntermedia.draw();

        tuberiaFinal = new Tuberia(tuberiaIntermedia.tox + Tuberia.ancho, pos['medio'], tuberiaIntermedia.tox + 100, pos['medio'], false, true);
        tuberiaFinal.draw();

        for (let i = 1; i < estaciones.length; ++i) {
            let espacio = new Linea(estaciones[i].tuberiaEntrada.fromx, estaciones[i].tuberiaEntrada.fromy,
                estaciones[i].tuberiaEntrada.fromx, estaciones[i].tuberiaEntrada.fromy + Tuberia.ancho,
                'white'
            );
            espacio.draw();

            espacio = new Linea(estaciones[i].tuberiaSalida.tox, estaciones[i].tuberiaSalida.toy,
                estaciones[i].tuberiaSalida.tox, estaciones[i].tuberiaSalida.toy + Tuberia.ancho,
                'white'
            );
            espacio.draw();
        }
    }


    dict['estaciones'] = estaciones;
    dict['tuberiaFinal'] = tuberiaFinal;
    dict['tuberiaIntermediaIzdaEstaciones'] = tuberiaIntermediaIzda;
    dict['tuberiaIntermediaDchaEstaciones'] = tuberiaIntermedia;

    return dict;
}

function restoRecorridoEstaciones(estaciones, tuberiaFinal, pos, numCpu, tuberiaPrincipio) {
    new Esquina(estaciones[0].tuberiaEntrada.fromx - Tuberia.ancho, estaciones[0].tuberiaEntrada.fromy + Tuberia.ancho, 'sup_izda');
    new Esquina(estaciones[estaciones.length - 1].tuberiaEntrada.fromx - Tuberia.ancho, estaciones[estaciones.length - 1].tuberiaEntrada.fromy, 'inf_izda');

    new Esquina(estaciones[0].tuberiaSalida.tox, estaciones[0].tuberiaSalida.toy, 'sup_dcha');
    new Esquina(estaciones[estaciones.length - 1].tuberiaSalida.tox + Tuberia.ancho, estaciones[estaciones.length - 1].tuberiaSalida.toy, 'inf_dcha');

    //recorrido de final a principio
    new Esquina(tuberiaFinal.tox, tuberiaFinal.toy, 'sup_dcha');

    var tuberiaPabajo;
    //tuberia pabajo
    if (numCpu > estaciones.length) {
        var tuberiaPabajo = new Tuberia(tuberiaFinal.tox, tuberiaFinal.toy + Tuberia.ancho,
            tuberiaFinal.tox, cpus[cpus.length - 1].tuberiaSalida.toy + Tuberia.ancho + pos['separacion'] - 100, true);
    }
    else {
        var tuberiaPabajo = new Tuberia(tuberiaFinal.tox, tuberiaFinal.toy + Tuberia.ancho,
            tuberiaFinal.tox, estaciones[estaciones.length - 1].tuberiaSalida.toy + Tuberia.ancho + pos['separacion'] - 100, true);
    }

    tuberiaPabajo.draw();
    new Esquina(tuberiaPabajo.tox + Tuberia.ancho, tuberiaPabajo.toy, 'inf_dcha')

    if (numCpu > 1) {
        var tuberiaIzda = new Tuberia(tuberiaPabajo.tox, tuberiaPabajo.toy,
            (tuberiaPrincipio.fromx + cpus[0].tuberiaEntrada.fromx) / 2 + Tuberia.ancho / 2, tuberiaPabajo.toy, false
        );
        tuberiaIzda.draw();

        new Esquina(tuberiaIzda.tox - Tuberia.ancho, tuberiaIzda.toy, 'inf_izda')

        var tuberiaParriba = new Tuberia(tuberiaIzda.tox - Tuberia.ancho, tuberiaIzda.toy,
            tuberiaIzda.tox - Tuberia.ancho, tuberiaPrincipio.toy + Tuberia.ancho,
            true, true);
        tuberiaParriba.draw();
    }
    else {
        var tuberiaIzda = new Tuberia(tuberiaPabajo.tox, tuberiaPabajo.toy,
            (cpus[0].tuberiaEntrada.fromx + cpus[0].tuberiaEntrada.tox) / 2 + Tuberia.ancho / 2, tuberiaPabajo.toy, false
        );
        tuberiaIzda.draw();

        new Esquina(tuberiaIzda.tox - Tuberia.ancho, tuberiaIzda.toy, 'inf_izda');

        var tuberiaParriba = new Tuberia(tuberiaIzda.tox - Tuberia.ancho, tuberiaIzda.toy,
            tuberiaIzda.tox - Tuberia.ancho, cpus[0].tuberiaEntrada.toy + Tuberia.ancho,
            true, true);
        tuberiaParriba.draw();
    }

    // 
    // 
    let dict = {
        'tuberiaIzda': tuberiaIzda,
        'tuberiaPabajo': tuberiaPabajo,
        'tuberiaParriba': tuberiaParriba
    }
    return dict
}

function salidaServidor(tuberiaCentral, numCpu, listaEtiquetas) {
    longitudSalida = 130;
    var suma = 0;
    //calcular el numero a partir de el inicio y final
    if (numCpu == 1 && listaEtiquetas.length > 1) {
        suma = (tuberiaCentral.tox - tuberiaCentral.fromx - longitudSalida + 30) / 2;
    }
    else if (numCpu == 1 && listaEtiquetas.length == 1) {
        suma = 120;
    }
    else if (numCpu > 1 && listaEtiquetas.length > 1) {
        suma = 110;
    }
    else {
        suma = (tuberiaCentral.tox - tuberiaCentral.fromx) / 2 + longitudSalida / 2 - 30;
    }
    let tuberiaSalida = new Tuberia(tuberiaCentral.fromx + suma, tuberiaCentral.fromy, tuberiaCentral.fromx + suma, tuberiaCentral.fromy - longitudSalida, true, true);
    tuberiaSalida.draw();

    return tuberiaSalida;
}

//funcion para hacer huecos blancos en tuberias

// class Simulacion{
//     constructor(estaciones)
// }

function main() {
    //dibujar cpus
    var numCpu = 3;
    // var listaEtiquetas = ['HDD', 'SSD', 'NIC'];
    var listaEtiquetas = ['HDD0', 'HDD1', 'HDD2'];

    var pos = calcularPosicionesEstaciones(numCpu, listaEtiquetas.length);

    dict_cpus = dibujarCpus(pos, numCpu);
    cpus = dict_cpus["cpus"];

    var dict = dibujarEstaciones(pos, listaEtiquetas);

    if (numCpu > 1) {
        var tuberiaPrincipio = dibujarEntradaCpus(cpus, numCpu, pos);
        dict['tuberiaPrincipio'] = tuberiaPrincipio
    }

    dict['tuberiaIntermediaIzdaCpus'] = dict_cpus["tuberiaIntermediaIzdaCpus"];
    dict['tuberiaIntermediaDchaCpus'] = dict_cpus["tuberiaIntermediaDchaCpus"];
    var estaciones = dict['estaciones'];
    var tuberiaFinal = dict['tuberiaFinal'];

    //resto recorrido estaciones
    if (estaciones.length > 1) {
        let dict_resto = restoRecorridoEstaciones(estaciones, tuberiaFinal, pos, numCpu, tuberiaPrincipio);
        dict = { ...dict, ...dict_resto };
    }

    //tuberia central

    if (numCpu > 1) {
        if (estaciones.length > 1) {
            var tuberiaCentral = new Tuberia(cpus[0].tuberiaSalida.tox + Tuberia.ancho, pos['medio'],
                estaciones[0].tuberiaEntrada.fromx - Tuberia.ancho, pos['medio'],
                false, true);
        }
        else {
            var tuberiaCentral = new Tuberia(cpus[0].tuberiaSalida.tox + Tuberia.ancho, pos['medio'],
                estaciones[0].tuberiaEntrada.fromx, pos['medio'],
                false, true);
        }
        tuberiaCentral.draw();
    }
    //se descuadra debido a las tuberias adicionales que sí hay con mas cpus
    else {
        if (estaciones.length > 1) {
            var tuberiaCentral = new Tuberia(cpus[0].tuberiaSalida.tox, pos['cpus'] + Tuberia.ancho / 2,
                estaciones[0].tuberiaEntrada.fromx - Tuberia.ancho, pos['cpus'] + Tuberia.ancho / 2,
                false, true);
        }
        else {
            var tuberiaCentral = new Tuberia(cpus[0].tuberiaSalida.tox, pos['medio'],
                estaciones[0].tuberiaEntrada.fromx, pos['medio'],
                false);
        }
    }

    tuberiaCentral.draw();
    dict['tuberiaSalida'] = salidaServidor(tuberiaCentral, numCpu, listaEtiquetas);

    //recorrido de fin a inicio!

    if (estaciones.length == 1) {
        //dibujar esquinita superior derecha
        new Esquina(estaciones[0].tuberiaSalida.tox, estaciones[0].tuberiaSalida.toy, 'sup_dcha');

        //conjunto de tuberias hacia la izda

        //tuberia hacia abajo
        var tuberia = new Tuberia(estaciones[0].tuberiaSalida.tox, estaciones[0].tuberiaSalida.toy + Tuberia.ancho, estaciones[0].tuberiaSalida.tox, cpus[cpus.length - 1].tuberiaSalida.toy + Tuberia.ancho + pos['separacion'], true);
        tuberia.draw();
        dict['tuberiaPabajo'] = tuberia;

        //esquinita inferior derecha
        new Esquina(tuberia.tox + Tuberia.ancho, tuberia.toy, 'inf_dcha')



        //tuberia parriba

        if (numCpu == 1) {
            //tuberia a la izda
            var tuberiaIzda = new Tuberia(tuberia.tox, tuberia.toy, (cpus[0].tuberiaEntrada.fromx + cpus[0].cola.x) / 2 + Tuberia.ancho / 2, tuberia.toy);
            tuberiaIzda.draw();

            //esquinita inferior izquierda
            new Esquina(tuberiaIzda.tox - Tuberia.ancho, tuberia.toy, 'inf_izda')

            var tuberiaParriba = new Tuberia(tuberiaIzda.tox - Tuberia.ancho, tuberia.toy,
                tuberiaIzda.tox - Tuberia.ancho, cpus[0].tuberiaEntrada.fromy + Tuberia.ancho,
                true, true);
            tuberiaParriba.draw();
        }
        else {
            var tuberiaIzda = new Tuberia(tuberia.tox, tuberia.toy, (tuberiaPrincipio.fromx + cpus[0].tuberiaEntrada.fromx) / 2 + Tuberia.ancho / 2, tuberia.toy);
            tuberiaIzda.draw();

            new Esquina(tuberiaIzda.tox - Tuberia.ancho, tuberia.toy, 'inf_izda')

            var tuberiaParriba = new Tuberia(tuberiaIzda.tox - Tuberia.ancho, tuberia.toy,
                tuberiaIzda.tox - Tuberia.ancho, tuberiaPrincipio.toy + Tuberia.ancho,
                true, true);
            tuberiaParriba.draw();
        }
        dict['tuberiaIzda'] = tuberiaIzda;
        dict['tuberiaParriba'] = tuberiaParriba;

    }

    dict['cpus'] = cpus;
    dict['estaciones'] = estaciones;
    dict['tuberiaCentral'] = tuberiaCentral;

    return dict;
}

var datos = main();

// el server tiene que decidir los destinos de acuerdo a los que hay (se piden los destinos por GET)
// el server los manda en formato json

// una cpu se ha pasado si la x ha estao en donde todas las cpus y la y en un rango

class Peticion {

    constructor(){
        this.x = (datos['cpus'].length == 1) ? datos['cpus'][0].tuberiaEntrada.fromx + Tuberia.ancho / 2 : datos['tuberiaPrincipio'].fromx + Tuberia.ancho / 2;
        this.y = (datos['cpus'].length == 1) ? datos['cpus'][0].tuberiaEntrada.fromy + Tuberia.ancho / 2 : datos['tuberiaPrincipio'].fromy + Tuberia.ancho / 2;
        this.vx = default_v;
        this.vy = 0;
        this.radius = 10;
        this.color = getRandomColor();
        this.horaEntrada = -1;
        this.reAvanzar = false;
        this.destinos = ['CPU', 'HDD1', 'CPU'];
        this.ultDestino = null;
        this.ubiUltDestino = null;
        this.proxDestino = {
            'cpus': 0,
            'estaciones': 0,
        }
        this.decidiDestino = false;
    }

    parar(){
        this.vx = 0;
        this.vy = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }

    avanzarDcha(v) {
        this.vx = v;
        this.vy = 0;
    }
    avanzarIzda(v) {
        this.vx = -v;
        this.vy = 0;
    }
    avanzarArriba(v) {
        this.vx = 0;
        this.vy = -v;
    }
    avanzarAbajo(v) {
        this.vx = 0;
        this.vy = v;
    }

    // primero hacer tema destinos

    // si hay más de una cpu disponible, tienes que ver si tienes ese destino como el siguiente, y analizar a cual ir dependiendo de la ocupacion de cada uno.
    // tienes que estar en tuberia principio antes de tuberia intermedia izda cpu o estaciones. 

    //la funcion que devuelve la estacion menos ocupada recibe como parametro el nombre y devuelve el índice de la estación.
    // el cuerpo de la función recorre todas las peticiones para ver cuántas hay entre la cola y el recurso fisico de cada estacion con ese nombre

    // la funcion ubiFromNombres no funciona. Hay que saber si estas entre tuberiaInicio y tuberiaIntermediaIzdaCPUS y el nombre del siguiente destino es == CPU.
    // entonces calculas donde está el menos ocupado
    haciaDestino() {
        console.log('this.x->' + this.x)
        console.log('this.y->' + this.y)

        // si quedan destinos por visitar
        if (this.destinos.length) {
            //estamos en el tramo de tuberia salida de estacion de servicio
            if (datos['cpus'].length == 1) {
                if (this.x >= datos['cpus'][0].tuberiaEntrada.fromx && this.x < datos['cpus'][0].cola.cola[0].x + EstacionServicio.tamHuecos / 2 &&
                    this.y == datos['cpus'][0].tuberiaEntrada.fromy + Tuberia.ancho / 2) {
                    let salto = xDchaCerca(this.x, datos['cpus'][0].cola.cola[0].x + EstacionServicio.tamHuecos / 2, default_v);
                    if (salto) {
                        this.avanzarDcha(salto);
                    }
                    else {
                        this.avanzarDcha(default_v);
                    }
                }

                else if (this.y == datos['cpus'][0].tuberiaEntrada.fromy + Tuberia.ancho / 2 &&
                    this.x >= datos['cpus'][0].cola.cola[0].x + EstacionServicio.tamHuecos / 2 && this.x < datos['cpus'][0].recursoFisico.x
                ) {
                    for (let i = 0; i < datos['cpus'][0].cola.cola.length; ++i) {
                        if (this.x == datos['cpus'][0].cola.cola[i].x + EstacionServicio.tamHuecos / 2) {
                            //"Si el siguiente hueco está ocupado:
                            //    parar, 
                            //else: 
                            //    seguir"
                            // de momento siempre se para
                            //

                            if (i < datos['cpus'][0].cola.cola.length - 1 && 
                                intervaloXOcupado(datos['cpus'][0].cola.cola[i].x + EstacionServicio.tamHuecos / 2,
                                                  datos['cpus'][0].cola.cola[i+1].x + EstacionServicio.tamHuecos / 2,
                                                  datos['cpus'][0].cola.cola[i+1].y + EstacionServicio.tamHuecos / 2
                                )
                            ){
                                this.parar();
                            }
                            else if (i == datos['cpus'][0].cola.cola.length - 1 && 
                                     intervaloXOcupado(datos['cpus'][0].cola.cola[i].x + EstacionServicio.tamHuecos / 2,
                                                       datos['cpus'][0].recursoFisico.x,
                                                       datos['cpus'][0].recursoFisico.y
                                     )
                            )
                            {
                                this.parar();
                            }
                            
                            else {
                                this.avanzarDcha(default_v);
                            }
                            break;
                        }
                        else {
                            if (i != datos['cpus'][0].cola.cola.length - 1) {
                                let salto = xDchaCerca(this.x, datos['cpus'][0].cola.cola[i + 1].x + EstacionServicio.tamHuecos / 2, default_v);

                                if (salto) {
                                    this.avanzarDcha(salto);
                                    this.horaEntrada = -1;
                                    break;
                                }
                                else {
                                    this.avanzarDcha(default_v);
                                }
                            }
                            //Hay que saltar al recurso fisico
                            else {
                                let salto = xDchaCerca(this.x, datos['cpus'][0].recursoFisico.x, default_v);

                                if (salto) {
                                    this.avanzarDcha(salto);
                                    break;
                                }
                                else {
                                    this.avanzarDcha(default_v);
                                }
                            }
                        }
                    }
                }

                else if (this.y == datos['cpus'][0].tuberiaEntrada.fromy + Tuberia.ancho / 2 && 
                         this.x == datos['cpus'][0].recursoFisico.x
                ){
                    if (this.horaEntrada == -1) {
                        this.horaEntrada = new Date().getTime();
                    }
                    if (this.horaEntrada + 1000 > new Date().getTime()) {
                        console.log('paramos recurso cpu')
                        this.parar();
                    }
                    else {
                        this.avanzarDcha(default_v);
                        this.destinos.shift();
                        this.horaEntrada = -1;
                        if (!this.destinos[0]){
                            this.destinos.push('EXIT')
                        }
                    }
                }

                else if (this.x == datos['cpus'][0].recursoFisico.x &&
                         this.y == datos['cpus'][0].tuberiaEntrada.fromy + Tuberia.ancho / 2 
                ){
                    if (this.horaEntrada == -1) {
                        this.horaEntrada = new Date().getTime();
                    }
                    if (this.horaEntrada + datos['cpus'][0].tiempoServicio > new Date().getTime()) {
                        this.parar();
                    }
                    else {
                        this.avanzarDcha(default_v);
                        this.horaEntrada = -1;
                    }
                }

                // else if (this.x > )
            }
            // más de una CPU
            else {
                if (this.x >= datos['tuberiaPrincipio'].fromx && this.x < datos['tuberiaPrincipio'].tox + Tuberia.ancho / 2 &&
                    this.y == datos['tuberiaPrincipio'].fromy + Tuberia.ancho / 2) {
                    //Avanzar a la dcha hasta llegar a tuberiaIntermediaIzdaCPU
                    console.log('tuberiaPrincipio')
                    let salto = xDchaCerca(this.x, datos['tuberiaIntermediaIzdaCpus'].fromx + Tuberia.ancho / 2, default_v);
                    if (salto) {
                        this.avanzarDcha(salto)
                    }
                    else {
                        this.avanzarDcha(default_v)
                    }
                }

                // aquí debemos ver si hay que ir parriba o pabajo. De momento vamos a ir siempre arriba
                // además el parametro datos['cpus'][0] se cambia por la cpu que este libre

                if (this.x == datos['tuberiaIntermediaIzdaCpus'].fromx + Tuberia.ancho / 2 &&
                    this.y > datos['tuberiaIntermediaIzdaCpus'].fromy - Tuberia.ancho / 2 && this.y < datos['tuberiaIntermediaIzdaCpus'].toy + Tuberia.ancho / 2
                ) {
                    // hay que ir a donde esté la cpu más libre.
                    // entrar aqui solo una vez

                    if (!this.decidiDestino){
                        this.proxDestino['cpus'] = estacionLibre(this.destinos[0]);
                        this.decidiDestino = true;
                    }
                    // si estamos debajo de nuestra cpu destino, avanzamos arriba
                    if (this.y > datos['cpus'][this.proxDestino['cpus']].tuberiaEntrada.fromy + Tuberia.ancho / 2){
                        let salto = yArribaCerca(this.y, datos['cpus'][this.proxDestino['cpus']].tuberiaEntrada.fromy + Tuberia.ancho / 2, default_v);

                        if (salto) {
                            console.log('saltooo->'+salto)
                            this.avanzarArriba(salto);
                        }
                        else {
                            this.avanzarArriba(default_v);
                        }
                    }
                    else if (this.y < datos['cpus'][this.proxDestino['cpus']].tuberiaEntrada.fromy + Tuberia.ancho / 2){
                        let salto = yAbajoCerca(this.y, datos['cpus'][this.proxDestino['cpus']].tuberiaEntrada.fromy + Tuberia.ancho / 2, default_v);

                        if (salto) {
                            this.avanzarAbajo(salto);
                        }
                        else {
                            this.avanzarAbajo(default_v);
                        }
                    }
                    else{
                        this.avanzarDcha(default_v);
                    }
                }

                // aqui vamos a la dcha porque estamos en la entrada de las CPUS
                else if (this.x >= datos['cpus'][this.proxDestino['cpus']].tuberiaEntrada.fromx && this.x < datos['cpus'][this.proxDestino['cpus']].cola.cola[0].x + EstacionServicio.tamHuecos / 2 &&
                    this.y == datos['cpus'][this.proxDestino['cpus']].tuberiaEntrada.fromy + Tuberia.ancho / 2
                ) {
                    let salto = xDchaCerca(this.x, datos['cpus'][this.proxDestino['cpus']].cola.cola[0].x + EstacionServicio.tamHuecos / 2, default_v);

                    if (salto) {
                        this.avanzarDcha(salto);
                    }
                    else {
                        this.avanzarDcha(default_v);
                    }
                    this.decidiDestino = false;
                }
                else if (this.y == datos['cpus'][this.proxDestino['cpus']].tuberiaEntrada.fromy + Tuberia.ancho / 2 &&
                         this.x > datos['tuberiaIntermediaIzdaCpus'].fromx - Tuberia.ancho / 2 && 
                         this.x < datos['tuberiaIntermediaDchaCpus'].fromx + Tuberia.ancho / 2
                ) {
                    // estamos entre el principio de la cola y el centro del recurso fisico
                    for (let i = 0; i < datos['cpus'][this.proxDestino['cpus']].cola.cola.length; ++i) {
                        if (this.x == datos['cpus'][this.proxDestino['cpus']].cola.cola[i].x + EstacionServicio.tamHuecos / 2) {
                            //"Si el siguiente hueco está ocupado:
                            //    parar, 
                            //else: 
                            //    seguir"
                            // de momento siempre se para
                            //

                            // aqui debe pararse hasta que el siguiente hueco no esté ocupado
                            if (i < datos['cpus'][this.proxDestino['cpus']].cola.cola.length - 1 && 
                                intervaloXOcupado(datos['cpus'][this.proxDestino['cpus']].cola.cola[i].x + EstacionServicio.tamHuecos / 2,
                                                  datos['cpus'][this.proxDestino['cpus']].cola.cola[i+1].x + EstacionServicio.tamHuecos / 2,
                                                  datos['cpus'][this.proxDestino['cpus']].cola.cola[i+1].y + EstacionServicio.tamHuecos / 2
                                )
                            ){
                                this.parar();
                            }
                            else if (i == datos['cpus'][this.proxDestino['cpus']].cola.cola.length - 1 && 
                                     intervaloXOcupado(datos['cpus'][this.proxDestino['cpus']].cola.cola[i].x + EstacionServicio.tamHuecos / 2,
                                                       datos['cpus'][this.proxDestino['cpus']].recursoFisico.x,
                                                       datos['cpus'][this.proxDestino['cpus']].recursoFisico.y
                                     )
                            )
                            {
                                this.parar();
                            }
                            
                            else {
                                this.avanzarDcha(default_v);
                            }
                            break;
                        }
                        else {
                            if (i <  datos['cpus'][this.proxDestino['cpus']].cola.cola.length - 1) {
                                let salto = xDchaCerca(this.x, datos['cpus'][this.proxDestino['cpus']].cola.cola[i + 1].x + EstacionServicio.tamHuecos / 2, default_v);

                                if (salto) {
                                    this.avanzarDcha(salto);
                                    this.horaEntrada = -1;
                                    break;
                                }
                                else {
                                    this.avanzarDcha(default_v);
                                }
                            }
                            //Hay que saltar al recurso fisico
                            else {
                                let salto = xDchaCerca(this.x, datos['cpus'][this.proxDestino['cpus']].recursoFisico.x, default_v);

                                if (salto) {
                                    this.avanzarDcha(salto);
                                    break;
                                }
                                else {
                                    this.avanzarDcha(default_v);
                                }
                            }
                        }
                    }

                    if (this.x == datos['cpus'][this.proxDestino['cpus']].recursoFisico.x) {
                        if (this.horaEntrada == -1) {
                            this.horaEntrada = new Date().getTime();
                        }
                        if (this.horaEntrada + datos['cpus'][this.proxDestino['cpus']].tiempoServicio > new Date().getTime()) {
                            this.parar();
                        }
                        else {
                            this.avanzarDcha(default_v);
                            this.destinos.shift();
                            this.horaEntrada = -1;
                            if (!this.destinos[0]){
                                this.destinos.push('EXIT')
                            }
                        }
                    }
                    else if (this.x > datos['cpus'][this.proxDestino['cpus']].recursoFisico.x && this.x < datos['tuberiaIntermediaDchaCpus'].fromx + Tuberia.ancho / 2) {
                        let salto = xDchaCerca(this.x, datos['tuberiaIntermediaDchaCpus'].fromx + Tuberia.ancho / 2, default_v);

                        if (salto) {
                            this.avanzarDcha(salto);
                        }
                        else {
                            this.avanzarDcha(default_v);
                        }
                    }
                }

                if (this.x == datos['tuberiaIntermediaDchaCpus'].fromx + Tuberia.ancho / 2 &&
                    this.y >= datos['tuberiaIntermediaDchaCpus'].fromy - Tuberia.ancho / 2 && this.y <= datos['tuberiaIntermediaDchaCpus'].toy + Tuberia.ancho / 2
                ) {
                    // avanzar hacia la direccion de tuberia Central
                    let salto = yAbajoCerca(this.y, datos['tuberiaCentral'].fromy + Tuberia.ancho / 2, default_v);
                    if (this.y < datos['tuberiaCentral'].fromy + Tuberia.ancho / 2) {
                        if (salto) {
                            this.avanzarAbajo(salto);
                        }
                        else {
                            this.avanzarAbajo(default_v);
                        }
                    }
                    else if (this.y > datos['tuberiaCentral'].fromy + Tuberia.ancho / 2) {
                        if (salto) {
                            this.avanzarArriba(salto);
                        }
                        else {
                            this.avanzarArriba(default_v);
                        }
                    }
                    else {
                        this.avanzarDcha(default_v);
                    }
                }

            }


            if (datos['estaciones'].length == 1){

                if (this.y == datos['tuberiaCentral'].fromy + Tuberia.ancho / 2 && 
                    this.x > datos['tuberiaCentral'].fromx - Tuberia.ancho / 2 && 
                    this.x < datos['estaciones'][0].cola.cola[0].x + EstacionServicio.tamHuecos / 2
                )
                {
                    let salto = xDchaCerca(this.x, datos['estaciones'][0].cola.cola[0].x + EstacionServicio.tamHuecos / 2, default_v);

                    if (salto){
                        this.avanzarDcha(salto);
                    }
                    else{
                        this.avanzarDcha(default_v)
                    }
                }

                if (this.y == datos['tuberiaCentral'].fromy + Tuberia.ancho / 2 && 
                         this.x >= datos['estaciones'][0].cola.cola[0].x + EstacionServicio.tamHuecos / 2 && 
                         this.x <= datos['estaciones'][0].recursoFisico.x
                )
                {
                    for (let i = 0; i < datos['estaciones'][0].cola.cola.length; ++i) {
                        if (this.x == datos['estaciones'][0].cola.cola[i].x + EstacionServicio.tamHuecos / 2) {
                            //"Si el siguiente hueco está ocupado:
                            //    parar, 
                            //else: 
                            //    seguir"
                            // de momento siempre se para
                            //

                            // aqui debe pararse hasta que el siguiente hueco no esté ocupado
                            if (i < datos['estaciones'][0].cola.cola.length - 1 && 
                                intervaloXOcupado(datos['estaciones'][0].cola.cola[i].x + EstacionServicio.tamHuecos / 2,
                                                  datos['estaciones'][0].cola.cola[i+1].x + EstacionServicio.tamHuecos / 2,
                                                  datos['estaciones'][0].cola.cola[i+1].y + EstacionServicio.tamHuecos / 2)
                            ){
                                this.parar();
                            }
                            else if (i == datos['estaciones'][0].cola.cola.length - 1 && 
                                     intervaloXOcupado(datos['estaciones'][0].cola.cola[i].x + EstacionServicio.tamHuecos / 2,
                                                       datos['estaciones'][0].recursoFisico.x,
                                                       datos['estaciones'][0].recursoFisico.y
                                     )
                            )
                            {
                                this.parar();
                            }
                            
                            else {
                                this.avanzarDcha(default_v);
                            }
                            break;
                        }
                        else {
                            if (i <  datos['estaciones'][0].cola.cola.length - 1) {
                                let salto = xDchaCerca(this.x, datos['estaciones'][0].cola.cola[i + 1].x + EstacionServicio.tamHuecos / 2, default_v);

                                if (salto) {
                                    this.avanzarDcha(salto);
                                    this.horaEntrada = -1;
                                    break;
                                }
                                else {
                                    this.avanzarDcha(default_v);
                                }
                            }
                            //Hay que saltar al recurso fisico
                            else {
                                let salto = xDchaCerca(this.x, datos['estaciones'][0].recursoFisico.x, default_v);

                                if (salto) {
                                    this.avanzarDcha(salto);
                                    break;
                                }
                                else {
                                    this.avanzarDcha(default_v);
                                }
                            }
                        }
                    }

                    if (this.x == datos['estaciones'][0].recursoFisico.x) {
                        if (this.horaEntrada == -1) {
                            this.horaEntrada = new Date().getTime();
                        }
                        if (this.horaEntrada + datos['estaciones'][0].tiempoServicio > new Date().getTime()) {
                            this.parar();
                        }
                        else {
                            this.avanzarDcha(default_v);
                            this.destinos.shift();
                            this.horaEntrada = -1;
                        }
                    }
                }
                else if (this.x > datos['estaciones'][0].recursoFisico.x && 
                    this.x < datos['tuberiaPabajo'].fromx + Tuberia.ancho / 2 &&
                    this.y == datos['tuberiaCentral'].fromy + Tuberia.ancho / 2)
                {
                    let salto = xDchaCerca(this.x, datos['tuberiaPabajo'].fromx + Tuberia.ancho/2, default_v);
                
                    if (salto){
                        this.avanzarDcha(salto);
                    }
                    else{
                        this.avanzarDcha(default_v);
                    }
                }

            }

            else{
                // tramo tuberiaIntermediaIzdaEstaciones
                if (this.y >= datos['estaciones'][0].tuberiaEntrada.fromy - Tuberia.ancho / 2  && 
                    this.y <= datos['estaciones'][datos['estaciones'].length-1].tuberiaEntrada.fromy + Tuberia.ancho / 2 &&
                    this.x == datos['tuberiaIntermediaIzdaEstaciones'].fromx + Tuberia.ancho / 2
                ){
                    console.log('estamos en decision estacion y proxDestino es: '+this.destinos[0])
                    this.proxDestino['estaciones'] = this.destinos[0][this.destinos[0].length-1];

                    // si estamos debajo de nuestra estacion destino, avanzamos arriba
                    if (this.y > datos['estaciones'][this.proxDestino['estaciones']].tuberiaEntrada.fromy + Tuberia.ancho / 2){
                        let salto = yArribaCerca(this.y, datos['estaciones'][this.proxDestino['estaciones']].tuberiaEntrada.fromy + Tuberia.ancho / 2, default_v);

                        if (salto) {
                            this.avanzarArriba(salto);
                        }
                        else {
                            this.avanzarArriba(default_v);
                        }

                    }
                    else if (this.y < datos['estaciones'][this.proxDestino['estaciones']].tuberiaEntrada.fromy + Tuberia.ancho / 2){
                        let salto = yAbajoCerca(this.y, datos['estaciones'][this.proxDestino['estaciones']].tuberiaEntrada.fromy + Tuberia.ancho / 2, default_v);

                        if (salto) {
                            this.avanzarAbajo(salto);
                        }
                        else {
                            this.avanzarAbajo(default_v);
                        }
                    }
                    else{
                        this.avanzarDcha(default_v);
                    }
                }

                else if (this.y == datos['estaciones'][this.proxDestino['estaciones']].tuberiaEntrada.fromy + Tuberia.ancho / 2 && 
                         this.x >= datos['tuberiaIntermediaIzdaEstaciones'].fromx + Tuberia.ancho / 2 && 
                         this.x < datos['estaciones'][this.proxDestino['estaciones']].cola.cola[0].x + EstacionServicio.tamHuecos / 2
                ){
                    let salto = xDchaCerca(this.x, datos['estaciones'][this.proxDestino['estaciones']].cola.cola[0].x + EstacionServicio.tamHuecos / 2, default_v);

                    if (salto){
                        this.avanzarDcha(salto);
                        this.horaEntrada = -1;
                    }
                    else{
                        this.avanzarDcha(default_v);
                    }
                }

                else if (this.y == datos['estaciones'][this.proxDestino['estaciones']].tuberiaEntrada.fromy + Tuberia.ancho / 2 &&
                         this.x >= datos['estaciones'][this.proxDestino['estaciones']].cola.cola[0].x + EstacionServicio.tamHuecos / 2 && 
                         this.x <= datos['estaciones'][this.proxDestino['estaciones']].recursoFisico.x
                )
                {
                    
                    for (let i = 0; i < datos['estaciones'][this.proxDestino['estaciones']].cola.cola.length; ++i) {
                        if (this.x == datos['estaciones'][this.proxDestino['estaciones']].cola.cola[i].x + EstacionServicio.tamHuecos / 2) {
                            //"Si el siguiente hueco está ocupado:
                            //    parar, 
                            //else: 
                            //    seguir"
                            // de momento siempre se para
                            //

                            // aqui debe pararse hasta que el siguiente hueco no esté ocupado
                            if (i < datos['estaciones'][this.proxDestino['estaciones']].cola.cola.length - 1 && 
                                intervaloXOcupado(datos['estaciones'][this.proxDestino['estaciones']].cola.cola[i].x + EstacionServicio.tamHuecos / 2,
                                                  datos['estaciones'][this.proxDestino['estaciones']].cola.cola[i+1].x + EstacionServicio.tamHuecos / 2,
                                                  datos['estaciones'][this.proxDestino['estaciones']].cola.cola[i+1].y + EstacionServicio.tamHuecos / 2)
                            ){
                                this.parar();
                            }
                            else if (i == datos['estaciones'][this.proxDestino['estaciones']].cola.cola.length - 1 && 
                                     intervaloXOcupado(datos['estaciones'][this.proxDestino['estaciones']].cola.cola[i].x + EstacionServicio.tamHuecos / 2,
                                                       datos['estaciones'][this.proxDestino['estaciones']].recursoFisico.x,
                                                       datos['estaciones'][this.proxDestino['estaciones']].recursoFisico.y
                                     )
                            )
                            {
                                this.parar();
                            }
                            
                            else {
                                this.avanzarDcha(default_v);
                            }
                            break;
                        }
                        else {
                            if (i <  datos['estaciones'][this.proxDestino['estaciones']].cola.cola.length - 1) {
                                let salto = xDchaCerca(this.x, datos['estaciones'][this.proxDestino['estaciones']].cola.cola[i + 1].x + EstacionServicio.tamHuecos / 2, default_v);

                                if (salto) {
                                    this.avanzarDcha(salto);
                                    this.horaEntrada = -1;
                                    break;
                                }
                                else {
                                    this.avanzarDcha(default_v);
                                }
                            }
                            //Hay que saltar al recurso fisico
                            else {
                                let salto = xDchaCerca(this.x, datos['estaciones'][this.proxDestino['estaciones']].recursoFisico.x, default_v);

                                if (salto) {
                                    this.avanzarDcha(salto);
                                    break;
                                }
                                else {
                                    this.avanzarDcha(default_v);
                                }
                            }
                        }
                    }

                    if (this.x == datos['estaciones'][this.proxDestino['estaciones']].recursoFisico.x) {
                        if (this.horaEntrada == -1) {
                            this.horaEntrada = new Date().getTime();
                        }
                        if (this.horaEntrada + datos['estaciones'][this.proxDestino['estaciones']].tiempoServicio > new Date().getTime()) {
                            this.parar();
                        }
                        else {
                            this.avanzarDcha(default_v);
                            this.destinos.shift();
                            this.horaEntrada = -1;
                        }
                    }
                }
                else if (this.x > datos['estaciones'][0].recursoFisico.x && 
                    this.x < datos['tuberiaIntermediaDchaEstaciones'].fromx + Tuberia.ancho / 2 &&
                    this.y == datos['estaciones'][this.proxDestino['estaciones']].tuberiaSalida.toy + Tuberia.ancho / 2
                ){
                    console.log('tuberia salida estaciones')
                    let salto = xDchaCerca(this.x, datos['tuberiaIntermediaDchaEstaciones'].fromx + Tuberia.ancho/2, default_v);
                    
                    if (salto){
                        this.avanzarDcha(salto);
                    }
                    else{
                        this.avanzarDcha(default_v);
                    }
                }

                else if (this.y >= datos['tuberiaIntermediaDchaEstaciones'].fromy - Tuberia.ancho / 2 && 
                    this.y <= datos['tuberiaIntermediaDchaEstaciones'].toy + Tuberia.ancho/2 &&
                    this.x == datos['tuberiaIntermediaDchaEstaciones'].fromx + Tuberia.ancho/2
                )
                {
                    // avanzar hacia la direccion de tuberia final
                    if (this.y < datos['tuberiaFinal'].fromy + Tuberia.ancho / 2) {
                        let salto = yAbajoCerca(this.y, datos['tuberiaFinal'].fromy + Tuberia.ancho / 2, default_v);
                        if (salto) {
                            this.avanzarAbajo(salto);
                        }
                        else {
                            this.avanzarAbajo(default_v);   
                        }
                    }
                    else if (this.y > datos['tuberiaFinal'].fromy + Tuberia.ancho / 2) {
                        console.log('lolitaaaaaaaaaaaaa')
                        let salto = yArribaCerca(this.y, datos['tuberiaFinal'].fromy + Tuberia.ancho / 2, default_v);
                        
                        if (salto) {
                            this.avanzarArriba(salto);
                        }
                        else {
                            this.avanzarArriba(default_v);
                        }
                    }
                    else {
                        this.avanzarDcha(default_v);
                    }       
                }
                else if (this.y == datos['tuberiaFinal'].fromy + Tuberia.ancho / 2 && 
                         this.x >= datos['tuberiaFinal'].fromx + Tuberia.ancho / 2 &&
                         this.x < datos['tuberiaPabajo'].fromx + Tuberia.ancho / 2
                )
                {
                    let salto = xDchaCerca(this.x, datos['tuberiaPabajo'].fromx + Tuberia.ancho / 2, default_v);

                    if (salto){
                        this.avanzarDcha(salto);
                    }
                    else{
                        this.avanzarDcha(default_v);
                        this.decidiDestino = false;
                    }
                }
                
            }

            if (this.y == datos['tuberiaCentral'].fromy + Tuberia.ancho / 2 &&
                this.x >= datos['tuberiaCentral'].fromx - Tuberia.ancho / 2 &&
                this.x < datos['tuberiaCentral'].tox + Tuberia.ancho / 2
            ) 
            {
                this.horaEntrada = -1;
                let salto = xDchaCerca(this.x, datos['tuberiaSalida'].tox + Tuberia.ancho / 2, default_v);
                if (salto) {
                    this.avanzarDcha(salto);
                }
                else {
                    if (datos['estaciones'].length == 1){
                        salto = xDchaCerca(this.x, datos['estaciones'][0].cola.cola[0].x + EstacionServicio.tamHuecos / 2, default_v);

                        if (salto){
                            this.avanzarDcha(salto);
                        }
                        else{
                            this.avanzarDcha(default_v);
                        }
                    }
                    else{
                        salto = xDchaCerca(this.x, datos['tuberiaCentral'].tox + Tuberia.ancho / 2, default_v);

                        if (salto){
                            this.avanzarDcha(salto);
                        }
                        else{
                            this.avanzarDcha(default_v);
                        }
                    }
                }

                if (this.destinos[0] == 'EXIT' && this.x == datos['tuberiaSalida'].tox + Tuberia.ancho / 2){
                    this.avanzarArriba(default_v)
                }
            }

            else if (this.x == datos['tuberiaPabajo'].fromx + Tuberia.ancho / 2 && 
            this.y >= datos['tuberiaPabajo'].fromy - Tuberia.ancho / 2 &&
            this.y < datos['tuberiaPabajo'].toy + Tuberia.ancho / 2                
            )
            {
                let salto = yAbajoCerca(this.y, datos['tuberiaPabajo'].toy + Tuberia.ancho / 2, default_v);

                if (salto){
                    this.avanzarAbajo(salto);
                }
                else{
                    this.avanzarAbajo(default_v);
                }
            }

            else if (this.y == datos['tuberiaPabajo'].toy + Tuberia.ancho/2 && 
                this.x <= datos['tuberiaPabajo'].fromx + Tuberia.ancho/2 && this.x > datos['tuberiaIzda'].tox - Tuberia.ancho / 2
            ){
                let salto = xIzdaCerca(this.x, datos['tuberiaIzda'].tox - Tuberia.ancho/2, default_v);

                if (salto){
                    this.avanzarIzda(salto);
                }
                else{
                    this.avanzarIzda(default_v);
                }
            }
            else if (this.y <= datos['tuberiaPabajo'].toy + Tuberia.ancho/2 && this.y > datos['tuberiaParriba'].toy - Tuberia.ancho / 2 &&
                    this.x == datos['tuberiaIzda'].tox - Tuberia.ancho/2
            ){
                let salto = yArribaCerca(this.y, datos['tuberiaParriba'].toy - Tuberia.ancho / 2, default_v);

                if (salto){
                    this.avanzarArriba(salto);
                }
                else{
                    this.avanzarArriba(default_v);
                }
            }
        }
        this.x += this.vx;   
        this.y += this.vy;
    }
    
};

//modo normal -> default_v = 3
//modo rapido -> default_v = 9
//modo lento -> default_v = 1


//tengo que encontrar la forma de parar la ejecución de la función main en javascript
//tengo que ampliar el movimiento de la bola para más cpus y más hdds

var default_v = 9;

//devuelve el salto necesario pa no pasarse
function xDchaCerca(x1, x2, r) {
    if (x1 + r > x2 && x2 > x1) {
        console.log('xDcha cerca');
        return x2 - x1;
    }

    return false;
}

function xIzdaCerca(x1, x2, r) {

    if (x1 - r < x2 && x2 < x1) {
        console.log('xIzda cerca')
        return x1 - x2
    }

    return false;
}
function yAbajoCerca(y1, y2, r) {

    if (y1 + r > y2 && y2 > y1) {
        return y2 - y1
    }

    return false;
}
function yArribaCerca(y1, y2, r) {

    if (y1 - r < y2 && y2 < y1) {
        console.log('yArriba cerca')
        return y1 - y2
    }

    return false;
}

function seguirParado(delay) {
    var start = new Date().getTime();
    return new Date().getTime() < start + delay;
}


function ubiFromNombres(destinos) {
    var ind_cpus = 0;
    var ind_est = 0;
    var ubiDestinos = [];

    for (i in destinos) {
        if (destinos[i] == 'CPU') {

            ubiDestinos.push(
                {
                    x: datos['cpus'][ind_cpus].recursoFisico.x,
                    y: datos['cpus'][ind_cpus].recursoFisico.y,
                }
            )
            if (datos['cpus'].length > 1) {
                ind_cpus++;
            }

        }
        else {
            ubi = {
                x: datos['estaciones'][ind_est].recursoFisico.x,
                y: datos['estaciones'][ind_est].recursoFisico.y,
            }

            ubiDestinos.push(ubi)
            ind_est++;
        }
    }

    return ubiDestinos;
}

//documentar



// recorre todas las peticiones para ver cuales están en las colas de unos u otros 

// al final no hace falta que la estacionLibre sea genérica, podría haber sido sólo para las CPUS. Lo dejo porque no es descabellado.
function estacionLibre(nombreEstacion){
    let repEstacion = {};

    if (nombreEstacion == 'CPU'){
        var estacionesAIterar = Object.entries(datos['cpus'])
    }
    else if (nombreEstacion == 'HDD' || nombreEstacion == 'SSD' || nombreEstacion == 'NIC'){
        var estacionesAIterar = Object.entries(datos['estaciones'])
    }
    
    for (const [i, estacion] of estacionesAIterar){
        console.log('indice');
        console.log(i);
        repEstacion[i] = 0;
        for (const [,pet] of Object.entries(peticiones)){
            if (pet.x > estacion.tuberiaEntrada.fromx - Tuberia.ancho / 2 &&
                pet.x <= estacion.recursoFisico.x &&
                pet.y == estacion.tuberiaEntrada.fromy + Tuberia.ancho / 2
            )
            {
                console.log(pet)
                repEstacion[i] = repEstacion[i] + 1;
            }
        }

        // si la estacion que estamos iterando no coincide con la que se nos ha pedido su ocupacion
        // entonces asignamos un numero muy alto a su componente en el vector de ocurrencias
        // para que cuando busquemos el mínimo en éste, sólo obtengamos una comparacion entre los que se nos han pedido
        // pero con un índice relativo a todas las estaciones
        if (estacion.recursoFisico.texto != nombreEstacion){
            repEstacion[i] = Number.MAX_SAFE_INTEGER;
        }
    }

    // retorna la clave que contiene el menor valor
    let listaMinimos = Object.keys(repEstacion).filter(function(x){
        return repEstacion[x] === Math.min.apply(null, Object.values(repEstacion))
    })

    return listaMinimos[0]
    
}

function puntoOcupado(x,y){
    for (const [_,pet] of Object.entries(peticiones)){
        if (pet.x == x && pet.y == y){
            return true;
        }
    }

    return false;
}

function intervaloXOcupado(x1, x2, y){
    for (const [_,pet] of Object.entries(peticiones)){
        if (pet.x > x1 && pet.x <= x2 && pet.y == y){
            return true;
        }
    }

    return false;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var running = false;
var raf

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    datos = main();
    
    //dibujamos bola donde corresponda
    for (let i = 0; i < 20; ++i){
        if (peticiones[i]){
            peticiones[i].draw();

            peticiones[i].haciaDestino();
        }
    }

    //avance lineal de bola

    if (running){
        raf = window.requestAnimationFrame(draw);
    }
    else{
        window.cancelAnimationFrame(raf);
    }
}

var peticiones = []
for (let i = 0; i < 20; ++i){
    inicializar(peticiones, i);
}

function inicializar(peticiones, i){
        setTimeout(function (){
            peticiones[i] = new Peticion();
        }, 1000*i)
}


function transicionPlayPause(){

    let boton = document.getElementById("boton-play");

    let simboloPause = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16">\
                          <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>\
                      </svg>';
    let simboloPlay = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">\
                       <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>\
                    </svg>';

    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    console.log(boton.innerHTML.includes('bi-pause'));
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')

    if (boton.innerHTML.includes('bi-pause')){
        boton.innerHTML = simboloPlay;
        boton.style.backgroundColor = "#8FBC8F"
        running = false;
        window.cancelAnimationFrame(raf);
    }
    else{
        boton.innerHTML = simboloPause;
        boton.style.backgroundColor = 'lightblue'
        running = true;
        raf = window.requestAnimationFrame(draw);
    }
}