Após realizar o download ou clone do projeto, execute o comando `npm install` para que todas as dependências de execução sejam instaladas em seu computador.

Para executar o projeto utilize o comando `npm run mobator` + um parâmetro de estratégia. Atualmente as estratégias disponíveis são `gank`, `pusher` e `teamfight`.

Ou seja, as possíveis execuções seriam:

`npm run mobator gank`
`npm run mobator pusher`
`npm run mobator teamfight`

TODAS AS ALTERAÇÕES DE CODIFICAÇÃO DEVEM SER REALIZADAS SOMENTE NO ARQUIVO `genetic-algorithm.ts`.

Os parâmetros utilizados para calcular o fitness máximo foram os seguintes:

- Máximos de _attackdamage_: 70, 70, 65, 65, 65.
- Máximos de _movespeed_: 355, 355, 350, 350, 350.
- Máximos de _attackdamagelevel_: 5, 5, 5, 5, 5.
- Máximos de _attackrange_: 650, 600, 600, 575, 575.

Com isso, obtém-se que os máximos são:

- Máximo na estratégia _gank_: **2095**.
- Máximo na estratégia _teamfight_: **360**.
- Máximo na estratégia _pusher_: **3335**.