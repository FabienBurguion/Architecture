require("dotenv").config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const PORT = 3000;

app.get("/health", async (req, res) => {
    res.status(200).send("Server is up");
});

// Routes
app.get('/todos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('GET /todos error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/todos', async (req, res) => {
    const text = req.body.text || '';
    try {
        const result = await pool.query(
            'INSERT INTO todos (text, done) VALUES ($1, $2) RETURNING *',
            [text, false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /todos error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (err) {
        console.error('DELETE /todos error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.patch('/todos/:id/done', async (req, res) => {
    const id = parseInt(req.params.id);
    const done = req.body.done === true;
    try {
        const result = await pool.query(
            'UPDATE todos SET done = $1 WHERE id = $2 RETURNING *',
            [done, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (err) {
        console.error('PATCH /todos/:id/done error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ... tout ton code express ...

const initializeDB = async (retries = 5) => {
    while (retries > 0) {
        try {
            console.log(`Tentative de connexion DB (${retries} restantes)...`);
            await pool.query(`
                CREATE TABLE IF NOT EXISTS todos (
                    id SERIAL PRIMARY KEY,
                    text TEXT NOT NULL,
                    done BOOLEAN DEFAULT FALSE
                )
            `);
            console.log("✅ Table 'todos' prête.");
            break; // Sortie de la boucle si succès
        } catch (err) {
            console.error('⚠️ DB pas prête, nouvelle tentative dans 5s...');
            retries -= 1;
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};

// 2. On lance l'initialisation DB en arrière-plan
initializeDB();

const path = require("path");
app.use(express.static(path.join(__dirname, "../todo-app/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../todo-app/dist/index.html"));
});

// 3. CRITIQUE : On démarre le serveur TOUT DE SUITE
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Todo API listening on port ${PORT}`);
});
