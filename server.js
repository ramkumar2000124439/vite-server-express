import express from 'express';
import apiRouter from './api';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const DEVELOPMENT = process.env.NODE_ENV === "development";

app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});
app.use('/api', apiRouter);

// Start server only in production
if (!DEVELOPMENT) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Serve static files from public directory
    app.use(express.static(path.join(__dirname, 'public')));
    app.listen(port, () => {
        console.log(`Express server running at http://localhost:${port}`);
    });
}

export { app };
export default app;