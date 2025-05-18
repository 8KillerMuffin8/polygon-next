import { QUERIES } from "@/utils";
import { getImgData } from "@/utils/getImgData";
import * as itm from "itm-wgs84";
import * as mariadb from "mariadb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  data?: any;
  error?: any;
  stackTrace?: any;
};

type Coordinate = {
  Latitude: number;
  Longitude: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { coordinates } = req.query;
  const CONNECTION_LIMIT = 5;

  let conn;
  try {
    const pool = mariadb.createPool({
      host: process.env.DB_URL,
      user: process.env.DB_USER,
      password: process.env.PASSWORD,
      connectionLimit: CONNECTION_LIMIT,
    });
    conn = await pool.getConnection();

    const gpsdata = await conn.query(QUERIES.GPSDATA);

    if (!coordinates) {
      res.status(500).json({ success: false, data: [], error: "Missing data" });
      return;
    }

    const newPoly: any[] = [];

    const coordArr: Coordinate[] = JSON.parse(coordinates as string);

    coordArr!.map((coord: Coordinate) => {
      if (coord.Latitude > 100) {
        const { lat, long } = itm.ITMtoWGS84(coord.Latitude, coord.Longitude);
        newPoly.push([lat, long]);
      } else {
        newPoly.push([coord.Longitude, coord.Latitude]);
      }
    });

    const imgData = await getImgData(newPoly, gpsdata, conn);

    await conn.query("DELETE FROM aviation.search_import");
    await Promise.all(
      imgData.map(async (img) => {
        await conn.query(
          "INSERT INTO aviation.search_import (SourceFile, GPSLatitude, GPSLongitude, DateTimeOriginal, target) VALUES (?, ?, ?, ?, ?)",
          [
            img.SourceFile,
            img.GPSLatitude,
            img.GPSLongitude,
            new Date(img.Datetimeoriginal),
            img.target,
          ]
        );
      })
    );

    res.status(200).json({ success: true, data: imgData });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: err instanceof Error && err.message,
    });
  } finally {
    if (conn) {
      conn.end();
    }
  }
}
