// commands/admin/setprefix.js
const fs = require('fs');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const prefixes = require('../../data/prefixes.json');

module.exports = {
  name: 'setprefix',
  aliases: ['changeprefix', 'prefix'],
  description: 'Cambia el prefijo del bot para este servidor, quedará guardado en la base local.',
  usage: '!setprefix <nuevo_prefijo>',
  run: (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const noPerms = new EmbedBuilder()
        .setColor('#E11D48')
        .setTitle('Permisos insuficientes')
        .setDescription('Necesitas el permiso **Administrador** para ejecutar este comando.')
        .setFooter({ text: `Solicitado por ${message.author.tag}` })
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] });
    }

    const nuevo = args[0];
    if (!nuevo) {
      const falta = new EmbedBuilder()
        .setColor('#F59E0B')
        .setTitle('Falta el nuevo prefijo')
        .setDescription(
          'Debes indicar el **nuevo prefijo** que deseas usar en este servidor.\n\n' +
          'Ejemplo: `!setprefix ?`'
        )
        .setFooter({ text: 'Consejo: usa un prefijo corto' })
        .setTimestamp();
      return message.channel.send({ embeds: [falta] });
    }

    prefixes[message.guild.id] = nuevo;
    fs.writeFileSync('./data/prefixes.json', JSON.stringify(prefixes, null, 2));

    const ok = new EmbedBuilder()
      .setColor('#10B981')
      .setTitle('Prefijo actualizado correctamente')
      .setDescription(
        `A partir de ahora el prefijo en **${message.guild.name}** será: \`${nuevo}\`\n\n` +
        `Ejemplo: \`${nuevo}help\` • \`${nuevo}redes\``
      )
      .setTimestamp();

    message.channel.send({ embeds: [ok] });
  },
};
