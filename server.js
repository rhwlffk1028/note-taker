// Imports
const express = require('express');
const path = require('path');
const fs = require('fs');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for Opening Page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for Note Page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// API Route for retrieving the saved notes
app.get('/api/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

// API Route for storing saved notes
app.post('/api/notes', (req,res) => {
    const newUserNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuid(),
    }
    readAndAppend(newUserNote, './db/db.json');
    res.send('Your note has been saved.');
});

// API Route for deleting existing notes
app.delete('/api/notes/:id', (req,res) => {
    const noteID = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedData = JSON.parse(data);
          const newData = parsedData.filter((note) => note.id !== noteID);
          writeToFile('./db/db.json', newData);
        }
    });
    res.send('Your note has been deleted.');
})

// Listen to the Port
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));