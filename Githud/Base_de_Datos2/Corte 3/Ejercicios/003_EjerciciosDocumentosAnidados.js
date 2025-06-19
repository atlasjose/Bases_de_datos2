// ========================================
// 1 CREAR DATOS DE PRUEBA
// ========================================

db.pokemons.insertMany([
  {
    name: "Pikachu",
    type: "Electric",
    stats: { hp: 35, attack: 55, defense: 40 },
    courses: ["training", "battle"],
    games: [
      { title: "Yellow", year: 1998 },
      { title: "Sword", year: 2019 },
      { title: "Shield", year: 2019 },
      { title: "Let's Go Pikachu", year: 2018 },
      { title: "Unite", year: 2021 }
    ]
  },
  {
    name: "Bulbasaur",
    type: "Grass",
    stats: { hp: 45, attack: 49, defense: 49 },
    games: [
      { title: "Red", year: 1996 },
      { title: "Blue", year: 1996 },
      { title: "Leaf Green", year: 2004 }
    ]
  },
  {
    name: "Charizard",
    type: "Fire",
    stats: { hp: 78, attack: 84, defense: 78 },
    courses: ["fly", "battle"],
    games: [
      { title: "Red", year: 1996 },
      { title: "Blue", year: 1996 },
      { title: "Sword", year: 2019 },
      { title: "Shield", year: 2019 },
      { title: "Unite", year: 2021 },
      { title: "Legends", year: 2022 }
    ]
  }
]);

// ========================================
// 2️ CONSULTAS DE EJEMPLO
// ========================================

//  A) Consulta SIN $where: pokemons con 'courses' y 5+ juegos
db.pokemons.find({
  courses: { $exists: true },
  $expr: { $gte: [ { $size: "$games" }, 5 ] }
});

// B) Filtrar por campo anidado: ataque > 50
db.pokemons.find({
  "stats.attack": { $gt: 50 }
});

// C) Filtrar por un campo dentro de un array de documentos: juegos del 2019
db.pokemons.find({
  "games.year": 2019
});

// D) Actualizar campo anidado: ataque de Pikachu a 60
db.pokemons.updateOne(
  { name: "Pikachu" },
  { $set: { "stats.attack": 60 } }
);

// E) Actualizar dentro de un array de subdocumentos: cambiar título del juego 2019
db.pokemons.updateOne(
  { name: "Pikachu", "games.year": 2019 },
  { $set: { "games.$.title": "Sword & Shield" } }
);

// F) Proyección: mostrar solo nombre y stats.hp y stats.attack (sin _id)
db.pokemons.find(
  {},
  { name: 1, "stats.hp": 1, "stats.attack": 1, _id: 0 }
);

// G) Filtrar elementos específicos del array con $elemMatch
db.pokemons.find(
  { name: "Charizard" },
  { games: { $elemMatch: { year: 2019 } }, _id: 0 }
);
