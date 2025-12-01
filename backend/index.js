const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuración de conexión a XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Usuario por defecto de XAMPP
    password: '',      // Contraseña por defecto (vacía)
    database: 'reservas_db'
});

// 2. Probar conexión
db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
    } else {
        console.log('✅ Conectado a la Base de Datos MySQL (XAMPP)');
    }
});

// --- RUTAS (ENDPOINTS) ---

// Login (Buscar usuario)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
    
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            res.json(result[0]); // Devuelve el usuario encontrado
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
});

// Obtener Salas (Para el Calendario)
app.get('/api/salas', (req, res) => {
    const sql = 'SELECT * FROM salas';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// 3. Iniciar servidor
app.listen(3000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3000');
});

app.get('/api/salas', (req, res) => {
    const sql = 'SELECT * FROM salas';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// 2. Obtener reservas (Filtradas por Sala)
app.get('/api/reservas', (req, res) => {
    const { salaId } = req.query; // Angular enviará ?salaId=1
    
    // OJO: En la BD los campos son snake_case (bloque_inicio), 
    // pero tu Front espera camelCase (bloqueInicio).
    // Usamos alias en el SQL para arreglarlo rápido:
    const sql = `
        SELECT 
            id, 
            usuario_id as usuarioId, 
            sala_id as salaId, 
            fecha, 
            bloque_inicio as bloqueInicio, 
            motivo, 
            estado 
        FROM reservas 
        WHERE sala_id = ? AND estado = 'APROBADA'
    `;
    
    db.query(sql, [salaId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// 3. CREAR NUEVA RESERVA
app.post('/api/reservas', (req, res) => {
    // Recibimos los datos del Angular
    const { usuarioId, salaId, fecha, bloqueInicio, bloqueFin, motivo, cantidadPersonas } = req.body;

    // Validación básica
    if (!usuarioId || !salaId || !fecha || !bloqueInicio || !bloqueFin) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    // SQL INSERT: Fíjate que en 'estado' ponemos 'PENDIENTE' directamente
    const sql = `
        INSERT INTO reservas 
        (usuario_id, sala_id, fecha, bloque_inicio, bloque_fin, motivo, cantidad_personas, estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')
    `;

    const values = [usuarioId, salaId, fecha, bloqueInicio, bloqueFin, motivo, cantidadPersonas];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar reserva:', err);
            return res.status(500).json({ message: 'Error en base de datos', error: err });
        }
        
        // Respondemos éxito y devolvemos el ID creado
        res.status(201).json({ message: 'Reserva creada con éxito', id: result.insertId });
    });
});