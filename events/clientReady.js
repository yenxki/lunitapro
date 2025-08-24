export default {
    name: "clientReady",
    once: true,
    execute(client) {
        console.log(`✅ Bot conectado como ${client.user.tag}`);
    }
};
