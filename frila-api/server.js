const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();

app.use(cors());
app.use(express.json());

//USUARIO DE TESTE
db.run(`INSERT OR IGNORE INTO usuarios (id_usuario, nome, cpf, email, senha)
        VALUES (1, 'Usuario Teste', '111.111.111-11', 'henrique@teste.com', '123456')`);

app.post('/servicos', (req, res) => {

    const { id_prestador, titulo, descricao, endereco, preco, preco_total, imagem } = req.body;
    console.log("Recebendo novo serviço:", titulo);


    const sql = `INSERT INTO servicos (id_prestador, titulo, descricao, endereco, preco, preco_total, imagem)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [id_prestador, titulo, descricao, endereco, preco, preco_total, imagem];

    db.run(sql, values, function(err) {
        if (err) {
            console.error("Erro ao salvar:", err.message);
            return res.status(500).json({ erro: 'Erro ao salvar no banco de dados.' });
        }

        console.log(`✅ Serviço salvo com sucesso! ID: ${this.lastID}`);

        res.status(201).json({
            mensagem: 'Serviço criado com sucesso!',
            id_servico: this.lastID
        });
    });
});

app.listen(3000, () => {
    console.log("🚀 Servidor da API rodando na porta 3000");
});