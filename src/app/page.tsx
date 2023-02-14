"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

type Props = {};

async function getData(gush_num: string) {
  try {
    const res = await fetch(`/api/gush/${gush_num}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return err;
  }
}

interface TableItemProps {
  SourceFile: string;
  GPSLongitude: string;
  GPSLatitude: string;
  DateTimeOriginal: string;
  target?: string;
}

const TableItem = ({ item }: { item: TableItemProps }) => {
  const { SourceFile, GPSLatitude, GPSLongitude, DateTimeOriginal, target } =
    item;
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {SourceFile}
      </th>
      <td className="px-6 py-4">{GPSLatitude}</td>
      <td className="px-6 py-4">{GPSLongitude}</td>
      <td className="px-6 py-4">{DateTimeOriginal}</td>
      <td className="px-6 py-4">{target || "null"}</td>
    </tr>
  );
};

const MAX_ITEMS_IN_PAGE = 5;
const MAX_PAGES = 10;

const FindGush = ({}: Props) => {
  const [gushInput, setGushInput] = useState("");
  const [result, setResult] = useState<TableItemProps[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTableHeader, setShowTableHeader] = useState(false);
  const [numOfPages, setNumOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleClick = async () => {
    handleClear();
    setLoading(true);
    try{
      const toastId = toast.loading('Loading...')
      const data = await getData(gushInput);
      if(data.data && data.success){
        toast.success("Success", {id: toastId, duration: 2000})
        setShowTable(true);
        setShowTableHeader(true);
        setResult(data.data);
      } else {
        toast.error("Error", {id: toastId, duration: 2000})
        setShowTable(false);
        setResult([]);
      }
    } catch (err){
      console.error(err)
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setShowTable(false);
    let timeout;
    timeout = setTimeout(() => {
      setResult([]);
    }, 500);
    clearTimeout(timeout)
  };

  const handlePageClicked = (pageIndex: number) => {
      setCurrentPage(pageIndex);
  }

  return (
    <div className={"w-screen h-screen flex justify-center items-center overflow-x-hidden lg:overflow-y-hidden p-12 max-h-screen"}>
      <Toaster />
      <div className={"flex flex-col justify-center items-center gap-4"}>
        <label className={"text-white text-2xl"}>Gush num</label>
        <input
          className={"p-2 rounded-xl shadow-md focus:outline-none"}
          type="number"
          value={gushInput}
          onChange={(e) => setGushInput(e.target.value)}
        ></input>
        <button onClick={handleClick}>
          <div className={"bg-white rounded-lg px-4 py-2"}>Search</div>
        </button>
        <motion.div
          className="overflow-x-auto relative overflow-hidden"
          animate={{
            height: showTable ? "auto" : 0,
          }}
          transition={{ type: "linear" }}
        >
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          {showTableHeader && (
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Source file
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Latitude
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Longitude
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Target
                          </th>
                        </tr>
                      </thead>
          )}
            {result && (
              <tbody>
                {result.slice(MAX_ITEMS_IN_PAGE * (currentPage - 1), MAX_ITEMS_IN_PAGE * currentPage).map((item, i) => (
                  <TableItem item={item} key={i.toString()} />
                ))}
              </tbody>
            )}
          </table>
        </motion.div>
        {showTable && (
          <>
        <button onClick={handleClear} className="bg-white p-2 rounded-lg px-4">
          <div className="self-center">Clear</div>
        </button>
        <p>{`Number of items: ${result.length}`}</p>
        {result.length > 5 && <div className="flex flex-row">
        {Array(Math.ceil(result.length / MAX_ITEMS_IN_PAGE)).fill(0).slice(0, MAX_PAGES).map((_, i) => {
          return (
            <button onClick={() => {
              handlePageClicked(i + 1)
            }} className={`border border-t-0 border-b-0 border-black p-2 px-4 hover:bg-slate-50 ${currentPage - 1 === i ? "bg-slate-50" : 'bg-slate-300'} transition-all`} key={i.toString()}>{i + 1}</button>
            )
          })}
          </div>
}
          </>
        )}
      </div>
        {/* <motion.div style={{pointerEvents: loading ? 'auto' : 'none'}} animate={{opacity: loading ? 1 : 0}} className={`absolute flex w-full h-full bg-[#ffffff80] justify-center items-center`}>
          <Lottie animationData={Gears} className="w-52 h-52"/>
        </motion.div> */}
    </div>
  );
};

export default FindGush;
