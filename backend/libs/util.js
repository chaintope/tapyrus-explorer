const tapyrus = require('tapyrusjs-lib');
const config = require('./config');

const isHash = hash => {
  return /^[0-9a-fA-F]{64}$/.test(hash);
};

const isColorId = colorId => {
  return /^(c|C)[1-3]{1}[0-9a-fA-F]{64}$/.test(colorId);
};

const isMaterialTrackingTransaction = tx => {
  return trackingOutputs(tx).length > 0;
};

const trackingOutputs = tx => {
  let tpos = tx.vout
    .map((output, index) => {
      return getMaterialTrackingPayload(output, index);
    })
    .filter(element => element != null);
  tpos = tpos.map(element => {
    switch (element[0]) {
      case ('01', '02'): {
        const output = tx.vout[element[2] + 1];
        if (!output) {
          return null;
        }
        const address = output.scriptpubkey_address;
        if (!address) {
          return null;
        }
        return [element[1], output, element[2], element[0]];
      }
      case '03': {
        return [element[1], null, element[2], element[0]];
      }
      default: {
        return null;
      }
    }
  });
  return tpos.filter(element => element != null);
};
const getMaterialTrackingPayload = (output, index) => {
  if (!output) {
    return null;
  }

  if (output.scriptpubkey_type != 'op_return') {
    return null;
  }
  const script = output.scriptpubkey;
  const commtiment = getCommitment(script);
  if (commtiment) {
    return [commtiment[0], commtiment[1], index];
  } else {
    return null;
  }
};

const getCommitment = script => {
  if (
    script.substring(0, 2) == '6a' && // OP_RETURN
    script.substring(2, 4) == '26' && // size(38 bytes)
    script.substring(4, 8) == '5450' && // marker
    script.substring(8, 10) == '02' && // version
    script.substring(10, 12) == '22' && // payload size(22 bytes)
    (script.substring(12, 14) == '01' ||
      script.substring(12, 14) == '02' ||
      script.substring(12, 14) == '03') // operation
  ) {
    return [script.substring(12, 14), script.substring(14)];
  } else {
    return null;
  }
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
  try {
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
  } catch (error) {
    return [null, null];
  }
};

const UINT_MAX = 2 ** 32 - 1;
const sortTxs = txs => {
  return txs.sort(
    (tx1, tx2) =>
      (tx2.status.block_time || UINT_MAX) - (tx1.status.block_time || UINT_MAX)
  );
};

module.exports = {
  isHash,
  isColorId,
  isMaterialTrackingTransaction,
  trackingOutputs,
  getMaterialTrackingPayload,
  getCommitment,
  splitColor,
  updateAddress,
  sortTxs
};
