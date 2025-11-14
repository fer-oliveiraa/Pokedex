# Pokédex Digital - React Native

> Trabalho Final da disciplina de Dispositivos Móveis.

Este projeto consiste em um aplicativo móvel desenvolvido em **React Native (Expo)** que consome a [PokéAPI](https://pokeapi.co/) para listar, filtrar e exibir detalhes de Pokémons. O objetivo foi aplicar conceitos de consumo de API REST, navegação, gerenciamento de estados e criação de interfaces responsivas.

## Demonstração do App

<div align="center">

https://github.com/user-attachments/assets/8c68218a-10c8-4fe0-af61-329138f45a30

</div>

## Funcionalidades Principais

- **Listagem Infinita:** Carrega os Pokémons automaticamente conforme o usuário rola a tela.
- **Busca e Filtro:** Permite buscar por nome/número e filtrar a lista por tipo (Fogo, Água, etc.).
- **Detalhes Visuais:** Mostra uma tela completa para cada Pokémon, incluindo barras de estatísticas (HP, Ataque, etc.).
- **Tratamento de Erros:** Possui uma tela de falha de conexão com botão para "Tentar Novamente".

## Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/)** (via Expo)
- **[React Navigation](https://reactnavigation.org/)** (Stack Navigator)
- **[Axios](https://axios-http.com/)** (Requisições HTTP)
- **JavaScript (ES6+)** & Hooks (useState, useEffect)

## Como executar o projeto

### Pré-requisitos
Certifique-se de ter instalado:
- [Node.js](https://nodejs.org/)
- Gerenciador de pacotes (NPM ou Yarn)
- Aplicativo **Expo Go** no seu celular (Android ou iOS)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/fer-oliveiraa/Pokedex.git
cd PokedexFinal
```
2. Instale as dependências:
```bash
npm install
```
3. Execute o projeto:
```bash
npx expo start
```
#### (Caso tenha problemas de conexão, tente: npx expo start --tunnel)


> Desenvolvido por Fernanda Oliveira Cardoso. Aluna do curso de Ciência da Computação - IFTM


