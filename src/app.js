import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import {authRouter} from './routes/auth.route.js'
import {settingsRouter} from './routes/settings.route.js'
import {dashboardRouter} from './routes/dashboard.route.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
// app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/settings', settingsRouter);
app.use('/api/v1/dashboard', dashboardRouter);

app.get('/', (req,res) => {
  res.status(200).json({
    success: true,
    message: "ALl ok"
  })
})
app.get('/health', (req,res) => {
  res.status(200).json({
    success: true,
    message: "Health is OK"
  })
})
app.use((req,res) => {
  res.status(404).json({
    success: false,
    message: "Resource Not found"
  })
})

export {app}