import parse from "html-react-parser";
import React from "react";

export interface Stat {
  name: string;
  count: number;
  icon: string;
}

interface IProps {
  stats: Stat[];
}

const Stats: React.FC<IProps> = ({ stats }) => {
  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            <p className="text-2xl font-semibold text-gray-900">{item.count}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default Stats;
