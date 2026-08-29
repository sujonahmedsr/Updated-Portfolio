import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandling';
import router from './app/routes/routes';
const app = express();


// Middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://shofiqdev81.vercel.app',
  'https://shofiqdevdashboard.vercel.app',
  'https://shofiqul81.vercel.app',
  process.env.DASHBOARD_URL,
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({ origin: allowedOrigins.length > 0 ? allowedOrigins : true, credentials: true }));
app.use(cookieParser());
app.use(express.json());



// api end points 
app.use('/api', router)



app.get('/', (req: Request, res: Response) => {
  res.send({
    status: true,
    message: 'Server Live ⚡',
  })
})

// global error handler 
app.use(globalErrorHandler)

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    message: 'Route not found'
  })
})

export default app
