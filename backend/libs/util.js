const isHash = hash => {
  return /^[0-9a-fA-F]{64}$/.test(hash);
};

module.exports = {
  isHash
};
