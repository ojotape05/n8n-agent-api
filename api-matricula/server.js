import express from 'express';
import cors from 'cors';
import alunoController from './controllers/alunoController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/consultar-aluno', alunoController.consultarAluno)
app.post('/api/criar-aluno', alunoController.criarAluno);
app.put('/api/editar-aluno', alunoController.editarAluno);
app.delete('/api/deletar-aluno', alunoController.deletarAluno);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));