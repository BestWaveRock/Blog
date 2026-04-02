export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    type: process.env.DB_TYPE || 'sqlite',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'blog_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'mySecretKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});