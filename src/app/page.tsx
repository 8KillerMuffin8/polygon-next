"use client";
import ActionButton from "@/components/ActionButton";
import ExportModal from "@/components/ExportModal";
import Paginator from "@/components/Paginator";
import TableHeader from "@/components/TableHeader";
import { TableItem, TableItemProps } from "@/components/TableItem";
import { MAX_ITEMS_IN_PAGE, MAX_PAGES } from "@/utils/constants";
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

const FindGush = ({}: Props) => {
  const [gushInput, setGushInput] = useState("");
  const [result, setResult] = useState<TableItemProps[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTableHeader, setShowTableHeader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = async () => {
    handleClear();
    setLoading(true);
    try {
      const toastId = toast.loading("Loading...");
      const data = await getData(gushInput);
      if (data.data && data.success) {
        toast.success("Success", { id: toastId, duration: 2000 });
        setShowTable(true);
        setShowTableHeader(true);
        setResult(data.data);
      } else {
        toast.error("Error", { id: toastId, duration: 2000 });
        setShowTable(false);
        setResult([]);
      }
    } catch (err) {
      console.error(err);
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

  const handlePageClicked = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div
      className={
        "w-screen h-screen flex justify-center items-center overflow-x-hidden lg:overflow-y-hidden p-12 max-h-screen"
      }
    >
      <Toaster />
      <ExportModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        data={result}
        fileName={`gush_${gushInput}`}
      />
      <div className={"flex flex-col justify-center items-center gap-4"}>
        <label className={"text-white text-2xl"}>Gush num</label>
        <input
          className={"p-2 rounded-xl shadow-md focus:outline-none"}
          type="number"
          value={gushInput}
          onChange={(e) => setGushInput(e.target.value)}
        ></input>
        <ActionButton onPress={handleSearch} label="Search" />
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
