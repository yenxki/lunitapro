const cooldowns = {};

function checkCooldown(userId, command, time) {
  if (!cooldowns[command]) cooldowns[command] = {};
  if (cooldowns[command][userId]) {
    const now = Date.now();
    const expiration = cooldowns[command][userId] + time;
    if (now < expiration) {
      return (expiration - now); // devuelve tiempo restante
    }
  }
  cooldowns[command][userId] = Date.now();
  return null;
}

module.exports = { checkCooldown };
