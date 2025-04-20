const venom = require('venom-bot');
const fetch = require('node-fetch');

// Inicia o Venom-Bot e o conecta ao WhatsApp com configurações adicionais
venom
  .create({
    session: 'sessionName',
    folderSession: './sessions',
  })
  .then((client) => start(client))
  .catch((error) => console.log('Erro ao iniciar o bot:', error));

function start(client) {
  console.log('Bot iniciado com sucesso!');

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Função para atendimento padrão
  async function atendimentoPadrao(client, msg, nome) {
    await delay(3000);
    client.sendText(
      msg.from,
      `Olá, ${nome}! Sou o assistente virtual da *Açaiteria Zaponi Intense*. Como posso ajudar você hoje? Digite uma das opções abaixo:\n\n` +
        `1 - Ver nosso cardápio\n` +
        `2 - Promoções do dia\n` +
        `3 - Horário de funcionamento\n` +
        `4 - Localização e contato\n` +
        `5 - Outras dúvidas`
    );
  }

  client.onMessage(async (msg) => {
    if (msg.from.endsWith('@c.us')) {
      const contact = await client.getContact(msg.from);
      const nome = contact.pushname?.split(" ")[0] || "Cliente";

      // Verifica se a mensagem corresponde a uma das opções pré-definidas
      if (/^(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)$/i.test(msg.body)) {
        await atendimentoPadrao(client, msg, nome);
      } else if (msg.body === '1') {
        await delay(3000);
        client.sendText(
          msg.from,
          `*Açaiteria Zaponi Intense - Cardápio*\n\n` +
          `*Açaí*\n Tamanhos:\n` +
          ` - 300ml: R$ 10,00\n` +
          ` - 500ml: R$ 15,00\n` +
          ` - 700ml: R$ 20,00\n` +
          ` - 1L: R$ 25,00\n\n` +
          `*Combos de Açaí:*\n` +
          ` - Açaí Fit: Banana, granola, mel - R$ 18,00\n` +
          ` - Açaí Tropical: Morango, kiwi, leite condensado - R$ 22,00\n` +
          ` - Açaí Especial: Leite em pó, paçoca, chocolate branco - R$ 25,00\n\n` +
          `*Complementos (cada):*\n` +
          ` - Frutas: Morango, banana, manga - R$ 3,00\n` +
          ` - Caldas: Leite condensado, chocolate, doce de leite - R$ 2,00\n` +
          ` - Grãos e Nuts: Granola, amendoim, castanha de caju - R$ 2,50\n\n` +
          `*Sorvetes*\n Bolas de Sorvete (cada):\n` +
          ` - Sabores Clássicos: Chocolate, Morango, Baunilha, Limão, Flocos - R$ 6,00\n` +
          ` - Sabores Especiais: Cookies & Cream, Menta com Chocolate, Doce de Leite - R$ 7,50\n\n` +
          `Sorvete no Pote:\n` +
          ` - 300ml: R$ 12,00\n` +
          ` - 500ml: R$ 18,00\n\n` +
          `*Milkshakes*\n Sabores: Chocolate, Morango, Ovomaltine, Baunilha, Nutella\n` +
          ` - Tamanho P (300ml): R$ 12,00\n` +
          ` - Tamanho M (500ml): R$ 15,00\n` +
          ` - Tamanho G (700ml): R$ 18,00\n\n` +
          `*Bebidas*\n` +
          ` - Sucos Naturais: R$ 8,00\n` +
          ` - Água de Coco: R$ 6,00\n` +
          ` - Refrigerantes: R$ 5,00\n` +
          ` - Chás Gelados: R$ 7,00`
        );
      } else if (msg.body === '2') {
        await delay(3000);
        client.sendText(
          msg.from,
          `🌟 *Promoções do Dia* 🌟\n\n` +
          `🍧 *Açaí em dobro* - Na compra de um açaí, o segundo sai pela metade do preço!\n` +
          `🍦 *Sorvete de 2 Litros* - De R$30,00 por R$25,00 (sabores limitados)\n\n` +
          `Essas ofertas são válidas apenas hoje! Aproveite!`
        );
      } else if (msg.body === '3') {
        await delay(3000);
        client.sendText(
          msg.from,
          `Nosso horário de funcionamento é:\n\n` +
          `🕒 Segunda a Sexta: 10:00 - 22:00\n` +
          `🕒 Sábado e Domingo: 12:00 - 23:00\n\n` +
          `Estamos ansiosos para atendê-lo!`
        );
      } else if (msg.body === '4') {
        await delay(3000);
        client.sendText(
          msg.from,
          `Você pode nos encontrar na seguinte localização:\n\n` +
          `📍 *Endereço:* R. Sandro Antônio Mendes, 175, Parque Vitoria Regia\n` +
          `📞 *Telefone:* (11) 1234-5678\n\n` +
          `Estamos sempre prontos para atendê-lo!`
        );
      } else if (msg.body === '5') {
        await delay(3000);
        client.sendText(
          msg.from,
          `Se você tiver outras dúvidas ou precisar de mais informações, fique à vontade para perguntar aqui ou ligar para nosso atendimento pelo número (11) 1234-5678.`
        );
      } else {
        // Caso a mensagem não corresponda a nenhuma opção, enviar para a API de IA
        try {
          const response = await fetch('https://bots.easy-peasy.ai/bot/d68ba378-65f0-48ef-8d7b-e80563b35345/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': '4ab87c4c-d729-46b2-963a-beaa40653b3d',
            },
            body: JSON.stringify({
              message: msg.body,
              history: [],
              stream: false,
            }),
          });

          const data = await response.json();
          const replyText = data.bot?.text || 'Desculpe, não consegui processar a resposta.';

          await client.sendText(msg.from, replyText);
        } catch (error) {
          console.error('Erro ao obter resposta do bot:', error);
          await client.sendText(msg.from, 'Desculpe, houve um erro ao processar sua mensagem.');
        }
      }
    }
  });
}
