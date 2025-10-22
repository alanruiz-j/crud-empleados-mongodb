/**
 * SISTEMA DE GESTIÓN DE EMPLEADOS - MONGODB
 * Este archivo define la estructura de la base de datos para un sistema de gestión de empleados
 * Incluye esquemas de validación, creación de colecciones y datos iniciales
 */

// ============================================================================
// ESQUEMAS DE VALIDACIÓN PARA LAS COLECCIONES
// ============================================================================

/**
 * Esquema de validación para la colección de Empleados
 * Define la estructura y reglas de validación para documentos de empleados
 */
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
        "description": "Nombre del empleado (campo obligatorio)"
      },
      "apellido_paterno": {
        "bsonType": ["string", "null"],
        "description": "Apellido paterno (opcional, pero al menos uno de los apellidos es requerido)"
      },
      "apellido_materno": {
        "bsonType": ["string", "null"], 
        "description": "Apellido materno (opcional, pero al menos uno de los apellidos es requerido)"
      },
      "id_genero": {
        "bsonType": "objectId",
        "description": "Referencia al género del empleado en la colección Generos"
      },
      "curp_empleado": {
        "bsonType": "string",
        "description": "CURP del empleado con formato válido mexicano",
        "pattern": "^([A-Z][AEIOUX][A-Z]{2}[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9])([0-9])$"
      },
      "rfc_empleado": {
        "bsonType": "string",
        "description": "RFC del empleado con formato válido mexicano",
        "pattern": "^[A-ZÑ&]{3,4}[0-9]{6}(?:[A-Z0-9]{3})?$"
      },
      "telefono_empleado": {
        "bsonType": "string",
        "description": "Número telefónico de 10 dígitos",
        "pattern": "^[0-9]{10}$"
      },
      "contratante": {
        "bsonType": "objectId",
        "description": "Referencia al empleado que contrató a este empleado (auto-referencia)"
      },
      "fecha_contratacion": {
        "bsonType": "date",
        "description": "Fecha en que fue contratado el empleado"
      },
      "id_departamento": {
        "bsonType": "objectId",
        "description": "Referencia al departamento al que pertenece el empleado"
      },
      "domicilio": {
        "bsonType": "object",
        "description": "Información de domicilio del empleado (documento embebido)",
        "required": ["calle", "numero_exterior", "colonia", "id_municipio"],
        "properties": {
          "calle": { 
            "bsonType": "string",
            "description": "Nombre de la calle"
          },
          "numero_exterior": { 
            "bsonType": "string",
            "description": "Número exterior del domicilio"
          },
          "numero_interior": {
            "bsonType": ["string", "null"],
            "description": "Número interior (opcional)"
          },
          "colonia": { 
            "bsonType": "string",
            "description": "Colonia o barrio"
          },
          "id_municipio": {
            "bsonType": "objectId",
            "description": "Referencia al municipio en la colección Municipios"
          }
        }
      },
      "correos": {
        "bsonType": "array",
        "description": "Lista de correos electrónicos del empleado",
        "items": {
          "bsonType": "object",
          "required": ["correo_empleado", "tipo_correo"],
          "properties": {
            "correo_empleado": {
              "bsonType": "string",
              "description": "Dirección de correo electrónico válida",
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

// ============================================================================
// CREACIÓN DE COLECCIONES CON VALIDACIÓN
// ============================================================================

/**
 * Crea la colección de Empleados con validación estricta
 * Aplica el esquema de validación definido anteriormente
 */
db.createCollection('Empleados', {
  validator: empleadosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

/**
 * Esquema de validación para la colección de Géneros
 * Define los tipos de género disponibles en el sistema
 */
const generosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Género",
    "required": ["nombre_genero"],
    "properties": {
      "nombre_genero": {
        "bsonType": "string",
        "description": "Nombre del género (campo obligatorio)"
      },
      "estado_genero": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo del género"
      }
    }
  }
}

/**
 * Crea la colección de Géneros con validación estricta
 */
db.createCollection('Generos', {
  validator: generosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

/**
 * Esquema de validación para la colección de Departamentos
 * Define los departamentos de la empresa
 */
const departamentosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Departamento",
    "required": ["nombre_departamento"],
    "properties": {
      "nombre_departamento": {
        "bsonType": "string",
        "description": "Nombre del departamento (campo obligatorio)"
      },
      "estado_departamento": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo del departamento"
      }
    }
  }
}

/**
 * Crea la colección de Departamentos con validación estricta
 */
db.createCollection('Departamentos', {
  validator: departamentosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

/**
 * Esquema de validación para la colección de Países
 * Define los países disponibles en el sistema
 */
const paisesSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de País",
    "required": ["nombre_pais"],
    "properties": {
      "nombre_pais": {
        "bsonType": "string",
        "description": "Nombre del país (campo obligatorio)"
      },
      "estado_pais": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo del país"
      }
    }
  }
}

/**
 * Crea la colección de Países con validación estricta
 */
db.createCollection('Paises', {
  validator: paisesSchema,
  validationLevel: "strict",
  validationAction: "error"
})

/**
 * Esquema de validación para la colección de Estados
 * Define los estados/provincias de cada país
 */
const estadosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Estado",
    "required": ["nombre_estado", "id_pais"],
    "properties": {
      "nombre_estado": {
        "bsonType": "string",
        "description": "Nombre del estado (campo obligatorio)"
      },
      "id_pais": {
        "bsonType": "objectId",
        "description": "Referencia al país al que pertenece el estado"
      },
      "estado_estado": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo del estado"
      }
    }
  }
}

/**
 * Crea la colección de Estados con validación estricta
 */
db.createCollection('Estados', {
  validator: estadosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

/**
 * Esquema de validación para la colección de Municipios
 * Define los municipios/ciudades de cada estado
 */
const municipiosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Municipio",
    "required": ["nombre_municipio", "id_estado"],
    "properties": {
      "nombre_municipio": {
        "bsonType": "string",
        "description": "Nombre del municipio (campo obligatorio)"
      },
      "id_estado": {
        "bsonType": "objectId",
        "description": "Referencia al estado al que pertenece el municipio"
      },
      "estado_municipio": {
        "bsonType": "bool",
        "description": "Estado activo/inactivo del municipio"
      }
    }
  }
}

/**
 * Crea la colección de Municipios con validación estricta
 */
db.createCollection('Municipios', {
  validator: municipiosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

// ============================================================================
// DATOS INICIALES (SEED DATA)
// ============================================================================

/**
 * Inserta los géneros disponibles en el sistema
 * Define las opciones de género para los empleados
 */
db.Generos.insertMany([
  { nombre_genero: "Masculino", estado_genero: true },
  { nombre_genero: "Femenino", estado_genero: true },
  { nombre_genero: "Otro", estado_genero: true }
]);

/**
 * Inserta los departamentos de la empresa
 * Define las áreas organizacionales disponibles
 */
db.Departamentos.insertMany([
  { nombre_departamento: "Recursos Humanos", estado_departamento: true },
  { nombre_departamento: "Tecnología", estado_departamento: true },
  { nombre_departamento: "Ventas", estado_departamento: true },
  { nombre_departamento: "Marketing", estado_departamento: true },
  { nombre_departamento: "Finanzas", estado_departamento: true }
]);

// ============================================================================
// CONFIGURACIÓN DE IDS PARA RELACIONES
// ============================================================================

/**
 * Genera IDs únicos para países
 * Estos IDs se utilizan para establecer relaciones entre países, estados y municipios
 */
const paisMexicoId = new ObjectId();
const paisUsaId = new ObjectId();
const paisCanadaId = new ObjectId();

/**
 * Genera IDs únicos para estados
 * Cada estado está relacionado con un país específico
 */
const estadoCdmxId = new ObjectId();
const estadoJaliscoId = new ObjectId();
const estadoNuevoLeonId = new ObjectId();
const estadoCaliforniaId = new ObjectId();

// ============================================================================
// INSERCIÓN DE DATOS GEOGRÁFICOS
// ============================================================================

/**
 * Inserta los países disponibles en el sistema
 * Incluye ejemplos de países activos e inactivos
 */
db.Paises.insertMany([
  { _id: paisMexicoId, nombre_pais: "México", estado_pais: true },
  { _id: paisUsaId, nombre_pais: "Estados Unidos", estado_pais: true },
  { _id: paisCanadaId, nombre_pais: "Canadá", estado_pais: false }
]);

/**
 * Inserta los estados/provincias de cada país
 * Establece las relaciones entre países y estados
 */
db.Estados.insertMany([
  { _id: estadoCdmxId, nombre_estado: "Ciudad de México", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoJaliscoId, nombre_estado: "Jalisco", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoNuevoLeonId, nombre_estado: "Nuevo León", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoCaliforniaId, nombre_estado: "California", id_pais: paisUsaId, estado_estado: true }
]);

/**
 * Inserta los municipios/ciudades de cada estado
 * Establece las relaciones entre estados y municipios
 * Organizado por estado para mejor legibilidad
 */
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