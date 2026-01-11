const utils = require('@noble/hashes/utils');
const secp256k1 = require('@noble/curves/secp256k1.js');

class Commitment {
  constructor(materials, R) {
    this.materials = materials;
    this.R = R;
  }

  point() {
    const dst = 'Tapyrus-Tracking-material-with-secp256k1_XMD:SHA-256_SSWU_RO_';
    let c = secp256k1.secp256k1.Point.fromHex(this.R);
    this.materials.forEach(material => {
      const p = secp256k1.secp256k1_hasher.hashToCurve(
        utils.utf8ToBytes(`${material.name}|${material.unit}`),
        { DST: dst }
      );
      c = c.add(p.multiply(BigInt(material.quantity)));
    });
    return c;
  }
}

module.exports = Commitment;
