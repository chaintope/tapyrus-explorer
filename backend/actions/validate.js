const app = require('../app.js');
const logger = require('../libs/logger.js');
const rest = require('../libs/rest');
const jsontokens = require('jsontokens');
const Commitment = require('../libs/commitment');

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

  return (
    script.substring(0, 2) == '6a' && // OP_RETURN
    script.substring(2, 4) == '26' && // size(38 bytes)
    script.substring(4, 8) == '5450' && // marker
    script.substring(8, 10) == '02' && // version
    script.substring(10, 12) == '22' && // payload size(22 bytes)
    (script.substring(12, 14) == '01' ||
      script.substring(12, 14) == '02' ||
      script.substring(12, 14) == '03') && // operation
    script.substring(14) == commitment
  ); //commitment
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
  } catch (error) {
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
//Validate commitment of tracking transaction
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
