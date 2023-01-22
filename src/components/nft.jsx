import TinderCard from "react-tinder-card";
import React, { useState, useEffect, useRef } from "react";
//import apiPost from '../utils/apiPosts';
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
import axios from "axios";

//Mainnet
//const connection = new Connection(process.env.REACT_APP_QUICK_NODE);

//Devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// web

let wallet = Keypair.fromSecretKey(
  bs58.decode(process.env.REACT_APP_SECRET_KEY)
);

// mobile
/*
let wallet = Keypair.fromSecretKey(
    bs58.decode(window.tinji.getWalletSecretKey())
);
*/
const metaplex = new Metaplex(connection).use(keypairIdentity(wallet));

export default function NFT() {
  const [searchResult, setSearchResult] = useState([]);
  const [Nft, setNFT] = useState({});
  const nextId = useRef(0);

  const alreadyRemoved = [];

  const [lastDirection, setLastDirection] = useState();

  const swiped = (direction, nft) => {
    setLastDirection(direction);
    console.log(direction);
    if (!alreadyRemoved.includes(nft)) {
      alreadyRemoved.push(nft);
      console.log(alreadyRemoved);
      if (direction === "left") {
        burnNFT({ targetAddress: nft.mintAddress, collection: nft.collection });
        alert("NFT Burned");
      }
    }
  };

  const nftSearch = async () => {
    const myNfts = await metaplex.nfts().findAllByOwner({
      owner: "12ozzwuTXeTX9jLDKkxFgceequ6FA8MhEm2TVTaNzc59",
    });
    console.log("myNfts", myNfts);
    const nft_item = myNfts[0];
      const Name = nft_item.name;
      const metadata = await axios.get(nft_item.uri);
      const Image = metadata["data"]["image"];
      const mintAddress = nft_item.mintAddress;
      const collection = nft_item.collection.address;
      const nftInfo = {
        id: nextId.current,
        name: Name,
        image: Image,
        mintAddress: mintAddress,
        collection: collection,
      };
    setNFT(nftInfo);
    console.log("nftInfo", nftInfo);
    }


  const outOfFrame = () => {
    nftSearch();
  };

  const burnNFT = async ({ targetAddress, collection }) => {
    try {
      const tx = await metaplex.nfts().delete({
        mintAddress: targetAddress,
        owner: wallet,
        collection: collection,
      });
      return tx;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    nftSearch();
  }, []);

  return (
    <>
    <div>
      <TinderCard
        className="swipe"
        key={Nft.id}
        preventSwipe={["up", "down"]}
        onSwipe={(dir) => swiped(dir, Nft)}
        onCardLeftScreen={() => outOfFrame()}
      >
        <div className="nft-container">
          <img className="card" src={Nft.image} alt={Nft.name} />
        </div>
      </TinderCard>
      <div className="card-menu" style={{ zIndex: 1 }}>
        <img
          src={"images/burn-btn.png"}
          alt="Burn"
          className="btn"
          onClick={() =>
            swiped("left", Nft)
          }
        />
        <div className="card-location">
          <img src="images/location-icon.png" alt="location" />
          1km away
        </div>
        <img src={"images/like-btn.png"} alt="Like" className="btn" 
            onClick={() =>
                swiped("right", Nft)
            }
        />
      </div>
      </div>
    </>
  );

};
