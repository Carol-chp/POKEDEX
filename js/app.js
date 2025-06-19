const team = JSON.parse(localStorage.getItem("team")) || [];
const teamContainer = document.createElement("div");
teamContainer.id = "teamContainer";
document.body.appendChild(teamContainer);




const container = document.getElementById("pokemonContainer");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let allPokemon = [];
let offset = 1;
const limit = 20;

async function getPokemon(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return await response.json();
}

function createTypeBadge(type) {
  const span = document.createElement("span");
  span.textContent = type.type.name;
  span.classList.add("type");
  span.style.backgroundColor = getTypeColor(type.type.name);
  return span;
}

function getTypeColor(type) {
  const colors = {
    fire: "#F08030", water: "#6890F0", grass: "#78C850", electric: "#F8D030",
    ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0", ground: "#E0C068",
    flying: "#A890F0", psychic: "#F85888", bug: "#A8B820", rock: "#B8A038",
    ghost: "#705898", dark: "#705848", dragon: "#7038F8", steel: "#B8B8D0",
    fairy: "#EE99AC", normal: "#A8A878"
  };
  return colors[type] || "#AAA";
}

function showPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h3>#${pokemon.id} ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
  `;

  pokemon.types.forEach(t => {
    const badge = createTypeBadge(t);
    card.appendChild(badge);
  });

  // Botón capturar
  const catchBtn = document.createElement("button");
  catchBtn.textContent = "Capturar";
  catchBtn.onclick = () => {
    if (team.find(p => p.id === pokemon.id)) {
      alert("¡Ya capturaste a este Pokémon!");
    } else if (team.length >= 6) {
      alert("¡Tu equipo ya tiene 6 Pokémon!");
    } else {
      team.push({ id: pokemon.id, name: pokemon.name });
      localStorage.setItem("team", JSON.stringify(team));
      renderTeam();
    }
  };
  card.appendChild(catchBtn);

  container.appendChild(card);
}


async function loadPokemonBatch(start, count) {
  for (let i = start; i < start + count; i++) {
    const pokemon = await getPokemon(i);
    allPokemon.push(pokemon);
    showPokemonCard(pokemon);
  }
}

function filterPokemon() {
  const search = searchInput.value.toLowerCase();
  const type = typeFilter.value;

  container.innerHTML = "";

  allPokemon
    .filter(p => p.name.includes(search))
    .filter(p => !type || p.types.some(t => t.type.name === type))
    .forEach(showPokemonCard);
}

async function loadTypes() {
  const response = await fetch("https://pokeapi.co/api/v2/type");
  const data = await response.json();

  data.results.forEach(t => {
    const option = document.createElement("option");
    option.value = t.name;
    option.textContent = t.name;
    typeFilter.appendChild(option);
  });
}

searchInput.addEventListener("input", filterPokemon);
typeFilter.addEventListener("change", filterPokemon);
loadMoreBtn.addEventListener("click", async () => {
  await loadPokemonBatch(offset, limit);
  offset += limit;
});

(async () => {
  await loadTypes();
  await loadPokemonBatch(offset, limit);
  offset += limit;
})();

function renderTeam() {
  teamContainer.innerHTML = "<h2>Tu equipo Pokémon</h2>";
  if (team.length === 0) {
    teamContainer.innerHTML += "<p>No has capturado ningún Pokémon.</p>";
    return;
  }

  const list = document.createElement("ul");
  team.forEach((pokemon, index) => {
    const item = document.createElement("li");
    item.textContent = `#${pokemon.id} ${pokemon.name}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Eliminar";
    removeBtn.onclick = () => {
      team.splice(index, 1);
      localStorage.setItem("team", JSON.stringify(team));
      renderTeam();
    };
    item.appendChild(removeBtn);
    list.appendChild(item);
  });
  teamContainer.appendChild(list);
}

renderTeam();
