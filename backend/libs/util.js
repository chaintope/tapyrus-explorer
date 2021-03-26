const tapyrus = require('tapyrusjs-lib');
const config = require('./config');

const isHash = hash => {
  return /^[0-9a-fA-F]{64}$/.test(hash);
};

// Determine uncolored address for colored coin
// and upadte fields (scriptpubkey_uncolored_address, color_id)
const updateAddress = tx => {
  tx.vin.forEach(input => {
    if (input.prevout) {
      const [colorId, uncoloredAddress] = splitColor(
        input.prevout.scriptpubkey
      );
      input.prevout.scriptpubkey_uncolored_address = uncoloredAddress;
      input.prevout.colorId = colorId;
    }
  });
  tx.vout.forEach(output => {
    const [colorId, uncoloredAddress] = splitColor(output.scriptpubkey);
    output.scriptpubkey_uncolored_address = uncoloredAddress;
    output.colorId = colorId;
  });
};

const COLOR_ID_LENGTH = 33;
const splitColor = script => {
  const network = tapyrus.networks[config.network];
  const output = Buffer.from(script, 'hex');
  const payment = tapyrus.payments.util.fromOutputScript(output, network);
  if (payment.colorId) {
    return [
      payment.colorId.toString('hex'),
      tapyrus.address.fromOutputScript(
        output.slice(1 + COLOR_ID_LENGTH + 1),
        network
      )
    ];
  } else {
    return [null, payment.address];
  }
};

module.exports = {
  isHash,
  splitColor,
  updateAddress
};
