/*Aqui é uma lista dos usuarios, que vão ficar armazenadas no sistema local*/

var usuarioPadrao = [
    {
        nome: "Adm",
        email: "admin@faunaalerta.com",
        senha: "0000",
        perfil: "admin"
    },
    {
        nome: "Denunciante",
        email: "denunciante@faunaalerta.com",
        senha: "0000",
        perfil: "usuario"
    }
];



function iniciarBancoUsuarios() {
    var dados = localStorage.getItem("usuarios");

    if (dados == null) {
        var textoJson = JSON.stringify(usuariosPadrao);
        localStorage.setItem("usuarios", textoJson)
    }

}