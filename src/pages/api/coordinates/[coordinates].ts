import type { NextApiRequest, NextApiResponse } from "next";
import * as mariadb from "mariadb";
import * as turf from "turf";
import * as itm from "itm-wgs84";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

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
      "SELECT SourceFile,GPSLatitude,GPSLongitude from aviation.gpsdata"
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

    // JSON.parse(gushim[0].geometry_coordinates)[0][0].map((pt: any) => {
    //   if(pt[0] > 100){
    //     const { lat, long } = itm.ITMtoWGS84(pt[0], pt[1]);
    //     newPoly.push([lat, long]);
    //   } else {
    //     newPoly.push([pt[1], pt[0]])
    //   }
    // });

    const imgArr: any[] = [];

    const poly = turf.polygon([newPoly]);

    gpsdata.map((pt: any) => {
      const point = turf.point([pt.GPSLatitude, pt.GPSLongitude]);
      const contains = booleanPointInPolygon(point, poly);
      if (contains) {
        imgArr.push(pt.SourceFile);
      }
    });
    if(imgArr.length === 0){
      res.status(200).json({success: true, data: []})
      return;
    }
    const baseq = `SELECT SourceFile,GPSLatitude,GPSLongitude,DateTimeOriginal,target from aviation.gpsdata where SourceFile in(${imgArr.map(
      (img) => `'${img}'`
    )})`;
    const imgData = await conn.query(baseq);

    res.status(200).json({ success: true, data: imgData });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, data: null, error: err});
  } finally {
    if (conn) {
      conn.end();
    }
  }
}
