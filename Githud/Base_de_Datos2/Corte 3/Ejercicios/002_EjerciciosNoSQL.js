
// 1. Búsquedas simples
// a) Nivel de poder igual a 95
db.pokemons.find({ nivel_poder: 95 });

// b) Mostrar solo nombre y poder de los pokemones tipo "planta"
db.pokemons.find({ elemento: "planta" }, { nombre: 1, poder: 1, _id: 0 });

// 2. Búsquedas con condiciones numéricas y operadores lógicos
// a) Pokemones con altura entre 0.6 y 2 metros
db.pokemons.find({ altura_m: { $gte: 0.6, $lte: 2.0 } });

// b) Pokemones con peso mayor a 10 y nivel de poder mayor que 80
db.pokemons.find({ peso_kg: { $gt: 10 }, nivel_poder: { $gt: 80 } });

// 3. Expresiones regulares
// a) Pokemones con nombre que empieza con "P"
db.pokemons.find({ nombre: /^P/ });

// b) Pokemones cuyo poder termina en "a"
db.pokemons.find({ poder: /a$/ });

// c) Pokemones cuya descripción contiene "agua"
db.pokemons.find({ descripcion: /agua/i });

// 4. Uso de $in y $nin
// a) Pokemones con elemento fuego, agua o planta
db.pokemons.find({ elemento: { $in: ["fuego", "agua", "planta"] } });

// b) Pokemones que NO son de tipo fuego, agua ni planta
db.pokemons.find({ elemento: { $nin: ["fuego", "agua", "planta"] } });

// 5. Campos opcionales y tipos de dato
// a) Insertar Pokémon con campo adicional `vidas`
db.pokemons.insertOne({ nombre: "Mewtwo", poder: "Psíquico", elemento: "psiquico", nivel_poder: 100, vidas: 3 });

// b) Buscar pokemones que tengan el campo `vidas`
db.pokemons.find({ vidas: { $exists: true } });

// c) Insertar Pokémon con fecha de nacimiento
db.pokemons.insertOne({ nombre: "Psyduck", poder: "Confusión", elemento: "agua", nivel_poder: 65, fechanac: new Date() });

// d) Buscar pokemones cuyo campo `fechanac` es tipo fecha
db.pokemons.find({ fechanac: { $type: "date" } });

// 6. Actualizaciones
// a) Cambiar el peso de Snorlax a 450
db.pokemons.updateOne({ nombre: "Snorlax" }, { $set: { peso_kg: 450 } });

// b) Sumarle 0.2 a la altura de pokemones con altura menor a 0.6
db.pokemons.updateMany({ altura_m: { $lt: 0.6 } }, { $inc: { altura_m: 0.2 } });

// c) Agregar el campo vidas=5 a todos los pokemones que no lo tengan
db.pokemons.updateMany({ vidas: { $exists: false } }, { $set: { vidas: 5 } });

// d) Eliminar campo fechanac si existe
db.pokemons.updateMany({ fechanac: { $exists: true } }, { $unset: { fechanac: "" } });

// 7. Upsert (insertar si no existe)
// a) Actualizar o insertar a Charmander
db.pokemons.updateOne(
  { nombre: "Charmander" },
  { $set: { poder: "Ascuas", elemento: "fuego", nivel_poder: 60 } },
  { upsert: true }
);

// 8. Insertar múltiples documentos con bucle (cursor)
for (let i = 1; i <= 10; i++) {
  db.logs.insertOne({
    log_id: i,
    mensaje: `Prueba ${i}`,
    fecha: new Date()
  });
}
