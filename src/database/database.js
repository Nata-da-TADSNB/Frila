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

    await db.runAsync(
        `INSERT OR IGNORE INTO usuarios (id_usuario, nome, email, senha)
         VALUES (1, 'Usuario Teste', 'henrique@teste.com', '123456')`
    );
}

export async function getUserByEmailAndSenha(email, senha) {
    return await db.getFirstAsync(
        'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
        [email, senha]
    );
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

export async function deleteServico(id_servico) {
    const result = await db.runAsync(
        'DELETE FROM servicos WHERE id_servico = ?',
        [id_servico]
    );
    return result.changes > 0;
}
