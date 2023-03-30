/*
    Rutas de Eventos 
    host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

const router = Router();

// Todas las rutas tienen que pasar por la validación del token JWT
router.use( validarJWT );

// Obtener eventos
router.get('/', getEventos);

// Crear nuevo evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de Inicio  es obligatoria').custom( isDate),
        check('end', 'Fecha de finalización  es obligatoria').custom( isDate),
        validarCampos

    ],
    crearEvento);

// Actualizar  evento
router.put(
    '/:id', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de Inicio  es obligatoria').custom( isDate),
        check('end', 'Fecha de finalización  es obligatoria').custom( isDate),
        validarCampos

    ],
    actualizarEvento);

// Borrar  evento
router.delete('/:id', eliminarEvento);


module.exports = router;