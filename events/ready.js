module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Lunita conectada como ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: 'con Gerasaurio ✨ | !help', type: 0 }],
      status: 'online'
    });
  }
};
