import { Coordinate } from "@/app/page";
import { TrashIcon } from "@heroicons/react/24/solid";
import React, { Dispatch, SetStateAction, SyntheticEvent, useEffect } from "react";

interface Props {
    index: number;
    coord: Coordinate;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'Latitude' | 'Longitude', index: number) => void;
    handleDeleteItem: (index: number) => void;
}

export const CoordItem = ({ index, coord, handleChange, handleDeleteItem}: Props) => {
  return <div className="flex flex-row gap-2 items-center bg-slate-600 p-2">
    <label className="text-white">Latitude</label>
    <input value={coord.Latitude || 0} onChange={(e) => {
        handleChange(e, "Latitude", index)
    }} className="w-10 p-1 rounded-sm" type={"number"}/>
    <label className="text-white">Longitude</label>
    <input value={coord.Longitude} onChange={(e) => {
        handleChange(e, "Longitude", index)
    }} className="w-10 p-1 rounded-sm" type={"number"}/>
    <button onClick={() => handleDeleteItem(index)}>
    <TrashIcon width={24} height={24} color="white"/>
    </button>
  </div>;
};
