document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('loginForm');
    var usuarioInput = document.getElementById('usuario');
    var contrasenaInput = document.getElementById('contrasena');
    var errorUsuario = document.getElementById('errorUsuario');
    var errorContrasena = document.getElementById('errorContrasena');
    var formSuccess = document.getElementById('formSuccess');

    // Requisitos de la contraseña
    var LONGITUD_MIN = 8;
    var LONGITUD_MAX = 15;
    var REGEX_MAYUSCULA = /[A-Z]/;
    var REGEX_MINUSCULA = /[a-z]/;   
    var REGEX_NUMERO = /[0-9]/;
    var REGEX_ESPECIAL = /[%^&*/$@]/;

    function validarUsuario() {
        var valor = usuarioInput.value.trim();

        if (valor === '') {
            mostrarError(usuarioInput, errorUsuario, 'El usuario no puede estar en blanco.');
            return false;
        }

        limpiarError(usuarioInput, errorUsuario);
        return true;
    }

    function validarContrasena() {
        var valor = contrasenaInput.value;

        if (valor.trim() === '') {
            mostrarError(contrasenaInput, errorContrasena, 'La contraseña no puede estar en blanco.');
            return false;
        }

        if (valor.length < LONGITUD_MIN || valor.length > LONGITUD_MAX) {
            mostrarError(contrasenaInput, errorContrasena, 'Debe tener entre ' + LONGITUD_MIN + ' y ' + LONGITUD_MAX + ' caracteres.');
            return false;
        }

        if (!REGEX_MAYUSCULA.test(valor)) {
            mostrarError(contrasenaInput, errorContrasena, 'Debe incluir al menos una letra mayúscula.');
            return false;
        }

        if (!REGEX_MINUSCULA.test(valor)) {
            mostrarError(contrasenaInput, errorContrasena, 'Debe incluir al menos una letra minúscula.');
            return false;
        }

        if (!REGEX_NUMERO.test(valor)) {
            mostrarError(contrasenaInput, errorContrasena, 'Debe incluir al menos un número.');
            return false;
        }

        if (!REGEX_ESPECIAL.test(valor)) {
            mostrarError(contrasenaInput, errorContrasena, 'Debe incluir al menos un carácter especial (% ^ & * /).');
            return false;
        }

        limpiarError(contrasenaInput, errorContrasena);
        return true;
    }

    function mostrarError(input, spanError, mensaje) {
        input.classList.add('invalid');
        spanError.textContent = mensaje;
    }

    function limpiarError(input, spanError) {
        input.classList.remove('invalid');
        spanError.textContent = '';
    }

    // Validación en tiempo real
    usuarioInput.addEventListener('input', validarUsuario);
    contrasenaInput.addEventListener('input', validarContrasena);

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();

        var usuarioValido = validarUsuario();
        var contrasenaValida = validarContrasena();

        if (usuarioValido && contrasenaValida) {
            formSuccess.textContent = 'Formulario válido. Listo para enviar.';
        } else {
            formSuccess.textContent = '';
        }
    });
});