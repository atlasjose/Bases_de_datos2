// =====================================
// MONGODB - OPERACIONES AVANZADAS
// Arrays, Modificación de Esquemas y Consultas Complejas
// =====================================

// -------------------------------------
// 8. OPERACIÓN findAndModify - BUSCAR Y MODIFICAR ATÓMICAMENTE
// -------------------------------------

// findAndModify combina búsqueda y actualización en una sola operación atómica
// Útil cuando necesitas el documento antes o después de la modificación

db.pokemons.findAndModify({
    query: {
        nivel_poder: 70,
        nombre: { $exists: false }  
    },
    update: {
        $set: {
            nombre: "Pikachu",
            poder: "Impactrueno",
            elemento: "electrico",
            descripcion: "Un Pokémon eléctrico muy popular, conocido por su ternura y agilidad en combate.",
            altura_m: 0.4,
            peso_kg: 6.0
        }
    }
});


// ALTERNATIVA MODERNA: findOneAndUpdate (más recomendada)
db.pokemons.findOneAndUpdate(
    {
        nivel_poder: 70,
        nombre: { $exists: false }
    },
    {
        $set: {
            nombre: "Pikachu",
            poder: "Impactrueno",
            elemento: "electrico"
        }
    },
    {
        returnDocument: "after"  // Retorna el documento después de la actualización
    }
);

// -------------------------------------
// 9. MODIFICACIÓN DE ESQUEMAS - RENAME FIELDS
// -------------------------------------

// Equivalente a ALTER TABLE en SQL
// $rename permite cambiar nombres de campos en toda la colección

// EJEMPLO 1: Renombrar campo con guión bajo a camelCase
// Cambiar 'nivel_poder' por 'nivelPoder'
db.pokemons.updateMany(
    {},  // Filtro vacío = todos los documentos
    {
        $rename: {
            nivel_poder: "nivelPoder"  // nombreAntiguo: nombreNuevo
        }
    }
);

// EJEMPLO 2: Renombrar campo de peso
// Cambiar 'peso_kg' por 'pesoKg'
db.pokemons.updateMany(
    {},
    {
        $rename: {
            peso_kg: "pesoKg"
        }
    }
);

// EJEMPLO 3: Renombrar campo de altura
// Cambiar 'altura_m' por 'alturaM'
db.pokemons.updateMany(
    {},
    {
        $rename: {
            altura_m: "alturaM"
        }
    }
);

// EJEMPLO 4: Renombrar múltiples campos en una sola operación
db.pokemons.updateMany(
    {},
    {
        $rename: {
            "campo_antiguo_1": "campoNuevo1",
            "campo_antiguo_2": "campoNuevo2",
            "campo_antiguo_3": "campoNuevo3"
        }
    }
);

// -------------------------------------
// 10. TRABAJANDO CON ARRAYS - OPERACIONES BÁSICAS
// -------------------------------------

// AGREGAR ARRAY INICIAL: Asignar lista de juegos a un Pokémon específico
db.pokemons.updateOne(
    { nombre: 'Bulbasaur' },  // Filtro: buscar por nombre
    {
        $set: {
            games: ['Silver', 'Gold', 'Blue']  // Crear array con 3 elementos
        }
    }
);

// ACTUALIZACIÓN MASIVA CON CONDICIONES MÚLTIPLES
// Pokémon débiles (< 70 poder) que no tengan juegos asignados
db.pokemons.updateMany(
    {
        nivelPoder: { $lt: 70 },        // Condición 1: poder bajo
        games: { $exists: false }       // Condición 2: sin campo games
    },
    {
        $set: {
            games: ['Silver', 'Gold', 'Blue']  // Juegos para principiantes
        }
    }
);

// ACTUALIZACIÓN MASIVA PARA POKÉMON FUERTES
// Pokémon poderosos (> 70 poder) reciben juegos más avanzados
db.pokemons.updateMany(
    {
        nivelPoder: { $gt: 70 },        // Condición 1: poder alto
        games: { $exists: false }       // Condición 2: sin campo games
    },
    {
        $set: {
            games: ['Red', 'Ruby', 'Diamond']  // Juegos más desafiantes
        }
    }
);

// -------------------------------------
// 11. CONSULTAS EN ARRAYS - BÚSQUEDAS ESPECÍFICAS
// -------------------------------------

// BÚSQUEDA SIMPLE: Pokémon que aparecen en un juego específico
// Busca documentos donde el array 'games' contiene 'Gold'
db.pokemons.find({
    games: 'Gold'  // Busca valor exacto dentro del array
});

// BÚSQUEDA MÚLTIPLE: Operador $all
// Buscar Pokémon que aparezcan en TODOS los juegos especificados
db.pokemons.find({
    games: {
        $all: ['Red', 'Ruby']  // Debe contener AMBOS valores
    }
});

// DIFERENCIA ENTRE $in y $all:
// $in: contiene AL MENOS UNO de los valores
// $all: contiene TODOS los valores especificados

// EJEMPLO COMPARATIVO:
// $in - Pokémon que aparecen en Red O Ruby (o ambos)
db.pokemons.find({
    games: { $in: ['Red', 'Ruby'] }
});

// $all - Pokémon que aparecen en Red Y Ruby (ambos obligatorios)
db.pokemons.find({
    games: { $all: ['Red', 'Ruby'] }
});

// -------------------------------------
// 12. ARRAYS NUMÉRICOS - PUNTUACIONES
// -------------------------------------

// CREAR ARRAY DE PUNTUACIONES para Pokémon poderosos
// Usar $and para múltiples condiciones
db.pokemons.updateMany(
    {
        $and: [
            { nivelPoder: { $gt: 70 } },      // Condición 1: poder alto
            { scores: { $exists: false } }     // Condición 2: sin puntuaciones
        ]
    },
    {
        $set: {
            scores: [7, 8, 9]  // Array de puntuaciones numéricas
        }
    }
);

// -------------------------------------
// 13. OPERADORES DE ARRAY - MODIFICACIÓN DINÁMICA
// -------------------------------------

// $push - AGREGAR ELEMENTO AL FINAL del array
// Agregar un nuevo juego a Bulbasaur
db.pokemons.updateOne(
    {
        nombre: 'Bulbasaur'
    },
    {
        $push: {
            games: 'Yellow'  // Agrega 'Yellow' al final del array games
        }
    }
);

// $push con $each - AGREGAR MÚLTIPLES ELEMENTOS
// Insertar varios juegos nuevos para Pikachu
db.pokemons.updateOne(
    {
        nombre: 'Pikachu'
    },
    {
        $push: {
            games: {
                $each: ['Soulsilver', 'Black', 'White']  // Agrega múltiples valores
            }
        }
    }
);

// OTROS OPERADORES DE ARRAY:
// $pull - Eliminar elemento específico del array
db.pokemons.updateOne(
    { nombre: 'Pikachu' },
    {
        $pull: {
            games: 'Blue'  // Elimina 'Blue' del array games
        }
    }
);

// $pop - Eliminar primer o último elemento
db.pokemons.updateOne(
    { nombre: 'Bulbasaur' },
    {
        $pop: {
            games: 1   // 1 = último elemento, -1 = primer elemento
        }
    }
);

// -------------------------------------
// 14. ACTUALIZACIÓN POR ÍNDICE - POSICIONES ESPECÍFICAS
// -------------------------------------

// ACTUALIZAR ELEMENTO EN POSICIÓN ESPECÍFICA
// Cambiar el juego en la posición 1 (segundo elemento) de Charizard
db.pokemons.updateOne(
    {
        nombre: "Charizard"
    },
    {
        $set: {
            'games.1': 'Soulsilver'  // Notación punto: campo.índice
        }
    }
);

// ACTUALIZAR SIN CONOCER EL ÍNDICE - Operador posicional $
// Cambiar todos los valores 5 por 15 en el array scores
db.pokemons.updateMany(
    {
        scores: { $exists: true },  // Debe tener el campo scores
        scores: 5                   // Y contener el valor 5
    },
    {
        $set: {
            'scores.$': 15  // $ representa la posición del elemento encontrado
        }
    }
);

// -------------------------------------
// 15. OPERADOR $slice - LIMITAR RESULTADOS DE ARRAY
// -------------------------------------

// $slice - MOSTRAR SOLO PRIMEROS N ELEMENTOS
// Mostrar solo el primer juego de Snorlax
db.pokemons.findOne(
    {
        nombre: 'Snorlax'
    },
    {
        _id: false,
        nombre: true,
        games: {
            $slice: 1  // Solo el primer elemento del array
        }
    }
);

// $slice con RANGO - Mostrar elementos específicos
// Mostrar elementos del 3 al 5 (skip 3, take 2)
db.pokemons.findOne(
    {
        nombre: 'Pikachu'
    },
    {
        _id: false,
        nombre: true,
        games: {
            $slice: [3, 2]  // [skip, limit] - saltar 3, tomar 2
        }
    }
);

// OTROS EJEMPLOS DE $slice:
// $slice: -2    // Últimos 2 elementos
// $slice: [-3, 2]  // Empezar 3 desde el final, tomar 2

// -------------------------------------
// 16. OPERADOR $size - FILTRAR POR TAMAÑO DE ARRAY
// -------------------------------------

// BUSCAR ARRAYS CON TAMAÑO ESPECÍFICO
// Mostrar Pokémon que tengan exactamente 3 juegos
db.pokemons.find(
    {
        games: {
            $size: 3  // Array con exactamente 3 elementos
        }
    },
    {
        _id: false,
        nombre: true,
        games: true
    }
);

// LIMITACIÓN DE $size:
// No se pueden usar rangos como $size: {$gt: 2}
// Para rangos, usar $where o agregar campo con la longitud

// -------------------------------------
// 17. OPERADOR $where - CONSULTAS CON JAVASCRIPT
// -------------------------------------

// $where permite ejecutar JavaScript para consultas complejas
// NOTA: Hay un error en el código original - 'courses' debería ser 'games'
// y 'lenght' debería ser 'length'

// VERSIÓN CORREGIDA:
db.pokemons.find(
    {
        $and: [
            { games: { $exists: true } },           // Debe tener campo games
            { $where: 'this.games.length >= 5' }    // JavaScript: longitud >= 5
        ]
    }
);

// ALTERNATIVAS MÁS EFICIENTES A $where:
// Opción 1: Agregar campo calculado
db.pokemons.updateMany(
    { games: { $exists: true } },
    {
        $set: {
            gamesCount: { $size: "$games" }  // Crear campo con el tamaño
        }
    }
);

// Opción 2: Usar aggregation pipeline
db.pokemons.aggregate([
    { $match: { games: { $exists: true } } },
    { $addFields: { gamesCount: { $size: "$games" } } },
    { $match: { gamesCount: { $gte: 5 } } }
]);

// =====================================
// RESUMEN DE OPERADORES DE ARRAY
// =====================================

/*
MODIFICACIÓN DE ARRAYS:
$push     - Agregar elemento al final
$pull     - Eliminar elemento específico
$pop      - Eliminar primer/último elemento
$each     - Agregar múltiples elementos con $push

CONSULTA DE ARRAYS:
$in       - Contiene al menos uno de los valores
$all      - Contiene todos los valores especificados
$size     - Longitud exacta del array
$slice    - Limitar elementos mostrados

ACTUALIZACIÓN POSICIONAL:
campo.índice  - Actualizar posición específica
campo.$       - Actualizar elemento encontrado
campo.$[]     - Actualizar todos los elementos

OPERADORES ESPECIALES:
$where    - Consultas con JavaScript (usar con precaución)
$exists   - Verificar existencia de campo
*/