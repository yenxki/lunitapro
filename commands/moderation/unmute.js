const { sendLog, addHistory } = require("../../utils/logger");

module.exports = {
  name: "unmute",
  description: "Quita el mute de un usuario.",
    category: "Mod",
  async execute({ client, message, args, createEmbed }) {
    if (!message.member.permissions.has("ModerateMembers")) return message.channel.send({
      embeds: [createEmbed(message.guild, `${client.emojisJSON.error} No tienes permisos.`, "Permisos insuficientes")]
    });

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send({ embeds: [createEmbed(message.guild, "Debes mencionar a un usuario válido.")] });

    await member.timeout(null);

    const embed = createEmbed(message.guild, `🔊 ${member.user.tag} ya no está muteado.\nModerador: ${message.author.tag}`, "Unmute");
    message.channel.send({ embeds: [embed] });

    sendLog(client, message.guild, embed);
    addHistory(member.id, { type: "UNMUTE", moderator: message.author.tag });
  }
};
