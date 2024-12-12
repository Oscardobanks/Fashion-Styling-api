import express, { json } from 'express'
import articleApi from './routes/article.js'
import authorApi from './routes/author.js'
import cors from 'cors'

import './config/connect'

const app = express()
app.use(json())
app.use(cors())

app.use('/article', articleApi)
app.use('/stylist', authorApi)

// app.use('/getimage', express.static('./uploads'))


app.listen(3000, () => {
    console.log('server works');
})