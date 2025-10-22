const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'EmpleadosBD';
let db;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectAndStartServer() {
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Conectado exitosamente a MongoDB');
        
        db = client.db(dbName);

        // API endpoints for populating form selects with reference data
        app.get('/api/generos', async (req, res) => {
            try {
                const data = await db.collection('Generos').find({ estado_genero: true }).toArray();
                res.json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
            }
        });

        app.get('/api/departamentos', async (req, res) => {
            try {
                const data = await db.collection('Departamentos').find({ estado_departamento: true }).toArray();
                res.json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
            }
        });

        app.get('/api/paises', async (req, res) => {
            try {
                const data = await db.collection('Paises').find({ estado_pais: true }).toArray();
                res.json(data);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: err.message });
            }
        });

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


        // Endpoint to create new employee records
        app.post('/api/empleados', async (req, res) => {
            console.log('Datos recibidos del formulario:', req.body);

            try {
                // Build address object with optional interior number
                const domicilio = {
                    calle: req.body.calle_empleado || '',
                    numero_exterior: req.body.numero_exterior_empleado || '',
                    colonia: req.body.colonia_empleado || '',
                    id_municipio: new ObjectId(req.body.municipio_empleado)
                };
                
                if (req.body.numero_interior_empleado) {
                    domicilio.numero_interior = req.body.numero_interior_empleado;
                }

                // Build email array with optional secondary email
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

                // Build main employee document with required fields
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
                
                // Add optional last names if provided
                if (req.body.apellido_paterno_empleado) {
                    documentoEmpleado.apellido_paterno = req.body.apellido_paterno_empleado;
                }

                if (req.body.apellido_materno_empleado) {
                    documentoEmpleado.apellido_materno = req.body.apellido_materno_empleado;
                }
                
                // Insert employee record into database
                const coleccion = db.collection('Empleados');
                const resultado = await coleccion.insertOne(documentoEmpleado);

                // Return success response
                res.status(201).json({
                    status: 'success',
                    message: 'Empleado guardado con éxito',
                    insertedId: resultado.insertedId
                });

            } catch (err) {
                // Handle validation and server errors
                if (err.name === 'MongoServerError' && err.code === 121) {
                    console.error('Error de validación:', err.errInfo.details);
                    res.status(400).json({
                        status: 'error',
                        message: 'Datos inválidos. El servidor rechazó los datos. Revisa la consola del servidor.',
                        details: err.errInfo.details
                    });
                } else {
                    console.error('Error al insertar:', err);
                    res.status(500).json({
                        status: 'error',
                        message: 'Error interno del servidor',
                        error: err.message
                    });
                }
            }
        });

        // Start the Express server
        app.listen(port, () => {
            console.log(`Servidor API corriendo en http://localhost:${port}`);
        });

    } catch (err) {
        console.error('No se pudo conectar a MongoDB:', err);
        process.exit(1);
    }
}

// Initialize database connection and start server
connectAndStartServer();