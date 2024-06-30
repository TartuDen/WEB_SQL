import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 8081;

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Define API routes
app.get("/login", (req, res) => {
    // Login route logic
});

app.get('/api/thread/:id', (req, res) => {
    const threadId = req.params.id;
    // Fetch thread details and send response
    res.json({ threadId, title: `Thread ${threadId}`, content: 'Thread content here' });
});

// Catch-all handler for any request that doesn't match the above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
