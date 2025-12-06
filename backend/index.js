const express = require("express");
const mysql = require("mysql2"); // 1. Importación básica de mysql2 (Callback)
const cors = require("cors");
const initDatabase = require("./setup/initDB");
const sendEmail = require("./utils/email"); // NOTA: Si sendEmail usa Promises/await, podría fallar o bloquear.

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuración de conexión a XAMPP
// Creamos una conexión de CALLBACK. Ya NO usamos .promise().
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "reservas_db",
  multipleStatements: true,
});

// Pasamos DB a initDatabase
// IMPORTANTE: La función initDatabase DEBE ser reescrita para usar Callbacks o funcionará mal.
initDatabase(db);

// 2. Probar conexión
// En el cliente Callback, db.connect() SÍ acepta un callback.
db.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
  } else {
    console.log("✅ Conectado a la Base de Datos MySQL (XAMPP)");
  }
});

// --- RUTAS (ENDPOINTS) ---

// Login (Buscar usuario)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (result.length > 0) {
      res.json(result[0]); // Devuelve el usuario encontrado
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
    }
  });
});

// Obtener Salas (Para el Calendario)
app.get("/api/salas", (req, res) => {
  const sql = "SELECT * FROM salas";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// 2. Obtener reservas (Filtradas por Sala)
app.get("/api/reservas", (req, res) => {
  const { salaId } = req.query;

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
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// 3. CREAR NUEVA RESERVA
app.post("/api/reservas", (req, res) => {
  const {
    usuarioId,
    salaId,
    fecha,
    bloqueInicio,
    bloqueFin,
    motivo,
    cantidadPersonas,
  } = req.body;

  if (!usuarioId || !salaId || !fecha || !bloqueInicio || !bloqueFin) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  const sql = `
        INSERT INTO reservas 
        (usuario_id, sala_id, fecha, bloque_inicio, bloque_fin, motivo, cantidad_personas, estado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')
    `;

  const values = [
    usuarioId,
    salaId,
    fecha,
    bloqueInicio,
    bloqueFin,
    motivo,
    cantidadPersonas,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error al insertar reserva:", err);
      return res
        .status(500)
        .json({ message: "Error en base de datos", error: err });
    }

    res
      .status(201)
      .json({ message: "Reserva creada con éxito", id: result.insertId });
  });
});

// 4. Obtener historial de reservas de un usuario
app.get("/api/reservas/usuario/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
        SELECT 
         r.id, 
         r.fecha, 
         r.bloque_inicio as bloqueInicio, 
         r.bloque_fin as bloqueFin, 
         r.motivo, 
         r.estado,
         //r.cantidad_personas as cantidadPersonas,
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

// Crear Sala
app.post("/api/salas", (req, res) => {
  const { nombre, capacidad, ubicacion } = req.body;
  const sql =
    'INSERT INTO salas (nombre, capacidad, ubicacion, estado) VALUES (?, ?, ?, "DISPONIBLE")';
  db.query(sql, [nombre, capacidad, ubicacion], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json({ message: "Sala creada", id: result.insertId });
  });
});

// Cambiar Estado (Bloquear/Desbloquear)
app.patch("/api/salas/:id", (req, res) => {
  const { estado } = req.body;
  const { id } = req.params;
  const sql = "UPDATE salas SET estado = ? WHERE id = ?";
  db.query(sql, [estado, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json({ message: "Estado actualizado" });
  });
});

// Eliminar Sala
app.delete("/api/salas/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM salas WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error al eliminar (quizás tiene reservas)" });
    }
    res.json({ message: "Sala eliminada" });
  });
});

// Obtener todas las reservas para Admin
app.get("/api/reservas/admin/todas", (req, res) => {
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
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// 2. Actualizar estado de una reserva (Aprobar/Rechazar)
app.patch("/api/reservas/:id/estado", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const sql = "UPDATE reservas SET estado = ? WHERE id = ?";

  db.query(sql, [estado, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json({ message: `Reserva ${estado} correctamente` });
  });
});

// Solicitud de cambio de contraseña
app.post("/api/password-reset-request", (req, res) => {
  const { correo, nueva_contrasena } = req.body;

  // Consulta 1: Buscar usuario
  db.query(
    "SELECT id FROM usuarios WHERE email = ?",
    [correo],
    (err, usuarios) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al buscar usuario" });
      }

      if (usuarios.length === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });

      const id_usuario = usuarios[0].id;

      // Consulta 2: Insertar solicitud
      db.query(
        "INSERT INTO PasswordResetRequest (id_usuario, nueva_contrasena) VALUES (?, ?)",
        [id_usuario, nueva_contrasena],
        (err2, result) => {
          if (err2) {
            console.error(err2);
            return res
              .status(500)
              .json({ error: "Error al crear la solicitud" });
          }
          res.json({ success: true, message: "Solicitud enviada al ayudante" });
        }
      );
    }
  );
});

// Aprobar solicitud
app.patch("/api/ayudante/password-requests/:id/approve", (req, res) => {
  const requestId = req.params.id;
  const idAyudante = req.body.id_ayudante;

  // Consulta 1: Obtener detalles de la solicitud
  db.query(
    `SELECT pr.*, u.email FROM PasswordResetRequest pr JOIN usuarios u ON pr.id_usuario = u.id WHERE pr.id = ?`,
    [requestId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener solicitud" });
      }
      if (rows.length === 0)
        return res.status(404).json({ error: "Solicitud no encontrada" });

      const solicitud = rows[0];

      // Consulta 2: Actualizar contraseña del usuario
      db.query(
        "UPDATE usuarios SET password = ? WHERE id = ?",
        [solicitud.nueva_contrasena, solicitud.id_usuario],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res
              .status(500)
              .json({ error: "Error al actualizar contraseña" });
          }

          // Consulta 3: Marcar solicitud como aprobada
          db.query(
            "UPDATE PasswordResetRequest SET estado = 'approved', revisado_por = ?, revisado_el = NOW() WHERE id = ?",
            [idAyudante, requestId],
            (err3) => {
              if (err3) {
                console.error(err3);
                return res
                  .status(500)
                  .json({ error: "Error al marcar solicitud" });
              }
              sendEmail(
                solicitud.email,
                "Cambio de contraseña aprobado",
                "Tu contraseña ha sido actualizada exitosamente por un ayudante."
              );
              res.json({
                success: true,
                message: "Solicitud aprobada y correo enviado",
              });
            }
          );
        }
      );
    }
  );
});

// Rechazar solicitud
app.patch("/api/ayudante/password-requests/:id/reject", (req, res) => {
  const requestId = req.params.id;
  const idAyudante = req.body.id_ayudante;

  // Consulta 1: Obtener detalles de la solicitud
  db.query(
    `SELECT pr.*, u.email FROM PasswordResetRequest pr JOIN usuarios u ON pr.id_usuario = u.id WHERE pr.id = ?`,
    [requestId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener solicitud" });
      }
      if (rows.length === 0)
        return res.status(404).json({ error: "Solicitud no encontrada" });

      const solicitud = rows[0];

      // Consulta 2: Marcar solicitud como rechazada
      db.query(
        "UPDATE PasswordResetRequest SET estado = 'rejected', revisado_por = ?, revisado_el = NOW() WHERE id = ?",
        [idAyudante, requestId],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: "Error al marcar solicitud" });
          }

          sendEmail(
            solicitud.email,
            "Cambio de contraseña rechazado",
            "Tu solicitud de cambio de contraseña ha sido rechazada por un ayudante."
          );

          res.json({
            success: true,
            message: "Solicitud rechazada y correo enviado",
          });
        }
      );
    }
  );
});

// Obtener todas las solicitudes pendientes
// Obtener todas las solicitudes pendientes
app.get("/api/ayudante/password-requests", (req, res) => {
  // La consulta no debe tener el salto de línea al inicio (antes de SELECT)
  const sqlQueryClean = `SELECT 
        pr.id, 
        u.nombre, 
        NULL AS apellido, 
        u.email as correo, 
        u.rut, 
        pr.nueva_contrasena
    FROM PasswordResetRequest pr
    JOIN usuarios u ON pr.id_usuario = u.id
    WHERE pr.estado IS NULL OR pr.estado = 'pending'
    ORDER BY pr.id DESC`.trim(); // Aplicar .trim() es crucial

  db.query(sqlQueryClean, (err, rows) => {
    if (err) {
      console.error("Error en la consulta de solicitudes:", err);
      return res.status(500).json({ error: "Error al obtener solicitudes" });
    }
    res.json(rows);
  });
});

// Endpoint para verificar existencia de Correo
app.get("/api/check-email", (req, res) => {
  const { correo } = req.query;

  const sql = "SELECT 1 FROM usuarios WHERE email = ?";

  db.query(sql, [correo], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Error en la verificación de correo" });
    }

    const exists = result.length > 0;

    res.json({ exists: exists });
  });
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
