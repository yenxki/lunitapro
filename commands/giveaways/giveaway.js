import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import fs from "fs";
const dataPath = "./data/guilds.json";

export default {
  name: "giveaway",
  description: "Crea un sorteo interactivo con animación, mostrando los últimos 10 participantes y el canal donde reclamar el premio.",
  async execute(message, args) {
    if (args.length < 3) return message.reply("Uso: `!giveaway <segundos animación> <mensaje (mínimo 2 palabras)> <URL imagen>`");

    const duration = parseInt(args[0]);
    if (isNaN(duration) || duration <= 0) return message.reply("Debes indicar un número válido de segundos para la animación.");

    const prize = args.slice(1, -1).join(" ");
    if (prize.split(" ").length < 2) return message.reply("El mensaje del sorteo debe tener al menos 2 palabras.");

    const imageURL = args[args.length - 1];
    const participants = [];

    const encouragement = `🎉 ¡Atención a todos! Este sorteo es una oportunidad increíble para ganar algo especial. Participa haciendo clic en el botón y únete a la diversión. Solo el ganador y el host podrán reclamar el premio en el canal privado. ¡No te lo pierdas!`;

    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle("🎁 ¡Sorteo Increíble!")
      .setDescription(`${encouragement}\n\n🎁 Premio: **${prize}**\n\nSorteo hosteado por: ${message.author}`)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setImage(imageURL)
      .addFields({ name: "Participantes", value: "Aún no hay participantes..." });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("join_giveaway").setLabel("🎉 Participar").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("start_giveaway").setLabel("🚀 Empezar Sorteo").setStyle(ButtonStyle.Primary)
    );

    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({ time: 3600000 });

    collector.on("collect", async (i) => {
      if (i.customId === "join_giveaway") {
        if (!participants.includes(i.user)) participants.push(i.user);

        const last10 = participants.slice(-10).map(u => u.username).join("\n");
        const others = participants.length > 10 ? participants.length - 10 : 0;
        const participantText = others > 0 ? `${last10}\n...y otros ${others} participando en el sorteo` : last10 || "Aún no hay participantes...";

        const updatedEmbed = EmbedBuilder.from(embed).spliceFields(0, 1, { name: "Participantes", value: participantText });
        await msg.edit({ embeds: [updatedEmbed] });
        return i.reply({ content: "✅ Te uniste al sorteo.", ephemeral: true });
      }

      if (i.customId === "start_giveaway") {
        if (i.user.id !== message.author.id) return i.reply({ content: "Solo el creador del sorteo puede iniciar el sorteo.", ephemeral: true });
        await i.deferUpdate();

        if (participants.length === 0) return message.channel.send("❌ No hay participantes.");

        // Animación
        const startTime = Date.now();
        while ((Date.now() - startTime) / 1000 < duration) {
          const randomWinner = participants[Math.floor(Math.random() * participants.length)];
          const animEmbed = EmbedBuilder.from(embed)
            .setDescription(`${encouragement}\n\n🎁 Premio: **${prize}**\n\nSorteo hosteado por: ${message.author}\n\n🔄 Sorteando... ${randomWinner}`)
            .spliceFields(0, 1, { name: "Participantes", value: participants.slice(-10).map(u => u.username).join("\n") + (participants.length > 10 ? `\n...y otros ${participants.length - 10} participando en el sorteo` : "") });
          await msg.edit({ embeds: [animEmbed], components: [row] });
          await new Promise(r => setTimeout(r, 500));
        }

        // Ganador final
        const winner = participants[Math.floor(Math.random() * participants.length)];
        let channelMention = "";
        const guildsConfig = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        const categoryName = guildsConfig[message.guild.id]?.giveawayCategory;

        if (categoryName) {
          const category = message.guild.channels.cache.find(ch => ch.name === categoryName && ch.type === 4);
          if (category) {
            const winnerChannel = await message.guild.channels.create({
              name: `ganador-${winner.username}`,
              type: 0,
              parent: category.id,
              permissionOverwrites: [
                { id: message.guild.roles.everyone.id, deny: ["ViewChannel"] },
                { id: message.author.id, allow: ["ViewChannel", "SendMessages"] },
                { id: winner.id, allow: ["ViewChannel", "SendMessages"] }
              ]
            });
            channelMention = `<#${winnerChannel.id}>`;

            try {
              await winner.send(`🎉 ¡Felicidades! Has ganado el sorteo **${prize}**. Ve a ${channelMention} para reclamar tu premio.`);
            } catch {}
          }
        }

        const finalEmbed = EmbedBuilder.from(embed)
          .setColor(0x00AE86)
          .setTitle("🏆 Sorteo Finalizado!")
          .setDescription(`🎁 Premio: **${prize}**\n\n🎉 Ganador: ${winner}\n\nSorteo hosteado por: ${message.author}\n\n¡Felicidades! ${winner} y el host del sorteo pueden entrar a ${channelMention} para reclamar el premio.`)
          .spliceFields(0, 1, { name: "Participantes", value: participants.slice(-10).map(u => u.username).join("\n") + (participants.length > 10 ? `\n...y otros ${participants.length - 10} participando en el sorteo` : "") });

        await msg.edit({ embeds: [finalEmbed], components: [] });
      }
    });

    collector.on("end", async () => {
      row.components.forEach(btn => btn.setDisabled(true));
      await msg.edit({ components: [row] });
    });
  }
};
