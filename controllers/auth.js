const User = require("../models/user");
const bcryptjs = require('bcryptjs');

const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/googleVerify");

const loginController = async(req, res) => {
   
    const { email, password } = req.body;
        
    //Verificar si el email ya existe (es único)
    const user = await User.findOne({ email });

    if( !user ) {
        return res.json({
            ok: false,
            msg: 'Datos incorrectos, revisa'
        });
    }

    //Verificar la contraseña
    const pass = bcryptjs.compareSync( password, user.password );
    if( !pass ){
        return res.json({
            ok: false,
            msg: 'Datos incorrectos, revisa'
        })
    }

    //Generar el JWT
    const token = await generateJWT( user.id );

    res.json({
        ok: true,
        user,
        token
    });

}

const registerController = async (req = request, res = response) => {

    const { name, email, password } = req.body;

    try {

        const emailExists = await User.findOne({ email });
        if(emailExists) {
            return res.json({
                ok: false,
                msg: `El correo ${email} ya se encuentra registrado`
            })
        }
        
        const user = new User({ name, email, password });

        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync( password, salt )

        //Guardar en BD
        await user.save();

        //Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

    
}

const renewController = async(req, res) => {

    const { user } = req;

    try {
        //Generar nuevo JWT
        const token = await generateJWT( user.id )

        res.json({
            ok: true,
            user,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleController = async (req,res) => {
    
    const { id_token } = req.body;

    try {
        
        const { name, email, picture } = await googleVerify(id_token);

        let user = await User.findOne({ email });
        
        if( !user ) {
            //Tengo que crearlo
            const data = {
                name,
                email,
                picture,
                password: 'No tiene, es de Google',
                role: 'USER',
                google: true
            };

            user = new User( data );
            await user.save();
        }

        //Generar el JWT
        const token = await generateJWT( user.id );
    
        res.json({
            uid: user.id,
            name: user.name,
            picture: user.picture,
            email: user.email,
            google: user.google,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    loginController,
    registerController,
    renewController,
    googleController
}