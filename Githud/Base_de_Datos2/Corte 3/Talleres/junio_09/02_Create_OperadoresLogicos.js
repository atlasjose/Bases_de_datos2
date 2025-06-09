db.operadoresLogicos.insertMany([
  {
    name: '$and',
    description: 'Combina múltiples expresiones que deben ser todas verdaderas.',
    example1: "Selecciona documentos donde el país (country) sea 'Peru' y el estado (status) sea 'pendiente'.\nEjemplo: { $and: [ { country: 'Peru' }, { status: 'pendiente' } ] }",
    example2: "Filtra personas cuya edad (age) esté entre 18 y 65 años.\nEjemplo: { $and: [ { age: { $gt: 18 } }, { age: { $lt: 65 } } ] }",
    compositeExample1: "Selecciona usuarios mayores de 18 años y cuyo país sea 'Chile'.\nEjemplo: { $and: [ { age: { $gt: 18 } }, { country: { $eq: 'Chile' } } ] }",
    compositeExample2: "Filtra documentos con score menor a 50 y status igual a 'pendiente'.\nEjemplo: { $and: [ { score: { $lt: 50 } }, { status: { $eq: 'pendiente' } } ] }"
  },
  {
    name: '$or',
    description: 'Combina múltiples expresiones donde al menos una debe ser verdadera.',
    example1: "Selecciona documentos donde el país (country) sea 'Peru' o 'Venezuela'.\nEjemplo: { $or: [ { country: 'Peru' }, { country: 'Venezuela' } ] }",
    example2: "Filtra tareas cuyo estado (status) sea 'pendiente' o 'en progreso'.\nEjemplo: { $or: [ { status: 'pendiente' }, { status: 'en progreso' } ] }",
    compositeExample1: "Selecciona documentos donde el país sea 'Peru' o la edad sea menor a 25.\nEjemplo: { $or: [ { country: { $eq: 'Peru' } }, { age: { $lt: 25 } } ] }",
    compositeExample2: "Filtra tareas donde el estado sea 'en progreso' o el score sea mayor a 80.\nEjemplo: { $or: [ { status: { $eq: 'en progreso' } }, { score: { $gt: 80 } } ] }"
  },
  {
    name: '$not',
    description: 'Invierte el efecto de otro operador.',
    example1: "Selecciona personas cuya edad (age) NO sea mayor a 18.\nEjemplo: { age: { $not: { $gt: 18 } } }",
    example2: "Filtra documentos donde el estado (status) NO sea 'pendiente'.\nEjemplo: { status: { $not: { $eq: 'pendiente' } } }",
    compositeExample1: "Filtra usuarios cuya edad NO sea menor a 18.\nEjemplo: { age: { $not: { $lt: 18 } } }",
    compositeExample2: "Selecciona documentos donde el país NO sea 'Chile'.\nEjemplo: { country: { $not: { $eq: 'Chile' } } }"
  },
  {
    name: '$nor',
    description: 'Selecciona los documentos que NO cumplen ninguna de las condiciones.',
    example1: "Selecciona documentos donde el país (country) no sea 'Peru' ni 'Venezuela'.\nEjemplo: { $nor: [ { country: 'Peru' }, { country: 'Venezuela' } ] }",
    example2: "Filtra tareas que no estén en estado 'pendiente' ni 'en progreso'.\nEjemplo: { $nor: [ { status: 'pendiente' }, { status: 'en progreso' } ] }",
    compositeExample1: "Filtra documentos donde el país NO sea 'Peru' ni la edad mayor a 30.\nEjemplo: { $nor: [ { country: { $eq: 'Peru' } }, { age: { $gt: 30 } } ] }",
    compositeExample2: "Selecciona usuarios que no tengan status 'activo' ni score mayor a 70.\nEjemplo: { $nor: [ { status: { $eq: 'activo' } }, { score: { $gt: 70 } } ] }"
  }
]);
