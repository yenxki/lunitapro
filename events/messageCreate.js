const fs = require("fs");
const path = require("path");
const { sendLog, addHistory } = require("../utils/logger");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../config.json");

const forbiddenWords = ["idiota","imbecil","pendejo","malparido","hdp","mierda","estupido","perra","puto","puta","cabrón","bastardo"];

module.exports = async (client, message) => {
  if (message.author.bot || !message.guild) return;

  const warnsPath = path.join(__dirname, "../data/warns.json");
  let warns = JSON.parse(fs.readFileSync(warnsPath, "utf8"));

  // 🔹 AutoWarn
  if (forbiddenWords.some(w => message.content.toLowerCase().includes(w))) {
    const userId = message.author.id;
    if (!warns[userId]) warns[userId] = 0;
    warns[userId]++;
    fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));

    const embed = client.createEmbed(
      message.guild,
      `⚠️ ${message.author.tag} ha recibido un **warn automático**.\nActualmente tiene **${warns[userId]} warns**.`,
      "AutoWarn"
    );

    message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 60000));

    const member = message.guild.members.cache.get(userId);
    if (member && member.moderatable) {
      if (warns[userId] === 3) member.timeout(5 * 60 * 1000, "Acumuló 3 warns");
      if (warns[userId] === 5) member.timeout(10 * 60 * 1000, "Acumuló 5 warns");
      if (warns[userId] === 7) member.timeout(15 * 60 * 1000, "Acumuló 7 warns");
    }

    sendLog(client, message.guild, embed);
    addHistory(userId, { type: "AUTOWARN", reason: "Lenguaje inapropiado", moderator: "Sistema" });
  }

  // 🔹 Sistema de Sugerencias
  if (message.channel.id === config.suggestionsChannelId) {
    const suggestionText = message.content;
    const wordCount = suggestionText.split(/\s+/).length;

    if (wordCount > 100) {
      await message.reply("❌ La sugerencia no puede tener más de 100 palabras.").then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 5000);
      });
      return message.delete().catch(() => {});
    }

    await message.delete().catch(() => {});

    const embed = new EmbedBuilder()
      .setColor("#00bcd4")
      .setAuthor({ name: `Nueva sugerencia de ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setDescription(`📢 **Sugerencia:**\n${suggestionText}`)
      .addFields({ name: "Estado", value: "⏳ Pendiente de ser revisada por los administradores." })
      .setFooter({ text: "Sistema de sugerencias", iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("approve_suggestion").setLabel("Aprobar").setStyle(ButtonStyle.Success).setEmoji("✅"),
      new ButtonBuilder().setCustomId("reject_suggestion").setLabel("Rechazar").setStyle(ButtonStyle.Danger).setEmoji("❌")
    );

    return message.channel.send({ embeds: [embed], components: [row] });
  }

  // 🔹 Command Handler
  if (!message.content.startsWith(client.prefix)) return;
  const args = message.content.slice(client.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;

  const { defaultCooldown } = require("../config.json");
  if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Map());
  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || defaultCooldown) * 1000;

  if (!message.member.permissions.has("Administrator")) {
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = Math.ceil((expirationTime - now) / 1000);
        return message.channel.send({
          embeds: [client.createEmbed(message.guild, `⏳ Espera **${timeLeft}s** para volver a usar este comando.`, "Cooldown")]
        });
      }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  try {
    await command.execute({ client, message, args, createEmbed: client.createEmbed });
  } catch (err) {
    console.error(err);
  }
};
