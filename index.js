const express = require('express')
const db = require('./DB')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    next()
})

app.post('/enroll_trainee', (req, res) => {
    const {nome, curso } = req.body
    const query = 'INSERT INTO bxijugqazbdworecszbc.inscrever_formando (nome, curso) VALUES (?, ?)'

    
    const query2 = 'SELECT * FROM bxijugqazbdworecszbc.inscrever_formando'

    db.query(query2, (e, result) => {
        if(e){
            console.error('Error getting trainees:', e)
            res.status(500).json({message: `Error inserting trainee: ${e}`})
        }
        else{
            console.log('Trainee got sucessfully:', JSON.stringify(result))

            if(result.length > 0){
                const traineeExists = result.some(trainee => trainee.nome === nome.trim() && trainee.curso === curso.trim())
                
                if(traineeExists){
                    console.log(`Funconário ${nome} já está incrito no curso ${curso}`)
                    res.status(400).json({message: `Funconário ${nome} já está incrito no curso ${curso}`})
                }
                else{
                    db.query(query, [nome, curso], (e, result1) => {
                        if(e){
                            console.error('Error inserting trainee:', e)
                            res.status(500).json({message: `Error inserting trainee: ${e}`})
                        }
                        else{
                            console.log('Trainee inserted sucessfully:', result1)
                            res.status(200).json({message: `Trainee inserted successfully`})
                        }
                    })
                }

            }
            else{
                db.query(query, [nome, curso], (e, result1) => {
                        if(e){
                            console.error('Error inserting trainee:', e)
                            res.status(500).json({message: `Error inserting trainee: ${e}`})
                        }
                        else{
                            console.log('Trainee inserted sucessfully:', result1)
                            res.status(200).json({message: `Trainee inserted successfully`})
                        }
                    })
            }

        }
    })

})

app.put('/update_trainee/:id', (req, res) => {
    const id = req.params.id
    const {nome, curso} = req.body
    const query = 'UPDATE bxijugqazbdworecszbc.inscrever_formando SET nome = ?, curso = ? WHERE id = ?'

    db.query(query, [nome, curso, id], (e, result) => {
        if(e){
            console.error('Error updating trainees:', e)
            res.status(500).json({message: `Error updating trainee: ${e}`})
        }
        else{
            console.log('Trainee updated sucessfully:', result)
            res.status(200).json({message: result})
        }
    })
})

app.delete('/delete_trainee/:id', (req, res) => {
    const id = req.params.id
    const query = 'DELETE FROM bxijugqazbdworecszbc.inscrever_formando WHERE id = ?'

    db.query(query, [id], (e, result) => {
        if(e){
            console.error('Error deleting trainees:', e)
            res.status(500).json({message: `Error deleting trainee: ${e}`})
        }
        else{
            console.log('Trainee deleted sucessfully:', result)
            res.status(200).json({message: result})
        }
    })
})

app.get('/trainees/:name', (req, res) => {
    const nome = req.params.name
    const query = 'SELECT * FROM bxijugqazbdworecszbc.inscrever_formando WHERE nome = ?'

    db.query(query, [nome],(e, result) => {
        if(e){
            console.error('Error getting trainees:', e)
            res.status(500).json({message: `Error inserting trainee: ${e}`})
        }
        else{
            console.log('Trainee got sucessfully:', result)
            res.status(200).json({message: result})
        }
    })
})

app.listen(4001, (e) => {
    if(e) console.error('Error starting server:', e)
    else console.log('Server ruuning on port 4001')
})