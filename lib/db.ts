import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL;
    
    if (dbUrl) {
      // Parse the URL manually for better control
      const url = new URL(dbUrl);
      const config: any = {
        host: url.hostname,
        user: url.username || "root",
        password: url.password || '',
        database: url.pathname.slice(1), // Remove leading /
        port: parseInt(url.port) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      };
      
      pool = mysql.createPool(config);
    } else {
      throw new Error('DATABASE_URL is not defined');
    }
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(text, params);
    return { rows };
  } finally {
    connection.release();
  }
}
