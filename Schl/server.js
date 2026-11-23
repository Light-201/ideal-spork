require("dotenv").config();
const Todo = require("./models/Todo");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
app.use(cors({
    origin: "https://YOUR-USERNAME.github.io"
}));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "timetable.html"));
});

// GET: Load all todos
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST: Create a todo
app.post("/api/todos", async (req, res) => {
    try {
        const todo = await Todo.create({
            subject: req.body.subject,
            content: req.body.content
        });

        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// PUT: Edit a todo
app.put("/api/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                subject: req.body.subject,
                content: req.body.content
            },
            { returnDocument: "after", runValidators: true }
        );

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// DELETE: Remove a todo
app.delete("/api/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});