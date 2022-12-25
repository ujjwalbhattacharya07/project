import './App.css';
import Footer from './components/footer';
import './style.css';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abi from './abi';

function App() {

  const [isMetamaskInstalled, setisMetamaskInstalled] = useState(false);
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState(null);
  const [status, setStatus] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const [uri, setUri] = useState("");
  const [tokens, setTokens] = useState([]);

  const contractAddress = "0xa31CAd1A503A3FECDE2e53fF43F0c61B01F8Fd6e";

  const { ethereum } = window;

  const provider = new ethers.providers.Web3Provider(ethereum, "any");

  const signer = provider.getSigner();

  const contract = new ethers.Contract(contractAddress, abi, signer);

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        setisMetamaskInstalled(false);
      }
      setisMetamaskInstalled(true);
    };
    checkMetamaskAvailability();
  }, []);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        setisMetamaskInstalled(false);
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);
      let network = await provider.getNetwork();
      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
      setNetwork(network);
      fetchNFTs();
    }
    catch (error) {
      setIsConnected(false);
    }
  }

  const mintNFT = async (e) => {
    try {
      e.preventDefault();

      setStatus("Transaction Initiated");
      toast.info("Transaction Initiated");
      setIsDisabled(true);

      const tx = await contract.safeMint(accountAddress, uri);

      if (tx) {
        setStatus("Pending");
      }

      const receipt = await tx.wait();
      console.log(receipt);

      if (receipt) {
        toast.success("Transaction Successful")
        setStatus("Transaction Successful");
        setIsDisabled(false);
      }

      fetchNFTs();
    }
    catch (error) {
      console.log(error);
      setStatus("Transaction Rejected");
      setIsDisabled(false);
    }

  }

  const fetchNFTs = async () => {
    const tokensTx = await contract.getAllTokens();
    setTokens(tokensTx);
  }

  return (
    <div className='bg-black'>

      <div className='sticky-top'>
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top bg-black">
          <div className="container">
            <b className='text-success' style={{ fontSize: "2em" }}>NFT</b>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  {
                    isConnected ?
                      <p className="text-light">{accountAddress.slice(0, 4)}...
                        {accountAddress.slice(38, 42)}</p>
                      : <button className="btn text-white" style={{ backgroundColor: "#17B3C1" }} onClick={connectWallet}>Connect Wallet</button>
                  }
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <br /><br /><br /><br /><br />
      <section className="py-5">
        <div className="container">

          <div className="row">
            <div className="col-md-12 text-center">

              <form >
                <div className="row">
                  <div className="col-md-3 mb-3"></div>
                  <div className="col-md-4 mb-3 form-group">
                    <input type="text" className="form-control" id="firstName" placeholder="Enter URI" value={uri} onChange={(e) => setUri(e.target.value)} required style={{ backgroundColor: "#fff", borderColor: "rgba(23, 179, 193, 0.1)", opacity: 20 }} /><br />
                  </div>
                  <div className="col-md-2 mb-3">
                    <button className="btn text-white" style={{ backgroundColor: "#17B3C1" }} disabled={isDisabled} onClick={mintNFT}>Mint</button>
                  </div>
                  <div className="col-md-3 mb-3"></div>
                </div>
              </form>
              <p className='text-light'>{status}</p>
            </div>
          </div>
        </div>
      </section><br />

      <section className="py-5">
        <div className="container">
          <div className="row text-white text-center">
            <div className="row row-cols-1 row-cols-md-4 g-2">
              
              {tokens && tokens.length > 0 ?
                tokens.map((token) => (
                  <div className="col">
                    <div className="card h-100 bg-black" style={{ borderColor: "#fff" }}>
                      <div className="container">
                        <br /><div>
                          <img style={{ width: "150px", height: "150px" }} src={`https://gateway.pinata.cloud/ipfs/${token}`} alt="" />
                        </div><br />
                        <p className='text-center'>{token}</p>
                      </div>
                    </div>
                  </div>
                ))
                : <p>No NFTs or Tokens</p>}
              
            </div>
          </div>
        </div>
      </section><br /><br />
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
