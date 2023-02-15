import React from 'react'

interface Props {
    numOfPages: number;
    currentPage: number;
    handlePageClicked: (page: number) => void;
}

export default function Paginator({numOfPages, currentPage, handlePageClicked}: Props) {
  return (
    <div className="flex flex-row">
    {Array(Math.ceil(numOfPages)).fill(0).map((_, i) => {
      return (
        <button onClick={() => {
          handlePageClicked(i + 1)
        }} className={`border border-t-0 border-b-0 border-black p-2 px-4 hover:bg-slate-50 ${currentPage - 1 === i ? "bg-slate-50" : 'bg-slate-300'} transition-all`} key={i.toString()}>{i + 1}</button>
        )
      })}
      </div>
 )
}