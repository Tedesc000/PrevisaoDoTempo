<?php

/*
FLUXO DE FUNCIONAMENTO
.Recebe do JavaScript uma mensagem via fetch (JSON no corpo da requisição).
.Decodifica esse JSON usando php://input.
.Monta o payload no formato exigido pela API do Groq (modelo + messages).
.Abre uma conexão HTTP com a API do Groq usando cURL.
.Configura a requisição como POST, define headers (JSON + Bearer Token) e envia o payload convertido em JSON.
.Executa a chamada para a IA.
.Recebe a resposta da Groq.
.Retorna esse JSON diretamente para o frontend (echo).

JS → PHP → Groq API → PHP → JS

Este arquivo funciona como backend intermediário para:
- esconder a chave da API
- evitar exposição no frontend
- centralizar chamadas à IA
*/


require "config.php";

// pega os dados enviados pelo JS
$dados = json_decode(file_get_contents("php://input"), true);//decodifica o JSON recebido no corpo da requisição, 
//input é um fluxo de dados padrão do PHP que lê dados brutos da requisição HTTP

$mensagem = $dados["mensagem"];

// payload baseado na documentação do Groq
$payload = [
    "model" => "openai/gpt-oss-120b",//modelo a ser usado
    "messages" => [
        [
            "role" => "user",
            "content" => $mensagem
        ]
    ]
];

$ch = curl_init("https://api.groq.com/openai/v1/chat/completions");//cria a sessão curl de conexão com a url da api do Groq, ch é a variável que representa essa sessão,
// curl handle(referencia à sessão)

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,//para retornar o resultado como string em uma variavel
    CURLOPT_POST => true,//define que é uma requisição POST
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",//define o tipo de conteúdo como json
        "Authorization: Bearer ".chaveGroq//adiciona o cabeçalho de autorização com a chave da api
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)//converte o payload para json e define como corpo da requisição
]);

$resposta = curl_exec($ch);//executa a requisição e armazena a resposta na variável

echo $resposta;//imprime a resposta para o JS