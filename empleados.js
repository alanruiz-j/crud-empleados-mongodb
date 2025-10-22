// Employee Management System - MongoDB Database Schema
// This file defines database structure, validation schemas, and initial data for an employee management system
// Employee collection validation schema with strict field requirements
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
        "description": "Employee first name (required)"
      },
      "apellido_paterno": {
        "bsonType": ["string", "null"],
        "description": "Paternal last name (optional, but at least one last name required)"
      },
      "apellido_materno": {
        "bsonType": ["string", "null"], 
        "description": "Maternal last name (optional, but at least one last name required)"
      },
      "id_genero": {
        "bsonType": "objectId",
        "description": "Reference to gender in Generos collection"
      },
      "curp_empleado": {
        "bsonType": "string",
        "description": "Mexican CURP with valid format",
        "pattern": "^([A-Z][AEIOUX][A-Z]{2}[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9])([0-9])$"
      },
      "rfc_empleado": {
        "bsonType": "string",
        "description": "Mexican RFC with valid format",
        "pattern": "^[A-ZÑ&]{3,4}[0-9]{6}(?:[A-Z0-9]{3})?$"
      },
      "telefono_empleado": {
        "bsonType": "string",
        "description": "10-digit phone number",
        "pattern": "^[0-9]{10}$"
      },
      "contratante": {
        "bsonType": "objectId",
        "description": "Reference to employee who hired this employee (self-reference)"
      },
      "fecha_contratacion": {
        "bsonType": "date",
        "description": "Employee hire date"
      },
      "id_departamento": {
        "bsonType": "objectId",
        "description": "Reference to employee's department"
      },
      "domicilio": {
        "bsonType": "object",
        "description": "Employee address information (embedded document)",
        "required": ["calle", "numero_exterior", "colonia", "id_municipio"],
        "properties": {
          "calle": { 
            "bsonType": "string",
            "description": "Street name"
          },
          "numero_exterior": { 
            "bsonType": "string",
            "description": "Exterior number"
          },
          "numero_interior": {
            "bsonType": ["string", "null"],
            "description": "Interior number (optional)"
          },
          "colonia": { 
            "bsonType": "string",
            "description": "Neighborhood or district"
          },
          "id_municipio": {
            "bsonType": "objectId",
            "description": "Reference to municipality in Municipios collection"
          }
        }
      },
      "correos": {
        "bsonType": "array",
        "description": "Employee email addresses list",
        "items": {
          "bsonType": "object",
          "required": ["correo_empleado", "tipo_correo"],
          "properties": {
            "correo_empleado": {
              "bsonType": "string",
              "description": "Valid email address",
              "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            },
            "tipo_correo": {
              "bsonType": "string",
              "description": "Email type: principal or secundario",
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

// Create collections with strict validation
db.createCollection('Empleados', {
  validator: empleadosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Gender collection validation schema
const generosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Género",
    "required": ["nombre_genero"],
    "properties": {
      "nombre_genero": {
        "bsonType": "string",
        "description": "Gender name (required)"
      },
      "estado_genero": {
        "bsonType": "bool",
        "description": "Active/inactive status"
      }
    }
  }
}

db.createCollection('Generos', {
  validator: generosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Department collection validation schema
const departamentosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Departamento",
    "required": ["nombre_departamento"],
    "properties": {
      "nombre_departamento": {
        "bsonType": "string",
        "description": "Department name (required)"
      },
      "estado_departamento": {
        "bsonType": "bool",
        "description": "Active/inactive status"
      }
    }
  }
}

db.createCollection('Departamentos', {
  validator: departamentosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Country collection validation schema
const paisesSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de País",
    "required": ["nombre_pais"],
    "properties": {
      "nombre_pais": {
        "bsonType": "string",
        "description": "Country name (required)"
      },
      "estado_pais": {
        "bsonType": "bool",
        "description": "Active/inactive status"
      }
    }
  }
}

db.createCollection('Paises', {
  validator: paisesSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// State/Province collection validation schema
const estadosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Estado",
    "required": ["nombre_estado", "id_pais"],
    "properties": {
      "nombre_estado": {
        "bsonType": "string",
        "description": "State name (required)"
      },
      "id_pais": {
        "bsonType": "objectId",
        "description": "Reference to parent country"
      },
      "estado_estado": {
        "bsonType": "bool",
        "description": "Active/inactive status"
      }
    }
  }
}

db.createCollection('Estados', {
  validator: estadosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Municipality/City collection validation schema
const municipiosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Municipio",
    "required": ["nombre_municipio", "id_estado"],
    "properties": {
      "nombre_municipio": {
        "bsonType": "string",
        "description": "Municipality name (required)"
      },
      "id_estado": {
        "bsonType": "objectId",
        "description": "Reference to parent state"
      },
      "estado_municipio": {
        "bsonType": "bool",
        "description": "Active/inactive status"
      }
    }
  }
}

db.createCollection('Municipios', {
  validator: municipiosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// Initial data (seed data) for the system
// Insert available gender options
db.Generos.insertMany([
  { nombre_genero: "Masculino", estado_genero: true },
  { nombre_genero: "Femenino", estado_genero: true },
  { nombre_genero: "Otro", estado_genero: true }
]);

// Insert company departments
db.Departamentos.insertMany([
  { nombre_departamento: "Recursos Humanos", estado_departamento: true },
  { nombre_departamento: "Tecnología", estado_departamento: true },
  { nombre_departamento: "Ventas", estado_departamento: true },
  { nombre_departamento: "Marketing", estado_departamento: true },
  { nombre_departamento: "Finanzas", estado_departamento: true }
]);

// Generate unique IDs for establishing relationships between countries, states, and municipalities
const paisMexicoId = new ObjectId();
const paisUsaId = new ObjectId();
const paisCanadaId = new ObjectId();

const estadoCdmxId = new ObjectId();
const estadoJaliscoId = new ObjectId();
const estadoNuevoLeonId = new ObjectId();
const estadoCaliforniaId = new ObjectId();

// Insert geographical data with relationships
// Insert countries (includes active and inactive examples)
db.Paises.insertMany([
  { _id: paisMexicoId, nombre_pais: "México", estado_pais: true },
  { _id: paisUsaId, nombre_pais: "Estados Unidos", estado_pais: true },
  { _id: paisCanadaId, nombre_pais: "Canadá", estado_pais: false }
]);

// Insert states/provinces for each country
db.Estados.insertMany([
  { _id: estadoCdmxId, nombre_estado: "Ciudad de México", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoJaliscoId, nombre_estado: "Jalisco", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoNuevoLeonId, nombre_estado: "Nuevo León", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoCaliforniaId, nombre_estado: "California", id_pais: paisUsaId, estado_estado: true }
]);

// Insert municipalities/cities for each state
db.Municipios.insertMany([
  // Ciudad de México municipalities
  { nombre_municipio: "Coyoacán", id_estado: estadoCdmxId, estado_municipio: true },
  { nombre_municipio: "Álvaro Obregón", id_estado: estadoCdmxId, estado_municipio: true },
  { nombre_municipio: "Benito Juárez", id_estado: estadoCdmxId, estado_municipio: true },
  
  // Jalisco municipalities
  { nombre_municipio: "Guadalajara", id_estado: estadoJaliscoId, estado_municipio: true },
  { nombre_municipio: "Zapopan", id_estado: estadoJaliscoId, estado_municipio: true },
  { nombre_municipio: "Tlaquepaque", id_estado: estadoJaliscoId, estado_municipio: true },

  // Nuevo León municipalities
  { nombre_municipio: "Monterrey", id_estado: estadoNuevoLeonId, estado_municipio: true },
  { nombre_municipio: "San Pedro Garza García", id_estado: estadoNuevoLeonId, estado_municipio: true },
  
  // California municipalities
  { nombre_municipio: "Los Ángeles", id_estado: estadoCaliforniaId, estado_municipio: true },
  { nombre_municipio: "San Francisco", id_estado: estadoCaliforniaId, estado_municipio: true }
]);