module.exports = {
  API: "http://localhost:3000",
  port: 3000,
  database: {
    host: "localhost",
    user: "postgres",
    password: "password",
    database: "brickbuilder",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  }
};