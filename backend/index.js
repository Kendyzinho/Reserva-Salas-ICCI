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

// 4. Obtener historial de reservas de un usuario
app.get('/api/reservas/usuario/:userId', (req, res) => {
    const { userId } = req.params;
    
    const sql = `
        SELECT 
            r.id, 
            r.fecha, 
            r.bloque_inicio as bloqueInicio, 
            r.bloque_fin as bloqueFin, 
            r.motivo, 
            r.estado,
            r.cantidad_personas as cantidadPersonas,
            s.nombre as nombreSala
        FROM reservas r
        JOIN salas s ON r.sala_id = s.id
        WHERE r.usuario_id = ?
        ORDER BY r.fecha DESC, r.bloque_inicio ASC
    `;
    
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

app.post('/api/salas', (req, res) => {
    const { nombre, capacidad, ubicacion } = req.body;
    const sql = 'INSERT INTO salas (nombre, capacidad, ubicacion, estado) VALUES (?, ?, ?, "DISPONIBLE")';
    db.query(sql, [nombre, capacidad, ubicacion], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Sala creada', id: result.insertId });
    });
});

// Cambiar Estado (Bloquear/Desbloquear)
app.patch('/api/salas/:id', (req, res) => {
    const { estado } = req.body; // 'DISPONIBLE' o 'MANTENCION'
    const { id } = req.params;
    const sql = 'UPDATE salas SET estado = ? WHERE id = ?';
    db.query(sql, [estado, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Estado actualizado' });
    });
});

// Eliminar Sala
app.delete('/api/salas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM salas WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al eliminar (quizás tiene reservas)' });
        res.json({ message: 'Sala eliminada' });
    });
});

app.get('/api/reservas/admin/todas', (req, res) => {
    const sql = `
        SELECT 
            r.id, 
            r.fecha, 
            r.bloque_inicio as bloqueInicio, 
            r.bloque_fin as bloqueFin, 
            r.motivo, 
            r.estado,
            r.cantidad_personas as cantidadPersonas,
            u.nombre as nombreUsuario,
            u.rol as rolUsuario,
            s.nombre as nombreSala
        FROM reservas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN salas s ON r.sala_id = s.id
        ORDER BY FIELD(r.estado, 'PENDIENTE', 'APROBADA', 'RECHAZADA'), r.fecha DESC
    `;
    
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// 2. Actualizar estado de una reserva (Aprobar/Rechazar)
app.patch('/api/reservas/:id/estado', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // 'APROBADA' o 'RECHAZADA'

    const sql = 'UPDATE reservas SET estado = ? WHERE id = ?';
    
    db.query(sql, [estado, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: `Reserva ${estado} correctamente` });
    });
});