# 📚 API de Cadastro de Alunos com Node.js + Firebase

Este projeto é uma API RESTful construída em **Node.js** que utiliza o **Firebase Firestore** como banco de dados, com integração para automações via **n8n** e **webhooks** externos (como bots do Telegram ou agentes de IA).

---

## ✨ Funcionalidades

- ✅ Cadastro de aluno com nome, e-mail, CPF e cursos
- 🔍 Consulta de aluno por CPF
- ✏️ Edição de aluno por CPF
- 🗑️ Exclusão de aluno por ID
- 🧹 Limpeza de CPF via Regex
- 📡 Webhook pronto para integração com plataformas como o n8n
- 🔐 Variáveis de ambiente via `.env`
- 🐳 Pronto para uso com Docker

---

## 🛠️ Tecnologias utilizadas

- Node.js
- Express.js
- Firebase Admin SDK
- dotenv
- Regex para sanitização de CPF
- JSON Schema para estruturação de dados
- n8n (integração via Webhook)
- Docker

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seunome/aluno-api.git
cd aluno-api

# Instale as dependências
npm install

# Crie o arquivo .env
cp .env.example .env
