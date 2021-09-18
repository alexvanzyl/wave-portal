import parse from "html-react-parser";
import React from "react";
import { beerHex, waveHex } from "../constants";

export enum MessageType {
  Wave = 0,
  Beer = 1,
}

export interface Message {
  from: string;
  messageType: MessageType;
  body: string;
  timestamp: Date;
}

interface IProps {
  messages: Message[];
}

const Messages: React.FC<IProps> = ({ messages }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {messages.map((message, index) => (
        <li key={index} className="py-4">
          <div className="flex space-x-3">
            <div className="text-2xl">
              {parse(
                message.messageType === MessageType.Wave ? waveHex : beerHex
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{message.from}</h3>
                <p className="text-sm text-gray-500">
                  {new Intl.DateTimeFormat("en-GB", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }).format(message.timestamp)}
                </p>
              </div>
              <p className="text-sm text-gray-500">{message.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Messages;
