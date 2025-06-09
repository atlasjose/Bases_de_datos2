
````markdown
# 📘 Tutorial: Uso de Operadores Relacionales y Lógicos en MongoDB

Este tutorial te enseñará cómo utilizar comandos `find()` en MongoDB para consultar las colecciones de operadores **relacionales** y **lógicos**, previamente insertados en las colecciones `operadoresRelacionales` y `operadoresLogicos`.

---

## ✅ Prerrequisitos

Antes de comenzar, asegúrate de:

- Tener **MongoDB** correctamente instalado y en ejecución.
- Haber insertado los operadores en las siguientes colecciones:
  - `operadoresRelacionales`
  - `operadoresLogicos`

---

## 📂 Consultas sobre `operadoresRelacionales`

Cada documento en esta colección representa un operador relacional. Puedes consultar cada uno por su nombre (`name`) usando los siguientes comandos:

### 🔹 `$eq` – Igualdad
```javascript
db.operadoresRelacionales.find({ name: "$eq" }).pretty()
````

### 🔹 `$ne` – Distinto

```javascript
db.operadoresRelacionales.find({ name: "$ne" }).pretty()
```

### 🔹 `$gt` – Mayor que

```javascript
db.operadoresRelacionales.find({ name: "$gt" }).pretty()
```

### 🔹 `$gte` – Mayor o igual que

```javascript
db.operadoresRelacionales.find({ name: "$gte" }).pretty()
```

### 🔹 `$lt` – Menor que

```javascript
db.operadoresRelacionales.find({ name: "$lt" }).pretty()
```

### 🔹 `$lte` – Menor o igual que

```javascript
db.operadoresRelacionales.find({ name: "$lte" }).pretty()
```

### 🔹 `$in` – Dentro de un conjunto

```javascript
db.operadoresRelacionales.find({ name: "$in" }).pretty()
```

### 🔹 `$nin` – Fuera de un conjunto

```javascript
db.operadoresRelacionales.find({ name: "$nin" }).pretty()
```

---

## 📂 Consultas sobre `operadoresLogicos`

Los operadores lógicos también están disponibles como documentos en la colección `operadoresLogicos`. Consulta cada uno así:

### 🔹 `$and` – Todas las condiciones verdaderas

```javascript
db.operadoresLogicos.find({ name: "$and" }).pretty()
```

### 🔹 `$or` – Al menos una condición verdadera

```javascript
db.operadoresLogicos.find({ name: "$or" }).pretty()
```

### 🔹 `$not` – Negación

```javascript
db.operadoresLogicos.find({ name: "$not" }).pretty()
```

### 🔹 `$nor` – Ninguna condición verdadera

```javascript
db.operadoresLogicos.find({ name: "$nor" }).pretty()
```

---
