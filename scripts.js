let nome;
let statusOnline;

function usuarioOnline(){
    statusOnline = new Date();
    console.log(`Usuário Online - ${statusOnline}`);
}

function usuarioOffline(){
    document.location.reload();
}

function verificarStatus(){
    const nomeObj = {name: nome};
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeObj);

    requisicao.then(usuarioOnline);
    requisicao.catch(usuarioOffline);
}

function falhaMensagens(){
    document.location.reload();
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
            mensagemAtual.innerHTML = `<p><span>(${lista[i].time})</span>&nbsp;<b>${lista[i].from}</b>&nbsp;${lista[i].text}</p>`
            containerMensagens.appendChild(mensagemAtual);
        }else if (lista[i].type === "message"){
            mensagemAtual = document.createElement("div");
            mensagemAtual.classList.add("mensagens");
            mensagemAtual.innerHTML = `<p><span>(${lista[i].time})</span>&nbsp;<b>${lista[i].from}&nbsp;</b>para&nbsp;<b>${lista[i].to}&nbsp;</b>: ${lista[i].text}</p>`
            containerMensagens.appendChild(mensagemAtual);
        }else if (lista[i].type === "private_message" && lista[i].to === nome){
            mensagemAtual = document.createAttribute("div");
            mensagemAtual.classList.add("mensagens-reservadas");
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
	console.log(resposta.data);
    getMensagens();
    setInterval(verificarStatus, 5000);
    getMensagens();
    setInterval(getMensagens, 3000);
}

function loginNegado(erro){
    console.log("Status code: " + erro.response.status); 
	console.log("Mensagem de erro: " + erro.response.data);
    fazerLogin("Usuário já se encontra logado, tente outro nome...");
}

function fazerLogin(msg){
    nome = prompt(msg);
    const nomeObj = {name: nome};

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeObj);
    requisicao.then(sucessoLogin);
    requisicao.catch(loginNegado);
}


fazerLogin("Digite seu nome para realizar o login");