const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {

    const events = await Event.find().populate('user', 'name');

    res.json({
        ok: true,
        events
    })
}

const createEvent = async (req, res = response) => {

    const event = new Event(req.body);

    try {

        event.user = req.uid;

        const savedEvent = await event.save();

        res.json({
            ok: true,
            msg: savedEvent
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact your admin'
        })
    }
}

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id;

    try {

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            })
        }
        
        if (event.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'User not authorized for editing this event'
            })
        }

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {new: true});

        res.json({
            ok: true,
            event: updatedEvent
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact your admin'
        })
    }
}

const deleteEvent = async (req, res = response) => {

    const eventId = req.params.id;

    try {

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            })
        }

        if (event.user.toString()!== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'User not authorized for removing this event'
            })
        }

        const deletedEvent = await Event.findByIdAndRemove(eventId);

        res.json({
            ok: true,
            event: deletedEvent
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact your admin'
        })
    }
}


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}