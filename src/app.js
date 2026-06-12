import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {authRouter} from './routes/auth.route.js'
import {settingsRouter} from './routes/settings.route.js'
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/settings', settingsRouter);


app.get('/', (req, res) => {
  res.send('Hello World!')
})


export {app}