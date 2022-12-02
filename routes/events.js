// host + /api/events

const { Router } = require('express');
const router = Router();

const { validateJWT } = require('../middlewares/jwt-validator');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { isDate } = require('../helpers/isDate');

const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventsController');

//All the routes have to go thorugh thhis middleware
router.use(validateJWT);

router.get('/', getEvents);

router.post(
    '/',
    [
        check('title', 'The title is required').not().isEmpty(),
        check('start', 'Start date is required').custom(isDate),
        check('end', 'End date is required').custom(isDate),
        fieldValidator
    ],
    createEvent
);

router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalización es obligatoria').custom(isDate),
        fieldValidator
    ],
    updateEvent
);

router.delete(
    '/:id',
    deleteEvent
);

module.exports = router;