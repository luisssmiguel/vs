const venom = require('venom-bot');

// Inicia o cliente Venom
venom
  .create({
    session: 'sessionName', // Nome da sessão para evitar problemas com o caminho padrão
    folderSession: './sessions', // Pasta onde a sessão será armazenada
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  console.log('Tudo certo! WhatsApp conectado.');

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Funil de atendimento para a sorveteria
  client.onMessage(async (msg) => {
    if (
      msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) &&
      msg.from.endsWith('@c.us')
    ) {
      await delay(3000);
      const contact = await client.getContact(msg.from);
      const name = contact.pushname;

      client.sendText(
        msg.from,
        `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da *Açaiteria Zaponi Intense*. Como posso ajudar você hoje? Digite uma das opções abaixo:\n\n` +
          `1 - Ver nosso cardápio\n` +
          `2 - Promoções do dia\n` +
          `3 - Horário de funcionamento\n` +
          `4 - Localização e contato\n` +
          `5 - Outras dúvidas`
      );
    }

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
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
    }

    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
      await delay(3000);
      client.sendText(
        msg.from,
        `🌟 *Promoções do Dia* 🌟\n\n` +
          `🍧 *Açaí em dobro* - Na compra de um açaí, o segundo sai pela metade do preço!\n` +
          `🍦 *Sorvete de 2 Litros* - De R$30,00 por R$25,00 (sabores limitados)\n\n` +
          `Essas ofertas são válidas apenas hoje! Aproveite!`
      );
    }

    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
      await delay(3000);
      client.sendText(
        msg.from,
        `Nosso horário de funcionamento é:\n\n` +
          `🕒 Segunda a Sexta: 10:00 - 22:00\n` +
          `🕒 Sábado e Domingo: 12:00 - 23:00\n\n` +
          `Estamos ansiosos para atendê-lo!`
      );
    }

    if (msg.body === '4' && msg.from.endsWith('@c.us')) {
      await delay(3000);
      client.sendText(
        msg.from,
        `Você pode nos encontrar na seguinte localização:\n\n` +
          `📍 *Endereço:* Rua Principal, 123, Centro\n` +
          `📞 *Telefone:* (11) 1234-5678\n\n` +
          `Estamos sempre prontos para atendê-lo!`
      );
    }

    if (msg.body === '5' && msg.from.endsWith('@c.us')) {
      await delay(3000);
      client.sendText(
        msg.from,
        `Se você tiver outras dúvidas ou precisar de mais informações, fique à vontade para perguntar aqui ou ligar para nosso atendimento pelo número (11) 1234-5678.`
      );
    }
  });
}
