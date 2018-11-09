const express = require('express');
const body_parser = require('body-parser');
const multer = require('multer');
const db_handler = require('./db_handler_v2');

const app = express();
const upload = multer();

app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

app.use(upload.array());
app.use(express.static('public'));

// app.delete('/api/employees/:employeeId', (req, res) => {
//     console.log(req.body);
//     res.send("Received");
// })


app.get('/api/employees', (req, res) => db_handler.getAll(req, res));
app.get('/api/employees/:employeeId', (req, res) => db_handler.getOne(req, res));
app.post('/api/employees', (req, res) => db_handler.postOne(req, res));
app.put('/api/employees/:employeeId', (req, res) => db_handler.putOne(req, res));
app.delete('/api/employees/:employeeId', (req, res) => db_handler.deleteOne(req, res));

app.listen(4000, console.log("Server started at port 4000"));