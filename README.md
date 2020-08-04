<h1 align="center">
  <img alt="Proffy" title="proffy" src=".github/logo.svg" width="200px" />
</h1>

<h3 align="center">
  Proffy: back-end, front-end web e mobile
</h3>

<p align = "center">
<a href="https://www.codefactor.io/repository/github/hugo-marcelo/proffy"><img src="https://www.codefactor.io/repository/github/hugo-marcelo/proffy/badge" alt="CodeFactor" /></a>
<img alt = "Última confirmação do Github" src = "https://img.shields.io/github/last-commit/hugo-marcelo/proffy">
<img alt = "Idioma principal do GitHub" src = "https://img.shields.io/github/languages/top/hugo-marcelo/proffy">
<img alt = "GitHub" src = "https://img.shields.io/github/license/hugo-marcelo/proffy.svg">
<a href="https://www.codacy.com/manual/hugo-marcelo/proffy?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=hugo-marcelo/proffy&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/147d0b2836734c79b7ee5ea035f065b4"/></a>
</p>

<h3 align="center">
  <a href="https://insomnia.rest/run/?label=Proffy&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fhugo-marcelo%2Fproffy%2Fmaster%2Fbackend%2FInsomnia.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</h3>

## :gear: Back-end

### :information_source: Deploy

- https://proffy-backend.herokuapp.com

### :information_source: Instruções Back-end

#### Executando back-end

```bash

# criar estrutura do banco de dados SQLite
yarn knex:migrate

# iniciar servidor da aplicação
yarn dev:server

```

---

## :computer: Front-end

### :information_source: Deploy

- https://proffy-web.herokuapp.com

### :information_source: Instruções Front-end

```bash
#instalar os pacotes e dependências
yarn

# iniciar a aplicação web
yarn start
```

---

## :iphone: Mobile

### :information_source: Instruções Mobile (iOS)

```bash
#instalar os pacotes e dependências
yarn

# iniciar o aplicativo no emulador do iOS
yarn ios
```

### :information_source: Instruções Mobile (Android)

```bash
#instalar os pacotes e dependências
yarn
```

Alterar a variável baseURL em `/src/services/api.js` colocando o ip local ou do emulador

```bash
# inicializar o aplicativo no emulador do Android
yarn android
```

---

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## :clap: Obrigado

[Rocketseat](https://rocketseat.com.br/) pelo NLW!
