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

// DELETE /api/reservas/:id
app.delete("/api/reservas/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM reservas WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar reserva:", err);
      return res
        .status(500)
        .json({ message: "Error en base de datos", error: err });
    }

    res.json({ message: "Reserva eliminada correctamente" });
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

// PATCH /api/reservas/:id
app.patch("/api/reservas/:id", (req, res) => {
  const idNum = Number(req.params.id); // Convertir a número

  const { fecha, motivo, cantidadPersonas } = req.body;

  if (!fecha || !motivo || cantidadPersonas == null) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  db.query(
    "UPDATE reservas SET fecha = ?, motivo = ?, cantidad_personas = ? WHERE id = ?",
    [fecha, motivo, Number(cantidadPersonas), idNum],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Reserva actualizada correctamente" });
    }
  );
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
// 2. Actualizar estado de una reserva (Aprobar/Rechazar)
app.patch("/api/reservas/:id/estado", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  // 1. Obtener datos de la reserva junto con el nombre de la sala
  const sqlSelect = `
    SELECT r.usuario_id, r.bloque_inicio, r.bloque_fin, s.nombre AS nombreSala
    FROM reservas r
    JOIN salas s ON r.sala_id = s.id
    WHERE r.id = ?
  `;

  db.query(sqlSelect, [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0)
      return res.status(404).json({ message: "Reserva no encontrada" });

    const reserva = rows[0];

    // 2. Actualizar estado de la reserva
    const sqlUpdate = "UPDATE reservas SET estado = ? WHERE id = ?";
    db.query(sqlUpdate, [estado, id], (err2) => {
      if (err2) return res.status(500).json(err2);

      // 3. Crear notificación para el estudiante correspondiente
      const mensaje = `Tu reserva en la sala "${reserva.nombreSala}" (Bloque ${reserva.bloque_inicio}-${reserva.bloque_fin}) ha sido ${estado}.`;

      const sqlNotificacion =
        "INSERT INTO notificaciones (usuario_id, mensaje) VALUES (?, ?)";
      db.query(sqlNotificacion, [reserva.usuario_id, mensaje], (err3) => {
        if (err3) {
          console.error("Error al crear notificación:", err3);
          return res.status(500).json({
            message: "Error al crear notificación",
            error: err3,
          });
        }

        // 4. Responder al frontend confirmando actualización y notificación
        res.json({
          message: `Reserva ${estado} y notificación creada correctamente`,
        });
      });
    });
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
      const nuevaContrasena = solicitud.nueva_contrasena; // Obtener la nueva contraseña

      // Consulta 2: Actualizar contraseña del usuario
      db.query(
        "UPDATE usuarios SET password = ? WHERE id = ?",
        [nuevaContrasena, solicitud.id_usuario],
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

              // ✨ MENSAJE PERSONALIZADO DE APROBACIÓN
              const subjectAprobado =
                "✅ Solicitud de Cambio de Contraseña Aprobada";
              const bodyAprobado =
                `Estimado usuario,\n\n` +
                `Le informamos que su solicitud de cambio de contraseña ha sido **aprobada** por un ayudante.\n\n` +
                `Su nueva contraseña es: **${nuevaContrasena}**\n\n` +
                `Le recomendamos que inicie sesión inmediatamente con esta clave temporal.\n\n` +
                `Saludos cordiales,\n` +
                `Equipo de Soporte.`;

              sendEmail(solicitud.email, subjectAprobado, bodyAprobado);

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

          // ✨ MENSAJE PERSONALIZADO DE RECHAZO
          const subjectRechazado =
            "❌ Solicitud de Cambio de Contraseña Rechazada";
          const bodyRechazado =
            `Estimado usuario,\n\n` +
            `Su solicitud de cambio de contraseña ha sido **rechazada**.\n\n` +
            `La solicitud fue rechazada debido a que no se pudo verificar la información de identidad proporcionada. Por favor, asegúrese de que todos los datos ingresados (Nombre Completo, RUT, Correo, Contraseña actual) coincidan exactamente con nuestros registros e intente nuevamente.\n\n` +
            `Si necesita asistencia adicional, por favor contacte a soporte técnico.\n\n` +
            `Saludos cordiales,\n` +
            `Equipo de Soporte.`;

          sendEmail(solicitud.email, subjectRechazado, bodyRechazado);

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

// backend: server.js o usuarios.js
app.patch("/api/usuarios/:id", (req, res) => {
  const { id } = req.params; // id viene como string
  const { nombre, carrera, telefono, rut } = req.body;

  const sql =
    "UPDATE usuarios SET nombre = ?, carrera = ?, telefono = ?, rut = ? WHERE id = ?";
  const values = [nombre, carrera, telefono, rut, Number(id)];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error al actualizar usuario", error: err });
    }
    res.json({ message: "Usuario actualizado correctamente" });
  });
});

// GET /api/notificaciones/usuario/:id
app.get("/api/notificaciones/usuario/:id", (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY fecha DESC";
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// PATCH /api/notificaciones/:id/leer
app.patch("/api/notificaciones/:id/leer", (req, res) => {
  const { id } = req.params;

  db.query("UPDATE notificaciones SET leido = 1 WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Notificación marcada como leída" });
  });
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
