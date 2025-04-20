const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const venom = require('venom-bot');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let clientWhatsApp;

// Iniciar o Venom-Bot e gerar o QR Code
venom
  .create(
    'sessionName',
    (base64Qr, asciiQR) => {
      console.log('QR Code gerado:', asciiQR); // QR Code no terminal
      io.emit('qrCode', base64Qr); // Envia o QR Code para o frontend
    },
    undefined,
    { folderSession: 'sessions' }
  )
  .then((client) => {
    clientWhatsApp = client;
    listenMessages(client); // Função para gerenciar mensagens
  })
  .catch((error) => console.error('Erro ao iniciar o Venom-Bot:', error));

// Função para gerenciar mensagens recebidas e enviá-las para o frontend
function listenMessages(client) {
  client.onMessage((message) => {
    io.emit('receivedMessage', message); // Envia a mensagem recebida para o frontend
  });
}

// Rota para enviar mensagens do frontend para o WhatsApp
app.post('/send-message', express.json(), async (req, res) => {
  const { number, text } = req.body;
  try {
    await clientWhatsApp.sendText(number + '@c.us', text);
    res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao enviar mensagem', error });
  }
});

// Servir o frontend (construído com React ou Vue)
app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
