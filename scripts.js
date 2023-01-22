let nome;
let statusOnline;
let textoObj;
let participanteAtual = "";
let visibilidadeAtual = "Publico";
let textoMsg;
let visibilidadeMsg;
let destinatario;

function selecionarOpcoes(classe, objSelecionado){
    if (classe === "participante"){
        participanteAtual = objSelecionado;
    }else{
        visibilidadeAtual = objSelecionado;
    }

    getUsers();
}

function sucessoParticipantes(resposta){
    const participantes = resposta.data;

    textoMsg = "Enviando para ";
    const telaParticipantes = document.querySelector(".tela-participantes>div:nth-of-type(2)");
    telaParticipantes.innerHTML = "";
    telaParticipantes.innerHTML += "<p class='titulo'>Escolha um contato<br> para enviar mensagem:</p>";
    if (participanteAtual === ""){
        telaParticipantes.innerHTML += `<div class='participantes-ativos selecionado' onclick='selecionarOpcoes("participante", "");' data-test='all'> <ion-icon name='people'></ion-icon> <p>Todos</p> <ion-icon name='checkmark-sharp' data-test='check'></ion-icon> </div>`;
        textoMsg += "Todos";
        destinatario = "Todos";
        visibilidadeAtual = "Publico";
        visibilidadeMsg = "message";
    }else{
        telaParticipantes.innerHTML += `<div class='participantes-ativos' onclick='selecionarOpcoes("participante", "");' data-test='all'> <ion-icon name='people'></ion-icon> <p>Todos</p> <ion-icon name='checkmark-sharp' data-test='check'></ion-icon> </div>`;
    }


    for (let i = 0; i < participantes.length; i++){
        if (participantes[i].name !== nome && participantes[i].name == participanteAtual){
            telaParticipantes.innerHTML += `<div class='participantes-ativos selecionado' onclick='selecionarOpcoes("participante", "${participantes[i].name}");' data-test='participant'> <ion-icon name='person-circle'></ion-icon> <p> ${participantes[i].name} </p>  <ion-icon name='checkmark-sharp' data-test='check'></ion-icon> </div>`;
            textoMsg += participantes[i].name;
            destinatario = participantes[i].name;
        }else if(participantes[i].name !== nome){
            telaParticipantes.innerHTML += `<div class='participantes-ativos' onclick='selecionarOpcoes("participante", "${participantes[i].name}");' data-test='participant'> <ion-icon name='person-circle'></ion-icon> <p> ${participantes[i].name} </p>  <ion-icon name='checkmark-sharp' data-test='check'></ion-icon> </div>`;
        }
    }

    let participanteSelecionado = document.querySelectorAll('.participantes-ativos.selecionado');

    if (participanteSelecionado.length === 0){
        const todos = document.querySelector('.participantes-ativos');
        todos.classList.add("selecionado");
        textoMsg += "Todos";
        destinatario = "Todos";
        participanteAtual = "";
        visibilidadeAtual = "Publico";
        visibilidadeMsg = "message";
    }

    telaParticipantes.innerHTML += "<p class='titulo'>Escolha a visibilidade:</p>";
    if (visibilidadeAtual === "Publico"){
        telaParticipantes.innerHTML += `<div class='opcao-visibilidade selecionado' onclick='selecionarOpcoes("visibilidade", "Publico");' data-test='public'> <ion-icon name='lock-open'></ion-icon> <p>Público</p> <ion-icon name='checkmark-sharp' data-test='check'></ion-icon>  </div>`;
        telaParticipantes.innerHTML += `<div class='opcao-visibilidade' onclick='selecionarOpcoes("visibilidade", "Reservado");' data-test='private'> <ion-icon name='lock-closed'></ion-icon> <p>Reservadamente</p> <ion-icon name='checkmark-sharp' data-test='check'></ion-icon> </div>`;
        visibilidadeMsg = "message";
    }else{
        telaParticipantes.innerHTML += `<div class='opcao-visibilidade' onclick='selecionarOpcoes("visibilidade", "Publico");' data-test='public'> <ion-icon name='lock-open'></ion-icon> <p>Público</p> <ion-icon name='checkmark-sharp' data-test='check'></ion-icon>  </div>`;
        telaParticipantes.innerHTML += `<div class='opcao-visibilidade selecionado' onclick='selecionarOpcoes("visibilidade", "Reservado");' data-test='private'> <ion-icon name='lock-closed'></ion-icon> <p>Reservadamente</p> <ion-icon name='checkmark-sharp' data-test='check'></ion-icon> </div>`;
        textoMsg += " (reservadamente)"
        visibilidadeMsg = "private_message"; 
    }
    
    const textoInput = document.querySelector(".enviar-mensagem p");
    textoInput.innerHTML = textoMsg;
}

function falhaParticipantes(){
    window.location.reload();
}

function getUsers(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then(sucessoParticipantes);
    promessa.catch(falhaParticipantes);
}

function exibirMenuLateral(){
    const menuLateral = document.querySelector(".tela-participantes");
    menuLateral.classList.toggle("disable");
    menuLateral.classList.toggle("able");
}

function mensagemNegada(){
    window.location.reload();
}

function mensagemEnviada(){
    getMensagens();
}

function enviarMensagem(){
    const input = document.querySelector("#texto");
    if (input.value.trim() !== ""){
        textoObj = {from: nome, to: destinatario, text: input.value, type: visibilidadeMsg};

        const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", textoObj);
        requisicao.then(mensagemEnviada);
        requisicao.catch(mensagemNegada);

        input.value = "";
    }
}

document.addEventListener('keypress', function(e){
    if(e.key == 'Enter'){
      enviarMensagem();
    }
  }, false);

function usuarioOnline(){
    statusOnline = new Date();
    console.log(`Usuário Online - ${statusOnline}`);
}

function usuarioOffline(){
    window.location.reload();
}

function verificarStatus(){
    const nomeObj = {name: nome};
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeObj);

    requisicao.then(usuarioOnline);
    requisicao.catch(usuarioOffline);
}

function falhaMensagens(){
    window.location.reload();
}

function sucessoMensagens(resposta) {
    let mensagemAtual;
    const containerMensagens = document.querySelector(".container-mensagens");
    containerMensagens.innerHTML = "";
    const lista = resposta.data;

    for (let i = 0; i < lista.length; i++){
        if (lista[i].type === "status"){
            mensagemAtual = document.createElement("div");
            mensagemAtual.classList.add("mensagens-status");
            mensagemAtual.setAttribute("data-test", "message");
            mensagemAtual.innerHTML = `<p><span>(${lista[i].time})</span>&nbsp;<b>${lista[i].from}</b>&nbsp;${lista[i].text}</p>`
            containerMensagens.appendChild(mensagemAtual);
        }else if (lista[i].type === "message"){
            mensagemAtual = document.createElement("div");
            mensagemAtual.classList.add("mensagens");
            mensagemAtual.setAttribute("data-test", "message");
            mensagemAtual.innerHTML = `<p><span>(${lista[i].time})</span>&nbsp;<b>${lista[i].from}&nbsp;</b>para&nbsp;<b>${lista[i].to}&nbsp;</b>: ${lista[i].text}</p>`
            containerMensagens.appendChild(mensagemAtual);
        }else if (lista[i].type === "private_message" && (lista[i].to === nome || lista[i].from === nome)){
            mensagemAtual = document.createElement("div");
            mensagemAtual.classList.add("mensagens-reservadas");
            mensagemAtual.setAttribute("data-test", "message");
            mensagemAtual.innerHTML = `<p><span>(${lista[i].time})</span>&nbsp;<b>${lista[i].from}&nbsp;</b>reservadamente para<b>&nbsp;${lista[i].to}</b>: ${lista[i].text}</p>`
            containerMensagens.appendChild(mensagemAtual);
        }
    }

    document.querySelector(".container-mensagens div:nth-last-child(1)").scrollIntoView();
}

function getMensagens(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(sucessoMensagens);
    promessa.catch(falhaMensagens);
}

function sucessoLogin(resposta) {
	const telaEntrada = document.querySelector(".tela-entrada");
    telaEntrada.classList.add("disable");

    getMensagens();
    getUsers();
    setInterval(verificarStatus, 5000);
    setInterval(getMensagens, 3000);
    setInterval(getUsers, 10000);
}

function loginNegado(erro){
    console.log("Status code: " + erro.response.status); 
	console.log("Mensagem de erro: " + erro.response.data);
    window.location.reload();
}

function fazerLogin(){
    const inputEntrada = document.querySelector(".tela-entrada input");
    nome = inputEntrada.value;
    const nomeObj = {name: nome};

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeObj);
    requisicao.then(sucessoLogin);
    requisicao.catch(loginNegado);
}


