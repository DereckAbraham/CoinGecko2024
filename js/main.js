document.addEventListener('DOMContentLoaded', () => {
    let urlApi = 'https://api.coingecko.com/api/v3/coins/markets';
    let listaCriptos = document.getElementById('crypto-list');
    let barraBusqueda = document.getElementById('search-bar');
    let filtroCategoria = document.getElementById('filter-category');
    
    let todasLasCriptos = []; 

    let obtenerDatos = async () => {
        try {
            let respuesta = await fetch(`${urlApi}?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`);
            let datos = await respuesta.json();
            todasLasCriptos = datos; 
            renderizarCriptos(todasLasCriptos); 
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    let renderizarCriptos = (criptos) => {
        listaCriptos.innerHTML = '';
        criptos.forEach(cripto => {
            let itemLista = document.createElement('li');
            itemLista.classList.add('crypto-item');
            itemLista.innerHTML = `
                <img src="${cripto.image}" alt="${cripto.name}">
                <div>
                    <h2>${cripto.name}</h2>
                    <p>Precio: $${cripto.current_price}</p>
                </div>
            `;
            listaCriptos.appendChild(itemLista);
        });
    };
    
    let filtrarCriptos = () => {
        let terminoBusqueda = barraBusqueda.value.toLowerCase();
        let categoriaSeleccionada = filtroCategoria.value.toLowerCase();

        let criptosFiltradas = todasLasCriptos.filter(cripto => {
            let coincideBusqueda = !terminoBusqueda || 
                cripto.name.toLowerCase().includes(terminoBusqueda) || 
                cripto.symbol.toLowerCase().includes(terminoBusqueda);

            let coincideCategoria = true;
            if (categoriaSeleccionada === 'defi') {
                coincideCategoria = cripto.categories && cripto.categories.includes('defi');
            } else if (categoriaSeleccionada === 'stablecoin') {
                coincideCategoria = cripto.name.toLowerCase().includes('usd') || cripto.name.toLowerCase().includes('tether');
            } else if (categoriaSeleccionada === 'nft') {
                coincideCategoria = cripto.name.toLowerCase().includes('nft') || cripto.name.toLowerCase().includes('ape');
            }

            return coincideBusqueda && coincideCategoria;
        });

        renderizarCriptos(criptosFiltradas);
    };

    barraBusqueda.addEventListener('input', filtrarCriptos);
    //filtroCategoria.addEventListener('change', filtrarCriptos);

    obtenerDatos();
});
