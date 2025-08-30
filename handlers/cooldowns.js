const cooldowns = {};

module.exports = {
    checkCooldown: (userId, commandName, cooldownTime) => {
        if (!cooldowns[commandName]) cooldowns[commandName] = {};
        const now = Date.now();
        const timestamps = cooldowns[commandName];

        if (timestamps[userId] && now - timestamps[userId] < cooldownTime) {
            const timeLeft = cooldownTime - (now - timestamps[userId]);
            return timeLeft;
        }

        timestamps[userId] = now;
        return 0;
    }
};
