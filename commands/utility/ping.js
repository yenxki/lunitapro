module.exports = {
  name: 'ping',
  description: 'Muestra la latencia del bot.',
  cooldown: 3,
    category: "Todos",
  async execute({ client, message, createEmbed }) {
    const sent = await message.channel.send({ embeds: [createEmbed(message.guild, '🏓 Calculando...', 'Ping')] });
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const api = Math.round(client.ws.ping);
    const embed = createEmbed(message.guild, `**Latencia mensaje:** ${latency}ms\n**Latencia API:** ${api}ms`, 'Pong 🏓');
    sent.edit({ embeds: [embed] });
  }
};
