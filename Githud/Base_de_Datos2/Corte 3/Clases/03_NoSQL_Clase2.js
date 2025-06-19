// =====================================
// MONGODB - APUNTES COMPLETOS CON POKÉMON
// Operaciones CRUD y Consultas Avanzadas
// =====================================

// -------------------------------------
// 1. INSERCIÓN DE DATOS - CREATE
// -------------------------------------

// Definición del dataset inicial de Pokémon
const pokes = [
  {
    nombre: "Pikachu",
    poder: "Impactrueno",
    elemento: "eléctrico",
    nivel_poder: 85,
    descripcion: "Un Pokémon eléctrico muy popular, conocido por su ternura y agilidad en combate.",
    altura_m: 0.4,
    peso_kg: 6.0
  },
  {
    nombre: "Charizard",
    poder: "Llamarada",
    elemento: "fuego",
    nivel_poder: 95,
    descripcion: "Dragón alado con un temperamento ardiente. Lanza fuego por su boca.",
    altura_m: 1.7,
    peso_kg: 90.5
  },
  {
    nombre: "Bulbasaur",
    poder: "Látigo Cepa",
    elemento: "planta",
    nivel_poder: 70,
    descripcion: "Tiene una semilla en su espalda que crece a medida que lo hace.",
    altura_m: 0.7,
    peso_kg: 6.9
  },
  {
    nombre: "Squirtle",
    poder: "Pistola Agua",
    elemento: "agua",
    nivel_poder: 72,
    descripcion: "Usa su caparazón como protección y lanza potentes chorros de agua.",
    altura_m: 0.5,
    peso_kg: 9.0
  },
  {
    nombre: "Jigglypuff",
    poder: "Canto",
    elemento: "hada",
    nivel_poder: 60,
    descripcion: "Su canto hace dormir a sus oponentes. Tiene una voz dulce y peligrosa.",
    altura_m: 0.5,
    peso_kg: 5.5
  },
  {
    nombre: "Gengar",
    poder: "Bola Sombra",
    elemento: "fantasma",
    nivel_poder: 88,
    descripcion: "Suele aparecer en la oscuridad. Se alimenta del miedo.",
    altura_m: 1.5,
    peso_kg: 40.5
  },
  {
    nombre: "Snorlax",
    poder: "Golpe Cuerpo",
    elemento: "normal",
    nivel_poder: 90,
    descripcion: "Duerme la mayor parte del tiempo, pero es muy fuerte cuando se activa.",
    altura_m: 2.1,
    peso_kg: 460.0
  }
];

// Insertar múltiples documentos en la colección
// insertMany() es más eficiente que múltiples insertOne()
db.pokemons.insertMany(pokes);

// Verificar la inserción - mostrar todos los documentos
db.pokemons.find();

// -------------------------------------
// 2. CONSULTAS BÁSICAS - READ
// -------------------------------------

// CONSULTA 1: Filtro por igualdad exacta
// Buscar Pokémon con nivel de poder específico
db.pokemons.find({ nivel_poder: 90 });

// CONSULTA 2: Proyección de campos específicos
// Mostrar solo el nombre del Pokémon que pesa 90.5 kg
// Proyección: incluir 'nombre' (true), excluir '_id' (false)
db.pokemons.find(
  { peso_kg: 90.5 },  // Filtro: condición WHERE
  { nombre: true, _id: false }  // Proyección: campos a mostrar
);

// CONSULTA 3: Operadores de comparación numérica
// Buscar Pokémon con altura entre 0.5 y 1.7 metros
// $gte: mayor o igual que, $lte: menor o igual que
db.pokemons.find(
  { altura_m: { $gte: 0.5, $lte: 1.7 } },  // Rango de valores
  { nombre: true, poder: true, elemento: true, _id: false }
);

// CONSULTA 4: Múltiples condiciones con AND implícito
// Pokémon pequeños (altura < 1m) pero no muy livianos (peso > 5kg)
db.pokemons.find(
  { 
    altura_m: { $lt: 1 },    // Condición 1: altura menor que 1
    peso_kg: { $gt: 5 }      // Condición 2: peso mayor que 5
  },
  { nombre: true, altura_m: true, peso_kg: true, _id: false }
);

// CONSULTA 5: Operador lógico OR
// Pokémon débiles (poder < 50) O de elemento fuego
db.pokemons.find(
  {
    $or: [
      { nivel_poder: { $lt: 50 } },  // Condición 1: poder bajo
      { elemento: "fuego" }          // Condición 2: elemento fuego
    ]
  },
  { nombre: true, nivel_poder: true, elemento: true, _id: false }
);

// -------------------------------------
// 3. EXPRESIONES REGULARES - REGEX
// -------------------------------------

// REGEX 1: Nombres que comienzan con 'S'
// Patrón: /^S/ - ^ indica inicio de cadena
db.pokemons.find({
  nombre: /^S/  // Busca nombres que empiecen con 'S'
});

// REGEX 2: Nombres que terminan con 'ff'
// Patrón: /ff$/ - $ indica final de cadena
db.pokemons.find({
  nombre: /ff$/  // Busca nombres que terminen con 'ff'
});

// REGEX 3: Descripción que contiene 'la'
// Búsqueda de subcadena dentro del texto
db.pokemons.find({
  descripcion: /la/  // Busca 'la' en cualquier parte de la descripción
});

// REGEX 4: Poderes que terminan en 'a'
db.pokemons.find({
  poder: /a$/  // Busca poderes que terminen con 'a'
});

// -------------------------------------
// 4. OPERADORES DE INCLUSIÓN/EXCLUSIÓN
// -------------------------------------

// MÉTODO 1: Usar OR para múltiples valores
// Buscar Pokémon de elementos específicos
db.pokemons.find({
  $or: [
    { elemento: 'fuego' },
    { elemento: 'agua' },
    { elemento: 'planta' }
  ]
});

// MÉTODO 2: Operador $in (más eficiente)
// Equivalente al OR anterior pero más limpio
db.pokemons.find({
  elemento: { $in: ["fuego", "planta", "agua"] }  // IN - incluir estos valores
});

// MÉTODO 3: Operador $nin (negación de $in)
// Buscar Pokémon que NO sean de estos elementos
db.pokemons.find({
  elemento: { $nin: ["fuego", "planta", "agua"] }  // NOT IN - excluir estos valores
});

// -------------------------------------
// 5. MANEJO DE CAMPOS DINÁMICOS
// -------------------------------------

// Agregar un Pokémon con campo adicional 'vidas'
const poke1 = {
  nombre: "Mew",
  poder: "Telepatía",
  elemento: "psíquico",
  nivel_poder: 90,
  vidas: 5  // Campo nuevo que no todos los documentos tienen
};
db.pokemons.insertOne(poke1);

// CONSULTA: Verificar existencia de campos
// $exists: true - busca documentos que TIENEN el campo
db.pokemons.find({
  vidas: { $exists: true }  // Solo documentos con campo 'vidas'
});

// Agregar otro Pokémon con campo de fecha
const poke2 = {
  nombre: "Psyduck",
  poder: "Telepatía",
  elemento: "psíquico",
  nivel_poder: 90,
  fechanac: new Date()  // Campo de tipo Date
};
db.pokemons.insertOne(poke2);

// CONSULTA: Filtrar por tipo de dato
// $type: 'date' - busca campos que sean de tipo fecha
db.pokemons.find({
  fechanac: { $type: 'date' }  // Solo documentos con fechas
});

// CONSULTA COMBINADA: Existencia + Condición numérica
// Pokémon altos (> 2m) que tengan el campo altura
db.pokemons.find(
  {
    altura_m: {
      $exists: true,  // Debe existir el campo
      $gt: 2         // Y ser mayor que 2
    }
  },
  { nombre: true, _id: false }
);

// -------------------------------------
// 6. OPERACIONES DE ACTUALIZACIÓN - UPDATE
// -------------------------------------

// MÉTODO TRADICIONAL: find + save (menos eficiente)
// 1. Buscar documento
const traerpoke = db.pokemons.findOne({ elemento: "normal" });
// 2. Modificar en memoria
traerpoke.peso_kg = 46;
// 3. Guardar cambios
db.pokemons.save(traerpoke);

// MÉTODO MODERNO: updateOne (más eficiente)
// Actualizar un solo documento que coincida con el filtro
db.pokemons.updateOne(
  {
    // Filtro: condición WHERE
    elemento: 'normal'
  },
  {
    // Operación: $set actualiza/crea campos
    $set: {
      peso_kg: 46
    }
  }
);

// ACTUALIZACIÓN MASIVA: updateMany
// Resetear vidas a 0 para todos los Pokémon que tengan este campo
db.pokemons.updateMany(
  {
    // Filtro: documentos que tengan campo 'vidas'
    vidas: { $exists: true }
  },
  {
    // Operación: establecer valor fijo
    $set: {
      vidas: 0
    }
  }
);

// OPERACIÓN MATEMÁTICA: $inc (incremento)
// Aumentar altura en 0.1m para Pokémon pequeños
db.pokemons.updateMany(
  {
    // Filtro: altura menor que 0.5m
    altura_m: { $lt: 0.5 }
  },
  {
    // Operación: $inc suma/resta al valor existente
    $inc: {
      altura_m: 0.1  // Incrementar en 0.1
    }
  }
);

// ELIMINACIÓN DE CAMPOS: $unset
// Remover el campo 'fechanac' de documentos que lo tengan
db.pokemons.updateOne(
  {
    fechanac: { $exists: true }
  },
  {
    // $unset elimina campos del documento
    $unset: {
      fechanac: true  // true indica que se elimine el campo
    }
  }
);

// UPSERT: Actualizar o Insertar
// Si encuentra el documento lo actualiza, si no lo encuentra lo crea
db.pokemons.updateOne(
  {
    nombre: 'Charmander'  // Buscar por nombre
  },
  {
    $set: {
      elemento: 'fuego'   // Establecer elemento
    }
  },
  {
    upsert: true  // Si no existe, lo crea automáticamente
  }
);

// EJEMPLO DE ACTUALIZACIÓN SIN COINCIDENCIAS
// Esta operación no afectará ningún documento (retorna 0 modificados)
db.pokemons.updateOne(
  {
    nombre: 'Kakuna'  // Pokémon que no existe en la colección
  },
  {
    $set: {
      nivel_poder: 10
    }
  }
  // Sin upsert: true, no se crea el documento
);

// -------------------------------------
// 7. CONCEPTOS AVANZADOS - CURSORES
// -------------------------------------

// DIFERENCIA ENTRE find() Y findOne()
// find() - Retorna un CURSOR (objeto iterable)
// findOne() - Retorna un OBJETO directamente

// Ejemplo de uso de cursor con datos de prueba
// Insertar documentos de prueba para demostrar cursores
for(let i = 1; i <= 50; i++){
  db.demos.insertOne({
    test: 'test' + i,
    numero: i,
    activo: i % 2 === 0  // Alternados: true/false
  });
}

// =====================================
// RESUMEN DE OPERADORES PRINCIPALES
// =====================================

/*
COMPARACIÓN:
$eq  - igual que
$ne  - no igual que
$gt  - mayor que
$gte - mayor o igual que
$lt  - menor que
$lte - menor o igual que
$in  - dentro de array
$nin - no dentro de array

LÓGICOS:
$and - y lógico
$or  - o lógico
$not - negación
$nor - ni uno ni otro

*/