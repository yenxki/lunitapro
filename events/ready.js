module.exports = (client) => {
    console.log(`✅ Lunita conectada como ${client.user.tag}`);
    client.user.setActivity("¡Mencióname para ayuda!", { type: 0 });
};
