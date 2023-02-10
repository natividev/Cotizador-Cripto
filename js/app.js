const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
  moneda: '',
  criptomoneda: '',
};

// * Crear un Promise


const obtenerCriptomonedas = (criptomonedas) => new Promise(resolve => {
  resolve(criptomonedas);
});



document.addEventListener('DOMContentLoaded', () => {
  consultarCriptomonedas();

  formulario.addEventListener('submit', submitFormulario);

  criptomonedasSelect.addEventListener('change', leerValor);
  monedaSelect.addEventListener('change', leerValor);



});

function consultarCriptomonedas() {
  const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas))

}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach(cripto => {

    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement('OPTION');
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);


  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
  moneda = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();
  // * Validar
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === '' || criptomoneda === '') {
    mostrarAlertar('Ambos campos son obligatorios');
    return;
  }

  // * Consultar la API con los resultados
  consultarAPI();



}

function mostrarAlertar(msg) {

  // * Forma para evitar que salga muchas veces la alerta, cuando se precione el boton

  const existeError = document.querySelector('.error');

  if (!existeError) {
    const divMensaje = document.createElement('DIV');
    divMensaje.classList.add('error');

    // * Mensaje de error
    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje)

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  // * Mostrar Spiner
  mostrarSpinner();

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(cotizacion => {
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    })
}

function mostrarCotizacionHTML(cotizacion) {

  limpiarHTML();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement('P');
  precio.classList.add('precio');
  precio.innerHTML = `El precio es <span>${PRICE}</span>`;

  const precioAlto = document.createElement('P');
  precioAlto.innerHTML = `Precio mas alto del dia <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement('P');
  precioBajo.innerHTML = `Precio mas bajo del dia <span>${LOWDAY}</span>`;


  const ultimasHoras = document.createElement('P');
  ultimasHoras.innerHTML = `Variacion ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

  const ultimaActualizacion = document.createElement('P');
  ultimaActualizacion.innerHTML = `Ultima actualizacion <span>${LASTUPDATE}</span>`;


  resultado.appendChild(precio)
  resultado.appendChild(precioAlto)
  resultado.appendChild(precioBajo)
  resultado.appendChild(ultimasHoras)
  resultado.appendChild(ultimaActualizacion)

}

function limpiarHTML() {

  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild)
  }

}

function mostrarSpinner() {
  limpiarHTML();

  const spinner = document.createElement('DIV');
  spinner.classList.add('spinner');

  spinner.innerHTML = `
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
  `;

  resultado.appendChild(spinner);

}