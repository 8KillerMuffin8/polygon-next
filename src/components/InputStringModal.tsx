import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import Modal from "react-modal";
import CheckBox from "./CheckBox";
import { XCircleIcon } from "@heroicons/react/24/solid";
import ActionButton from "./ActionButton";

interface Props {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  handleApply: (str: string) => void;
}

export default function InputStringModal({
  modalOpen,
  setModalOpen,
  handleApply
}: Props) {
    const [inputValue, setInputValue] = useState("");
  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      style={{
        content: {
          top: "39%",
          left: "35%",
          right: "35%",
          bottom: "39%",
          border: "0px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          backgroundColor: "rgb(100,116,139)",
          padding: 16
        },
        overlay: {
          backgroundColor: "#000000aa",
        },
      }}
      contentLabel="Example Modal"
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-white text-xl flex">Coordinate string</h2>
          <button
            onClick={() => {
              setModalOpen(false);
            }}
          >
            <XCircleIcon className="w-8 text-white" />
          </button>
        </div>
        <div className="flex w-full">
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="flex-1 p-1 rounded-md" type={"text"}></input>
        </div>
        <div className="flex-0 self-center">
        <ActionButton label="Apply" onPress={() => {
            handleApply(inputValue)
            setInputValue("")
            }}/>
        </div>
      </div>
    </Modal>
  );
}
