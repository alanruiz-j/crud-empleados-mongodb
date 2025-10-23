// Sistema de Gestión de Empleados - Esquema de Base de Datos MongoDB
// Este archivo define la estructura de la base de datos, esquemas de validación y datos iniciales para un sistema de gestión de empleados
// Esquema de validación de la colección de empleados con requisitos estrictos de campos
const empleadosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Empleado",
    "required": [
      "nombre_empleado",
      "id_genero", 
      "curp_empleado",
      "rfc_empleado",
      "telefono_empleado",
      "fecha_contratacion",
      "id_departamento",
      "domicilio",
      "correos"
    ],
    "properties": {
      "nombre_empleado": {
        "bsonType": "string",
        "description": "Nombre del empleado (requerido)"
      },
      "apellido_paterno": {
        "bsonType": ["string", "null"],
        "description": "Apellido paterno (opcional, pero se requiere al menos un apellido)"
      },
      "apellido_materno": {
        "bsonType": ["string", "null"], 
        "description": "Apellido materno (opcional, pero se requiere al menos un apellido)"
      },
      "id_genero": {
        "bsonType": "objectId",
        "description": "Referencia al género en la colección Generos"
      },
      "curp_empleado": {
        "bsonType": "string",
        "description": "CURP mexicano con formato válido",
        "pattern": "^([A-Z][AEIOUX][A-Z]{2}[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9])([0-9])$"
      },
      "rfc_empleado": {
        "bsonType": "string",
        "description": "RFC mexicano con formato válido",
        "pattern": "^[A-ZÑ&]{3,4}[0-9]{6}(?:[A-Z0-9]{3})?$"
      },
      "telefono_empleado": {
        "bsonType": "string",
        "description": "Número de teléfono de 10 dígitos",
        "pattern": "^[0-9]{10}$"
      },
      "contratante": {
        "bsonType": "objectId",
        "description": "Referencia al empleado que contrató a este empleado (auto-referencia)"
      },
      "fecha_contratacion": {
        "bsonType": "date",
        "description": "Fecha de contratación del empleado"
      },
      "id_departamento": {
        "bsonType": "objectId",
        "description": "Referencia al departamento del empleado"
      },
      "domicilio": {
        "bsonType": "object",
        "description": "Información de dirección del empleado (documento embebido)",
        "required": ["calle", "numero_exterior", "colonia", "id_municipio"],
        "properties": {
          "calle": { 
            "bsonType": "string",
            "description": "Nombre de la calle"
          },
          "numero_exterior": { 
            "bsonType": "string",
            "description": "Número exterior"
          },
          "numero_interior": {
            "bsonType": ["string", "null"],
            "description": "Número interior (opcional)"
          },
          "colonia": { 
            "bsonType": "string",
            "description": "Colonia o distrito"
          },
          "id_municipio": {
            "bsonType": "objectId",
            "description": "Referencia al municipio en la colección Municipios"
          }
        }
      },
      "correos": {
        "bsonType": "array",
        "description": "Lista de direcciones de correo del empleado",
        "items": {
          "bsonType": "object",
          "required": ["correo_empleado", "tipo_correo"],
          "properties": {
            "correo_empleado": {
              "bsonType": "string",
              "description": "Dirección de correo válida",
              "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            },
            "tipo_correo": {
              "bsonType": "string",
              "description": "Tipo de correo: principal o secundario",
              "enum": ["principal", "secundario"]
            }
          }
        }
      }
    },
    "anyOf": [
      { "required": ["apellido_paterno"] },
      { "required": ["apellido_materno"] }
    ]
  }
}

// Crear colecciones con validación estricta
db.createCollection('Empleados', {
  validator: empleadosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Esquema de validación de la colección de géneros
const generosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Género",
    "required": ["nombre_genero"],
    "properties": {
      "nombre_genero": {
        "bsonType": "string",
        "description": "Nombre del género (requerido)"
      },
      "estado_genero": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo"
      }
    }
  }
}

db.createCollection('Generos', {
  validator: generosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Esquema de validación de la colección de departamentos
const departamentosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Departamento",
    "required": ["nombre_departamento"],
    "properties": {
      "nombre_departamento": {
        "bsonType": "string",
        "description": "Nombre del departamento (requerido)"
      },
      "estado_departamento": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo"
      }
    }
  }
}

db.createCollection('Departamentos', {
  validator: departamentosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Esquema de validación de la colección de países
const paisesSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de País",
    "required": ["nombre_pais"],
    "properties": {
      "nombre_pais": {
        "bsonType": "string",
        "description": "Nombre del país (requerido)"
      },
      "estado_pais": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo"
      }
    }
  }
}

db.createCollection('Paises', {
  validator: paisesSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Esquema de validación de la colección de estados/provincias
const estadosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Estado",
    "required": ["nombre_estado", "id_pais"],
    "properties": {
      "nombre_estado": {
        "bsonType": "string",
        "description": "Nombre del estado (requerido)"
      },
      "id_pais": {
        "bsonType": "objectId",
        "description": "Referencia al país padre"
      },
      "estado_estado": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo"
      }
    }
  }
}

db.createCollection('Estados', {
  validator: estadosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Esquema de validación de la colección de municipios/ciudades
const municipiosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Municipio",
    "required": ["nombre_municipio", "id_estado"],
    "properties": {
      "nombre_municipio": {
        "bsonType": "string",
        "description": "Nombre del municipio (requerido)"
      },
      "id_estado": {
        "bsonType": "objectId",
        "description": "Referencia al estado padre"
      },
      "estado_municipio": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo"
      }
    }
  }
}

db.createCollection('Municipios', {
  validator: municipiosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Datos iniciales (datos semilla) para el sistema
// Insertar opciones de género disponibles
db.Generos.insertMany([
  { nombre_genero: "Masculino", estado_genero: true },
  { nombre_genero: "Femenino", estado_genero: true },
  { nombre_genero: "Otro", estado_genero: true }
]);

// Insertar departamentos de la empresa
db.Departamentos.insertMany([
  { nombre_departamento: "Recursos Humanos", estado_departamento: true },
  { nombre_departamento: "Tecnología", estado_departamento: true },
  { nombre_departamento: "Ventas", estado_departamento: true },
  { nombre_departamento: "Marketing", estado_departamento: true },
  { nombre_departamento: "Finanzas", estado_departamento: true }
]);

// Generar IDs únicos para establecer relaciones entre países, estados y municipios
const paisMexicoId = new ObjectId();
const paisUsaId = new ObjectId();
const paisCanadaId = new ObjectId();

const estadoCdmxId = new ObjectId();
const estadoJaliscoId = new ObjectId();
const estadoNuevoLeonId = new ObjectId();
const estadoCaliforniaId = new ObjectId();

// Insertar datos geográficos con relaciones
// Insertar países (incluye ejemplos activos e inactivos)
db.Paises.insertMany([
  { _id: paisMexicoId, nombre_pais: "México", estado_pais: true },
  { _id: paisUsaId, nombre_pais: "Estados Unidos", estado_pais: true },
  { _id: paisCanadaId, nombre_pais: "Canadá", estado_pais: false }
]);

// Insertar estados/provincias para cada país
db.Estados.insertMany([
  { _id: estadoCdmxId, nombre_estado: "Ciudad de México", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoJaliscoId, nombre_estado: "Jalisco", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoNuevoLeonId, nombre_estado: "Nuevo León", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoCaliforniaId, nombre_estado: "California", id_pais: paisUsaId, estado_estado: true }
]);

// Insertar municipios/ciudades para cada estado
db.Municipios.insertMany([
  // Municipios de Ciudad de México
  { nombre_municipio: "Coyoacán", id_estado: estadoCdmxId, estado_municipio: true },
  { nombre_municipio: "Álvaro Obregón", id_estado: estadoCdmxId, estado_municipio: true },
  { nombre_municipio: "Benito Juárez", id_estado: estadoCdmxId, estado_municipio: true },
  
  // Municipios de Jalisco
  { nombre_municipio: "Guadalajara", id_estado: estadoJaliscoId, estado_municipio: true },
  { nombre_municipio: "Zapopan", id_estado: estadoJaliscoId, estado_municipio: true },
  { nombre_municipio: "Tlaquepaque", id_estado: estadoJaliscoId, estado_municipio: true },

  // Municipios de Nuevo León
  { nombre_municipio: "Monterrey", id_estado: estadoNuevoLeonId, estado_municipio: true },
  { nombre_municipio: "San Pedro Garza García", id_estado: estadoNuevoLeonId, estado_municipio: true },
  
  // Municipios de California
  { nombre_municipio: "Los Ángeles", id_estado: estadoCaliforniaId, estado_municipio: true },
  { nombre_municipio: "San Francisco", id_estado: estadoCaliforniaId, estado_municipio: true }
]);