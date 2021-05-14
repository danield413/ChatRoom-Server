const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async(req, res, next) => {
    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify( token , process.env.SECRET_JWT_KEY );

        //Leer el usuario que corresponde al uid
        const userToken = await User.findById( uid );
        
        if( !userToken ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existen en DB'
            }); 
        }

        //Se coloca en la request
        req.user = userToken;

        next();
        
    } catch (error) {
        // console.log(error);
        res.json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

module.exports= { validateJWT }