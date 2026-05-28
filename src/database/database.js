import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('frila.db');

export async function initDatabase() {
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            nome       TEXT NOT NULL,
            email      TEXT UNIQUE NOT NULL,
            senha      TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS servicos (
            id_servico   INTEGER PRIMARY KEY AUTOINCREMENT,
            id_prestador INTEGER NOT NULL,
            titulo       TEXT NOT NULL,
            descricao    TEXT,
            endereco     TEXT,
            preco        REAL NOT NULL,
            preco_total  REAL NOT NULL,
            imagem       TEXT,
            FOREIGN KEY (id_prestador) REFERENCES usuarios(id_usuario)
        );
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS mensagens (
            id_mensagem        INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario         INTEGER NOT NULL,
            contact_id         TEXT NOT NULL,
            chat_tipo          TEXT NOT NULL DEFAULT 'usuario',
            is_me              INTEGER NOT NULL DEFAULT 1,
            tipo               TEXT NOT NULL DEFAULT 'text',
            conteudo           TEXT,
            uri_imagem         TEXT,
            proposta_valor     REAL,
            proposta_descricao TEXT,
            proposta_status    TEXT DEFAULT 'pending',
            hora               TEXT NOT NULL,
            data_envio         DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS pedidos (
            id_pedido             INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario            INTEGER NOT NULL,
            nome_contato          TEXT NOT NULL,
            foto_id               TEXT DEFAULT 'FOTOFREELANCER1',
            status                TEXT NOT NULL DEFAULT 'Em Andamento',
            mensagem_cancelamento TEXT,
            motivo_reembolso      TEXT,
            mostrar_reembolso     INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        );
    `);

    // Migration: adiciona colunas cpf e telefone se ainda não existirem
    try { await db.execAsync(`ALTER TABLE usuarios ADD COLUMN cpf TEXT`); } catch (_) {}
    try { await db.execAsync(`ALTER TABLE usuarios ADD COLUMN telefone TEXT`); } catch (_) {}

    await db.runAsync(
        `INSERT OR IGNORE INTO usuarios (id_usuario, nome, email, senha)
         VALUES (1, 'Usuario Teste', 'henrique@teste.com', '123456')`
    );

    // Seed pedidos de exemplo para o usuário de teste
    await db.execAsync(`
        INSERT OR IGNORE INTO pedidos (id_pedido, id_usuario, nome_contato, foto_id, status, mensagem_cancelamento, motivo_reembolso, mostrar_reembolso)
        VALUES
            (1, 1, 'João Silva',    'HOMEM5',  'Em Andamento', '1 hora pra cancelar', null, 0),
            (2, 1, 'João Pedro',    'HOMEM4',  'Em Andamento', null, null, 1),
            (3, 1, 'Maria Santos',  'MULHER2', 'Concluído',    null, null, 0),
            (4, 1, 'Pedro Oliveira','HOMEM3',  'Cancelado',    null, null, 0),
            (5, 1, 'Ana Souza',     'MULHER1', 'Reembolso',    null, 'Aguardando análise do suporte', 0);
    `);

    // Seed: proposta fictícia do Andrey Silva para o usuário de teste
    await db.execAsync(`
        INSERT OR IGNORE INTO mensagens
            (id_mensagem, id_usuario, contact_id, chat_tipo, is_me, tipo,
             proposta_valor, proposta_descricao, proposta_status, hora, data_envio)
        VALUES
            (100, 1, '1', 'usuario', 0, 'proposal',
             150.00,
             'Olá! Ofereço meu serviço de desenvolvimento de landing page responsiva. Inclui 2 revisões e entrega em 5 dias úteis.',
             'pending', '10:30', '2024-01-01 10:30:00');
    `);
}

export async function createUser(nome, email, senha, cpf, telefone) {
    const result = await db.runAsync(
        `INSERT INTO usuarios (nome, email, senha, cpf, telefone) VALUES (?, ?, ?, ?, ?)`,
        [nome, email.trim().toLowerCase(), senha, cpf ?? null, telefone ?? null]
    );
    return result.lastInsertRowId;
}

export async function getUserByEmailAndSenha(email, senha) {
    return await db.getFirstAsync(
        'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
        [email, senha]
    );
}

export async function getUserById(id) {
    return await db.getFirstAsync(
        'SELECT * FROM usuarios WHERE id_usuario = ?',
        [id]
    );
}

export async function updateUser(id, nome, telefone) {
    const result = await db.runAsync(
        'UPDATE usuarios SET nome = ?, telefone = ? WHERE id_usuario = ?',
        [nome, telefone ?? null, id]
    );
    return result.changes > 0;
}

export async function updateUserPassword(id, novaSenha) {
    const result = await db.runAsync(
        'UPDATE usuarios SET senha = ? WHERE id_usuario = ?',
        [novaSenha, id]
    );
    return result.changes > 0;
}

export async function createServico(id_prestador, titulo, descricao, endereco, preco, preco_total, imagem) {
    const result = await db.runAsync(
        `INSERT INTO servicos (id_prestador, titulo, descricao, endereco, preco, preco_total, imagem)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id_prestador, titulo, descricao ?? null, endereco ?? null, preco, preco_total, imagem ?? null]
    );
    return result.lastInsertRowId;
}

export async function getAllServicos(id_prestador) {
    return await db.getAllAsync(
        'SELECT * FROM servicos WHERE id_prestador = ? ORDER BY id_servico DESC',
        [id_prestador]
    );
}

export async function getServicoById(id_servico) {
    return await db.getFirstAsync(
        'SELECT * FROM servicos WHERE id_servico = ?',
        [id_servico]
    );
}

export async function updateServico(id_servico, titulo, descricao, endereco, preco, preco_total, imagem) {
    const result = await db.runAsync(
        `UPDATE servicos
         SET titulo = ?, descricao = ?, endereco = ?, preco = ?, preco_total = ?, imagem = ?
         WHERE id_servico = ?`,
        [titulo, descricao ?? null, endereco ?? null, preco, preco_total, imagem ?? null, id_servico]
    );
    return result.changes > 0;
}

// ── Mensagens ──────────────────────────────────────────────────────────────

export async function getMensagens(idUsuario, contactId, chatTipo) {
    const rows = await db.getAllAsync(
        `SELECT * FROM mensagens
         WHERE id_usuario = ? AND contact_id = ? AND chat_tipo = ?
         ORDER BY data_envio ASC`,
        [idUsuario, contactId, chatTipo]
    );
    return rows.map(row => {
        if (row.tipo === 'image') {
            return { id: row.id_mensagem, type: 'image', uri: row.uri_imagem, time: row.hora, isMe: row.is_me === 1 };
        }
        if (row.tipo === 'proposal') {
            return {
                id: row.id_mensagem,
                type: 'proposal',
                proposal: { value: row.proposta_valor, description: row.proposta_descricao, time: row.hora, status: row.proposta_status },
                isMe: row.is_me === 1,
                time: row.hora
            };
        }
        return { id: row.id_mensagem, text: row.conteudo, time: row.hora, isMe: row.is_me === 1, type: 'text' };
    });
}

export async function addMensagem(idUsuario, contactId, chatTipo, isMe, tipo, dados, hora) {
    const result = await db.runAsync(
        `INSERT INTO mensagens (id_usuario, contact_id, chat_tipo, is_me, tipo, conteudo, uri_imagem, proposta_valor, proposta_descricao, proposta_status, hora)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        [idUsuario, contactId, chatTipo, isMe ? 1 : 0, tipo,
         dados.conteudo ?? null, dados.uri ?? null,
         dados.propostaValor ?? null, dados.propostaDescricao ?? null, hora]
    );
    return result.lastInsertRowId;
}

export async function updatePropostaStatus(idMensagem, status) {
    await db.runAsync(
        'UPDATE mensagens SET proposta_status = ? WHERE id_mensagem = ?',
        [status, idMensagem]
    );
}

// ── Pedidos ────────────────────────────────────────────────────────────────

export async function addPedido(idUsuario, nomeContato, fotoId, status) {
    const result = await db.runAsync(
        `INSERT INTO pedidos (id_usuario, nome_contato, foto_id, status)
         VALUES (?, ?, ?, ?)`,
        [idUsuario, nomeContato, fotoId ?? 'FOTOFREELANCER1', status ?? 'Em Andamento']
    );
    return result.lastInsertRowId;
}

export async function getPedidosByUsuario(idUsuario) {
    return await db.getAllAsync(
        'SELECT * FROM pedidos WHERE id_usuario = ? ORDER BY id_pedido DESC',
        [idUsuario]
    );
}

export async function updatePedidoStatus(idPedido, status) {
    const result = await db.runAsync(
        'UPDATE pedidos SET status = ? WHERE id_pedido = ?',
        [status, idPedido]
    );
    return result.changes > 0;
}

export async function seedPropostaAndrey(userId) {
    const existing = await db.getFirstAsync(
        `SELECT id_mensagem FROM mensagens WHERE id_usuario = ? AND contact_id = '1' AND tipo = 'proposal'`,
        [userId]
    );
    if (existing) return;
    await db.runAsync(
        `INSERT INTO mensagens
            (id_usuario, contact_id, chat_tipo, is_me, tipo,
             proposta_valor, proposta_descricao, proposta_status, hora, data_envio)
         VALUES (?, '1', 'usuario', 0, 'proposal', 150.00, ?, 'pending', '10:30', '2024-01-01 10:30:00')`,
        [userId, 'Olá! Ofereço meu serviço de desenvolvimento de landing page responsiva. Inclui 2 revisões e entrega em 5 dias úteis.']
    );
}

// ── Serviços ───────────────────────────────────────────────────────────────

export async function deleteServico(id_servico) {
    const result = await db.runAsync(
        'DELETE FROM servicos WHERE id_servico = ?',
        [id_servico]
    );
    return result.changes > 0;
}
