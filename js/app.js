const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda : '',
    criptomoneda : ''
}

// Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise ( resolve =>{
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        //console.log(cripto);
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    //console.log(objBusqueda);
}

function submitFormulario(e) {
    e.preventDefault();

    // Validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda ==='') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(msg) {
    //console.log(msg);
    const existeError = document.querySelector('.error');

    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');

        //Mensaje de Error
        divMensaje.textContent = msg;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI() {
    const {moneda, criptomoneda}= objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            //console.log(cotizacion.DISPLAY[criptomoneda][moneda]);
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion) {
    //console.log(cotizacion);
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} =  cotizacion;

    LimpiarHTML();

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.classList.add('.precio');
    precioAlto.innerHTML = `<p>Precio más alto del dia <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.classList.add('.precio');
    precioBajo.innerHTML = `<p>Precio más bajo del dia <span>${LOWDAY}</span>`;
    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.classList.add('.precio');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.classList.add('.precio');
    ultimaActualizacion.innerHTML = `<p>Última actualización <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function LimpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    LimpiarHTML();
    
    const spinner = document.createElement('div');
    spinner.classList.add('.spinner');
    spinner.innerHTML =`
        <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
        </div>
    `;

    resultado.appendChild(spinner);
}