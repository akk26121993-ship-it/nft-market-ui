import { useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x621Cca9D9922Df503a21aab6bEC5640310dd92E4";

const abi = [
  "function mint() public",
  "function listNFT(uint256 _tokenId, uint256 _price) public",
  "function buyNFT(uint256 _tokenId) public payable"
];

function App() {
  const [account, setAccount] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");

  // CONNECT WALLET
  async function connectWallet() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    setAccount(accounts[0]);
  }

  // CONNECT CONTRACT
  async function getContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(contractAddress, abi, signer);
  }

  // MINT NFT
  async function mintNFT() {
    const contract = await getContract();
    const tx = await contract.mint();
    await tx.wait();

    alert("NFT Minted!");
  }

  // LIST NFT
  async function listNFT() {
    const contract = await getContract();

    const tx = await contract.listNFT(tokenId, price);
    await tx.wait();

    alert("NFT Listed!");
  }

  // BUY NFT
  async function buyNFT() {
    const contract = await getContract();

    const tx = await contract.buyNFT(tokenId, {
      value: price
    });

    await tx.wait();

    alert("NFT Bought!");
  }

return (
  <div style={{
    textAlign: "center",
    marginTop: "40px",
    fontFamily: "Arial",
    background: "#f5f5f5",
    minHeight: "100vh",
    padding: "20px"
  }}>
    
    <h1 style={{ color: "#333" }}>
      🖼️ NFT Marketplace
    </h1>

    {/* WALLET SECTION */}
    <div style={{
      background: "white",
      padding: "15px",
      margin: "20px auto",
      width: "60%",
      borderRadius: "10px"
    }}>
      <button onClick={connectWallet}>
        {account ? "Wallet Connected ✅" : "Connect Wallet"}
      </button>

      <p style={{ marginTop: "10px" }}>
        <b>{account}</b>
      </p>
    </div>

    {/* MINT SECTION */}
    <div style={{
      background: "white",
      padding: "15px",
      margin: "20px auto",
      width: "60%",
      borderRadius: "10px"
    }}>
      <h2>Mint NFT</h2>
      <button onClick={mintNFT}>
        Mint NFT
      </button>
    </div>

    {/* LIST SECTION */}
    <div style={{
      background: "white",
      padding: "15px",
      margin: "20px auto",
      width: "60%",
      borderRadius: "10px"
    }}>
      <h2>List NFT</h2>

      <input
        placeholder="Token ID"
        onChange={(e) => setTokenId(e.target.value)}
        style={{ margin: "5px", padding: "5px" }}
      />

      <input
        placeholder="Price (wei)"
        onChange={(e) => setPrice(e.target.value)}
        style={{ margin: "5px", padding: "5px" }}
      />

      <br />

      <button onClick={listNFT} style={{ marginTop: "10px" }}>
        List NFT
      </button>
    </div>

    {/* BUY SECTION */}
    <div style={{
      background: "white",
      padding: "15px",
      margin: "20px auto",
      width: "60%",
      borderRadius: "10px"
    }}>
      <h2>Buy NFT</h2>

      <input
        placeholder="Token ID"
        onChange={(e) => setTokenId(e.target.value)}
        style={{ margin: "5px", padding: "5px" }}
      />

      <input
        placeholder="Price (wei)"
        onChange={(e) => setPrice(e.target.value)}
        style={{ margin: "5px", padding: "5px" }}
      />

      <br />

      <button onClick={buyNFT} style={{ marginTop: "10px" }}>
        Buy NFT
      </button>
    </div>

  </div>
  );
};

export default App;
