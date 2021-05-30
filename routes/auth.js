const { Router } = require("express");
const { check } = require("express-validator");
const { loginController, registerController, renewController, registeredUsersController, googleController } = require("../controllers/auth");

const { validarCampos } = require("../middlewares/validar-campos");
const { validateJWT } = require("../middlewares/validate-JWT");

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], loginController);

router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], registerController);

router.get('/renew', validateJWT, renewController);

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleController);

module.exports = router;