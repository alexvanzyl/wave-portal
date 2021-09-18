import { ethers } from "ethers";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import AlertError from "./components/AlertError";
import Messages, { Message, MessageType } from "./components/Messages";
import Spinner from "./components/Spinner";
import Stats, { Stat } from "./components/Stats";
import { beerHex, waveHex } from "./constants";
import abi from "./WavePortal.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stat[]>([
    { name: "Wave count", count: 0, icon: waveHex },
    { name: "Beer count", count: 0, icon: beerHex },
  ]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [latestWinner, setLatestWinner] = useState(
    "0x0000000000000000000000000000000000000000"
  );

  const contractAddress = "0x3B8db67D8AaA97EfF3497aB60e111168eE255c44";
  const contractABI = abi.abi;

  const getContract = (readOnly?: boolean): ethers.Contract => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signerOrProvider = readOnly ? provider : provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signerOrProvider);
  };

  const getMessages = async (): Promise<void> => {
    const waveportalContract = getContract(true);

    const messages = await waveportalContract.getMessages();
    const messagesFormatted: Message[] = messages.map((message: Array<any>) => {
      return {
        from: message[0],
        messageType: message[1],
        body: message[2],
        timestamp: new Date(message[3] * 1000),
      };
    });
    setMessages(messagesFormatted.reverse());

    waveportalContract.on(
      "NewMessage",
      (from, timestamp, messageType, body) => {
        setMessages((oldMessages) => [
          {
            from,
            timestamp: new Date(timestamp * 1000),
            messageType,
            body,
          },
          ...oldMessages,
        ]);
      }
    );
  };

  const getStats = async (): Promise<void> => {
    const waveportalContract = getContract(true);

    const waveCount = await waveportalContract.getTotalFor(MessageType.Wave);
    const beerCount = await waveportalContract.getTotalFor(MessageType.Beer);

    setStats([
      { name: "Wave count", count: waveCount.toNumber(), icon: waveHex },
      { name: "Beer count", count: beerCount.toNumber(), icon: beerHex },
    ]);
  };

  const getLatestWinner = async (): Promise<void> => {
    const waveportalContract = getContract(true);
    const latestWinner = await waveportalContract.latestWinner();
    setLatestWinner(latestWinner);
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
      })
      .catch((err: any) => console.log(err));
  };

  const sendMessage = async (
    event: React.MouseEvent<HTMLButtonElement>,
    messageType: MessageType
  ): Promise<void> => {
    event.preventDefault();
    setErrorMessage("");

    if (!messageBody) {
      setErrorMessage("Please write something nice :)");
      return;
    }

    setIsSendingMessage(true);

    try {
      const waveportalContract = getContract(false);

      const tx = await waveportalContract.sendMessage(
        messageType,
        messageBody,
        {
          gasLimit: 300000,
        }
      );
      await tx.wait();
      getStats();
      getLatestWinner();
      setMessageBody("");
    } catch (err: any) {
      console.log(err);
      setErrorMessage("Transaction failed!");
    }

    setIsSendingMessage(false);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getStats();
    getMessages();
    getLatestWinner();
    // Disable for on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700">
      <div className="max-w-xl mx-auto">
        <div className="mt-10 text-center text-lg">
          <h1 className="text-5xl mb-2">Hi there! {parse(waveHex)}</h1>
          <p>I'm Alex, blockchain engineer and web3 enthusiast.</p>
          <p>
            Feel free to wave {parse(waveHex)} or send me a beer{" "}
            {parse(beerHex)}.
          </p>
          <p>If you lucky you might win some ETH after sending your message!</p>
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

        <div className="mt-5">
          {!errorMessage ? null : <AlertError errorMessage={errorMessage} />}
        </div>

        <div className="mt-5">
          {!currentAccount ? null : (
            <>
              <div>
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
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                {!isSendingMessage ? (
                  <>
                    <button
                      type="button"
                      className="shadow-sm inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                      onClick={(e) => sendMessage(e, MessageType.Wave)}
                      disabled={isSendingMessage}
                    >
                      Say, Hi
                      <div className="ml-1">{parse(waveHex)}</div>
                    </button>
                    <button
                      type="button"
                      className="shadow-sm inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      onClick={(e) => sendMessage(e, MessageType.Beer)}
                      disabled={isSendingMessage}
                    >
                      Send beer
                      <div className="ml-1">{parse(beerHex)}</div>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="shadow-sm inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    disabled={isSendingMessage}
                  >
                    <Spinner />
                    Sending...
                  </button>
                )}
              </div>
            </>
          )}

          <div className="mt-10 bg-blue-100 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              Latest Winner:{" "}
              {latestWinner === "0x0000000000000000000000000000000000000000"
                ? "Nobody yet...might be you!"
                : latestWinner}
            </div>
          </div>

          <div className="mt-5">
            <Stats stats={stats} />
          </div>

          <div className="mt-5">
            <Messages messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
