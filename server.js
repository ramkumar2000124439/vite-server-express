import express from 'express';
import cors from 'cors';
import apiRouter from './api';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Enable CORS for all origins in development
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});
app.use('/api', apiRouter);

if (isProduction) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.use(express.static(path.join(__dirname, 'public')));
    app.listen(port, () => {
        console.log(`Express server running at http://localhost:${port}`);
    });
}

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal Server Error' 
    });
});

export { app };
export default app;
