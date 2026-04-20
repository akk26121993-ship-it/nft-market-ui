import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

const contractAddress = "0x621Cca9D9922Df503a21aab6bEC5640310dd92E4";

const abi = [
  "function mint() public",
  "function tokenId() view returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
  "function listings(uint256) view returns (address seller, uint256 price)",
  "function listNFT(uint256 _tokenId, uint256 _price) public",
  "function buyNFT(uint256 _tokenId) public payable"
];

export default function App() {
  const [nfts, setNfts] = useState([]);
  const [account, setAccount] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");

  // CONNECT
  async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    setAccount(accounts[0]);
  }

  // CONTRACT
  async function getContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  }

  // MINT
  async function mintNFT() {
    const contract = await getContract();
    const tx = await contract.mint();
    await tx.wait();
    loadNFTs();
  }

  // LIST
  async function listNFT() {
    const contract = await getContract();
    const tx = await contract.listNFT(tokenId, price);
    await tx.wait();
    loadNFTs();
  }

  // BUY
  async function buyNFT(id, price) {
    const contract = await getContract();
    const tx = await contract.buyNFT(id, { value: price });
    await tx.wait();
    loadNFTs();
  }

  // LOAD NFTs
  const loadNFTs = useCallback(async () => {
    try {
      const contract = await getContract();
      const total = Number(await contract.tokenId());

      let items = [];

      for (let i = 1; i <= total; i++) {
        const tokenURI = await contract.tokenURI(i);

        const metaURL = tokenURI.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );

        const res = await fetch(metaURL);
        const data = await res.json();

        const listing = await contract.listings(i);

        items.push({
          id: i,
          name: data.name,
          description: data.description,
          image: data.image.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          ),
          price: listing.price.toString()
        });
      }

      setNfts(items);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    loadNFTs();
  }, [loadNFTs]);

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <div style={styles.nav}>
        <div style={styles.logo}>🧿 OpenNFT</div>

        <div style={styles.navRight}>
          <button style={styles.btn} onClick={connectWallet}>
            {account ? "Connected ✔" : "Connect Wallet"}
          </button>

          {account && (
            <div style={styles.wallet}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>
      </div>

      {/* ACTION PANEL */}
      <div style={styles.panel}>
        <input
          placeholder="Token ID"
          style={styles.input}
          onChange={(e) => setTokenId(e.target.value)}
        />

        <input
          placeholder="Price (wei)"
          style={styles.input}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button style={styles.btn} onClick={mintNFT}>Mint</button>
        <button style={styles.btn} onClick={listNFT}>List</button>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {nfts.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No NFTs found</p>
        ) : (
          nfts.map((nft) => (
            <div key={nft.id} style={styles.card}>
              
              <div style={styles.imgWrap}>
                <img src={nft.image} alt="" style={styles.img} />
              </div>

              <h3 style={styles.title}>{nft.name}</h3>
              <p style={styles.desc}>{nft.description}</p>

              <div style={styles.price}>
                {nft.price} wei
              </div>

              <button
                style={styles.buyBtn}
                onClick={() => buyNFT(nft.id, nft.price)}
              >
                Buy Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    color: "white",
    fontFamily: "Arial"
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    position: "sticky",
    top: 0,
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(10px)"
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold"
  },

  navRight: {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },

  wallet: {
    padding: "6px 10px",
    background: "#1e293b",
    borderRadius: "8px",
    fontSize: "12px"
  },

  panel: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    padding: "20px",
    flexWrap: "wrap"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },

  btn: {
    padding: "10px 15px",
    background: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    padding: "20px"
  },

  card: {
    background: "rgba(30, 41, 59, 0.6)",
    borderRadius: "15px",
    padding: "15px",
    transition: "0.3s",
    cursor: "pointer",
    transform: "translateY(0px)"
  },

  imgWrap: {
    overflow: "hidden",
    borderRadius: "10px"
  },

  img: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    transition: "0.4s"
  },

  title: {
    marginTop: "10px"
  },

  desc: {
    fontSize: "12px",
    color: "#94a3b8"
  },

  price: {
    marginTop: "8px",
    fontWeight: "bold"
  },

  buyBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(90deg,#22c55e,#3b82f6)",
    color: "white",
    cursor: "pointer"
  }
};