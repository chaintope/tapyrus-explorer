const app = require('../app.js');
const logger = require('../libs/logger.js');
const rest = require('../libs/rest');
const jsontokens = require('jsontokens');
const Commitment = require('../libs/commitment');
const {
  isHash,
  trackingOutputs,
  getMaterialTrackingPayload,
  getCommitment
} = require('../libs/util');
const secp256k1 = require('@noble/curves/secp256k1.js');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const isValidFormat = (script, commitment) => {
  if (!script || !commitment) {
    return false;
  }

  return getCommitment(script)[1] == commitment;
};

const isValidCommitment = payload => {
  return (
    new Commitment(payload.materials, payload.R).point().toHex(true) ==
    payload.commitment
  );
};

const decode = jws => {
  try {
    return jsontokens.decodeToken(jws);
  } catch {
    return null;
  }
};

const isValid = (openedValue, script, payload) => {
  const validFormat = isValidFormat(script, payload.commitment);
  if (!validFormat) {
    return [false, 'The commitment does not match in blockchain'];
  }

  const validCommitment = isValidCommitment(payload);
  if (!validCommitment) {
    return [false, 'Invalid commitment'];
  }

  const validSignature = new jsontokens.TokenVerifier(
    'ES256K',
    payload.R
  ).verify(openedValue);
  if (!validSignature) {
    return [false, 'Invalid signature'];
  }
  return [true, ''];
};

const getPreviousMaterialTrackingPayload = async input => {
  const txid = input.txid;
  const index = input.vout;
  try {
    const tx = await rest.transaction.get(txid);
    if (!tx) {
      return null;
    }
    return getMaterialTrackingPayload(tx.vout[index - 1], index - 1);
  } catch (err) {
    console.log(err);
    return null;
  }
};

const checkBalance = async tx => {
  const inputs = await Promise.all(
    tx.vin.map(input => {
      return getPreviousMaterialTrackingPayload(input);
    })
  );
  const inputCommitment = inputs
    .filter(e => e != null)
    .reduce((commitment, payloads) => {
      const point = secp256k1.secp256k1.ProjectivePoint.fromHex(payloads[1]);
      return commitment.add(point);
    }, secp256k1.secp256k1.ProjectivePoint.ZERO);
  const outputs = trackingOutputs(tx);
  const outputCommitment = outputs
    .filter(output => {
      //exclude mint operation
      return output[3] != '01';
    })
    .reduce((commitment, payloads) => {
      const point = secp256k1.secp256k1.ProjectivePoint.fromHex(payloads[0]);
      return commitment.add(point);
    }, secp256k1.secp256k1.ProjectivePoint.ZERO);

  return inputCommitment.toHex(true) == outputCommitment.toHex(true);
};

//Validate commitment of material tracking transaction
app.get('/api/validate/:openedValue', async (req, res) => {
  try {
    const openedValue = req.params.openedValue;
    const decoded = decode(openedValue);
    if (!decoded) {
      res.status(400).send('Invalid JWS format.');
      return;
    }
    const txid = decoded.payload.txid;
    const index = decoded.payload.index;
    const tx = await rest.transaction.get(txid);
    if (!tx) {
      res.status(404).send(`Tx not found(${txid})`);
      return;
    }

    const script = tx.vout[index].scriptpubkey;
    const [valid, error] = isValid(openedValue, script, decoded.payload);

    res.json({ ...decoded, valid: valid, error: error });
  } catch (error) {
    logger.error(
      `Error validating opened value. Error Message - ${error.message}`
    );
    res.status(500).send('Error validating opened value');
  }
});

// Check that the total amount of material used for inputs and for outputs are balanced
app.get('/api/check_material_tracking_balance/:txid', async (req, res) => {
  const txid = req.params.txid;
  if (!isHash(txid)) {
    console.error(
      `Invalid txid(${txid}) -- /api/check_material_tracking_balance/${txid}`
    );
    res.status(400).send('Bad request');
    return;
  }

  try {
    const tx = await rest.transaction.get(txid);
    if (!tx) {
      res.status(404).send(`Tx not found(${txid})`);
      return;
    }
    const balanced = await checkBalance(tx);
    res.json({ balanced: balanced });
  } catch (error) {
    logger.error(
      `Error calling the method gettransaction for transaction - ${txid}. Error Message - ${error.message}`
    );
    res.status(503).send('Service Temporary Unavailabled');
  }
});
