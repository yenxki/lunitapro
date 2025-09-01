const { getHistory } = require("../../utils/logger");

module.exports = {
  name: "history",
  description: "Muestra el historial de acciones de un usuario.",
      category: "Mod",
  async execute({ client, message, args, createEmbed }) {
    if (!message.member.permissions.has("ModerateMembers")) return message.channel.send({
      embeds: [createEmbed(message.guild, "No tienes permisos para usar este comando.", "Permisos insuficientes")]
    });

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send({ embeds: [createEmbed(message.guild, "Debes mencionar a un usuario válido.", "Uso: !history @usuario")] });

    const history = getHistory(member.id);
    if (!history.length) return message.channel.send({ embeds: [createEmbed(message.guild, `${member.user.tag} no tiene historial de acciones.`, "Historial")] });

    const desc = history.map((h, i) => `**${i + 1}.** [${h.date}] ${h.type} por ${h.moderator}\n📝 Razón: ${h.reason}${h.duration ? `\n⏱ Duración: ${h.duration}` : ""}`).join("\n\n");
    message.channel.send({ embeds: [createEmbed(message.guild, desc, `Historial de ${member.user.tag}`)] });
  }
};
