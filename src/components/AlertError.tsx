import { XCircleIcon } from "@heroicons/react/solid";
import React from "react";

interface IProps {
  errorMessage: string;
}

const AlertError: React.FC<IProps> = ({ errorMessage }) => {
  return (
    <div className="shadow bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertError;
