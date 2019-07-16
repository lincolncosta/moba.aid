**Informações gerais**

Os parâmetros utilizados para calcular o fitness máximo foram os seguintes:

- Máximos de _attackdamage_: 70, 70, 65, 65, 65.
- Máximos de _movespeed_: 355, 355, 350, 350, 350.
- Máximos de _attackdamagelevel_: 5, 5, 5, 5, 5.
- Máximos de _healthpoints_: 800, 625.6, 616.28, 616.28, 615.
- Máximos de _attackrange_: 650, 600, 600, 575, 575.
- Máximos de _attackspeedperlevel_: 6, 4, 3.75, 3.7, 3.5.

Com isso, obtém-se que os máximos são:

- Máximo na estratégia _Hard Engage_: **2095**.
- Máximo na estratégia _Team Fight_: **3633**.
- Máximo na estratégia _Pusher_: **3356**.

**Informações de execução**

Após realizar o download ou clone do projeto, execute o comando `npm install` para que todas as dependências de execução sejam instaladas em seu computador.

Para executar o projeto utilize o comando `npm run` + um parâmetro de estratégia. Atualmente as estratégias disponíveis são `hardengage`, `pusher` e `teamfight`.

Ou seja, as possíveis execuções seriam:

`npm run hardengage`
`npm run pusher`
`npm run teamfight`

**Resultados**

Os resultados obtidos após a execução da abordagem estarão disponíveis nas pastas `reports` e `time-reports`. A primeira conterá informações a respeito de cada uma das gerações e execuções e a segunda conterá informações a respeito da duração de processamento em cada uma dessas etapas. 

**Novas implementações**

**TODAS AS ALTERAÇÕES DE CODIFICAÇÃO DEVEM SER REALIZADAS SOMENTE NO ARQUIVO `genetic-algorithm.ts`.**