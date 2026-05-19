/*
Nesta função é criado uma array de usuarios.
Uma array é uma lista.
Cada usuario é um objeto com nome, email, senha e perfil 
*/

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

/*
Função iniciarBanco Usuarios
Vai verificar se a usuarios salvos no navegador
Se não existir, salva os usuarios padrão
*/ 

function iniciarBancoUsuarios() {
    var dados = localStorage.getItem("usuarios");

    if (dados == null) {
        var textoJson = JSON.stringify(usuariosPadrao);
        localStorage.setItem("usuarios", textoJson)
    }

}

/* 
Função carregarUsuarios
procura ler o texto jSON salvo no localStorage
e transforma novamente numa array.
*/

function carregarUsuarios() {
    iniciarBancoUsuarios();

    var dados = localStorage.getItem("usuarios");
    var listaUsuarios = JSON.parse(dados);

    return listaUsuarios;

}

/*
Função salvarUsuarios
Recebe uma array de usuários e a transforma em JSON e salva no navegador.
*/

function salvarUsuarios(listaUsuarios) {
    var textoJson = JSON.stringify(listaUsuarios)
    localStorage.setItem("usuarios", textoJson)
}

/*
Função mostrarMensagem
Mostra uma mensagem dentro de um elemento da página
*/

function mostrarMensagem(idElemento, texto, classeBootstrap) {
    var elemento = document.getElementById(idElemento);

    if (elemento != null) {
        elemento.className = classeBootstrap;
        elemento.innerHTML = texto;
    }
}

/*

*/

function buscarUsuarioPorEmail(email) {
    var listaUsuarios = carregarUsuarios();

    for (var i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].email == email) {
            return listaUsuarios[i];
        }
    }

    return null;
}



/*
Função realizarLogin
Lê os campos de login e valida o usuario.
*/

function realizarLogin() {
    var email = document.getElementById("email").Value;
    var senha = document.getElementById("senha").Value;

    if (email == "" || senha == "") {
        mostrarMensagem("mensagem", "Preencha e-mail e senha.", "alert alert-waarning");
        return;
    }

    var usuarioEncontrado = buscarUsuarioPorEmail(email);

    if (usuarioEncontrado == null) {
        mostrarMensagem("mensagem", "Usuario não encontrado.", "alert alert-danger" );
        return
    }

    if (usuarioEncontrado.senha != senha) {
        mostrarMensagem("mensagem", "Senha incorreta.", "alert alert-danger");
        return
    }

    var usuarioLogadoJson = JSON.stringify(usuarioEncontrado);
    localStorage.setItem("usuarioLogado", usuarioLogadoJson);

    if (usuarioEncontrado.perfil == "admin") {
        window.location.href = "perfil.html";
    } else {
        window.location.href = "perfil.html";
    }
}

/*
Função cadastrarUsuario
Cadastra um novo usuário comum.
*/
function cadastrarUsuario() {
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;

    if (nome == "" || email == "" || senha == "") {
        mostrarMensagem("mensagem", "Preencha todos os campos.", "alert alert-warning");
        return;
    }

    var usuarioExistente = buscarUsuarioPorEmail(email);

    if (usuarioExistente != null) {
        mostrarMensagem("mensagem", "Já existe usuário com este e-mail.", "alert alert-danger");
        return;
    }

    var listaUsuarios = carregarUsuarios();

    var novoUsuario = {
        nome: nome,
        email: email,
        senha: senha,
        perfil: "usuario"
    };

    listaUsuarios.push(novoUsuario);
    salvarUsuarios(listaUsuarios);

    mostrarMensagem("mensagem", "Cadastro realizado com sucesso. Agora faça login.", "alert alert-success");

    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
}

/*
Função obterUsuarioLogado
Busca o usuário logado no localStorage.
*/
function obterUsuarioLogado() {
    var dados = localStorage.getItem("usuarioLogado");

    if (dados == null) {
        return null;
    }

    var usuario = JSON.parse(dados);
    return usuario;
}

/*
Função protegerPagina
Impede o acesso a páginas internas sem login.
*/
function protegerPagina(perfilNecessario) {
    var usuario = obterUsuarioLogado();

    if (usuario == null) {
        window.location.href = "login.html";
        return;
    }

    if (perfilNecessario == "admin" && usuario.perfil != "admin") {
        window.location.href = "usuario.html";
        return;
    }
}

/*
Função carregarAreaUsuario
Mostra os dados do usuário na página usuario.html.
*/
function carregarAreaUsuario() {
    protegerPagina("usuario");

    var usuario = obterUsuarioLogado();

    document.getElementById("nomeUsuario").innerHTML = usuario.nome;
    document.getElementById("emailUsuario").innerHTML = usuario.email;
    document.getElementById("perfilUsuario").innerHTML = usuario.perfil;
}

function carregarAreaAdmin() {
    protegerPagina("admin");

    var listaUsuarios = carregarUsuarios();
    var corpoTabela = document.getElementById("corpoTabelaUsuarios");

    corpoTabela.innerHTML = "";

    for (var i = 0; i < listaUsuarios.length; i++) {
        corpoTabela.innerHTML += "<tr>" +
            "<td>" + listaUsuarios[i].nome + "</td>" +
            "<td>" + listaUsuarios[i].email + "</td>" +
            "<td>" + listaUsuarios[i].perfil + "</td>" +
            "<td>" +
            "<button class='btn btn-sm btn-warning me-2' onclick='prepararAlteracao(" + i + ")'>Alterar</button>" +
            "</td>" +
            "</tr>";
    }
}