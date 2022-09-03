// selectores
const formulario =  document.querySelector('#formulario');
const resultados = document.querySelector('#resultado');
const paginacion = document.querySelector('#paginacion');

const registrosPorPagina = 20;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () =>{
    formulario.addEventListener('submit', validarFormulaio);
}

function validarFormulaio(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    // validar
    if(terminoBusqueda === ''){
        mostrarAlerta('Agrege un término de busqueda');
        return;
    }

    buscarImagenes(terminoBusqueda);
}


function mostrarAlerta(mensaje){

    const existAlerta = document.querySelector('.bg-red-100');

    if(!existAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400','text-red-700','px-4','py-3','rounded',
        'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class='font-bold'>!Error</strong>
            <span class='block sm:inline'> ${mensaje} </span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }


}

async function buscarImagenes(){

    const termino = document.querySelector('#termino').value;

    const api_key = '29696519-14482bc40b1ccfac767308e34';
    const url = `https://pixabay.com/api/?key=${api_key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

     try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        totalPaginas = calcularPaginas(data.totalHits);
        mostrarImagenes(data.hits);
    } catch (error) {
        console.log(error);
        mostrarAlerta('Algo ha salido mal');
    }
    
}

const calcularPaginas = (total) => parseInt( Math.ceil( total / registrosPorPagina) );


// generador que va a registrar la canatidad de elementos de acuerdo a las páginas
function *crearPaginador(total){
    for(let i=1; i <= total ; i++){
        yield i;
    }   
}

function mostrarImagenes(imagenes){
    
    // console.log(imagenes);

    while(resultados.firstChild){
        resultados.removeChild(resultados.firstChild);
    }

    // iterar sobre array imagenes
    imagenes.forEach( imagen =>{
        const {previewURL,likes, views,largeImageURL } = imagen;

        resultados.innerHTML += `
            <div class='w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4'>
                <div class='bg-white'>
                    <img class='w-full' src='${previewURL}'>

                    <div class='p-4'>
                        <p class='font-bold'>${likes} <span class='font-light'> Me Gusta </span></p>
                        <p class='font-bold'>${views} <span class='font-light'> Vistas </span></p>

                        <a 
                            class='block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1'
                            href='${largeImageURL}' 
                            target='_blank' 
                            rel='noopener noreferrer'
                        > 
                        Ver Imagen </a>
                    </div>

                </div>
            </div>
        `;
    });
    // limpiar paginador
    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild);
    }

    imprimirPaginador()
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const {value, done} = iterador.next();
        if(done) return;

        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-5','uppercase','rounded');
        if(boton.dataset.pagina == paginaActual) boton.classList.add('opacity-25');

        boton.onclick = () =>{
            paginaActual = value;
            buscarImagenes();
        }
        paginacion.appendChild(boton);
    }
}
