<?php 
    require "config.php";//importa o arquivo de configuração onde está a chave da api, usar require pois se config.php não existir ele para a execução
    $cidade = $_GET['cidade'];//pega a cidade passada por parâmetro na url pelo JS
    $url = "https://api.openweathermap.org/data/2.5/weather?q=".$cidade."&appid=".chave."&lang=pt_br&units=metric";

    echo file_get_contents($url);//isso retorna o json da api e imprime como resposta
?>