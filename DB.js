import mysql2 from 'mysql2/promise'; // Note o /promise aqui

// Crie um pool de conexões
const pool = mysql2.createPool({
    host: 'bxijugqazbdworecszbc-mysql.services.clever-cloud.com',
    user: 'uqdrqiqffb5gyzua',
    password: '42qWxyh3NXtAt4syT7k2',
    database: 'bxijugqazbdworecszbc',
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexões no pool
    queueLimit: 0
});

// Testar a conexão do pool
pool.getConnection()
    .then(conn => {
        console.log('Conectado ao banco de dados com sucesso');
        conn.release(); // Libera a conexão de volta para o pool
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

export default pool;
