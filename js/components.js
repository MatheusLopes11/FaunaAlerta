// Função assíncrona responsável por carregar um componente HTML
// e inseri-lo dentro de um elemento da página.
//
// Parâmetros:
// id   -> id da div onde o componente será inserido
// file -> caminho do arquivo HTML do componente
async function loadComponent(id, file) {

    // Procura no HTML um elemento com o id informado
    // Exemplo:
    // <div id="header"></div>
    const element = document.getElementById(id);

    // Verifica se o elemento realmente existe na página
    // Isso evita erros caso o id não seja encontrado
    if (element) {

        // Faz uma requisição para buscar o arquivo HTML
        // Exemplo:
        // fetch("components/header.html")
        const response = await fetch(file);

        // Converte a resposta recebida em texto
        // pois o conteúdo do arquivo HTML vem como texto
        const html = await response.text();

        // Insere o conteúdo HTML dentro da div encontrada
        // Exemplo:
        // <div id="header">CONTEÚDO DO HEADER</div>
        element.innerHTML = html;
    }
}

// Carrega o header dentro da div com id="header"
loadComponent("header", "/components/header.html");

// Carrega o footer dentro da div com id="footer"
loadComponent("footer", "/components/footer.html");

/* 
//==================================================================================================================================
// Codigo para gravação do login
// Aguarda o HTML carregar completamente na tela antes de rodar o código
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Encontra o formulário de cadastro dentro do HTML
    const formulario = document.querySelector('form');

    // Se o formulário não existir nesta página, o código para aqui (evita erros)
    if (!formulario) return; 

    // 2. Fica "vigiando" o formulário. Quando clicar no botão CADASTRAR, roda a função abaixo
    formulario.addEventListener('submit', function(event) {
        
        // Impede a página de recarregar (se recarregar, nós perdemos os dados digitados)
        event.preventDefault(); 

        // 3. Captura os valores que o usuário digitou dentro de cada caixinha (input)
        const nome = document.querySelector('input[placeholder="Seu Nome"]').value.trim();
        const email = document.querySelector('input[placeholder="E-mail"]').value.trim();
        const telefone = document.querySelector('input[placeholder="Seu Telefone"]').value.trim();
        const senha = document.querySelector('input[placeholder="Senha"]').value;

        // 4. Cria uma "ficha" (objeto) para o novo usuário
        const novoUsuario = {
            id: Date.now(), // Cria um número único para identificar esse usuário
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senha
        };

        // 5. Vai até o "banco" do navegador e pega a lista de usuários que já existem lá.
        // Se o banco estiver vazio (primeira vez usando), ele cria uma lista vazia []
        let listaUsuarios = JSON.parse(localStorage.getItem('usuariosFaunaAlerta')) || [];

        // 6. TESTE DE SEGURANÇA: Verifica se o e-mail digitado já foi cadastrado antes
        const emailExiste = listaUsuarios.some(user => user.email === email);
        if (emailExiste) {
            alert('⚠️ Atenção: Este e-mail já está cadastrado no sistema!');
            return; // Para o código aqui e não deixa cadastrar duplicado
        }

        // 7. Adiciona a nova "ficha" do usuário no final da lista
        listaUsuarios.push(novoUsuario);

        // 8. TRANSFORMA EM JSON E SALVA: Pega a lista atualizada, transforma em texto JSON
        // e guarda no LocalStorage do navegador
        localStorage.setItem('usuariosFaunaAlerta', JSON.stringify(listaUsuarios));

        // 9. Limpa os campos do formulário para o próximo cadastro e avisa que deu certo
        alert('🎉 Sucesso! Cadastro salvo localmente em formato JSON.');
        formulario.reset();

        // Mostra a lista atualizada no painel de controle (F12) do navegador para você ver
        console.log("Banco de Dados JSON atualizado com sucesso:", listaUsuarios);
    });
});
*/

//==================================================================================================================================