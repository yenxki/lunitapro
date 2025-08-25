const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'mute',
  aliases: ['silence', 'silenciar'],
  description: 'Silencia temporalmente a un usuario mencionado.',
  usage: '!mute @usuario <duración en minutos> <razón>',
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.channel.send('❌ No tienes permisos para usar este comando.');
    }

    const user = message.mentions.members.first();
    if (!user) return message.channel.send('❌ Debes mencionar a alguien.');

    const durationArg = args[1];
    if (!durationArg || isNaN(durationArg)) return message.channel.send('❌ Debes especificar la duración en minutos.');

    const duration = parseInt(durationArg); // duración en minutos
    const reason = args.slice(2).join(' ') || 'No especificada';

    if (!user.moderatable) return message.channel.send('❌ No puedo silenciar a este usuario.');

    try {
      await user.timeout(duration * 60 * 1000, reason); // convertir minutos a milisegundos

      const embed = new EmbedBuilder()
        .setColor('#F59E0B')
        .setAuthor({ name: '🔇 Usuario silenciado', iconURL: user.displayAvatarURL() })
        .setDescription(`**${user.user.tag}** ha sido silenciado por **${duration} minuto(s)**.\n**Razón:** ${reason}`)
        .setFooter({ text: `Moderador: ${message.author.tag}` })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.channel.send('❌ Ocurrió un error al intentar silenciar al usuario.');
    }
  },
};
