function initDatabase(db) {
  console.log("🛠️ Creando tablas si no existen...");

  const queries = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol ENUM('ESTUDIANTE', 'AYUDANTE') DEFAULT 'ESTUDIANTE',
      rut VARCHAR(20),
      carrera VARCHAR(100),
      telefono VARCHAR(20)
    );`,

    `CREATE TABLE IF NOT EXISTS salas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL,
      capacidad INT,
      ubicacion VARCHAR(100),
      estado ENUM('DISPONIBLE', 'MANTENCION') DEFAULT 'DISPONIBLE'
    );`,

    `CREATE TABLE IF NOT EXISTS reservas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      sala_id INT NOT NULL,
      fecha DATE NOT NULL,
      bloque_inicio TIME NOT NULL,
      bloque_fin TIME NOT NULL,
      motivo TEXT,
      cantidad_personas INT, 
      estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA') DEFAULT 'PENDIENTE',
      fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (sala_id) REFERENCES salas(id)
    );`,

    `INSERT IGNORE INTO usuarios (id, nombre, email, password, rol)
     VALUES
     (1, 'Estudiante Demo', 'estudiante@uta.cl', '123', 'ESTUDIANTE'),
     (2, 'Ayudante Admin', 'admin@uta.cl', 'admin', 'AYUDANTE');`,

    `INSERT IGNORE INTO salas (id, nombre, capacidad)
     VALUES
     (1, 'Sala Azufre', 20),
     (2, 'Sala Socompa', 15),
     (3, 'Sala Parinacota', 25);`,

    `CREATE TABLE IF NOT EXISTS PasswordResetRequest (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        nueva_contrasena VARCHAR(255) NOT NULL,
        estado ENUM('pending','approved','rejected') DEFAULT 'pending',
        revisado_por INT NULL,
        solicitado_el DATETIME DEFAULT CURRENT_TIMESTAMP,
        revisado_el DATETIME NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    );`,
  ];

  queries.forEach((sql) => {
    db.query(sql, (err) => {
      if (err) console.error("❌ Error ejecutando query:", err);
    });
  });

  console.log("✅ Tablas creadas e inserts iniciales listos");
}

module.exports = initDatabase;
