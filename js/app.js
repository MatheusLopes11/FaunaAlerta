        //Verificar se já existe uma sessão

        verificarLogin()


        function fazerLogin() {
            //Pegar os valores digitados no form
            let usuario = document.getElementById("usuario").value;
            let senha = document.getElementById("senha").value;

            //Validar usuario
            if (usuario === "admin" && senha === "123") {
                //criar a sessão
                sessionStorage.setItem("usuarioLogado", usuario);

                //Abrir pagina de sistema
                window.location.href = "perfil.html"
            }else{
                alert("Usuário ou senha inválidos!");
            }
        }

        function verificarLogin(){
            //Procurar sessão salva
            let usuario = sessionStorage.getItem("usuarioLogado");

            //Se existir uma sessão, já vai direto para pagina
            if (usuario !== null){
                window.location.href = "perfil.html"
            }
        }