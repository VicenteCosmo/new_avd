const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'bxijugqazbdworecszbc-mysql.services.clever-cloud.com',
    user: 'uqdrqiqffb5gyzua',
    password: '42qWxyh3NXtAt4syT7k2',
    database: 'bxijugqazbdworecszbc',
    port: 3306
})

db.connect((e) => {
    if(e) console.error('Error connecting to the database:', e)
    else console.log('Connected to the database!')
})

module.exports = db