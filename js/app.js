const container = document.getElementById("pokemonContainer");
const searchInput = document.getElementById("searchInput");

let allPokemon = [];

async function getPokemon(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}

async function fetchAllPokemon() {
  for (let i = 1; i <= 50; i++) {
    const pokemon = await getPokemon(i);
    allPokemon.push(pokemon);
    showPokemonCard(pokemon);
  }
}

function showPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.classList.add("pokemon-card");
  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
    <h3>#${pokemon.id}</h3>
    <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
  `;
  container.appendChild(card);
}

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();
  container.innerHTML = "";
  const filtered = allPokemon.filter(p =>
    p.name.toLowerCase().includes(searchValue)
  );
  filtered.forEach(showPokemonCard);
});

fetchAllPokemon();
