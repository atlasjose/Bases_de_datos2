db.operadoresRelacionales.insertMany([
  {
    name: '$eq',
    description: 'Compara si el valor del campo es igual al valor especificado.',
    example1: "Selecciona los documentos donde el campo country sea igual a 'Peru'.\nEjemplo: { country: { $eq: 'Peru' } }",
    example2: "Filtra documentos donde el campo status sea igual a 'pendiente'.\nEjemplo: { status: { $eq: 'pendiente' } }",
    compositeExample1: "Filtra documentos donde el país sea 'Peru' y el estado sea 'activo'.\nEjemplo: { $and: [ { country: { $eq: 'Peru' } }, { status: { $eq: 'activo' } } ] }",
    compositeExample2: "Selecciona usuarios cuyo país sea 'Chile' y edad mayor a 25.\nEjemplo: { $and: [ { country: { $eq: 'Chile' } }, { age: { $gt: 25 } } ] }"
  },
  {
    name: '$ne',
    description: 'Compara si el valor del campo NO es igual al valor especificado.',
    example1: "Selecciona los documentos donde el campo country NO sea igual a 'Venezuela'.\nEjemplo: { country: { $ne: 'Venezuela' } }",
    example2: "Filtra documentos donde el campo status NO sea 'completado'.\nEjemplo: { status: { $ne: 'completado' } }",
    compositeExample1: "Filtra documentos donde el país NO sea 'Venezuela' y la edad sea mayor a 30.\nEjemplo: { $and: [ { country: { $ne: 'Venezuela' } }, { age: { $gt: 30 } } ] }",
    compositeExample2: "Selecciona usuarios cuyo status NO sea 'inactivo' y el país sea 'Chile'.\nEjemplo: { $and: [ { status: { $ne: 'inactivo' } }, { country: { $eq: 'Chile' } } ] }"
  },
  {
    name: '$gt',
    description: 'Selecciona documentos donde el valor del campo es mayor que el valor especificado.',
    example1: "Encuentra documentos donde la edad (age) sea mayor a 30.\nEjemplo: { age: { $gt: 30 } }",
    example2: "Filtra documentos donde la puntuación (score) sea mayor a 80.\nEjemplo: { score: { $gt: 80 } }",
    compositeExample1: "Encuentra documentos donde la edad sea mayor a 25 y el país sea 'Peru'.\nEjemplo: { $and: [ { age: { $gt: 25 } }, { country: { $eq: 'Peru' } } ] }",
    compositeExample2: "Selecciona usuarios con puntuación mayor a 80 y estado 'activo'.\nEjemplo: { $and: [ { score: { $gt: 80 } }, { status: { $eq: 'activo' } } ] }"
  },
  {
    name: '$gte',
    description: 'Selecciona documentos donde el valor del campo es mayor o igual al valor especificado.',
    example1: "Selecciona personas cuya edad (age) sea al menos 18 años.\nEjemplo: { age: { $gte: 18 } }",
    example2: "Filtra documentos con puntuaciones (score) de 60 o más.\nEjemplo: { score: { $gte: 60 } }",
    compositeExample1: "Filtra documentos donde la edad sea al menos 18 y el país no sea 'Chile'.\nEjemplo: { $and: [ { age: { $gte: 18 } }, { country: { $ne: 'Chile' } } ] }",
    compositeExample2: "Selecciona personas con puntuación mayor o igual a 60 y status diferente de 'borrado'.\nEjemplo: { $and: [ { score: { $gte: 60 } }, { status: { $ne: 'borrado' } } ] }"
  },
  {
    name: '$lt',
    description: 'Selecciona documentos donde el valor del campo es menor que el valor especificado.',
    example1: "Filtra documentos donde la edad (age) sea menor a 18.\nEjemplo: { age: { $lt: 18 } }",
    example2: "Encuentra documentos con puntuación (score) menor a 50.\nEjemplo: { score: { $lt: 50 } }",
    compositeExample1: "Filtra usuarios con edad menor a 18 y país distinto de 'Chile'.\nEjemplo: { $and: [ { age: { $lt: 18 } }, { country: { $ne: 'Chile' } } ] }",
    compositeExample2: "Encuentra documentos con score menor a 50 y status 'pendiente'.\nEjemplo: { $and: [ { score: { $lt: 50 } }, { status: { $eq: 'pendiente' } } ] }"
  },
  {
    name: '$lte',
    description: 'Selecciona documentos donde el valor del campo es menor o igual al valor especificado.',
    example1: "Filtra personas cuya edad (age) no supere los 65 años.\nEjemplo: { age: { $lte: 65 } }",
    example2: "Encuentra documentos con puntuaciones (score) de 75 o menos.\nEjemplo: { score: { $lte: 75 } }",
    compositeExample1: "Filtra documentos donde la edad sea menor o igual a 65 y el país sea 'Chile'.\nEjemplo: { $and: [ { age: { $lte: 65 } }, { country: { $eq: 'Chile' } } ] }",
    compositeExample2: "Encuentra puntuaciones menores o iguales a 75 y status no sea 'rechazado'.\nEjemplo: { $and: [ { score: { $lte: 75 } }, { status: { $ne: 'rechazado' } } ] }"
  },
  {
    name: '$in',
    description: 'Selecciona los documentos donde el valor del campo coincide con alguno de los valores en el array.',
    example1: "Selecciona documentos donde el país (country) sea 'Peru' o 'Chile'.\nEjemplo: { country: { $in: ['Peru', 'Chile'] } }",
    example2: "Filtra tareas cuyo estado (status) sea 'pendiente' o 'en progreso'.\nEjemplo: { status: { $in: ['pendiente', 'en progreso'] } }",
    compositeExample1: "Selecciona documentos donde el país sea 'Peru' o 'Chile' y el estado sea 'activo'.\nEjemplo: { $and: [ { country: { $in: ['Peru', 'Chile'] } }, { status: { $eq: 'activo' } } ] }",
    compositeExample2: "Filtra usuarios cuyo estado sea 'pendiente' o 'en progreso' y edad mayor a 20.\nEjemplo: { $and: [ { status: { $in: ['pendiente', 'en progreso'] } }, { age: { $gt: 20 } } ] }"
  },
  {
    name: '$nin',
    description: 'Selecciona los documentos donde el valor del campo NO coincide con ninguno de los valores en el array.',
    example1: "Filtra documentos donde el país (country) NO sea ni 'Peru' ni 'Chile'.\nEjemplo: { country: { $nin: ['Peru', 'Chile'] } }",
    example2: "Selecciona tareas cuyo estado (status) NO sea 'cancelado'.\nEjemplo: { status: { $nin: ['cancelado'] } }",
    compositeExample1: "Filtra documentos donde el país NO sea ni 'Peru' ni 'Chile' y edad menor a 30.\nEjemplo: { $and: [ { country: { $nin: ['Peru', 'Chile'] } }, { age: { $lt: 30 } } ] }",
    compositeExample2: "Selecciona tareas cuyo estado NO sea 'cancelado' y el país NO sea 'Venezuela'.\nEjemplo: { $and: [ { status: { $nin: ['cancelado'] } }, { country: { $ne: 'Venezuela' } } ] }"
  }
]);
