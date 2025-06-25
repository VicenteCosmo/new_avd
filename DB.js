const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cosmo',
    database: 'avd'
})

db.connect((e) => {
    if(e) console.error('Error connecting to the database:', e)
    else console.log('Connected to the database!')
})

module.exports = db