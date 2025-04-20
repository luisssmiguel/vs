const venom = require('venom-bot');
const fetch = require('node-fetch');

venom
  .create(
    'sessionName',
    undefined,
    undefined,
    {
      folderSession: 'sessions',
      headless: 'new', // ✅ CORRETO para Chrome v112+
      browserArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
        '--headless=new' // ✅ Compatível com o novo modo headless
      ],
    }
  )
  .then((client) => start(client))
  .catch((error) => {
    console.error('Erro ao iniciar o bot:', error);
  });

function start(client) {
  console.log("Bot iniciado com sucesso!");

  client.onMessage(async (message) => {
    console.log("Mensagem recebida:", message.body);

    if (message.body && !message.isGroupMsg) {
      try {
        console.log("Enviando mensagem para a API:", message.body);

        const response = await fetch('https://bots.easy-peasy.ai/bot/d68ba378-65f0-48ef-8d7b-e80563b35345/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '4ab87c4c-d729-46b2-963a-beaa40653b3d',
          },
          body: JSON.stringify({
            message: message.body,
            history: [],
            stream: false,
          }),
        });

        const data = await response.json();
        const replyText = data.bot?.text || 'Desculpe, não consegui processar a resposta.';

        console.log("Resposta recebida da API:", replyText);
        await client.sendText(message.from, replyText);

      } catch (error) {
        console.error('Erro ao obter resposta do bot:', error);
        await client.sendText(message.from, 'Desculpe, houve um erro ao processar sua mensagem.');
      }
    }
  });
}