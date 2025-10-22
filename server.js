// 1. Importar las dependencias
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

// 2. Configuración inicial
const app = express();
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'EmpleadosBD';
let db;

// 3. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Función principal para conectar a MongoDB e iniciar el servidor
async function connectAndStartServer() {
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Conectado exitosamente a MongoDB');
        
        db = client.db(dbName);

        // ==========================================================
        // RUTAS 'GET' PARA POBLAR LOS SELECTS (Sin cambios)
        // ==========================================================

        // GET - Cargar Géneros
        app.get('/api/generos', async (req, res) => {
            try {
                const data = await db.collection('Generos').find({ estado_genero: true }).toArray();
                res.json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
            }
        });

        // GET - Cargar Departamentos
        app.get('/api/departamentos', async (req, res) => {
            try {
                const data = await db.collection('Departamentos').find({ estado_departamento: true }).toArray();
                res.json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
            }
        });

        // GET - Cargar Países
        app.get('/api/paises', async (req, res) => {
            try {
                const data = await db.collection('Paises').find({ estado_pais: true }).toArray();
                res.json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
            }
        });

        // GET - Cargar Estados (por País)
        app.get('/api/estados/pais/:paisId', async (req, res) => {
            try {
                const paisId = new ObjectId(req.params.paisId);
                const data = await db.collection('Estados').find({ id_pais: paisId, estado_estado: true }).toArray();
                res.json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
            }
        });

        // GET - Cargar Municipios (por Estado)
        app.get('/api/municipios/estado/:estadoId', async (req, res) => {
            try {
                const estadoId = new ObjectId(req.params.estadoId);
                const data = await db.collection('Municipios').find({ id_estado: estadoId, estado_municipio: true }).toArray();
                res.json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
            }
        });


        // ==========================================================
        // RUTA 'POST' PARA GUARDAR EMPLEADO (¡ACTUALIZADA!)
        // ==========================================================
        app.post('/api/empleados', async (req, res) => {
            console.log('Datos recibidos del formulario:', req.body);

            try {
                // 6. Mapear datos del formulario al schema (Dinámicamente)

                // --- Domicilio (con campo opcional) ---
                const domicilio = {
                    calle: req.body.calle_empleado || '',
                    numero_exterior: req.body.numero_exterior_empleado || '',
                    colonia: req.body.colonia_empleado || '',
                    id_municipio: new ObjectId(req.body.municipio_empleado)
                };
                
                // Añadir 'numero_interior' SOLO SI existe y no está vacío
                if (req.body.numero_interior_empleado) {
                    domicilio.numero_interior = req.body.numero_interior_empleado;
                }

                // --- Correos (con campo opcional) ---
                const correos = [];
                // El correo principal es obligatorio por el formulario
                if (req.body.correo_principal_empleado) {
                    correos.push({
                        correo_empleado: req.body.correo_principal_empleado,
                        tipo_correo: 'principal'
                    });
                }
                
                // Añadir 'correo_secundario' SOLO SI existe y no está vacío
                if (req.body.correo_secundario_empleado) {
                    correos.push({
                        correo_empleado: req.body.correo_secundario_empleado,
                        tipo_correo: 'secundario'
                    });
                }

                // --- Documento Principal (con campos opcionales) ---
                // Empezamos con los campos obligatorios
                const documentoEmpleado = {
                    nombre_empleado: req.body.nombre_empleado || '',
                    id_genero: new ObjectId(req.body.genero_empleado),
                    curp_empleado: req.body.curp_empleado.toUpperCase() || '',
                    rfc_empleado: req.body.rfc_empleado.toUpperCase() || '',
                    telefono_empleado: req.body.telefono_empleado || '',
                    fecha_contratacion: new Date(),
                    id_departamento: new ObjectId(req.body.departamento_empleado),
                    domicilio: domicilio,
                    correos: correos
                };
                
                // Añadir 'apellido_paterno' SOLO SI existe y no está vacío
                if (req.body.apellido_paterno_empleado) {
                    documentoEmpleado.apellido_paterno = req.body.apellido_paterno_empleado;
                }

                // Añadir 'apellido_materno' SOLO SI existe y no está vacío
                if (req.body.apellido_materno_empleado) {
                    documentoEmpleado.apellido_materno = req.body.apellido_materno_empleado;
                }
                
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
                        message: 'Datos inválidos. El servidor rechazó los datos. Revisa la consola del servidor.',
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