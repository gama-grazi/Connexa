const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../database'); // Conexão com SQLite
const { sendConfirmationEmail } = require('../utils/email'); // Função fictícia para envio de email

// ...existing code...

// POST /api/usuarios/cadastro
router.post('/cadastro', async (req, res) => {
    const { email, senha } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    // Validação do email institucional
    if (!email.endsWith('@universidade.edu.br')) {
        return res.status(400).json({ erro: 'O email deve ser do domínio @universidade.edu.br.' });
    }

    // Validação da senha
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!senhaRegex.test(senha)) {
        return res.status(400).json({ erro: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números.' });
    }

    try {
        // Verificar duplicidade de email
        const usuarioExistente = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'Este email já está cadastrado.' });
        }

        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Salvar usuário no banco de dados
        await db.run('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, senhaHash]);

        // Enviar email de confirmação (simulado)
        sendConfirmationEmail(email);

        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso. Verifique seu email para confirmação.' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

module.exports = router;
