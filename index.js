const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

let phoneList = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/info', (req, res) => {
    const info = `Phonebook has info for ${phoneList.length} people<br>${new Date()}`;
    res.send(info);
});

app.get('/api/persons', (req, res) => {
    res.json(phoneList);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id.trim());
    const person = phoneList.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id.trim());
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    const exists = phoneList.some(person => person.id === id);
    if (!exists) {
        return res.status(404).json({ error: 'Person not found' });
    }
    phoneList = phoneList.filter(person => person.id !== id);
    return res.status(204).end();
});

const generateId = () => {
    const maxId = phoneList.length > 0 ? Math.max(...phoneList.map(p => p.id)) : 0;
    return maxId + 1;
};

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).json({ error: 'Name and number are required' });
    }
    const nameExists = phoneList.some(p => p.name === name);
    if (nameExists) {
        return res.status(400).json({ error: 'Name must be unique' });
    }
    const newPerson = { id: generateId(), name, number };
    phoneList.push(newPerson);
    res.status(201).json(newPerson);
});

app.listen(port, () => {
    console.log(`🚀 Server listening at 🖥️http://localhost:${port}`);
});