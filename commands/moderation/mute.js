const { sendLog, addHistory } = require("../../utils/logger");
const ms = require("ms");

module.exports = {
  name: "mute",
  description: "Silencia a un usuario temporalmente.",
    category: "Mod",
  async execute({ client, message, args, createEmbed }) {
    if (!message.member.permissions.has("ModerateMembers")) return message.channel.send({
      embeds: [createEmbed(message.guild, `${client.emojisJSON.error} No tienes permisos.`, "Permisos insuficientes")]
    });

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send({ embeds: [createEmbed(message.guild, "Debes mencionar a un usuario válido.")] });

    const time = args[1] || "10m";
    const reason = args.slice(2).join(" ") || "No especificado";

    if (!ms(time)) return message.channel.send({ embeds: [createEmbed(message.guild, "Formato de tiempo inválido.")] });

    await member.timeout(ms(time), reason);

    const embed = createEmbed(message.guild, `🔇 ${member.user.tag} fue muteado por **${time}**.\n📝 Razón: ${reason}\nModerador: ${message.author.tag}`, "Mute");
    message.channel.send({ embeds: [embed] });

    sendLog(client, message.guild, embed);
    addHistory(member.id, { type: "MUTE", reason, moderator: message.author.tag, duration: time });
  }
};
