<h1 align="center">Moba AID 🎮</h1>

<div align="center"><img src="./assets/pickoff.jpg" /></div>

## Informações gerais

Os parâmetros utilizados para calcular o fitness máximo foram os seguintes:

> Taxa de vitória do _top_ + taxa de vitória do _jungler_ + taxa de vitória do _mid_ + taxa de vitória do _carry_ + taxa de vitória do _support_.

Para cada uma das composições geradas, são analisados os valores de _role_ dos campeões participantes. Caso os campeões possuam _roles_ relacionadas à estratégia proposta, um fator de bonificação de 0.1 é acrescido ao multiplicador (que inicia-se em 1.0) do valor de avaliação. A relação de estratégias e _roles_ funciona da seguinte maneira:

Estratégias | _Roles_
------------ | -------------
Hard Engage | Hard Engage
Team Fight | Area of Effect
Pusher | Poke, Wave Clear

## Inicialização

1. Instale as dependências

```bash
cd server && yarn install
```

2. Duplique o arquivo `.env.example` e renomeie para `.env` preenchendo as variáveis corretamente

3. Suba o servidor

```bash
yarn start
```

4. (OPCIONAL) Importe a collection `docs/moba.aid.postman_collection.json` no seu [Postman](https://www.postman.com/) para testar os endpoints


## Resultados

Os resultados obtidos após a execução da abordagem estarão disponíveis nas pastas `reports` e `time-reports`. A primeira conterá informações a respeito de cada uma das gerações e execuções e a segunda conterá informações a respeito da duração de processamento em cada uma dessas etapas. 

## Contribuidores

| [<img src="https://avatars1.githubusercontent.com/u/5794419?s=460&v=4" width="115"><br><sub>@eliocosta</sub>](https://github.com/eliocosta) |
| :---: |    

## Autores

| [<img src="https://avatars0.githubusercontent.com/u/26147019?s=460&v=4" width=115><br><sub>@tekpixo</sub>](https://github.com/tekpixo) | [<img src="https://avatars2.githubusercontent.com/u/8319539?s=460&v=4" width=115><br><sub>@fcarlosmonteiro</sub>](https://github.com/fcarlosmonteiro) | [<img src="https://avatars0.githubusercontent.com/u/13510169?s=460&v=4" width="115"><br><sub>@santospatrick</sub>](https://github.com/santospatrick) |
| :---: | :---: | :---: |

## Citação do artigo publicado no SBgames 2019

Artigo: https://www.researchgate.net/publication/337260793_An_Approach_for_Team_Composition_in_League_of_Legends_using_Genetic_Algorithm


```
@INPROCEEDINGS{Costa2019, 
author={L. M. {Costa} and A. C. C. {Souza} and F. C. M. {Souza}}, 
booktitle={2019 18th Brazilian Symposium on Computer Games and Digital Entertainment (SBGames)}, 
title={An Approach for Team Composition in League of Legends using Genetic Algorithm}, 
year={2019}, 
pages={52-61}
}
```
