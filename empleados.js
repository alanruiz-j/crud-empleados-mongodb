// use EmpleadosBD

var empleadosSchema = {
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
        "description": "Debe ser un string y es requerido"
      },
      "apellido_paterno": {
        "bsonType": "string",
        "description": "Opcional, pero ver 'anyOf' al final"
      },
      "apellido_materno": {
        "bsonType": "string",
        "description": "Opcional, pero ver 'anyOf' al final"
      },
      "id_genero": {
        "bsonType": "objectId",
        "description": "Referencia a la colección 'generos'"
      },
      "curp_empleado": {
        "bsonType": "string",
        "description": "Debe ser un string de 18 caracteres y cumplir el patrón",
        "pattern": "^([A-Z][AEIOUX][A-Z]{2}[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9])([0-9])$"
      },
      "rfc_empleado": {
        "bsonType": "string",
        "description": "Debe ser un string y cumplir el patrón",
        "pattern": "^[A-ZÑ&]{3,4}[0-9]{6}(?:[A-Z0-9]{3})?$"
      },
      "telefono_empleado": {
        "bsonType": "string",
        "description": "Debe ser un string de 10 dígitos",
        "pattern": "^[0-9]{10}$"
      },
      "contratante": {
        "bsonType": "objectId",
        "description": "Referencia a otro empleado en esta misma colección"
      },
      "fecha_contratacion": {
        "bsonType": "date",
        "description": "Requerido."
      },
      "id_departamento": {
        "bsonType": "objectId",
        "description": "Referencia a la colección 'departamentos'"
      },
      "domicilio": {
        "bsonType": "object",
        "description": "Sub-documento incrustado desde la tabla DOMICILIOS (1 a 1)",
        "required": [ "calle", "numero_exterior", "colonia", "id_municipio" ],
        "properties": {
          "calle": { "bsonType": "string" },
          "numero_exterior": { "bsonType": "string" },
          "numero_interior": { "bsonType": "string" },
          "colonia": { "bsonType": "string" },
          "id_municipio": {
            "bsonType": "objectId",
            "description": "Referencia a la colección 'municipios'"
          }
        }
      },

      "correos": {
        "bsonType": "array",
        "description": "Array de sub-documentos incrustados desde la tabla CORREOS (1 a N)",
        "items": {
          "bsonType": "object",
          "required": [ "correo_empleado", "tipo_correo" ],
          "properties": {
            "correo_empleado": {
              "bsonType": "string",
              "description": "Debe ser un email válido",
              "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$"
            },
            "tipo_correo": {
              "bsonType": "string",
              "description": "Debe ser 'principal' o 'secundario'",
              "enum": [ "principal", "secundario" ]
            }
          }
        }
      }
    },
    "anyOf": [
      { "required": [ "apellido_paterno" ] },
      { "required": [ "apellido_materno" ] }
    ]
  }
}

db.createCollection('Empleados', {
  validator: empleadosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

var generosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Género",
    "required": [ "nombre_genero" ],
    "properties": {
      "nombre_genero": {
        "bsonType": "string",
        "description": "Requerido (NOT NULL)"
      },
      "estado_genero": {
        "bsonType": "bool",
        "description": "Default",
      }
    }
  }
}

db.createCollection('Generos', {
  validator: generosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

var departamentosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Departamento",
    "required": [ "nombre_departamento" ],
    "properties": {
      "nombre_departamento": {
        "bsonType": "string",
        "description": "Requerido (NOT NULL)"
      },
      "estado_departamento": {
        "bsonType": "bool",
        "description": "Default"
      }
    }
  }
};

db.createCollection('Departamentos', {
    validator: departamentosSchema,
    validationLevel: "strict",
    validationAction: "error"
});

var paisesSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de País",
    "required": [ "nombre_pais" ],
    "properties": {
      "nombre_pais": {
        "bsonType": "string",
        "description": "Requerido (NOT NULL)"
      },
      "estado_pais": {
        "bsonType": "bool",
        "description": "Default"
      }
    }
  }
}

db.createCollection('Paises', {
    validator: paisesSchema,
    validationLevel: "strict",
    validationAction: "error"
})

var estadosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Estado",
    "required": [ "nombre_estado", "id_pais" ],
    "properties": {
      "nombre_estado": {
        "bsonType": "string",
        "description": "Requerido (NOT NULL)"
      },
      "id_pais": {
        "bsonType": "objectId",
        "description": "Referencia (FK) a la colección 'paises'"
      },
      "estado_estado": {
        "bsonType": "bool",
        "description": "Default"
      }
    }
  }
}

db.createCollection('Estados', {
  validator: estadosSchema,
  validationLevel: "strict",
  validationAction: "error"
})

var municipiosSchema = {
  "$jsonSchema": {
    "bsonType": "object",
    "title": "Validación de Documento de Municipio",
    "required": [ "nombre_municipio", "id_estado" ],
    "properties": {
      "nombre_municipio": {
        "bsonType": "string",
        "description": "Requerido"
      },
      "id_estado": {
        "bsonType": "objectId",
        "description": "Referencia a la colección 'estados'"
      },
      "estado_municipio": {
        "bsonType": "bool",
        "description": "Default"
      }
    }
  }
}

db.createCollection('Municipios', {
  validator: municipiosSchema,
  validationLevel: "strict",
  validationAction: "error"
})


db.Generos.insertMany([
  { nombre_genero: "Masculino", estado_genero: true },
  { nombre_genero: "Femenino", estado_genero: true },
  { nombre_genero: "Otro", estado_genero: true }
]);

db.Departamentos.insertMany([
  { nombre_departamento: "Recursos Humanos", estado_departamento: true },
  { nombre_departamento: "Tecnología", estado_departamento: true },
  { nombre_departamento: "Ventas", estado_departamento: true },
  { nombre_departamento: "Marketing", estado_departamento: true },
  { nombre_departamento: "Finanzas", estado_departamento: true }
]);

var paisMexicoId = new ObjectId();
var paisUsaId = new ObjectId();
var paisCanadaId = new ObjectId();

var estadoCdmxId = new ObjectId();
var estadoJaliscoId = new ObjectId();
var estadoNuevoLeonId = new ObjectId();
var estadoCaliforniaId = new ObjectId();

db.Paises.insertMany([
  { _id: paisMexicoId, nombre_pais: "México", estado_pais: true },
  { _id: paisUsaId, nombre_pais: "Estados Unidos", estado_pais: true },
  { _id: paisCanadaId, nombre_pais: "Canadá", estado_pais: false } // Ejemplo de un país inactivo
]);

db.Estados.insertMany([
  { _id: estadoCdmxId, nombre_estado: "Ciudad de México", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoJaliscoId, nombre_estado: "Jalisco", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoNuevoLeonId, nombre_estado: "Nuevo León", id_pais: paisMexicoId, estado_estado: true },
  { _id: estadoCaliforniaId, nombre_estado: "California", id_pais: paisUsaId, estado_estado: true }
]);

db.Municipios.insertMany([
  // Municipios de CDMX
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