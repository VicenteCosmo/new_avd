import express from 'express'
import credentials from './env.js'
import DB from './DB.js'

// import jsreport from './Report.js'
import generateReport from './Report.js'

const app = express()

//settings
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    next()
    
})

app.post('/trainings/insert_course', (req, res) => {
    const { course_name, course_description, course_init_date, course_finish_date, course_instuctors, 
        course_requirements
    } = req.body

    const query = `INSERT INTO ${credentials.DB}.avd_training (courses, description, init_date, finish_date, instructors, requirements ) VALUES (?, ?, ?, ?, ?, ?)`
    const values = [course_name, course_description, course_init_date, course_finish_date, course_instuctors, course_requirements]
    
    DB.query('SELECT id FROM avd_training WHERE courses = ?', [course_name], (e, result1) => {
                if(e){
                    console.log('Erro ao verificar se o curso existe:', e)

                    return res.status(500).json(
                        { 
                            error: `Erro ao verificar se o curso existe: ${e} `
                        }
                    )
                }

                else if(result1.length > 0){
                    console.log('Curso já existe:', result1[0])
                    return res.status(409).json(
                        {
                            message: `Curso já existe ${result1[0]}`
                        }
                    )
                }

                else{
                    DB.query(query, values, (e, result2) => {
                        if(e){
                            console.error('Erro ao criar curso:', e)
                            return res.status(500).json(
                                {
                                    error: `Erro ao criar curso: ${e}`
                                }
                            )
                        }
                        else{
                            console.log('Erros ao criar curso:', e)
                            return res.status(201).json(
                                {
                                    message: `Curso criado com sucesso: ${result2}`
                                }
                            )
                        }
                    })
                }
            })            
})

app.put('/trainings/update_course/:id', (req, res) => {

    const id = req.params.id

    const { course_name, course_description, course_init_date, course_finish_date, course_instructors, 
        course_requirements
    } = req.body
    const query = `UPDATE ${credentials.DB}.avd_training SET courses=?, description=?, init_date=?, finish_date=?, instructors=?, requirements=? WHERE id=?`
    const values = [course_name, course_description, course_init_date, course_finish_date, course_instructors, course_requirements, id]

    DB.query(query, values, (e, result) => {
        if(e){
                    console.log('Erro ao verificar se o curso existe:', e)

                    return res.status(500).json(
                        { 
                            error: `Erro ao verificar se o curso existe: ${e} `
                        }
                    )
        }
        else{
            console.log('Curso atualizado com sucesso:', result)
            return res.status(201).json(
                                {
                                    message: `Curso atualizado com sucesso: ${result}`
                                }
                            )
        }
            


    })
})

app.get('/trainings/get_courses', (req, res) => {
    const query = `SELECT * FROM ${credentials.DB}.avd_training`

    DB.query(query, (e, result) => {
        if(e){
                    console.log('Erro ao pegar os cursos:', e)

                    return res.status(500).json(
                        { 
                            error: `Erro ao pegar os cursos: ${e} `
                        }
                    )
        }
        else{
            console.log('Cursos:', result)
            return res.status(200).json(
                                {
                                    message: result
                                }
                            )
        }
    })
})

app.delete('/trainings/delete_courses/:id', (req, res) => {
    const id = req.params.id
    const query = `DELETE FROM ${credentials.DB}.avd_training WHERE id = ?`
    const value = [id]

    DB.query(query,value, (e, result) => {
        if(e){
                    console.log('Erro ao deletar o curso:', e)

                    return res.status(500).json(
                        { 
                            error: `Erro ao deletar o curso: ${e} `
                        }
                    )
        }
        else{
            console.log('Curso deletado:', result)
            return res.status(200).json(
                                {
                                    message: `Curso deletado: ${JSON.stringify(result)}`
                                }
                            )
        }
    })
    
})

app.post('/trainings/generate_report', (req, res) => {
    const { title, headers, data } = req.body

    try {
        const report = generateReport(title, headers, data)
        // Configurar cabeçalhos da resposta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/ /g, '_')}.pdf"`);

        // Enviar o PDF como resposta
        // const pdfBuffer = Buffer.from(report.output('arraybuffer'));
        console.log('About to send report')
        res.send(report);
        console.log('report sent')
    } catch (error) {
        console.log('Error generating report:',error)
    }
})

app.listen(4000)