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