import { EmbedBuilder } from "discord.js";

export default {
  name: "giveaway-test",
  description: "Simula un sorteo con animación, últimos 10 participantes, y canal de reclamo, mostrando quién lo hostea.",
  async execute(message, args) {
    if (args.length < 3) return message.reply("Uso: `!giveaway-test <segundos animación> <mensaje (mínimo 2 palabras)> <URL imagen>`");

    const duration = parseInt(args[0]);
    if (isNaN(duration) || duration <= 0) return message.reply("Debes indicar un número válido de segundos para la animación.");

    const prize = args.slice(1, -1).join(" ");
    if (prize.split(" ").length < 2) return message.reply("El mensaje del sorteo debe tener al menos 2 palabras.");

    const imageURL = args[args.length - 1];
    const participants = [];
    const fakeUsers = ["@Juan", "@Ana", "@Pedro", "@Lucia", "@Carlos", "@Maria", "@Luis", "@Sofia", "@Diego", "@Valeria", "@Emma", "@Mateo"];

    const encouragement = `🎉 ¡Atención! Este sorteo de prueba es una oportunidad perfecta para ver cómo funciona nuestro sistema. Participa, diviértete y observa cómo se selecciona un ganador. Sorteo hosteado por: ${message.author}.`;

    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle("🎁 ¡Sorteo de Prueba!")
      .setDescription(`${encouragement}\n\n🎁 Premio: **${prize}**`)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setImage(imageURL)
      .addFields({ name: "Participantes", value: "Aún no hay participantes..." });

    const msg = await message.channel.send({ embeds: [embed] });

    // Simular participantes uniéndose
    for (let user of fakeUsers) {
      participants.push(user);
      const last10 = participants.slice(-10).join("\n");
      const others = participants.length > 10 ? participants.length - 10 : 0;
      const participantText = others > 0 ? `${last10}\n...y otros ${others} participando en el sorteo` : last10;
      const updatedEmbed = EmbedBuilder.from(embed).spliceFields(0, 1, { name: "Participantes", value: participantText });
      await msg.edit({ embeds: [updatedEmbed] });
      await new Promise(r => setTimeout(r, 500));
    }

    // Animación de selección
    const startTime = Date.now();
    while ((Date.now() - startTime) / 1000 < duration) {
      const randomWinner = participants[Math.floor(Math.random() * participants.length)];
      const animEmbed = EmbedBuilder.from(embed)
        .setDescription(`${encouragement}\n\n🎁 Premio: **${prize}**\n\n🔄 Sorteando... ${randomWinner}`)
        .spliceFields(0, 1, { name: "Participantes", value: participants.slice(-10).join("\n") + (participants.length > 10 ? `\n...y otros ${participants.length - 10} participando en el sorteo` : "") });
      await msg.edit({ embeds: [animEmbed] });
      await new Promise(r => setTimeout(r, 500));
    }

    // Ganador final
    const winner = participants[Math.floor(Math.random() * participants.length)];
    const finalEmbed = EmbedBuilder.from(embed)
      .setColor(0x00AE86)
      .setTitle("🏆 Sorteo de Prueba Finalizado!")
      .setDescription(`🎁 Premio: **${prize}**\n\n🎉 Ganador: ${winner}\n\nSorteo hosteado por: ${message.author}\n\n¡Felicidades! Este es un sorteo simulado.`)
      .spliceFields(0, 1, { name: "Participantes", value: participants.slice(-10).join("\n") + (participants.length > 10 ? `\n...y otros ${participants.length - 10} participando en el sorteo` : "") });

    await msg.edit({ embeds: [finalEmbed] });
  }
};
