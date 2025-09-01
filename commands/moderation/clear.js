module.exports = {
  name: "clear",
  description: "Borra una cantidad de mensajes del canal.",
  category: "Mod",
  async execute({ client, message, args, createEmbed }) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.channel.send({ embeds: [createEmbed(message.guild, `${client.emojisJSON.error} No tienes permisos para usar este comando.`, "Permisos insuficientes")] });
    }

    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) {
      return message.channel.send({ embeds: [createEmbed(message.guild, `${client.emojisJSON.error} Debes indicar un número entre 1 y 100.`, "Uso: !clear <cantidad>")] });
    }

    try {
      await message.channel.bulkDelete(amount, true);

      const embed = createEmbed(
        message.guild,
        `${client.emojisJSON.success} Se han eliminado **${amount} mensajes** correctamente.`,
        `${client.emojisJSON.Moderation} Mensajes eliminados`
      );

      const sentMessage = await message.channel.send({ embeds: [embed] });
      setTimeout(() => sentMessage.delete().catch(() => {}), 5000);

    } catch (err) {
      console.error(err);
      message.channel.send({ embeds: [createEmbed(message.guild, `${client.emojisJSON.error} No se pudieron eliminar los mensajes.`, "Error")] });
    }
  }
};
