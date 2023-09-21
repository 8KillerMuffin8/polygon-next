import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import Modal from "react-modal";
import CheckBox from "./CheckBox";
import { XCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  data: any;
  fileName: string;
}

export default function ExportModal({
  modalOpen,
  setModalOpen,
  data,
  fileName,
}: Props) {
  const [exportHeaders, setExportHeaders] = useState({
    sourceFile: true,
    lat: true,
    long: true,
    alt: true,
    date: true,
    target: true,
    imu_roll: true,
    imu_pitch: true,
    imu_yaw: true,
    resolution: true,
    client: true
  });

  const [_data, _setData] = useState(data);

  useEffect(() => {
    _setData(data);
  }, [data]);

  useEffect(() => {
    let newData = data;
    newData = newData.map((item: any) => {
      const ret: any = {};
      if (exportHeaders.sourceFile) {
        ret["SourceFile"] = item.SourceFile;
      }
      if (exportHeaders.lat) {
        ret["GPSLatitude"] = item.GPSLatitude;
      }
      if (exportHeaders.long) {
        ret["GPSLongitude"] = item.GPSLongitude;
      }
      if (exportHeaders.date) {
        ret["DateTimeOriginal"] = item.DateTimeOriginal;
      }
      if (exportHeaders.target) {
        ret["target"] = item.target;
      }
      if (exportHeaders.imu_roll) {
        ret["imu_roll"] = item.IMURoll;
      }
      if (exportHeaders.imu_pitch) {
        ret["imu_pitch"] = item.IMUPitch;
      }
      if (exportHeaders.imu_yaw) {
        ret["imu_yaw"] = item.IMUYaw;
      }
      if (exportHeaders.resolution) {
        ret["resolution"] = item.resolution;
      }
      if (exportHeaders.client) {
        ret["client"] = item.Client;
      }
      return ret;
    });
    _setData(newData);
  }, [exportHeaders]);

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      style={{
        content: {
          top: "25%",
          left: "50%",
          right: "25%",
          bottom: "25%",
          transform: "translate(-50%)",
          border: "0px",
          borderRadius: "6%",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          backgroundColor: "rgb(100,116,139)",
        },
        overlay: {
          backgroundColor: "#000000aa",
        },
      }}
      contentLabel="Example Modal"
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-white text-xl flex">CSV Headers</h2>
          <button
            onClick={() => {
              setModalOpen(false);
            }}
          >
            <XCircleIcon className="w-8 text-white" />
          </button>
        </div>
        <div className="flex flex-col text-white">
          {Object.entries(exportHeaders).map(([key, value]) => {
            return (
              <CheckBox
                key={key}
                label={key}
                checked={value}
                setChecked={(newValue) =>
                  setExportHeaders({ ...exportHeaders, [key]: newValue })
                }
              />
            );
          })}

        </div>

        <CSVLink
          className="bg-white rounded-md p-2 text-center"
          data={_data}
          filename={fileName}
          enclosingCharacter=""
        >
          Export
        </CSVLink>
      </div>
    </Modal>
  );
}
