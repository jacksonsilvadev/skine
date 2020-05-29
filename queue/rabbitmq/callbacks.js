module.exports.onConsume = (operations) => async (msg) => {
  const operation = (msg.operation || msg.routingKey)
    .replace(/\s+/g, '-')
    .toLowerCase();

  try {
    return operations[operation]({
      user: {},
      args: msg.body,
    });
  } catch (err) {
    throw new Error(`Invalid operation ${operation}`);
  }
};
