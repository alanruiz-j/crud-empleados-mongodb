// 1. Importar las dependencias
const express = require('express');
const { MongoClient, ObjectId, Timestamp } = require('mongodb'); // Importamos ObjectId y Timestamp
const cors = require('cors');

// 2. Configuración inicial
const app = express();
const port = 3000; // El puerto donde correrá nuestro servidor API
const mongoUrl = 'mongodb://localhost:27017'; // URL de tu MongoDB local
const dbName = 'EmpleadosBD'; // El nombre de tu DB
let db; // Variable para guardar la conexión a la DB

// 3. Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Para parsear JSON (aunque el form envía urlencoded)
app.use(express.urlencoded({ extended: true })); // Para parsear los datos del formulario (x-www-form-urlencoded)

// 4. Función principal para conectar a MongoDB e iniciar el servidor
async function connectAndStartServer() {
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Conectado exitosamente a MongoDB');
        
        db = client.db(dbName); // Asigna la conexión de la DB a la variable global

        // 5. ¡El Endpoint! Aquí es donde el formulario enviará los datos
        app.post('/api/empleados', async (req, res) => {
            console.log('Datos recibidos del formulario:', req.body);

            try {
                // --- ¡Advertencia de Incompatibilidad! ---
                // Tu schema empleados.js espera `objectId` para campos como `id_genero`, 
                // `id_departamento`, y `id_municipio` en el domicilio.
                //
                // Tu index.html envía strings simples (ej: "1", "2", "mx", "jal").
                //
                // Una inserción directa fallará la validación del schema.
                // SOLUCIÓN: Debes modificar tu 'empleados.js' para que esos
                // campos acepten "bsonType": "string" en lugar de "objectId".
                //
                // El siguiente código asume que ya hiciste ese cambio en tu schema.

                // 6. Mapear datos del formulario al schema
                
                // Sub-documento Domicilio
                const domicilio = {
                    calle: req.body.calle_empleado || '',
                    numero_exterior: req.body.numero_exterior_empleado || '',
                    numero_interior: req.body.numero_interior_empleado || null,
                    colonia: req.body.colonia_empleado || '',
                    id_municipio: req.body.municipio_empleado || '' // Guardando como string
                };

                // Array de Correos
                const correos = [];
                if (req.body.correo_principal_empleado) {
                    correos.push({
                        correo_empleado: req.body.correo_principal_empleado,
                        tipo_correo: 'principal'
                    });
                }
                if (req.body.correo_secundario_empleado) {
                    correos.push({
                        correo_empleado: req.body.correo_secundario_empleado,
                        tipo_correo: 'secundario'
                    });
                }

                // Documento Principal
                const documentoEmpleado = {
                    nombre_empleado: req.body.nombre_empleado || '',
                    apellido_paterno: req.body.apellido_paterno_empleado || null,
                    apellido_materno: req.body.apellido_materno_empleado || null,
                    id_genero: req.body.genero_empleado || '', // Guardando como string
                    curp_empleado: req.body.curp_empleado || '',
                    rfc_empleado: req.body.rfc_empleado || '',
                    telefono_empleado: req.body.telefono_empleado || '',
                    fecha_contratacion: new Date(), // Requerido por tu schema
                    id_departamento: req.body.departamento_empleado || '', // Guardando como string
                    domicilio: domicilio,
                    correos: correos
                };
                
                // 7. Insertar en la base de datos
                const coleccion = db.collection('Empleados');
                const resultado = await coleccion.insertOne(documentoEmpleado);

                // 8. Responder al front-end con éxito
                res.status(201).json({
                    status: 'success',
                    message: 'Empleado guardado con éxito',
                    insertedId: resultado.insertedId
                });

            } catch (err) {
                // 9. Manejo de Errores (incluyendo validación de Schema)
                if (err.name === 'MongoServerError' && err.code === 121) {
                    // Error de validación de Schema
                    console.error('Error de validación:', err.errInfo.details);
                    res.status(400).json({
                        status: 'error',
                        message: 'Datos inválidos. Revisa la consola del servidor.',
                        details: err.errInfo.details
                    });
                } else {
                    // Otro error
                    console.error('Error al insertar:', err);
                    res.status(500).json({
                        status: 'error',
                        message: 'Error interno del servidor',
                        error: err.message
                    });
                }
            }
        });

        // Iniciar el servidor
        app.listen(port, () => {
            console.log(`Servidor API corriendo en http://localhost:${port}`);
        });

    } catch (err) {
        console.error('No se pudo conectar a MongoDB:', err);
        process.exit(1);
    }
}

// Ejecutar la función principal
connectAndStartServer();