import type { NextApiRequest, NextApiResponse } from "next";
import * as mariadb from "mariadb";
import * as turf from "turf";
import * as itm from "itm-wgs84";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { QUERIES } from "@/utils";
import { getImgData } from "@/utils/getImgData";

type Data = {
  success: boolean;
  data?: any;
  error?: any;
  stackTrace?: any
};

type Coordinate = {
    Latitude: number;
    Longitude: number;
}

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

    const gpsdata = await conn.query(
      QUERIES.GPSDATA
    );

    if(!coordinates){
        res.status(500).json({success: false, data: [], error: "Missing data"})
        return;
    }

    const newPoly: any[] = [];

    const coordArr: Coordinate[] = JSON.parse(coordinates as string);

    coordArr!.map((coord: Coordinate) => {
        if(coord.Latitude > 100){
        const { lat, long } = itm.ITMtoWGS84(coord.Latitude, coord.Longitude);
        newPoly.push([lat, long]);
      } else {
        newPoly.push([coord.Longitude, coord.Latitude])
      }
    })

    const imgData = await getImgData(newPoly, gpsdata, conn)

    res.status(200).json({ success: true, data: imgData });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, data: null, error: err instanceof Error && err.message});
  } finally {
    if (conn) {
      conn.end();
    }
  }
}
