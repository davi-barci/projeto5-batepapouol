let nome;
let statusOnline;

function usuarioOnline(){
    statusOnline = new Date();
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

function sucessoLogin(resposta) {
	console.log(resposta.data);
    setInterval(verificarStatus, 5000);
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