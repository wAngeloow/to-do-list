function atualizarHora() {
    const hora = new Date();
    let horas = hora.getHours();
    let minutos = hora.getMinutes();
    minutos = minutos < 10 ? "0" + minutos : minutos;
    const horaFormatada = `${horas}:${minutos}`;
    document.getElementById('hora').textContent = horaFormatada;
}

setInterval(atualizarHora, 1000);
atualizarHora();

const inputTarefa = document.getElementById('nova-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorCriadas = document.getElementById('contador-1');
const contadorConcluidas = document.getElementById('contador-2');
const excluirTudoBtn = document.getElementById('excluir-tudo');
const modalEditar = document.getElementById('modal-editar');
const inputEditar = document.getElementById('input-editar');
const salvarEdicaoBtn = document.getElementById('salvar-edicao');
const cancelarEdicaoBtn = document.getElementById('cancelar-edicao');

let tarefas = [];
let contadorTotal = 0;
let contadorConcluidasTotal = 0;
let tarefaEditando = null;

// Atualiza os contadores de tarefas
function atualizarContadores() {
    contadorCriadas.textContent = contadorTotal;
    contadorConcluidas.textContent = contadorConcluidasTotal;
}

// Adiciona uma nova tarefa
function adicionarTarefa(texto) {
    if (texto.trim() === '') return;

    const tarefa = {
        id: Date.now(),
        texto,
        concluida: false
    };
    tarefas.push(tarefa);
    contadorTotal++;
    renderizarTarefas();
    atualizarContadores();
    excluirTudoBtn.style.display = 'block';
    salvarNoLocalStorage();
}

// Renderiza a lista de tarefas
function renderizarTarefas() {
    listaTarefas.innerHTML = '';

    if (tarefas.length === 0) {
        document.querySelector('.sem-tarefas').style.display = 'block';
        excluirTudoBtn.style.display = 'none';
    } else {
        document.querySelector('.sem-tarefas').style.display = 'none';
    }

    tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.classList.add('tarefa');

        const checkbox = document.createElement('button');
        checkbox.classList.add('checkbox');
        checkbox.innerHTML = tarefa.concluida ? 
            '<i class="fa-solid fa-circle-check"></i>' : 
            '<i class="fa-regular fa-circle"></i>';
        checkbox.onclick = () => marcarConcluida(tarefa.id);

        const texto = document.createElement('p');
        texto.classList.add('text');
        texto.textContent = tarefa.texto;
        if (tarefa.concluida) {
            texto.style.textDecoration = 'line-through';
        }

        const editarBtn = document.createElement('button');
        editarBtn.classList.add('edit');
        editarBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        editarBtn.onclick = () => abrirModalEdicao(tarefa.id);

        const deletarBtn = document.createElement('button');
        deletarBtn.classList.add('delete');
        deletarBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deletarBtn.onclick = () => deletarTarefa(tarefa.id);

        li.appendChild(checkbox);
        li.appendChild(texto);
        li.appendChild(editarBtn);
        li.appendChild(deletarBtn);

        listaTarefas.appendChild(li);
    });
}

// Marca uma tarefa como concluída
function marcarConcluida(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;

        if (tarefa.concluida) {
            const somConclusao = new Audio('./audio/concluido.mp3');
            somConclusao.play();
            tarefas = tarefas.filter(t => t.id !== id);
            tarefas.push(tarefa);
        }

        contadorConcluidasTotal = tarefas.filter(t => t.concluida).length;
        renderizarTarefas();
        atualizarContadores();
        salvarNoLocalStorage();
    }
}

// Abre o modal de edição
function abrirModalEdicao(id) {
    tarefaEditando = tarefas.find(t => t.id === id);
    inputEditar.value = tarefaEditando.texto;
    modalEditar.style.display = 'block';
    modalFundo.style.display = 'block';
    document.body.style.overflow = 'hidden';
    inputEditar.select();
}

// Salva a edição da tarefa
salvarEdicaoBtn.onclick = () => {
    if (tarefaEditando) {
        tarefaEditando.texto = inputEditar.value;
        renderizarTarefas();
        salvarNoLocalStorage();
    }
    fecharModal();
};

// Fecha o modal
function fecharModal() {
    modalEditar.style.display = 'none';
    modalFundo.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Cancela a edição
cancelarEdicaoBtn.onclick = fecharModal;

inputEditar.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        salvarEdicaoBtn.click();
    }
});

// Deleta uma tarefa
function deletarTarefa(id) {
    tarefas = tarefas.filter(t => t.id !== id);
    contadorTotal--;
    contadorConcluidasTotal = tarefas.filter(t => t.concluida).length;
    renderizarTarefas();
    atualizarContadores();
    salvarNoLocalStorage();
}

// Adiciona a tarefa ao clicar no botão
document.getElementById('add-tarefa').addEventListener('click', (event) => {
    event.preventDefault();
    adicionarTarefa(inputTarefa.value);
    inputTarefa.value = '';
});

// Salva as tarefas no localStorage
function salvarNoLocalStorage() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Carrega as tarefas do localStorage
function carregarDoLocalStorage() {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
        contadorTotal = tarefas.length;
        contadorConcluidasTotal = tarefas.filter(t => t.concluida).length;
    }
}

// Carrega as tarefas ao iniciar
carregarDoLocalStorage();
renderizarTarefas();
atualizarContadores();

const modalFundo = document.createElement('div');
modalFundo.id = 'modal-fundo';
document.body.appendChild(modalFundo);

modalFundo.addEventListener('click', fecharModal);

modalEditar.addEventListener('click', (event) => {
    event.stopPropagation();
});

excluirTudoBtn.addEventListener('click', () => {
    tarefas = [];
    contadorTotal = 0;
    contadorConcluidasTotal = 0;
    renderizarTarefas();
    atualizarContadores();
    salvarNoLocalStorage();
});