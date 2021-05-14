const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateJWT = ( uid, name, email ) => {
    
    return new Promise( (resolve, reject) => {

        const payload = { uid, name, email };

        jwt.sign( payload, process.env.SECRET_JWT_KEY, {
            expiresIn: '48h'
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve( token );
            }
        })

    })

}

const checkJWT = async( token = '' ) => {

    try {

        if(token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRET_JWT_KEY );
        const user = await User.findById( uid );

        if( user ){
          return user;
        } else {
            return null;
        }

    } catch (error) {
        console.log(error);
        return null;
    }

}

module.exports = {
    generateJWT,
    checkJWT
}