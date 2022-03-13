import { useCallback, useMemo, useState, useEffect, createRef } from 'react';
import { useScreenshot } from 'use-react-screenshot'
import { useMetaMask } from "metamask-react";
import { useMoralisWeb3Api } from "react-moralis";
import html2canvas from 'html2canvas';
import { TwitterPicker } from 'react-color';

import css from './App.module.css';
import ColorIcon from './ColorIcon';

const ipfsRegex = new RegExp(/^ipfs\:\/\/(ipfs)?/);

type RawNFTObject = {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_uri?: string | undefined;
  metadata?: string | undefined;
  synced_at?: string | undefined;
  amount?: string | undefined;
  name: string;
  symbol: string;
};

type GetNFTsRes = {
  status?: string | undefined;
  total?: number | undefined;
  page?: number | undefined;
  page_size?: number | undefined;
  result?: RawNFTObject[] | undefined;
}

type ParsedNFTObject = {
  parsedMetadata: {[key: string]: string},
  rawNFTObject: RawNFTObject,
};

function App() {
  const { status, connect, chainId, ethereum } = useMetaMask();
  const account = "0x9f4838f18104f4973aa0972a73a3f50bdebf86ba";
  const Web3Api = useMoralisWeb3Api();
  const [color, setColor] = useState('#50C5B7');

  const onConnect = useCallback(async () => {
    if (status === "connected") {

      const address = await ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {}
          }
        ]
      });
      return;
    }
    if (status !== "notConnected") {
      return;
    }
    connect();
  }, [status]);

  const isDisabled = useMemo(() => {
    return status === "connecting" || status === "unavailable";
  }, [status])

  const [res, setRes] = useState<GetNFTsRes | null>(null);

  useEffect(() => {
    (async () => {
      if (!account) {
        return;
      }

      const res = await Web3Api.account.getNFTs({address: account});
      setRes(res);
    })();
  }, [account, setRes]);

  const connectButton = (
    <button disabled={isDisabled} className={css.Connector} onClick={onConnect}>
      {connectingButtonText(status, account, chainId)}
    </button>
  );

  if (!account) {
    return (
      <div className={css.Container}>
        {connectButton}
      </div>
    );
  }

  if (!res) {
    return (
      <div className={css.Container}>
        <Loading />
      </div>
    )
  }

  const nftCards = res.result.filter(nft => !!nft.metadata).map(nft => {
    if (!nft.metadata) {
      return null;
    }
    let parsed;
    try {
      parsed = JSON.parse(nft.metadata);
    } catch {
      return null
    }
    parsed.name = parsed.name || nft.name ? `${nft.name}#${nft.token_id}` : null;
    if (!parsed.name) {
      return null;
    }
    return <NFTCard color={color} key={nft.token_address + nft.token_id} nftObject={{parsedMetadata: parsed, rawNFTObject: nft}} />
  }).filter(elem => !!elem);

  const content = (
    <div>
      <div className={css.Header}>
        <div className={css.ColorPicker}>
          <div className={css.ColorIcon}>
            <ColorIcon color={color} size={50} />
          </div>
          <div className={css.ColorPreset} style={{backgroundColor: '#50C5B7'}} onClick={() => setColor('#50C5B7')}/>
          <div className={css.ColorPreset} style={{backgroundColor: '#533A71'}} onClick={() => setColor('#533A71')}/>
          <div className={css.ColorPreset} style={{backgroundColor: '#353b48'}} onClick={() => setColor('#353b48')}/>
          <div className={css.ColorPreset} style={{backgroundColor: '#c23616'}} onClick={() => setColor('#c23616')}/>
          <div className={css.ColorPreset} style={{backgroundColor: '#f368e0'}} onClick={() => setColor('#f368e0')}/>
          <div className={css.ColorPreset} style={{backgroundColor: '#ff9f43'}} onClick={() => setColor('#ff9f43')}/>
        </div>
        {connectButton}
      </div>
      <div className={css.Body}>
        <div className={css.NFTList}>
          {nftCards.length === 0 ? "You have no NFTs!" : nftCards}
        </div>
      </div>
    </div>
    
  );

  return (
    <div className={css.App}>
      {content}
    </div>
  );
}

type NFTCardProps = {
  nftObject: ParsedNFTObject,
  color: string,
}
function NFTCard(props: NFTCardProps) {
  const {nftObject, color} = props;
  const ref = createRef<HTMLDivElement>();

  const parsed = nftObject.parsedMetadata;

  let image = parsed.image || parsed.image_uri || parsed.image_url;
  let nftImage = (
    <div className={css.ImageLoadError}>
      Could not load NFT image
    </div>
  );
  if (image) {
    nftImage = (
      <div className={css.ImageContainer}>
        <img height="400px" width="400px" 
          src={image.replace(ipfsRegex, "https://ipfs.io/ipfs/")} 
          onError={(event: any) => {
            event.target.src = "/broken.png"
            event.onerror = null
          }} 
        />
      </div>
    )
  } else {
    console.log(props)
  }

  const getImage = async () => {
    const canvas = await html2canvas(ref.current, {useCORS: true, width: 500, x: -50, height: 550, y: -25, backgroundColor: 'rgba(255, 255, 255, 0)'});
    canvas.toBlob(function(blob) {
      (window as any).saveAs(blob, `${parsed.name}_nftcard.png`);
    });
  }

  return (
    <div ref={ref} className={css.NFTListItem} onClick={getImage}>
      {nftImage}
      <div className={css.NFTListItemData} style={{backgroundColor: color}}>
        {parsed.name}
      </div>
    </div>
  )
}


function Loading() {
  return <div>Loading...</div>
}


function connectingButtonText(status, account, chainId) {
  if (status === "initializing") return "Initializing";

  if (status === "unavailable") return "Metamask isn't Available";

  if (status === "notConnected") return "Connect Wallet";

  if (status === "connecting") return "Connecting...";

  if (status === "connected") return `Connected account ${account} on chain ID ${chainId}`;

  return "Error";
}

export default App;
