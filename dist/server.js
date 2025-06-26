"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let todos = [];
app.get("/api/todos", (req, res) => {
    console.log("GET /api/todos - Request received to fetch all todos");
    res.status(200).json(todos);
});
app.get("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    console.log(`GET /api/todos/${id} - Request received to fetch todo by ID: ${id}`);
    const todo = todos.find(t => t.id === id);
    if (todo) {
        res.status(200).json(todo);
    }
    else {
        res.status(404).json({ message: `Todo with ID ${id} not found` });
    }
});
app.post("/api/todos", (req, res) => {
    const { title } = req.body;
    console.log(`POST /api/todos - Request received to add new todo with title: ${title}`);
    if (!title || typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ message: 'Title is required and must be a non-empty string' });
        return;
    }
    const newTodo = {
        id: String(todos.length > 0 ? Math.max(...todos.map(t => parseInt(t.id))) + 1 : 1),
        title: title.trim(),
        completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});
app.put("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    console.log(`PUT /api/todos/${id} - Request received to update todo with ID: ${id}. Data:`, { title, completed });
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex > -1) {
        const existingTodo = todos[todoIndex];
        todos[todoIndex] = {
            ...existingTodo,
            title: title !== undefined && typeof title === "string" ? title.trim() : existingTodo.title,
            completed: completed !== undefined && typeof completed === "boolean" ? completed : existingTodo.completed,
        };
        res.status(200).json(todos[todoIndex]);
    }
    else {
        res.status(404).json({ message: `Todo with ID ${id} not found` });
    }
});
app.delete("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    console.log(`DELETE /api/todos/${id} - Request received to delete todo with ID: ${id}`);
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id);
    if (todos.length < initialLength) {
        res.status(204).send();
    }
    else {
        res.status(404).json({ message: `Todo with ID ${id} not found` });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
