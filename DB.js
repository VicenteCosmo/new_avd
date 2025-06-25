import mysql2 from 'mysql2'

const connection = mysql2.createConnection({
    host: 'bxijugqazbdworecszbc-mysql.services.clever-cloud.com',
    user: 'uqdrqiqffb5gyzua',
    password: '42qWxyh3NXtAt4syT7k2',
    database: 'bxijugqazbdworecszbc',
    port: 3306
})

connection.connect((e) => {
    if(e) console.log('Erros ao conectar ao banco de dados:', e)
    else console.log('Conectado com sucesso ao banco de dado')    
})

export default connection
