import React from "react";
import parse from "html-react-parser";
// import logo from "./logo.svg";

function App() {
  const messages = [
    {
      id: 0,
      messageType: "wave",
      message: "Hi there all the way from neverland.",
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      datetime: Date.now(),
    },
    {
      id: 1,
      messageType: "beer",
      message: "Hi there all the way from neverland.",
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      datetime: Date.now(),
    },
  ];

  const waveHex = "&#x1F44B;";
  const beerHex = "&#x1F37A;";

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
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Leave your message here..."
            ></textarea>
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
            >
              Say, hi
              <div className="ml-1">&#x1F44B;</div>
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Send beer
              <div className="ml-1">&#x1F37A;</div>
            </button>
          </div>

          <div className="mt-10">
            <ul className="divide-y divide-gray-200">
              {messages.map((message) => (
                <li key={message.id} className="py-4">
                  <div className="flex space-x-3">
                    <div className="text-2xl">
                      {parse(
                        message.messageType === "wave" ? waveHex : beerHex
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">
                          {message.address}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Intl.DateTimeFormat("en-GB").format(
                            message.datetime
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{message.message}</p>
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
