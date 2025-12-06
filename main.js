// Seletores dos elementos do DOM
const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('post-title');
const contentInput = document.getElementById('post-content');
const submitBtn = document.getElementById('submit-btn');
const clearBtn = document.getElementById('clear-btn');
const titleCounter = document.getElementById('title-counter');
const contentCounter = document.getElementById('content-counter');

// Seletores para renderização
const tituloRenderizar = document.getElementById('renderizador-titulo');
const conteudoRenderizar = document.getElementById('renderizador-conteudo');
const postDisplay = document.getElementById('post-display');
const placeholder = document.getElementById('placeholder');
const loadingSpinner = document.getElementById('loading-spinner');
const postTime = document.getElementById('post-time');
const postId = document.getElementById('post-id');
const postStatus = document.getElementById('post-status');
const apiResponse = document.getElementById('api-response');

// Contadores de caracteres
titleInput.addEventListener('input', () => {
    const length = titleInput.value.length;
    titleCounter.textContent = `${length}/100`;
    titleCounter.style.color = length > 90 ? '#e74c3c' : '#666';
});

contentInput.addEventListener('input', () => {
    const length = contentInput.value.length;
    contentCounter.textContent = `${length}/500`;
    contentCounter.style.color = length > 450 ? '#e74c3c' : '#666';
});

// Botão limpar
clearBtn.addEventListener('click', () => {
    titleInput.value = '';
    contentInput.value = '';
    titleCounter.textContent = '0/100';
    contentCounter.textContent = '0/500';
    titleInput.focus();
});

// Formatação da data atual
function formatDate() {
    const now = new Date();
    const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    return now.toLocaleDateString('pt-BR', options);
}

// Formatação da resposta da API para exibição
function formatApiResponse(data) {
    return JSON.stringify(data, null, 2);
}

// Evento de submit do formulário
postForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    
    // Validação básica
    if (!titleInput.value.trim() || !contentInput.value.trim()) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    // Mostra o loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    loadingSpinner.style.display = 'block';
    
    // Monta o objeto de dados conforme especificado
    const data = {
        title: titleInput.value,
        body: contentInput.value,
        userId: 1
    };
    
    try {
        // Configuração do fetch conforme especificado
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        
        // Verifica se a requisição foi bem sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Simula um delay para melhor experiência do usuário
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Renderiza os dados retornados da API
        renderPost(data, responseData);
        
        // Atualiza a resposta da API
        apiResponse.textContent = formatApiResponse(responseData);
        
        // Mostra mensagem de sucesso
        postStatus.innerHTML = '<i class="fas fa-check-circle"></i> Post publicado com sucesso!';
        postStatus.style.color = '#4cc9f0';
        
        // Limpa o formulário
        titleInput.value = '';
        contentInput.value = '';
        titleCounter.textContent = '0/100';
        contentCounter.textContent = '0/500';
        
    } catch (error) {
        console.error('Erro ao enviar post:', error);
        
        // Mostra mensagem de erro
        postStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro ao publicar post';
        postStatus.style.color = '#e74c3c';
        
        // Mostra o erro na resposta da API
        apiResponse.textContent = `Erro: ${error.message}`;
        
    } finally {
        // Esconde o loading e reabilita o botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publicar Post';
        loadingSpinner.style.display = 'none';
    }
});

// Função para renderizar o post
function renderPost(userData, apiData) {
    // Atualiza os elementos com os dados
    tituloRenderizar.textContent = userData.title;
    conteudoRenderizar.textContent = userData.body;
    postTime.textContent = formatDate();
    postId.textContent = apiData.id || '101'; // JSONPlaceholder sempre retorna id 101 para novos posts
    
    // Esconde o placeholder e mostra o post
    placeholder.style.display = 'none';
    postDisplay.style.display = 'block';
    
    // Anima a entrada do post
    postDisplay.style.opacity = '0';
    postDisplay.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        postDisplay.style.transition = 'all 0.5s ease';
        postDisplay.style.opacity = '1';
        postDisplay.style.transform = 'translateY(0)';
    }, 100);
}

// Funções dos botões de ação (curtir, comentar, compartilhar)
document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', function() {
        const action = this.classList[1]; // like-btn, comment-btn ou share-btn
        
        // Feedback visual temporário
        const originalContent = this.innerHTML;
        const originalColor = this.style.color;
        
        switch(action) {
            case 'like-btn':
                this.innerHTML = '<i class="fas fa-thumbs-up"></i> Curtido!';
                this.style.color = '#4361ee';
                break;
            case 'comment-btn':
                this.innerHTML = '<i class="fas fa-comment"></i> Comentando...';
                this.style.color = '#7209b7';
                break;
            case 'share-btn':
                this.innerHTML = '<i class="fas fa-share"></i> Compartilhado!';
                this.style.color = '#4cc9f0';
                break;
        }
        
        // Volta ao estado original após 2 segundos
        setTimeout(() => {
            this.innerHTML = originalContent;
            this.style.color = originalColor;
        }, 2000);
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Foca no campo de título
    titleInput.focus();
    
    // Adiciona tooltips aos botões de ação
    document.querySelectorAll('.action-btn').forEach(btn => {
        const action = btn.classList[1];
        let tooltip = '';
        
        switch(action) {
            case 'like-btn': tooltip = 'Curtir este post'; break;
            case 'comment-btn': tooltip = 'Adicionar comentário'; break;
            case 'share-btn': tooltip = 'Compartilhar post'; break;
        }
        
        btn.title = tooltip;
    });
    
    console.log('Posting Page inicializada com sucesso!');
    console.log('URL da API: https://jsonplaceholder.typicode.com/posts');
});

// Função para testar a API (opcional - para desenvolvimento)
async function testAPI() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        if (response.ok) {
            console.log('✅ API está funcionando corretamente');
        }
    } catch (error) {
        console.warn('⚠️ Não foi possível conectar à API. Verifique sua conexão com a internet.');
    }
}

// Testa a conexão com a API ao carregar a página
window.addEventListener('load', testAPI);
