import {
  ArrowDownCircleIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowUpCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import colors from 'tailwindcss/colors'

interface Props {
  toast: any;
  t: any;
  error: any;
}

function ErrorToast({ toast, t, error }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="overflow-hidden transition-all flex flex-col items-start w-32 h-6" 
      style={{
        height: expanded ? "10em" : undefined,
        width: expanded ? "20em" : undefined,
      }}
    >
      <div className="flex justify-between items-center w-full">
        <button onClick={() => toast.dismiss(t.id)}>
          <XCircleIcon width={24} height={24} color={colors.red[400]}/>
        </button>
        <div>Error</div>
        <button onClick={() => setExpanded((old) => !old)}>
          {!expanded ? (
            <ArrowsPointingOutIcon width={24} height={24} />
          ) : (
            <ArrowsPointingInIcon width={24} height={24} />
          )}
        </button>
      </div>
      <div className="min-w-full mt-2">
        <p>{error}</p>
        </div>
    </div>
  );
}

export default ErrorToast;
