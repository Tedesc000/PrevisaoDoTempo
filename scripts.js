/*Lógica do script

-fluxo básico-
.captar quando o botao foi clicado x
.pegar nome da cidade e guardar em variavel x
.enviar o nome da cidade para a API x
.pegar os dados da API e guardar em variaveis x
.atualizar a interface com os novos dados x

-fluxo de voz-
.descobrir quando o botão mic foi clicado x
.ouvir e pegar a trasncricao do que foi dito x
.enviar a transcricao para o servidor de API x
.pegar a resposta e mostrar x

-fluxo da IA-
.pegar os dados da cidade selecionada
.enviar os dados para o servidor da IA
.pegar a resposta da IA e mostrar na interface


-IMPORTANTE PARA SEGURANÇA-
.Nunca deixar a chave de API exposta no código front-end
.Utilizar um servidor back-end para fazer as requisições para a API externa, como o PHP
*/



async function cliqueBotao(){ /*async e await andam juntos, tornando a ação de buscar os dados assíncrona, indicam promisses(promessa de que no fututro vai ter resultado)*/
    let cidade = document.querySelector(".inputCidade").value;
    let endereco = `weather.php?cidade=${cidade}`;//chama o backend PHP que faz a requisição para a API
    /*template string em que pode botar outras variáveis dentro, como cidade*/

    let caixa = document.querySelector(".caixaMedia");


    //Precisa avisar o Javascript que vai fazer uma requisição para um servidor externo
    //traduzir a resposta do servidor para um formato que o Javascript entenda (JSON)

    let respostaServidor = await fetch(endereco);/*await faz a função esperar até que a promessa seja resolvida*/
    let dadosJson = await respostaServidor.json();/*.json() é uma função que pega a resposta do servidor e traduz para JSON*/

    //Math.floor(dadosJson.main.temp) arredonda para baixo a temperatura
    caixa.innerHTML = `
        <div class="alinharCentro">
        <h2 class="cidade">${dadosJson.name}</h2>
        <p class="temperatura">${Math.floor(dadosJson.main.temp)} °C</p>
        <img class="icone" src="https://openweathermap.org/img/wn/${dadosJson.weather[0].icon}.png" alt="Ícone do clima">
        <p class="umidade">Umidade: ${dadosJson.main.humidity} %</p>
        </div>
        <button class="botaoIA" onclick="sugestaoRoupa()">Sugestão de roupa</button>
        <p class="respostaIA">Resposta da IA</p>
    `
    /*O icone é montado através da url disponibilizada no site juntamente com o código do ícone */
}

function detectaVoz(){
    let reconhecimento = new window.webkitSpeechRecognition();//função nativa do navegador para reconhecimento de voz
    reconhecimento.lang = "pt-BR";//definir o idioma
    reconhecimento.start();//iniciar o reconhecimento de voz

    reconhecimento.onresult = function(evento){//função que captura o resultado do reconhecimento de voz
        let textoTranscrito = evento.results[0][0].transcript;//pegar o texto transcrito, parecido com o JSON da API, é um array dentro de outro array
        document.querySelector(".inputCidade").value = textoTranscrito;//colocar o texto transcrito no input de cidade
    }
}

async function sugestaoRoupa(){
    //pegar o texto contido na classe temperatura, usar textContent pois ele puxa o texto bruto, até elementos escondidos por CSS
    let temperatura = document.querySelector(".temperatura").textContent;
    let umidade = document.querySelector(".umidade").textContent;
    let cidade = document.querySelector(".cidade").textContent;

    let resposta = await fetch("groq.php", {
        method: "POST",
        headers: { //cabeçalhos da requisição
            "Content-Type": "application/json",//tipo de conteúdo que está sendo enviado
        },
        body: JSON.stringify({ //corpo da requisição, converter para string JSON
            mensagem: `Com base na temperatura de ${temperatura} e umidade de ${umidade} em ${cidade}, que roupa você recomendaria para vestir hoje? 
            Por favor, responda de forma breve e objetiva, não use traços ou pontos de lista, faça em parágrafo.` //mensagem enviada para a IA
        })
    });

    /*METODOS HTTP
    GET - pegar dados
    POST - enviar dados
    PUT - atualizar dados
    DELETE - deletar dados
   */

    let dados = await resposta.json(); //pegar a resposta da API e converter para JSON
    console.log(dados);
    document.querySelector(".respostaIA").textContent = dados.choices[0].message.content;//mostrar a resposta da IA na interface,a partir do JSON retornado
}