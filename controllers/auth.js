const { response } = require('express');
const Usuario = require('../models/Usuario');
const bycrypt = require('bcryptjs');
const { generarJWT }  = require('../helpers/jwt');


const crearUsuario = async(req, resp = response )=>{

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({email});

        if( usuario ) {
            return resp.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bycrypt.genSaltSync();
        usuario.password = bycrypt.hashSync(password, salt);


        await usuario.save();
        
        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

    
        resp.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
    
        });
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg:'Por favor hable con el administrador'
        })
    }


}

const loginUsuario = async(req, resp = response)=>{

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({email});

        if( !usuario ) {
            return resp.status(400).json({
                ok: false,
                msg: 'El usuario No existe en la BD'
            });
        }

        //Confirmar los passwords
        const validPassword = bycrypt.compareSync( password, usuario.password );
        if( !validPassword ){
            return resp.status(400).json({
                ok: false,
                msg: 'Password Incorrecto'
            });
        }

        // Generar nuestro JWT
        const token = await generarJWT( usuario.id, usuario.name );

        resp.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token

        });

        
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg:'Por favor hable con el administrador'
        })
    }


}

const revalidarToken = async (req, resp = response)=>{

    const { uid, name } = req;
   
    // generar un nuevo JWT y retornarlo en esta petición.
    const token = await generarJWT( uid, name);

    resp.json({
        ok: true,
        token
    });

}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}