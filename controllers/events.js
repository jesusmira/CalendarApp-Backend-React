const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async(req, resp) => {

    const eventos = await Evento.find()
                                .populate('user','name');

    resp.status(200).json({
        ok: true,
        eventos
    })


}
const crearEvento = async (req, resp) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        resp.json({
            ok: true,
            evento: eventoGuardado
        });
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        })
    }

}
const actualizarEvento = async (req, resp) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoId);

        if( !evento ){
            return resp.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese Id'
            });
        }

        if( evento.user.toString() !== uid ){
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const EventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        resp.json({
            ok: true,
            evento: EventoActualizado
        });


    } catch (error) {
       console.log(error);
       resp.status(500).json({
        ok: false,
        msg: 'Hable con el administrador...'
       }) 
    }


}
const eliminarEvento = async(req, resp) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventoId);

        if( !evento ){
            return resp.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese Id'
            });
        }

        if( evento.user.toString() !== uid ){
            return resp.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }

        
       await Evento.findByIdAndDelete( eventoId );

        resp.json({
            ok: true
        });


    } catch (error) {
       console.log(error);
       resp.status(500).json({
        ok: false,
        msg: 'Hable con el administrador...'
       }) 
    }


}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
} 