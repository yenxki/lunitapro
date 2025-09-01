const { sendLog, addHistory } = require("../../utils/logger");

module.exports = {
  name: "kick",
  description: "Expulsa a un usuario del servidor.",
  category: "Mod",
  async execute({ client, message, args, createEmbed }) {
    if (!message.member.permissions.has("KickMembers")) return message.channel.send({
      embeds: [createEmbed(message.guild, `${client.emojisJSON.error} No tienes permisos.`, "Permisos insuficientes")]
    });

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send({ embeds: [createEmbed(message.guild, "Debes mencionar a un usuario válido.")] });

    const reason = args.slice(1).join(" ") || "No especificado";
    if (!member.kickable) return message.channel.send({ embeds: [createEmbed(message.guild, "No puedo expulsar a ese usuario.")] });

    await member.kick(reason);

    const embed = createEmbed(message.guild, `👢 ${member.user.tag} fue expulsado.\n📝 Razón: ${reason}\nModerador: ${message.author.tag}`, "Kick");
    message.channel.send({ embeds: [embed] });

    sendLog(client, message.guild, embed);
    addHistory(member.id, { type: "KICK", reason, moderator: message.author.tag });
  }
};
