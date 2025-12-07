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
    `CREATE TABLE IF NOT EXISTS notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);`,
    `INSERT IGNORE INTO usuarios (nombre, email, password, rol, rut, carrera, telefono)
        VALUES
        ('Carlos López', 'carlos.lopez@alumnos.uta.cl', '123', 'ESTUDIANTE', '19.234.567-8', 'Ingeniería Civil Informática', '987654321'),
        ('María Torres', 'maria.torres@alumnos.uta.cl', '123', 'ESTUDIANTE', '20.345.678-9', 'Ingeniería Comercial', '912345678'),
        ('Javier Rivera', 'javier.rivera@alumnos.uta.cl', '123', 'ESTUDIANTE', '21.456.789-0', 'Ingeniería Eléctrica', '956789123'),
        ('Daniela Araya', 'daniela.araya@alumnos.uta.cl', '123', 'ESTUDIANTE', '18.987.654-3', 'Trabajo Social', '976543210'),
        ('Sofía Martínez', 'sofia.martinez@alumnos.uta.cl', '123', 'ESTUDIANTE', '22.123.456-1', 'Kinesiología', '987321654'),
        ('Felipe Rojas', 'felipe.rojas@alumnos.uta.cl', '123', 'ESTUDIANTE', '17.876.543-2', 'Ingeniería Civil Industrial', '923456781'),
        ('Valentina Soto', 'valentina.soto@alumnos.uta.cl', '123', 'ESTUDIANTE', '23.234.567-4', 'Pedagogía en Matemáticas', '954321987'),
        ('Camilo Pérez', 'camilo.perez@alumnos.uta.cl', '123', 'ESTUDIANTE', '16.765.432-1', 'Derecho', '998877665'),
        ('Fernanda Aguilar', 'fernanda.aguilar@alumnos.uta.cl', '123', 'ESTUDIANTE', '24.345.678-5', 'Enfermería', '933221144'),
        ('Matías Herrera', 'matias.herrera@alumnos.uta.cl', '123', 'ESTUDIANTE', '25.456.789-6', 'Contador Público Auditor', '955667788');`,

    `INSERT IGNORE INTO usuarios (nombre, email, password, rol, rut, carrera, telefono)
        VALUES
        ('Ayudante Salas', 'ayudante1@gestion.uta.cl', '123', 'AYUDANTE', '9.123.456-7', 'Ingeniería Civil Informática', '999111222'),
        ('Ayudante Salas', 'ayudante2@gestion.uta.cl', '123', 'AYUDANTE', '8.987.654-3', 'Ingeniería Civil Industrial', '999333444');`,

    `INSERT IGNORE INTO salas (nombre, capacidad, ubicacion, estado)
        VALUES
        ('Sala Licancabur', 30, 'Campus Saucache', 'DISPONIBLE'),
        ('Sala Socompa', 25, 'Campus Saucache', 'DISPONIBLE'),
        ('Sala Pomerape', 20, 'Campus Saucache', 'DISPONIBLE'),
        ('Sala Guallatire', 35, 'Campus Saucache', 'DISPONIBLE'),
        ('Sala Parinacota', 40, 'Campus Velásquez', 'DISPONIBLE'),
        ('Sala Azufre', 20, 'Campus Velásquez', 'DISPONIBLE')`,

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
