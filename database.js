const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./banco.sqlite', (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite.');
        
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) console.error("Erro ao ativar foreign keys", err);
        });
    }
});


db.serialize(() => {
    
    // TABELA 1: Usuários
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        telefone TEXT,
        foto_perfil TEXT
    )`);

    // TABELA 2: Serviços
    db.run(`CREATE TABLE IF NOT EXISTS servicos (
        id_servico INTEGER PRIMARY KEY AUTOINCREMENT,
        id_prestador INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        descricao TEXT,
        endereco TEXT,
        preco REAL NOT NULL,
        preco_total REAL NOT NULL,
        imagem TEXT,
        FOREIGN KEY (id_prestador) REFERENCES usuarios (id_usuario)
    )`);

    // TABELA 3: Conversas (Precisa ser criada antes de Pedidos, pois Pedidos referencia ela)
    db.run(`CREATE TABLE IF NOT EXISTS conversas (
        id_conversa INTEGER PRIMARY KEY AUTOINCREMENT,
        id_cliente INTEGER NOT NULL,
        id_freelancer INTEGER NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_cliente) REFERENCES usuarios (id_usuario),
        FOREIGN KEY (id_freelancer) REFERENCES usuarios (id_usuario)
    )`);

    // TABELA 4: Pedidos
    db.run(`CREATE TABLE IF NOT EXISTS pedidos (
        id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
        id_servico INTEGER NOT NULL,
        id_prestador INTEGER NOT NULL,
        id_solicitante INTEGER NOT NULL,
        status_pedidos TEXT NOT NULL,
        id_conversa INTEGER,
        imagem TEXT,
        FOREIGN KEY (id_servico) REFERENCES servicos (id_servico),
        FOREIGN KEY (id_prestador) REFERENCES usuarios (id_usuario),
        FOREIGN KEY (id_solicitante) REFERENCES usuarios (id_usuario),
        FOREIGN KEY (id_conversa) REFERENCES conversas (id_conversa)
    )`);

    // TABELA 5: Mensagens
    db.run(`CREATE TABLE IF NOT EXISTS mensagens (
        id_mensagem INTEGER PRIMARY KEY AUTOINCREMENT,
        id_remetente INTEGER NOT NULL,
        id_destinatario INTEGER NOT NULL,
        conteudo TEXT NOT NULL,
        data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_remetente) REFERENCES usuarios (id_usuario),
        FOREIGN KEY (id_destinatario) REFERENCES usuarios (id_usuario)
    )`);

    // TABELA 6: Pagamentos
    db.run(`CREATE TABLE IF NOT EXISTS pagamentos (
        id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
        id_servico INTEGER NOT NULL,
        id_contratante INTEGER NOT NULL,
        id_transacao_mp TEXT,
        descricao TEXT,
        status_pagamento TEXT NOT NULL,
        valor_pago REAL,
        data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_servico) REFERENCES servicos (id_servico),
        FOREIGN KEY (id_contratante) REFERENCES usuarios (id_usuario)
    )`);

    console.log('✅ Estrutura de tabelas criada e verificada com sucesso!');
});

module.exports = db;