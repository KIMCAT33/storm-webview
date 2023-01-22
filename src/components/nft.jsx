
import TinderCard from 'react-tinder-card'
import React, { useState, useEffect, useRef } from "react";
//import apiPost from '../utils/apiPosts';
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
import axios from 'axios';


export default function NFT() {
    const [searchResult, setSearchResult] = useState([]);
    const [NFTs, setNFTs] = useState([]);
    const nextId = useRef(0);
    
    const alreadyRemoved = [];



      const [lastDirection, setLastDirection] = useState();

      const swiped = (direction, nft) => {
        setLastDirection(direction);
        alreadyRemoved.push(nft);
      };
      
      const nftSearch = async () => {
        
        //Mainnet
        //const connection = new Connection(process.env.REACT_APP_QUICK_NODE);
        
        //Devnet
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        let wallet = await Keypair.fromSecretKey(
            bs58.decode(process.env.REACT_APP_SECRET_KEY)
        )
        const metaplex = await Metaplex.make(connection).use(keypairIdentity(wallet));
        // if searchResult is empty then search for all NFTs
        if(searchResult.length === 0) {
      

        const myNfts = await metaplex.nfts().findAllByOwner({
            owner: "12ozzwuTXeTX9jLDKkxFgceequ6FA8MhEm2TVTaNzc59",
        });
        myNfts.forEach(async (nft) => {
            const Name = nft.name;
            const metadata = await axios.get(nft.uri);
            const Image = metadata["data"]["image"];
            const mintAddress = nft.mintAddress;
            
            const nftInfo = {
                id : nextId.current,
                name: Name,
                image: Image,
                mintAddress: mintAddress,
            }
            setNFTs([...NFTs, nftInfo]);
            nextId.current += 1;
        });
        
        setSearchResult(myNfts);
        }
        console.log(NFTs);
    }

    useEffect(() => {
        nftSearch();
    }, [searchResult]);
      

    return (
        
            NFTs.map((nft, index) => (

                nft&&(<TinderCard
                className="swipe"
                key={nft.name}
                preventSwipe={["up", "down"]}
                onSwipe={dir => swiped(dir, nft)}
                >
                <div className="nft-container">
                 <img 
                    className="card"
                    src={nft.image} 
                    alt={nft.name} 
                />
                <div
                    className="card-menu" 
                >
                    <img 
                        src={"images/burn-btn.png"}
                        alt="Burn"
                        className='btn'
                    />
                    <div
                        className="card-location"    
                    >
                    <img src="images/location-icon.png" alt="location" /> 
                    1km away
                    </div>
                    <img
                        src={"images/like-btn.png"}
                        alt="Like"
                        className='btn'
                    />
                
                </div>
                </div>
                </TinderCard>)
            ))
    );
    
           
}