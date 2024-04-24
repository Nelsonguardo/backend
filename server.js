const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const JSON_FILE_PATH = './data/patients.json';

// Habilitar CORS
app.use(cors());

app.use(bodyParser.json());

// Leer los datos de pacientes del archivo JSON
const readPatientsFromFile = () => {
    try {
        const data = fs.readFileSync(JSON_FILE_PATH);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo JSON de pacientes:', error);
        throw new Error('Error al leer el archivo JSON de pacientes');
    }
};

// Escribir los datos de pacientes en el archivo JSON
const writePatientsToFile = (patients) => {
    try {
        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(patients, null, 2));
    } catch (error) {
        console.error('Error al escribir en el archivo JSON de pacientes:', error);
        throw new Error('Error al escribir en el archivo JSON de pacientes');
    }
};

// Obtener todos los pacientes
app.get('/api/patients', (req, res) => {
    try {
        const patients = readPatientsFromFile();
        res.json(patients);
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener un paciente por su ID
app.get('/api/patients/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const patients = readPatientsFromFile();
        const patient = patients.find(patient => patient.id === id);
        if (!patient) {
            res.status(404).send('Paciente no encontrado');
        } else {
            res.json(patient);
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar un paciente por su ID
app.put('/api/patients/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedPatient = req.body;
        let patients = readPatientsFromFile();
        const index = patients.findIndex(patient => patient.id === id);
        if (index === -1) {
            res.status(404).send('Paciente no encontrado');
        } else {
            patients[index] = { ...patients[index], ...updatedPatient };
            writePatientsToFile(patients);
            res.json(patients[index]);
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
