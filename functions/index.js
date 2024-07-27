const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

admin.initializeApp();

exports.getPacientes = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await admin.database().ref('/Pacientes').once('value');
    const pacientes = snapshot.val();
    res.status(200).json(pacientes);
    await logAccess('GET /Pacientes');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

exports.getPaciente = functions.https.onRequest(async (req, res) => {
  const idPaciente = req.query.id_paciente;

  if (!idPaciente) {
    return res.status(400).send('ID de paciente es requerido');
  }

  try {
    const snapshot = await admin.database().ref(`/Pacientes/${idPaciente}`).once('value');
    const paciente = snapshot.val();

    if (paciente && paciente.accesible === false) {
      return res.status(403).send('Acceso denegado');
    }

    if (!paciente) {
      return res.status(404).send('Paciente no encontrado');
    }

    res.status(200).json(paciente);
    await logAccess(`GET /Pacientes/${idPaciente}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

exports.createPaciente = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Metodo no permitido');
  }

  const nuevoPaciente = req.body;

  if (!nuevoPaciente || !nuevoPaciente.nombre || !nuevoPaciente.apellidoPaterno || !nuevoPaciente.apellidoMaterno || !nuevoPaciente.numeroSeguridadSocial || nuevoPaciente.accesible === undefined) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  const idPaciente = uuidv4();

  try {
    await admin.database().ref(`/Pacientes/${idPaciente}`).set(nuevoPaciente);
    res.status(201).send('Paciente creado');
    await logAccess('POST /Pacientes');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

async function logAccess(message) {
  const log = {
    createdAt: Date.now(),
    message: message,
  };
  await admin.database().ref('/logs').push(log);
}
