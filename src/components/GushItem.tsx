import { Coordinate } from "@/app/page";
import { TrashIcon } from "@heroicons/react/24/solid";
import React, { Dispatch, SetStateAction, SyntheticEvent, useEffect } from "react";

interface Props {
    index: number;
    item: string;
    handleDeleteItem: (index: number) => void;
}

export const GushItem = ({ index, item, handleDeleteItem}: Props) => {
  return <div className="flex flex-row gap-2 items-center justify-between w-52 bg-slate-600 p-2">
    <p className="text-white">{item}</p>
    <button onClick={() => handleDeleteItem(index)}>
    <TrashIcon width={24} height={24} color="white"/>
    </button>
  </div>;
};
