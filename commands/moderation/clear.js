export default {
  name: "clear",
  description: "Borra una cantidad de mensajes en el canal actual.",
  async execute(message, args) {
    // Verificar permisos
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("❌ No tienes permisos para usar este comando.");
    }

    // Verificar argumentos
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0 || amount > 100) {
      return message.reply("❌ Debes indicar un número válido de mensajes a borrar (1-100).");
    }

    try {
      // Bulk delete
      const deletedMessages = await message.channel.bulkDelete(amount, true);
      return message.channel.send(`✅ Se han borrado ${deletedMessages.size} mensajes.`)
        .then(msg => setTimeout(() => msg.delete(), 5000)); // Borra aviso después de 5 segundos
    } catch (err) {
      console.error(err);
      return message.reply("❌ No se pudieron borrar los mensajes. Asegúrate de que los mensajes tengan menos de 14 días de antigüedad.");
    }
  }
};
