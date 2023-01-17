import type { NextApiRequest, NextApiResponse } from "next";
import * as mariadb from "mariadb";
import * as turf from "turf";
import * as itm from "itm-wgs84";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

type Data = {
  success: boolean;
  data?: any;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { gush_num } = req.query;
  const URL = "185.32.178.53";
  const USER = "ubuntu";
  const PASSWORD = "0315";
  const CONNECTION_LIMIT = 5;

  let conn;
  try {
    const pool = mariadb.createPool({
      host: URL,
      user: USER,
      password: PASSWORD,
      connectionLimit: CONNECTION_LIMIT,
    });
    conn = await pool.getConnection();

    const gushim = await conn.query(
      `SELECT * from aviation.gushim where GUSH_NUM=${gush_num}`
    );

    if (!gushim) {
      res.status(400).json({ success: false, error: "gush not found" });
    }

    const gpsdata = await conn.query(
      "SELECT SourceFile,GPSLatitude,GPSLongitude from aviation.gpsdata"
    );

    const newPoly: any[] = [];

    JSON.parse(gushim[0].geometry_coordinates)[0][0].map((pt: any) => {
      const { lat, long } = itm.ITMtoWGS84(pt[0], pt[1]);
      newPoly.push([lat, long]);
    });

    const imgArr: any[] = [];

    const poly = turf.polygon([newPoly]);

    gpsdata.map((pt: any) => {
      const point = turf.point([pt.GPSLatitude, pt.GPSLongitude]);
      const contains = booleanPointInPolygon(point, poly);
      if (contains) {
        imgArr.push(pt.SourceFile);
      }
    });

    const baseq = `SELECT SourceFile,GPSLatitude,GPSLongitude,DateTimeOriginal,target from aviation.gpsdata where SourceFile in(${imgArr.map(
      (img, i) => `'${img}'`
    )})`;
    const imgData = await conn.query(baseq);

    res.status(200).json({ success: true, data: imgData });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, data: null, error: "Internal server error" });
  } finally {
    if (conn) {
      conn.end();
    }
  }
}
