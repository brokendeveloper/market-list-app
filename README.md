# Market List App 🛒

Este projeto é uma aplicação fullstack para gerenciamento de listas de 
compras, desenvolvida com **Java + Spring Boot** no backend e **React + Next.JS** 
no frontend. O banco de dados utilizado é **PostgreSQL** rodando em Docker.

## 🚀 Tecnologias Utilizadas
- Java 17 + Spring Boot
- React + TypeScript + Tailwind CSS + Shadcn
- PostgreSQL 
- Docker + Docker Compose

## 📌 Funcionalidades
- Criar, listar, atualizar e deletar listas de compras
- Adicionar e gerenciar itens dentro de cada lista
- Atualizar status dos itens

## ⚡ Como Rodar o Projeto

### 1️⃣ Pré-requisitos

Certifique-se de ter instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Java 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Node.js 18+](https://nodejs.org/)

### 2️⃣ Clonar o repositório
1. Clone o repositório:
```sh
git clone https://github.com/seu-usuario/market-list-app.git

cd market-list-app
```

## 🔹 Backend (Spring Boot + Docker)
### 3️⃣ Subir o banco de dados
2. No diretório raiz do projeto, suba o banco de dados com:
   ```sh
   docker-compose up -d
    ```
### 4️⃣ Rodar o Backend
3. Navegue até o diretório do backend:
    ```
    cd backend
    ```
3. Instale as dependências e executa o backend.
    ```
   ./mvnw clean install

   mvn spring-boot:run
   ```
O backend estará rodando em http://localhost:8080

## Frontend (React + Next.JS)
### 5️⃣ Rodar o Frontend
1. Navegue até o diretório do frontend:
    ```
   cd frontend
    ```
2. No diretório do frontend, instale as dependências:
    ```
    npm install
    ```
3. Inicie o frontend:
    ```
    npm run dev
    ```
Acesse a aplicação no navegador: http://localhost:3001 🚀

## 🛠️ Ajustes e Melhorias

- Melhorar interface do usuário

- Implementar autenticação

- Adicionar testes unitários

- Contribuições são bem-vindas! 😊