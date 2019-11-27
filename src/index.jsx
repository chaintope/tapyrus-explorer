import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';

const bh = '19af353c9828e6dc20b37ae3006551500be68322552e1027fbf6def8a1a0b710';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      blockHash: 'hash',
      ntx: 'ntx',
      height: 'height',
      timestamp: 'time',
      proof: 'nonce',
      sizeBytes: 'size',
      version: 'version',
      merkleRoot: 'merkleRoot',
      immutableMerkleRoot: 'immutable',
      previousBlock: 'previousblockhash',
      nextBlock: 'nextblockhash',
    };
  }

  componentDidMount() {
    this.getBlockInfo();
  }

  async getBlockInfo() {
    const result = await axios.get(`${'http://localhost:3001/blocks'}/${bh}`);
    this.setState({
      blockHash: result.data.blockHash,
      ntx: result.data.ntx,
      height: result.data.height,
      timestamp: result.data.timestamp,
      proof: result.data.proof,
      sizeBytes: result.data.sizeBytes,
      version: result.data.version,
      merkleRoot: result.data.merkleRoot,
      immutableMerkleRoot: 'immutable',
      previousBlock: result.data.previousBlock,
      nextBlock: result.data.nextBlock,
    });
  }

  render() {
    const {
      blockHash, ntx, height, timestamp, proof, sizeBytes, version,
      merkleRoot, immutableMerkleRoot, previousBlock, nextBlock,
    } = this.state;
    return (
      <div className="App">
        <p>
          <table>
            <tbody>
              <tr>
                <td>
                  {' '}
BLOCKHASH :
                  {blockHash}
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
NTX :
                  {ntx}
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
HEIGHT :
                  {height}
                </td>
              </tr>
              <tr>
                <td>
TIME :
                  {timestamp}
                </td>
              </tr>
              <tr>
                <td>
PROOF :
                  {proof}
                </td>
              </tr>
              <tr>
                <td>
SIZE :
                  {sizeBytes}
                </td>
              </tr>
              <tr>
                <td>
VERSION :
                  {version}
                </td>
              </tr>
              <tr>
                <td>
MERKLEROOT :
                  {merkleRoot}
                </td>
              </tr>
              <tr>
                <td>
IMMUTABLEMERKLEROOT :
                  {immutableMerkleRoot}
                </td>
              </tr>
              <tr>
                <td>
PREVIOUSBLOCK :
                  {previousBlock}
                </td>
              </tr>
              <tr>
                <td>
NEXT BLOCK :
                  {nextBlock}
                </td>
              </tr>
            </tbody>

          </table>

        </p>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
