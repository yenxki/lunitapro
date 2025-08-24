const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { setGuildConfig } = require('../utils/db');

module.exports = {
  name: 'welcome-config',
  category: 'Configuración',
  description: 'Configura el canal de bienvenida.',
  usage: '!welcome-config #canal',
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0xE74C3C).setTitle('＜:lock_IDS:1403559848318205984＞ Solo administradores')
      ]});
    }

    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.channel.send({ embeds: [
        new EmbedBuilder().setColor(0xE67E22).setDescription('Uso: `!welcome-config #canal`')
      ]});
    }

    const cfg = setGuildConfig(message.guild.id, { welcomeChannelId: channel.id });
    return message.channel.send({ embeds: [
      new EmbedBuilder().setColor(0x2ECC71).setDescription(`Canal de bienvenida establecido en ${channel}.`)
    ]});
  }
};
