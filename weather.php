<?php 
    require "config.php";//importa o arquivo de configuração onde está a chave da api, usar require pois se config.php não existir ele para a execução

    if (!isset($_GET['cidade']) || empty($_GET['cidade'])) {//verifica se o parâmetro cidade foi passado na url
        echo json_encode(["erro" => "Parâmetro 'cidade' não fornecido."]);//retorna um json de erro
        exit;
    }

    $cidade = urlencode($_GET['cidade']);//pega a cidade passada por parâmetro na url pelo JS, urlencode para tratar espaços e caracteres especiais
    $url = "https://api.openweathermap.org/data/2.5/weather?q=".$cidade."&appid=".chave."&lang=pt_br&units=metric";

    $resposta = @file_get_contents($url);//isso retorna o json da api e imprime como resposta
    //o @ suprime mensagens de erro em HTML caso a requisição falhe

    if ($resposta === false){
        echo json_encode(["cod" => 404, "message" => "Cidade não encontrada"]);//se der erro na requisição, retorna um json com código 404
        exit;//encerra a execução do script
    }

    echo $resposta;//imprime a resposta da api para o JS
?>