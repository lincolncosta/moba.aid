# Mobator

Artigo relacionado: https://ieeexplore.ieee.org/document/8924849

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

Baixe as dependências do projeto executando o comando `npm install` na pasta raiz. Para executar o servidor do projeto, acesse a pasta _/server_ e execute o comando `npm start`. As requisições ficarão disponíveis caso não haja nenhum erro na inicialização.

## Requisições

Importações das requisições via Insomnia, [clique aqui](../tree/master/docs). 

**URL** : `/api/league/`

**Descrição** : `API para geração de uma composição em League Of Legends.`

**Método** : `GET`

**Parâmetros disponíveis**

```json
{
    "mutation_chance": 0.3,
    "max_generations": 1000,
    "population_size": 300,
    "strategy": "hardengage",
    "max_fit_value": 81.28,
    "enemy_champion[x]": 50,
    "enemy_champion[y]": 1,
}
```
Acima estão ilustrados os possíveis parâmetros em uma requisição para a geração de uma composição de League Of Legends. No exemplo, os valores de chance de mutação, número máximo de gerações e tamanho da população são, respectivamente, 0.3, 1000 e 300. A estratégia requisitada é Hard Engage e o valor máximo alcançável para essa estratégia é 81.28. **Esses são parâmetros obrigatórios!**
Por fim, os campeões _pickados_ pelo time adversário podem ser inseridos através de um array de, no máximo, 5 itens. Esses campeões serão considerados para buscar uma composição contendo _counters_ dos mesmos.


## Resultados

Os resultados obtidos após a execução da abordagem estarão disponíveis nas pastas `reports` e `time-reports`. A primeira conterá informações a respeito de cada uma das gerações e execuções e a segunda conterá informações a respeito da duração de processamento em cada uma dessas etapas. 