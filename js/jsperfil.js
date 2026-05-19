document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ENGRENAGEM DA TELA DE CADASTRO
    // ==========================================
    const formularioCadastro = document.querySelector('form:not(#form-login)'); 
    // Captura o formulário padrão se não for o de login
    
    if (formularioCadastro && document.querySelector('input[placeholder="Seu Nome"]')) {
        formularioCadastro.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const nome = document.querySelector('input[placeholder="Seu Nome"]').value.trim();
            const email = document.querySelector('input[placeholder="E-mail"]').value.trim();
            const telefone = document.querySelector('input[placeholder="Seu Telefone"]').value.trim();
            const senha = document.querySelector('input[placeholder="Senha"]').value;

            const novoUsuario = {
                id: Date.now(),
                nome: nome,
                email: email,
                telefone: telefone,
                senha: senha
            };

            let listaUsuarios = JSON.parse(localStorage.getItem('usuariosFaunaAlerta')) || [];

            const emailExiste = listaUsuarios.some(user => user.email === email);
            if (emailExiste) {
                alert('⚠️ Atenção: Este e-mail já está cadastrado no sistema!');
                return;
            }

            listaUsuarios.push(novoUsuario);
            localStorage.setItem('usuariosFaunaAlerta', JSON.stringify(listaUsuarios));

            alert('🎉 Sucesso! Cadastro realizado em formato JSON.');
            formularioCadastro.reset();
        });
    }

    // ==========================================
    // 2. ENGRENAGEM DA TELA DE LOGIN
    // ==========================================
    const formularioLogin = document.getElementById('form-login');

    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const emailDigitado = formularioLogin.querySelector('input[type="email"]').value.trim();
            const senhaDigitada = formularioLogin.querySelector('input[type="password"]').value;

            const listaUsuarios = JSON.parse(localStorage.getItem('usuariosFaunaAlerta')) || [];

            // Busca na lista de cadastrados se o email e a senha batem
            const usuarioAchado = listaUsuarios.find(user => user.email === emailDigitado && user.senha === senhaDigitada);

            if (usuarioAchado) {
                // Deixa gravado no navegador quem acabou de logar
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAchado));

                alert(`🎉 Seja bem-vindo, ${usuarioAchado.nome}!`);
                
                // Abre a tela de perfil automaticamente
                window.location.href = "perfil.html"; 
            } else {
                alert('⚠️ Erro: E-mail ou senha incorretos.');
            }
        });
    }

    // ==========================================
    // 3. ENGRENAGEM DA TELA DE PERFIL
    // ==========================================
    const elementoNomePerfil = document.getElementById('nome-perfil-usuario');
    
    if (elementoNomePerfil) {
        // Busca os dados de quem fez o login na tela anterior
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

        // Se a pessoa tentou entrar no perfil direto pelo link sem logar
        if (!usuarioLogado) {
            alert('⚠️ Acesso negado! Por favor, efetue o login primeiro.');
            window.location.href = "login.html"; // Expulsa para o login
            return;
        }

        // Se achou o usuário logado, troca o texto fixo pelo nome real
        elementoNomePerfil.textContent = usuarioLogado.nome;
    }
});