/*Lógica do script

-fluxo básico-
.captar quando o botao foi clicado x
.pegar nome da cidade e guardar em variavel x
.enviar o nome da cidade para a API x
.pegar os dados da API e guardar em variaveis x
.atualizar a interface com os novos dados

-fluxo de voz-
.descobrir quando o botão mic foi clicado
.ouvir e pegar a trasncricao do que foi dito
.enviar a transcricao para o servidor de API
.pegar a resposta e mostrar

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
        <h2 class="cidade">${dadosJson.name}</h2>
        <p class="temperatura">${Math.floor(dadosJson.main.temp)} °C</p>
        <img class="icone" src="https://openweathermap.org/img/wn/${dadosJson.weather[0].icon}.png" alt="Ícone do clima">
        <p class="umidade">Umidade: ${dadosJson.main.humidity} %</p>
        <button class="botaoIA">Sugestão de roupa</button>
        <p class="respostaIA">Resposta da IA</p>
    `
    /*O icone é montado através da url disponibilizada no site juntamente com o código do ícone */
}