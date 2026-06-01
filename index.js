const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors());

let usuarios = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María López' }
];

// documentacion en json
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API Final - Mi Tarea',
        version: '1.0.0',
        description: 'Documentación interactiva de la API con CRUD completo',
    },
    servers: [
        {
            url: 'https://api-final-angel-crud.onrender.com',
            description: 'Servidor Production'
        }
    ],
    paths: {
        '/usuarios': {
            get: {
                summary: 'Retorna la lista de todos los usuarios (Read)',
                responses: {
                    '200': {
                        description: 'Lista devuelta con éxito',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            nombre: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                summary: 'Registra un nuevo usuario (Create)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nombre'],
                                properties: {
                                    nombre: { type: 'string', example: 'Carlos Mendoza' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Usuario creado exitosamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        nombre: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/usuarios/{id}': {
            put: {
                summary: 'Actualiza un usuario existente (Update)',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID numérico del usuario a actualizar'
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nombre'],
                                properties: {
                                    nombre: { type: 'string', example: 'Juan Pérez Modificado' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuario actualizado correctamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer' },
                                        nombre: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Falta el nombre en el body'
                    },
                    '404': {
                        description: 'Usuario no encontrado'
                    }
                }
            },
            delete: {
                summary: 'Elimina un usuario por su ID (Delete)',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID numérico del usuario a borrar'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Usuario eliminado correctamente'
                    },
                    '404': {
                        description: 'Usuario no encontrado'
                    }
                }
            }
        }
    }
};

// ruta de documentacion.
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// endpoints 

//  Obtener todos los usuarios (READ)
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

//  Crear un nuevo usuario (CREATE)
app.post('/usuarios', (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: 'El campo nombre es obligatorio' });
    }
    const nuevoUsuario = {
        id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
        nombre: nombre
    };
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

// Actualizar un usuario existente (UPDATE)
app.put('/usuarios/:id', (req, res) => {
    const idUsuario = parseInt(req.params.id);
    const { nombre } = req.body;
    
    // Buscamos si el usuario existe
    const usuarioEncontrado = usuarios.find(u => u.id === idUsuario);

    if (!usuarioEncontrado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (!nombre) {
        return res.status(400).json({ error: 'El campo nombre es obligatorio' });
    }

    // Actualizamos el nombre
    usuarioEncontrado.nombre = nombre;
    res.json(usuarioEncontrado);
});

//  Eliminar un usuario por ID (DELETE)
app.delete('/usuarios/:id', (req, res) => {
    const idUsuario = parseInt(req.params.id);
    const index = usuarios.findIndex(u => u.id === idUsuario);

    if (index === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuarios.splice(index, 1);
    res.json({ mensaje: `Usuario con ID ${idUsuario} eliminado exitosamente.` });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});