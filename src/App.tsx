import { ethers } from "ethers";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import abi from "./WavePortal.json";

enum MessageType {
  Wave = 0,
  Beer = 1,
}

interface Message {
  from: string;
  messageType: MessageType;
  body: string;
  timestamp: number;
}

interface Stat {
  name: string;
  count: number;
  icon: string;
}

function App() {
  const waveHex = "&#x1F44B;";
  const beerHex = "&#x1F37A;";

  const [currentAccount, setCurrentAccount] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stat[]>([
    { name: "Wave", count: 0, icon: waveHex },
    { name: "Beer", count: 0, icon: beerHex },
  ]);

  const contractAddress = "0x017c60Ae1F5C11637574cC8A3838150Ca2857ed3";
  const contractABI = abi.abi;

  const spinner = (): JSX.Element => {
    return (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  };

  const getContract = (): ethers.Contract => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const getMessages = async (): Promise<void> => {
    const waveportalContract = getContract();

    const messages = await waveportalContract.getMessages();
    const messagesFormatted: Message[] = messages.map((message: Array<any>) => {
      return {
        from: message[0],
        messageType: message[1],
        body: message[2],
        timestamp: message[3].toNumber(),
      };
    });

    setMessages(messagesFormatted);
  };

  const getStats = async (): Promise<void> => {
    const waveportalContract = getContract();

    const waveCount = await waveportalContract.getTotalFor(MessageType.Wave);
    const beerCount = await waveportalContract.getTotalFor(MessageType.Beer);

    setStats([
      { name: "Wave", count: waveCount.toNumber(), icon: waveHex },
      { name: "Beer", count: beerCount.toNumber(), icon: beerHex },
    ]);
  };

  const checkIfWalletIsConnected = (): void => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    }
    console.log("We have the ethereum object", ethereum);

    ethereum.request({ method: "eth_accounts" }).then((accounts: any) => {
      if (accounts.length === 0) {
        console.log("No authorized account found");
      } else {
        const account = accounts[0];
        console.log("Found authorized account: ", account);

        setCurrentAccount(account);
        getStats();
        getMessages();
      }
    });
  };

  const connectWallet = (): void => {
    const { ethereum } = window;
    if (!ethereum) alert("Get MetaMask!");

    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts: any) => {
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
        getStats();
        getMessages();
      })
      .catch((err: any) => console.log(err));
  };

  const sendMessage = async (
    event: React.MouseEvent<HTMLButtonElement>,
    messageType: MessageType
  ): Promise<void> => {
    setIsSendingMessage(true);
    const waveportalContract = getContract();

    const totalWaves = await waveportalContract.getTotalFor(MessageType.Wave);
    console.log("Total waves: ", totalWaves.toNumber());
    const totalBeers = await waveportalContract.getTotalFor(MessageType.Beer);
    console.log("Total beers: ", totalBeers.toNumber());

    setTimeout(() => {
      setIsSendingMessage(false);
    }, 3000);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700">
      <div className="max-w-xl mx-auto">
        <div className="mt-10 text-center">
          <h1 className="text-5xl mb-2">Hi there! {parse(waveHex)}</h1>
          <p className="text-lg">
            I'm Alex, blockchain engineer and web3 enthusiast.
          </p>
          <p className="text-lg">
            Feel free to wave {parse(waveHex)} or send me a beer{" "}
            {parse(beerHex)}.
          </p>
        </div>

        {currentAccount ? null : (
          <div className="text-center mt-10">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
            <p className="text-xs mt-2">Deployed on Rinkeby</p>
          </div>
        )}

        <div className="mt-10">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 sr-only"
          >
            Message
          </label>
          <div className="mt-5">
            <textarea
              id="message"
              name="message"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Leave your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="relative bg-white py-5 px-4 shadow rounded-lg overflow-hidden"
                >
                  <dt>
                    <div className="absolute bg-gray-100 rounded-md p-2">
                      <div className="text-3xl">{parse(item.icon)}</div>
                    </div>
                    <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </p>
                  </dt>
                  <dd className="ml-16 flex items-baseline ">
                    <p className="text-2xl font-semibold text-gray-900">
                      {item.count}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {!currentAccount ? null : (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                className="shadow-sm inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                onClick={(e) => sendMessage(e, MessageType.Wave)}
                disabled={isSendingMessage}
              >
                {!isSendingMessage ? (
                  <>
                    Say, Hi
                    <div className="ml-1">{parse(waveHex)}</div>
                  </>
                ) : (
                  <div className="flex">
                    {spinner()}
                    Sending...
                  </div>
                )}
              </button>
              <button
                type="button"
                className="shadow-sm inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={(e) => sendMessage(e, MessageType.Beer)}
                disabled={isSendingMessage}
              >
                {!isSendingMessage ? (
                  <>
                    Send beer
                    <div className="ml-1">{parse(beerHex)}</div>
                  </>
                ) : (
                  <div className="flex">
                    {spinner()}
                    Sending...
                  </div>
                )}
              </button>
            </div>
          )}

          <div className="mt-10">
            <ul className="divide-y divide-gray-200">
              {messages.map((message, index) => (
                <li key={index} className="py-4">
                  <div className="flex space-x-3">
                    <div className="text-2xl">
                      {parse(
                        message.messageType === MessageType.Wave
                          ? waveHex
                          : beerHex
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{message.from}</h3>
                        <p className="text-sm text-gray-500">
                          {new Intl.DateTimeFormat("en-GB").format(
                            message.timestamp
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{message.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
