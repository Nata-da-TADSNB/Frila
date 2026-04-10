# Execução do Projeto Frila

Abra ambos os Projetos (Front e Back) separados no VS Code e siga a ordem abaixo:

---

## Iniciar o Servidor frila-api
Abra um terminal e execute:

```bash
node server.js
```

---

## Iniciar o Servidor Ngrok
Abra um novo terminal e execute
```bash
npx ngrok http 3000
```

**Nota:**
Copie a URL gerada na linha `Forwarding`, por exemplo:

```
https://xxxx.ngrok-free.app
```

---

## 📱 Frontend (Mobile)

1. Abra o arquivo `.env` na pasta `Frila`

2. Atualize a variável com a URL copiada no passo anterior:

```env
EXPO_PUBLIC_API_URL=https://SUA_URL_COPIADA.app
```

3. Inicie o aplicativo limpando o cache:

```bash
cd Frila
npx expo start -c --tunnel
```

---

## 📷 Execução

* Escaneie o QR Code com o aplicativo **Expo Go**
* O app será iniciado no seu dispositivo

---

## ⚠️ Observações

* Sempre que reiniciar o Ngrok, a URL será alterada
* Atualize o `.env` novamente sempre que isso acontecer
