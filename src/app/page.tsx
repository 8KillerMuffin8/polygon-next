"use client";
import ActionButton from "@/components/ActionButton";
import { CoordItem } from "@/components/CoordItem";
import ErrorToast from "@/components/ErrorToast";
import ExportModal from "@/components/ExportModal";
import InputStringModal from "@/components/InputStringModal";
import Paginator from "@/components/Paginator";
import TableHeader from "@/components/TableHeader";
import { TableItem, TableItemProps } from "@/components/TableItem";
import { MAX_ITEMS_IN_PAGE, MAX_PAGES } from "@/utils/constants";
import { PlusIcon } from "@heroicons/react/24/outline";
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

async function getDataByCoords(coords: Coordinate[]) {
  try {
    const res = await fetch(`/api/coordinates/${JSON.stringify(coords)}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export type Coordinate = {
  Latitude: number | string;
  Longitude: number | string;
};

const FindGush = ({}: Props) => {
  const [gushInput, setGushInput] = useState("");
  const [result, setResult] = useState<TableItemProps[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTableHeader, setShowTableHeader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputStringModalOpen, setInputStringModalOpen] = useState(false);
  const [inputMethod, setInputMethod] = useState<"coordinates" | "gush">(
    "gush"
  );
  const [coordinates, setCoordinates] = useState<Coordinate[]>([
    {
      Latitude: 0,
      Longitude: 0,
    },
    {
      Latitude: 0,
      Longitude: 0,
    },
    {
      Latitude: 0,
      Longitude: 0,
    },
  ]);

  const handleSearch = async () => {
    handleClear();
    setLoading(true);
    const toastId = toast.loading("Loading...");
    try {
      if(inputMethod === 'gush') {
        const data = await getData(gushInput);
        if (data.data && data.success) {
          toast.success("Success", { id: toastId, duration: 2000 });
          setShowTable(true);
          setShowTableHeader(true);
          setResult(data.data);
        } else {
          toast.dismiss(toastId)
          toast((t) => <ErrorToast t={t} toast={toast} error={data.error}/>
          , {duration: Infinity});  
          console.error(data);             
          setShowTable(false);
          setResult([]);
        }
      } else {
        const data = await getDataByCoords(coordinates);
        if (data.data && data.success) {
          toast.success("Success", { id: toastId, duration: 2000 });
          setShowTable(true);
          setShowTableHeader(true);
          setResult(data.data);

        } else {   
          toast.dismiss(toastId)
          toast((t) => <ErrorToast t={t} toast={toast} error={data.error}/>
          , {duration: Infinity});  
          console.error(data.error);             
          setShowTable(false);
          setResult([]);        
        }
      }
    } catch (err) {
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
    clearTimeout(timeout);
  };

  const handleExport = () => {
    setModalOpen(true);
  };
  
  const openInputStringModal = () => {
    setInputStringModalOpen(true);
  }

  const handlePageClicked = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const handleAddCoordinate = () => {
    setCoordinates((old) => [...old, { Latitude: 0, Longitude: 0 }]);
  };

  // This is very silly.
  const flat = (arr: any[]) => {
    const str = JSON.stringify(arr);
    let indexOfLastBrace = 0;
    while(str[indexOfLastBrace] === '[') {
      indexOfLastBrace += 1;
    }
    return JSON.parse(str).flat(indexOfLastBrace - 2 > 0 ? indexOfLastBrace - 2 : 0);
  }

  const handleApplyCoordinates = (str: string) => {
    const newCoordinates: Coordinate[] = [];
    try{
      const inputArr = flat(JSON.parse(str));
      inputArr.map((item: any) => {
        newCoordinates.push({
          Latitude: item[0],
          Longitude: item[1]
        })
      })
      setCoordinates(newCoordinates)
    } catch (err) {
      console.error(err)
    } finally {
      setInputStringModalOpen(false);
    }
  }

  const handleDeleteItem = (index: number) => {
    let newCoordinates = coordinates;
    newCoordinates = newCoordinates.filter((_, i) => i !== index);
    setCoordinates(newCoordinates);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "Latitude" | "Longitude",
    index: number
  ) => {
    let newCoordinates = [...coordinates];
    newCoordinates[index] = {
      ...newCoordinates[index],
      [type]: e.target.value,
    };
    setCoordinates(newCoordinates);
  };

  return (
    <div
      className={
        "flex justify-center items-center p-12 min-height=screen"
      }
    >
      <Toaster />
      <ExportModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        data={result}
        fileName={`gush_${gushInput}`}
      />
      <InputStringModal 
      modalOpen={inputStringModalOpen}
      setModalOpen={setInputStringModalOpen}
      handleApply={handleApplyCoordinates}
      />
      <div className={"flex flex-col justify-center items-center gap-4"}>
        <label className={"text-white text-2xl"}>
          {inputMethod === "coordinates" ? "Coordinates" : "Gush num"}
        </label>
        {inputMethod === "gush" ? (
          <>
            <input
              className={"p-2 rounded-xl shadow-md focus:outline-none"}
              type="number"
              value={gushInput}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  handleSearch();
                }
              }}
              onChange={(e) => setGushInput(e.target.value)}
            ></input>
          </>
        ) : (
          <div>
            <div className="max-h-24 overflow-auto">
            {coordinates.map((coord, index) => {
              return (
                <CoordItem
                  handleChange={handleChange}
                  handleDeleteItem={handleDeleteItem}
                  coord={coord}
                  index={index}
                  key={index.toString()}
                />
              );
            })}
            </div>
            <button
              onClick={handleAddCoordinate}
              className="flex bg-slate-600 w-full justify-between mt-2 p-2 text-white"
            >
              <p>Add coordinate</p>
              <PlusIcon width={24} height={24} />
            </button>
          </div>
        )}
        <div className="flex flex-row gap-3">
        <ActionButton onPress={handleSearch} label="Search" />
        {inputMethod === 'coordinates' && <ActionButton onPress={openInputStringModal} label="Input string"/>}
        </div>
        <button
          onClick={() =>
            setInputMethod((old) =>
              old === "coordinates" ? "gush" : "coordinates"
            )
          }
        >
          <p className="underline text-white">{`Search by ${
            inputMethod === "gush" ? "Coordinates" : "Gush"
          }`}</p>
        </button>
        <motion.div
          className="overflow-x-auto relative overflow-hidden"
          animate={{
            height: showTable ? "auto" : 0,
          }}
          transition={{ type: "linear" }}
        >
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            {showTableHeader && <TableHeader />}
            {result && (
              <tbody>
                {result
                  .slice(
                    MAX_ITEMS_IN_PAGE * (currentPage - 1),
                    MAX_ITEMS_IN_PAGE * currentPage
                  )
                  .map((item, i) => (
                    <TableItem item={item} key={i.toString()} />
                  ))}
              </tbody>
            )}
          </table>
        </motion.div>
        {showTable && (
          <>
            <div className="flex flex-row gap-4">
              <ActionButton onPress={handleClear} label="Clear" />
              <ActionButton onPress={handleExport} label="Export" />
            </div>
            <p>{`Number of items: ${result.length}`}</p>
            <Paginator
              handlePageClicked={handlePageClicked}
              numOfPages={Math.min(
                MAX_PAGES,
                result.length / MAX_ITEMS_IN_PAGE
              )}
              currentPage={currentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FindGush;
