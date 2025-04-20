const venom = require('venom-bot');
const fetch = require('node-fetch');

// Inicia o Venom-Bot e o conecta ao WhatsApp com configurações adicionais
venom
  .create(
    'sessionName', // Nome da sessão
    undefined, // Código QR (opcional)
    undefined, // Suporte ao multidevice (opcional)
    { 
      folderSession: './sessions', // Especifica a pasta onde a sessão será salva
      headless: false // Opcional, define o navegador visível para escanear o QR
    }
  )
  .then((client) => {
    console.log("Venom iniciado com sucesso!");
    start(client);
  })
  .catch((error) => {
    console.error('Erro ao iniciar o bot:', error);
  });

// Função principal que lida com as mensagens
function start(client) {
  console.log("Bot iniciado com sucesso!");

  client.onMessage(async (message) => {
    // Verifica se message.body está definido
    if (!message.body) {
      console.log("Mensagem recebida não contém body:", message);
      return; // Sai da função se message.body for undefined
    }
    
    console.log("Mensagem recebida:", message.body);

    // Função para enviar o menu inicial
    const sendMainMenu = async (from, name) => {
      console.log("Enviando menu inicial para:", from);
      await client.sendText(
        from,
        `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da *Açaiteria Zaponi Intense*. Como posso ajudar você hoje? Digite uma das opções abaixo:\n\n` +
          `1 - Ver nosso cardápio\n` +
          `2 - Promoções do dia\n` +
          `3 - Horário de funcionamento\n` +
          `4 - Localização e contato\n` +
          `5 - Outras dúvidas\n` +
          `6 - Voltar ao menu inicial`
      );
    };

    // Verifica se a mensagem contém palavras-chave de saudação para enviar o menu inicial
    if (
      message.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) &&
      !message.isGroupMsg
    ) {
      const contact = await client.getContact(message.from);
      const name = contact.pushname;
      await sendMainMenu(message.from, name);
    }

    // Funil de atendimento com base na escolha do usuário
    if (message.body === '1' && !message.isGroupMsg) {
      await client.sendText(
        message.from,
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
          ` - Chás Gelados: R$ 7,00\n\nDigite "6" para voltar ao menu inicial.`
      );
    } else if (message.body === '2' && !message.isGroupMsg) {
      await client.sendText(
        message.from,
        `🌟 *Promoções do Dia* 🌟\n\n` +
          `🍧 *Açaí em dobro* - Na compra de um açaí, o segundo sai pela metade do preço!\n` +
          `🍦 *Sorvete de 2 Litros* - De R$30,00 por R$25,00 (sabores limitados)\n\n` +
          `Essas ofertas são válidas apenas hoje! Aproveite!\n\nDigite "6" para voltar ao menu inicial.`
      );
    } else if (message.body === '3' && !message.isGroupMsg) {
      await client.sendText(
        message.from,
        `Nosso horário de funcionamento é:\n\n` +
          `🕒 Segunda a Sexta: 10:00 - 22:00\n` +
          `🕒 Sábado e Domingo: 12:00 - 23:00\n\n` +
          `Estamos ansiosos para atendê-lo!\n\nDigite "6" para voltar ao menu inicial.`
      );
    } else if (message.body === '4' && !message.isGroupMsg) {
      await client.sendText(
        message.from,
        `Você pode nos encontrar na seguinte localização:\n\n` +
          `📍 *Endereço:* Rua Principal, 123, Centro\n` +
          `📞 *Telefone:* (11) 1234-5678\n\n` +
          `Estamos sempre prontos para atendê-lo!\n\nDigite "6" para voltar ao menu inicial.`
      );
    } else if (message.body === '5' && !message.isGroupMsg) {
      // Integração com a API para outras dúvidas
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

        // Extrai o texto da resposta da API para enviar ao WhatsApp
        const replyText = data.bot?.text || 'Desculpe, não consegui processar a resposta.';

        console.log("Resposta recebida da API:", replyText);

        // Envia apenas o texto extraído para o WhatsApp
        await client.sendText(message.from, `${replyText}\n\nDigite "6" para voltar ao menu inicial.`);
      } catch (error) {
        console.error('Erro ao obter resposta do bot:', error);
        await client.sendText(message.from, 'Desculpe, houve um erro ao processar sua mensagem.\n\nDigite "6" para voltar ao menu inicial.');
      }
    } else if (message.body === '6' && !message.isGroupMsg) {
      // Retorna ao menu inicial
      const contact = await client.getContact(message.from);
      const name = contact.pushname;
      await sendMainMenu(message.from, name);
    }
  });
}
