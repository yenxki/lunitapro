module.exports = (client) => {
  console.log(`${client.user.tag} está online 🚀`);
  client.user.setActivity("viendo a @gerasaurio", { type: 3 }); // WATCHING
};
