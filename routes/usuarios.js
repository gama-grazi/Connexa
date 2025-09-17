const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database'); // Assumindo que há um módulo para interagir com o banco de dados
const router = express.Router();

router.post('/cadastro', async (req, res) => {
    const { email, senha } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    // Validação do domínio do email
    if (!email.endsWith('@universidade.edu.br')) {
        return res.status(400).json({ erro: 'O email deve ser do domínio @universidade.edu.br.' });
    }

    try {
        // Verificar se o email já existe no banco de dados
        const usuarioExistente = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Email já cadastrado.' });
        }

        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Inserir o novo usuário no banco de dados
        await db.run('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, senhaHash]);

        // Responder com sucesso
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso. Verifique seu email para confirmação.' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

module.exports = router;
