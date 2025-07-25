import { collection, query, where, doc, getDocs, updateDoc, addDoc, deleteDoc } from 'firebase/firestore/lite';
import db from '../firebase/connect.js';

async function consultarAluno(req, res) {
    try {

        const { cpf } = req.query;

        if (!cpf) {
            return res.status(400).json({
                tool: 'consulta-aluno',
                status: 'error',
                message: "O parâmetro CPF é obrigatório."
            })
        }

        const cpf_limpo = cpf.replace(/\D/g,"")
        const alunosRef = collection(db, "alunos")
        const query_var = query(alunosRef, where('cpf', "==", cpf_limpo))
        const snapshot = await getDocs(query_var)

        if (snapshot.empty) {
            return res.status(404).json({
                tool: 'consulta-aluno',
                status: 'error',
                message: "Não existe aluno para esse CPF."
            })
        }

        const alunoData = snapshot.docs[0].data()
        return res.status(200).json({
            tool: 'consulta-aluno',
            status: 'sucesso',
            message: `Consulta por ${alunoData.nome} realizada.\n\nmatricula: ${snapshot.docs[0].id}\ncpf: ${alunoData.cpf}\nnome: ${alunoData.nome}\nemail: ${alunoData.email}\ncursos: ${alunoData.cursos}`,
            dados: {
                matricula: snapshot.docs[0].id,
                cpf: alunoData.cpf,
                nome: alunoData.nome,
                email: alunoData.email,
                cursos: alunoData.cursos || []
            }
        })

    } catch (error) {
        console.error("Erro ao consultar aluno", error);
        return res.status(500).json({
            tool: 'consulta-aluno',
            status: 'error',
            message: "Erro interno, por favor tente mais tarde."
        })
    }
};

async function editarAluno(req, res) {
    try {
        const { cpf } = req.query;
        const { nome, email, cursos } = req.body;

        if (!cpf) {
            return res.status(400).json({
                tool: 'editar-aluno',
                status: 'error',
                message: 'O parâmetro CPF é obrigatório.'
            });
        }

        if (!nome && !email && !cursos) {
            return res.status(400).json({
                tool: 'editar-aluno',
                status: 'error',
                message: 'Informe ao menos um campo para atualização (nome, email ou cursos).'
            });
        }

        const cpf_limpo = cpf.replace(/\D/g,"")
        const alunosRef = collection(db, "alunos");
        const query_var = query(alunosRef, where('cpf', "==", cpf_limpo));
        const snapshot = await getDocs(query_var);

        if (snapshot.empty) {
            return res.status(404).json({
                tool: 'editar-aluno',
                status: 'error',
                message: 'Aluno não encontrado.'
            });
        }

        const docId = snapshot.docs[0].id;
        const alunoData = snapshot.docs[0].data()

        const atualizacoes = {};
        if (nome) atualizacoes.nome = nome;
        if (email) atualizacoes.email = email;
        if (cursos) {
            if (!Array.isArray(cursos)) {
                return res.status(400).json({
                    tool: 'editar-aluno',
                    status: 'error',
                    message: 'O campo cursos deve ser uma lista.'
                });
            }
            atualizacoes.cursos = cursos;
        }

        await updateDoc(doc(db, "alunos", docId), atualizacoes);

        return res.status(200).json({
            tool: 'editar-aluno',
            status: 'sucesso',
            message: `Aluno ${nome || alunoData.nome} atualizado com sucesso.\n\nmatricula: ${docId}\ncpf: ${alunoData.cpf}\nnome: ${nome || alunoData.nome}\nemail: ${email || alunoData.email}\ncursos: ${cursos || alunoData.cursos}`,
            dados: {
                matricula: docId,
                cpf,
                ...atualizacoes
            }
        });

    } catch (error) {
        console.error("Erro ao editar aluno:", error);
        return res.status(500).json({
            tool: 'editar-aluno',
            status: 'error',
            message: 'Erro interno ao editar o aluno.'
        });
    }
};


async function criarAluno(req, res) {
    try {
        const { nome, cpf, email, cursos } = req.body;

        if (!cpf || !nome || !email || !cursos || !Array.isArray(cursos)) {
            return res.status(400).json({
                tool: 'nova-matricula',
                status: 'error',
                message: 'Dados inválidos'
            });;
        }

        const cpf_limpo = cpf.replace(/\D/g,"")
        const alunosRef = collection(db, "alunos")
        const query_var = query(alunosRef, where('cpf', "==", cpf_limpo))
        const snapshot = await getDocs(query_var)

        if (!snapshot.empty) {
            return res.status(400).json({
                tool: 'nova-matricula',
                status: 'error',
                message: 'Erro ao processar matrícula. Matrícula já realizada.'
            });
        }

        const docRef = await addDoc(alunosRef, {
            nome,
            cpf: cpf_limpo, 
            email,
            cursos
        });

        res.status(200).json({
            tool: 'nova-matricula',
            status: 'sucesso',
            message: `Bem vindo, ${nome}! Sua matrícula ${docRef.id} foi registrada com sucesso.`,
            dados: { matricula: docRef.id, nome, cpf: cpf_limpo, email, cursos }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            tool: 'nova-matricula',
            status: 'error',
            message: 'Erro interno ao processar a matrícula. Tente novamente mais tarde'
        });
    }
};

async function deletarAluno(req, res) {
    try {
        const { cpf } = req.query;

        if (!cpf) {
            return res.status(400).json({
                tool: 'deletar-aluno',
                status: 'error',
                message: 'O parâmetro CPF é obrigatório.'
            });
        }

        const cpf_limpo = cpf.replace(/\D/g,"")
        const alunosRef = collection(db, "alunos");
        const query_var = query(alunosRef, where("cpf", "==", cpf_limpo));
        const snapshot = await getDocs(query_var);

        if (snapshot.empty) {
            return res.status(404).json({
                tool: "deletar-aluno",
                status: "erro",
                message: "Aluno não encontrado."
            });
        }

        const docToDelete = snapshot.docs[0];
        await deleteDoc(doc(db, "alunos", docToDelete.id));

        return res.status(200).json({
            tool: "deletar-aluno",
            status: "sucesso",
            message: `Aluno ${docToDelete.data().nome}, com CPF ${cpf}, deletado com sucesso.`
        });

    } catch (error) {
        console.error("Erro ao deletar aluno", error);
        return res.status(500).json({
            tool: "deletar-aluno",
            status: "erro",
            message: "Erro interno ao tentar deletar o aluno."
        });
    }
};

export default {
  criarAluno, editarAluno, consultarAluno, deletarAluno
};
