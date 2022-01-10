import Head from "next/head";
import Image from "next/image";
import { ethers } from "ethers";

import { useState, useEffect, useRef } from "react";
export default function Home() {
  const [counter, setCount] = useState(800);
  const [loginStatus, setLoginStatus] = useState();
  const [status, setStatus] = useState(false);
  const [wallet, setWallet] = useState("");
  const [qty, setQty] = useState("0.1");
  async function payMeta(sender, receiver, strEther, msged) {
    console.log(
      `payWithMetamask(receiver=${receiver}, sender=${sender}, strEther=${strEther})`
    );
    try {
      // Acccounts now exposed
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const params = [
        {
          from: sender,
          to: receiver,
          value: ethers.utils.parseUnits(strEther, "ether").toHexString(),
        },
      ];

      const transactionHash = await provider.send(
        "eth_sendTransaction",
        params
      );
    } catch (e) {
      console.log("payment fail!");
      console.log(e);
    }
  }
  const login = async () => {
    setLoginStatus("Connecting your wallet");
    if (!window.ethereum) {
      setStatus(false);
      setLoginStatus("No MetaMask wallet... Please install MetaMask");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts");
    const network = await provider.getNetwork();
    if (network.chainId != 1) {
      setLoginStatus("Please change to Ethereum Mainnet");
    }
    const signer = provider.getSigner();
    const walletAddr = await signer.getAddress();
    if (walletAddr.length > 0) {
      localStorage.setItem("wallet", walletAddr);
    }
    setWallet(walletAddr);
    setStatus(true);
    console.log(`walletAddr`, walletAddr);
  };

  useInterval(() => {
    if (counter < 970) {
      setCount(counter + Math.floor(Math.random() * 8));
    }
  }, 1000);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  useEffect(() => {
    const walletTemp = localStorage.getItem("wallet");
    if (walletTemp) {
      setWallet(walletTemp);
      setStatus(true);
    }
  }, []);
  return (
    <div className="">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500&amp;display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <title> Doodle Ape Mint</title>
        <meta property="og:title" content="Doodle Ape Mint" key="title" />
        <meta
          property="og:description"
          content="DAPES with high fashion sense living in the metaverse"
          key="description"
        />
        <meta property="og:image" content="/thumb.jpg" key="description" />
      </Head>
      <header className="relative flex items-center justify-center h-screen overflow-hidden">
        <div className="relative z-30 p-5 text-2xl text-white uppercase bg-black bg-opacity-50 w-full">
          <div id="__next" data-reactroot>
            <div className="flex flex-col min-h-screen p-5 lg:p-7">
              {/* <nav class="flex items-center flex-none">
            <div class="flex-none"><a href="https://invisiblefriends.io/"><img src="https://invisiblefriends.io/handshake.svg" alt="bing bong" class="w-8 text-white uppercase md:w-12"/></a></div>
            <div class="flex-auto"></div>
            <div class="flex flex-none space-x-4"><a class="" href="https://twitter.com/InvsbleFriends"><img src="https://invisiblefriends.io/twitter-logo.svg" alt="Twitter" class="w-8 text-white uppercase"/></a><a class="" href="https://discord.gg/rndm"><img src="https://invisiblefriends.io/discord-logo.svg" alt="Discord" class="w-8 text-white uppercase"/></a></div>
         </nav> */}
              <div className="flex flex-col items-center justify-center flex-1">
                <header className="flex flex-col items-center justify-center h-full text-center">
                  {/* <h1 class="text-6xl text-yellow-200 md:text-8xl lg:text-9xl leading-solid "></h1> */}
                  <div className="w-full md:w-[600px] -mt-16 md:-mt-32 lg:-mt-36">
                    {/* <img src="hape.png" alt="Basketball"/> */}
                  </div>
                </header>
                <div className="text-center space-y-4 md:space-y-8">
                  <div className="h-2" />
                  <h2 className="text-4xl font-bold md:text-5xl leading-solid text-white uppercase">
                    Doodle Ape
                    <br />
                    mint now available
                  </h2>
                  <h2 className="text-xl font-bold md:text-xl leading-solid text-white uppercase">
                    {loginStatus}
                  </h2>
                  <p className="tracking-wider" />
                  <div className="mx-auto w-full text-center">
                    <p>
                      Total Minted:{" "}
                      <span className="mintcounter">{counter}</span> / 1,000 for
                      presale
                    </p>
                    <p>Price per mint: 0.1</p>

                    {status ? (
                      <div>
                        {wallet.substring(0, 5) +
                          "...." +
                          wallet.substring(38, 42)}
                      </div>
                    ) : (
                      <button
                        className="mt-8 bg-white btn text-black uppercase enableEthereumButton"
                        id="connectBtn"
                        onClick={() => login()}
                      >
                        Connect your wallet
                      </button>
                    )}
                    {status ? (
                      <div className="text-black " id="hiddenTillConnected">
                        <span className="text-3xl text-white">Quantity:</span>{" "}
                        <input
                          className="bg-white mx-4 rounded-full py-4 px-8 text-center"
                          type="number"
                          id="mintnumber"
                          min={1}
                          max={10}
                          defaultValue={1}
                          onChange={(e) =>
                            setQty((e.target.value / 10).toString())
                          }
                        />
                        <button
                          className="mt-8 bg-white py-4 btn text-black uppercase"
                          id="checkoutBtn"
                          onClick={() =>
                            payMeta(
                              wallet,
                              "0x69E0187Dfb079ad24E8b2f86ACc4Dcbb103cd4a7",
                              qty
                            )
                          }
                        >
                          Mint!
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <p />
                  <div className="flex items-center justify-center text-base md:text-xl space-x-2">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://twitter.com/doodleapenft"
                      className="bg-white btn text-black"
                    >
                      <svg
                        enableBackground="new 0 0 248 204"
                        viewBox="0 0 248 204"
                        className="h-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5 0-.22 0-.43 0-.64 7.02 3.91 14.88 6.08 22.92 6.32-22.19-14.83-29.03-44.35-15.63-67.43 25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>Twitter</span>
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://discord.com/invite/doodleape"
                      className="bg-white btn text-black"
                    >
                      <svg
                        viewBox="0 0 71 55"
                        className="h-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <clipPath id="a">
                          <path d="m0 0h71v55h-71z" />
                        </clipPath>
                        <g clipPath="url(#a)">
                          <path
                            d="m60.1045 4.8978c-4.5253-2.0764-9.378-3.6062-14.4518-4.48238-.0924-.01691-.1847.025349-.2323.109869-.6241 1.110011-1.3154 2.558111-1.7995 3.696311-5.4572-.817-10.8864-.817-16.2317 0-.4842-1.1635-1.2006-2.5863-1.8275-3.696311-.0476-.0817-.1399-.123959-.2323-.109869-5.071.87338-9.9237 2.40318-14.4518 4.48238-.0392.0169-.0728.0451-.0951.0817-9.20455 13.7514-11.726061 27.1648-10.489092 40.4119.005597.0648.041978.1268.092353.1662 6.072899 4.4598 11.955539 7.1673 17.728939 8.9619.0924.0282.1903-.0056.2491-.0817 1.3657-1.865 2.5831-3.8315 3.6269-5.8995.0616-.1211.0028-.2648-.1231-.3127-1.931-.7325-3.7697-1.6256-5.5384-2.6398-.1399-.0817-.1511-.2818-.0224-.3776.3722-.2789.7445-.5691 1.0999-.8621.0643-.0535.1539-.0648.2295-.031 11.6196 5.3051 24.1992 5.3051 35.6817 0 .0756-.0366.1652-.0253.2323.0282.3555.293.7277.586 1.1027.8649.1287.0958.1203.2959-.0196.3776-1.7687 1.0339-3.6074 1.9073-5.5412 2.637-.1259.0479-.1819.1944-.1203.3155 1.0662 2.0651 2.2836 4.0316 3.6241 5.8967.056.0789.1567.1127.2491.0845 5.8014-1.7946 11.684-4.5021 17.7569-8.9619.0532-.0394.0868-.0986.0924-.1634 1.4804-15.3151-2.4796-28.6185-10.4975-40.4119-.0196-.0394-.0531-.0676-.0923-.0845zm-36.3786 32.4275c-3.4983 0-6.3808-3.2117-6.3808-7.156s2.8266-7.156 6.3808-7.156c3.5821 0 6.4367 3.2399 6.3807 7.156 0 3.9443-2.8266 7.156-6.3807 7.156zm23.5919 0c-3.4982 0-6.3807-3.2117-6.3807-7.156s2.8265-7.156 6.3807-7.156c3.5822 0 6.4367 3.2399 6.3808 7.156 0 3.9443-2.7986 7.156-6.3808 7.156z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                      <span>Discord</span>
                    </a>
                  </div>
                  <div className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <video
          autoPlay
          loop
          muted
          className="absolute z-10 w-auto min-w-full min-h-full max-w-none"
        >
          <source src="doodle.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </header>
    </div>
  );
}
