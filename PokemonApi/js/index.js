var id;
addEvent(window, 'load', cargar, false);

function addEvent(ele, eve, fun, cap) {
    if (window.attachEvent) {
        addAttachEvent('on' + eve, fun);
    } else {
        ele.addEventListener(eve, fun, cap);
    }
}

async function cargar() {
    const searchBy = document.getElementById('searchBy').value;
    const searchValue = document.getElementById('searchInput').value.trim();

    let url;
 
    if (searchBy === 'random') {
        id = Math.floor(Math.random() * 150) + 1; // Genera un ID aleatorio entre 1 y 150
        url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    } else {
        // Verificar si el valor ingresado es un número entre 1 y 150
        id = parseInt(searchValue);
        if (isNaN(id) || id < 1 || id > 150) {
            alert('Por favor ingresa un ID válido entre 1 y 150.');
            return;
        }
        url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    }

    try {
        const response = await fetch(url);
        const pokemonData = await response.json();
        displayPokemonInfo(pokemonData);
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}

function displayPokemonInfo(pokemon) {
    const pokemonInfoDiv = document.getElementById('pokemonInfo');
    pokemonInfoDiv.innerHTML = `
        <div class="pokemon-card">
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>Id: ${pokemon.id}</p>
            <p>Habilidades: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <!--Boton para agregar a la tabla -->
            <button onclick="addPokemonToTable('${pokemon.name}', '${pokemon.sprites.front_default}', '${pokemon.height}', '${pokemon.abilities.map(ability => ability.ability.name).join(', ')}')">Agregar a la tabla</button>
        </div>
    `;
}

async function showMoreInfo() {
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = await response.json();
        modalContent.innerHTML = `
            <h3>Más Información de ${pokemonData.name}</h3>
            <p>Tipo: ${pokemonData.types.map(type => type.type.name).join(', ')}</p>
            <p>Experiencia base: ${pokemonData.base_experience}</p>
            <p>Altura: ${pokemonData.height / 10} m</p>
            <p>Peso: ${pokemonData.weight / 10} kg</p>
            <p>Movimientos: ${pokemonData.moves.map(move => move.move.name).slice(0, 5).join(', ')}</p>
        `;
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }

    const span = document.getElementsByClassName('close')[0];
    span.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function addPokemonToTable(name, image, height, abilities) {
    const pokemonTableBody = document.querySelector('#pokemonTable tbody');
    const existingPokemon = Array.from(pokemonTableBody.children).find(row => row.cells[0].textContent === name);

    if (existingPokemon) {
        alert('Este Pokémon ya está en la tabla.');
        return;
    }

    if (pokemonTableBody.children.length >= 6) {
        alert('No puedes añadir más de 6 Pokémon.');
        return;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${name}</td>
        <td><img src="${image}" alt="${name}" width="50"></td>
        <td>${height}</td>
        <td>${abilities}</td>
    `;
    pokemonTableBody.appendChild(newRow);
}