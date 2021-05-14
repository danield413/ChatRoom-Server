const User = require("../models/user");
const bcryptjs = require('bcryptjs');

const { generateJWT } = require("../helpers/generateJWT");

const loginController = async(req, res) => {
   
    const { email, password } = req.body;

    try {
        
        //Verificar si el email ya existe (es único)
        const user = await User.findOne({ email });

        if( !email ) {
            return res.status(400).json({
                ok: false,
                msg: 'Datos incorrectos, revisa -E'
            });
        }

        //Verificar la contraseña
        const pass = bcryptjs.compareSync( password, user.password );
        if( !pass ){
            return res.status(400).json({
                ok: false,
                msg: 'Datos incorrectos, revisa - P'
            })
        }

        //Generar el JWT
        const token = await generateJWT( user.id );
    
        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const registerController = async (req = request, res = response) => {

    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt )

    //Guardar en BD
    await user.save();

    res.json({
        ok: true,
        user
    });
}

const renewController = async(req, res) => {

    const { user } = req;

    //Generar nuevo JWT
    const token = await generateJWT( user.id )

    res.json({
        ok: true,
        user,
        token
    })

}

module.exports = {
    loginController,
    registerController,
    renewController
}