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

## Resultados

Os resultados obtidos após a execução da abordagem estarão disponíveis nas pastas `reports` e `time-reports`. A primeira conterá informações a respeito de cada uma das gerações e execuções e a segunda conterá informações a respeito da duração de processamento em cada uma dessas etapas. 