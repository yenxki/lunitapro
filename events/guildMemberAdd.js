const { EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/db');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const cfg = getGuildConfig(member.guild.id);
    if (!cfg.welcomeChannelId) return;
    const channel = member.guild.channels.cache.get(cfg.welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({ name: `¡Bienvenid@, ${member.user.username}!`, iconURL: member.user.displayAvatarURL({ size: 256 }) })
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setTitle('＜:Verify:1403559836096004206＞ ¡Te damos la bienvenida!')
      .setDescription([
        `¡Hola ${member}!`,
        'Nos alegra tenerte aquí en **' + member.guild.name + '** ✨',
        '• Lee las reglas y preséntate.',
        '• Reacciona a los anuncios y participa en la comunidad.',
        '• Si te gusta el contenido de **Gerasaurio**, ¡apoya y comparte!'
      ].join('\n'))
      .addFields(
        { name: 'Consejos', value: 'Usa `!help` para ver todos los comandos.\nConfigura tus notificaciones y échale un ojo a los canales fijados.' },
        { name: 'Cuenta', value: `Creada: <t:${Math.floor(member.user.createdTimestamp/1000)}:R>` }
      )
      .setFooter({ text: 'Lunita — bot oficial de la comunidad', iconURL: member.client.user.displayAvatarURL() })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  }
};
