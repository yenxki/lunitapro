const fs = require("fs");
const path = require("path");
const { sendLog, addHistory } = require("../../utils/logger");

module.exports = {
  name: "warn",
  description: "Agrega un warn manual a un usuario.",
    category: "Mod",
  async execute({ client, message, args, createEmbed }) {
    if (!message.member.permissions.has("ModerateMembers")) return message.channel.send({
      embeds: [createEmbed(message.guild, `${client.emojisJSON.error} No tienes permisos.`, "Permisos insuficientes")]
    });

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send({ embeds: [createEmbed(message.guild, "Debes mencionar a un usuario válido.")] });

    const reason = args.slice(1).join(" ") || "No especificado";
    const warnsPath = path.join(__dirname, "../../data/warns.json");
    let warns = JSON.parse(fs.readFileSync(warnsPath, "utf8"));
    if (!warns[member.id]) warns[member.id] = 0;
    warns[member.id]++;
    fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));

    message.delete().catch(() => {});
    const embed = createEmbed(message.guild, `⚠️ ${member.user.tag} ha recibido un **warn**.\n📝 Razón: ${reason}\nActualmente tiene **${warns[member.id]} warns**.`, "Warn manual");
    message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 60000));

    if (member.moderatable) {
      if (warns[member.id] === 3) member.timeout(5 * 60 * 1000, "Acumuló 3 warns");
      if (warns[member.id] === 5) member.timeout(10 * 60 * 1000, "Acumuló 5 warns");
      if (warns[member.id] === 7) member.timeout(15 * 60 * 1000, "Acumuló 7 warns");
    }

    sendLog(client, message.guild, embed);
    addHistory(member.id, { type: "WARN", reason, moderator: message.author.tag });
  }
};
