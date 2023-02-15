import React, { ReactNode } from 'react'

interface Props {
    label?: string;
    onPress?: () => void;
    children?: ReactNode;
}

export default function ActionButton({label, onPress, children}: Props) {
  return (
    <button onClick={onPress} className="bg-white p-2 rounded-lg px-4">
    <div className="self-center">
      {label || ""}
      {children}
      </div>
  </button>  )
}