import type { NextApiRequest, NextApiResponse } from "next";
import * as mariadb from "mariadb";
import * as turf from "turf";
import * as itm from "itm-wgs84";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { QUERIES } from "@/utils";
import { getImgData } from "@/utils/getImgData";
import { getGpsData } from "@/utils/getGpsData";

type Data = {
  success: boolean;
  data?: any;
  error?: any;
  stackTrace?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { gush_arr } = req.query;
  const CONNECTION_LIMIT = 5;

  let conn: any;
  try {
    const pool = mariadb.createPool({
      host: process.env.DB_URL,
      user: process.env.DB_USER,
      password: process.env.PASSWORD,
      connectionLimit: CONNECTION_LIMIT,
    });
    conn = await pool.getConnection();
    const gushim = await conn.query(
      `${QUERIES.GUSH_ARR}(${gush_arr?.slice(1, gush_arr.length - 1)})`
    );

    if (!gushim[0]) {
      res
        .status(200)
        .json({ success: false, error: "gush not found", data: [] });
    }

    const gpsdata = await getGpsData(conn);
    const polygons: { value: any; key: any }[] = [];

    gushim.map((gush: any, i: number) => {
      const newPoly: any[] = [];
      const gushim_keys = JSON.parse(gush_arr as string);

      JSON.parse(gush.geometry_coordinates)[0][0].map((pt: any) => {
        if (pt[0] > 100) {
          const { lat, long } = itm.ITMtoWGS84(pt[0], pt[1]);
          newPoly.push([lat, long]);
        } else {
          newPoly.push([pt[1], pt[0]]);
        }
      });
      polygons.push({
        value: newPoly,
        key: gushim_keys[i],
      });
    });

    const imgData = await Promise.allSettled(polygons.map(async (poly) => {
      const polyData = await getImgData(poly.value, gpsdata, conn);
      return {
        gush_data: polyData,
        gush_num: poly.key
      };
    }));

    res.status(200).json({ success: true, data: imgData });
  } catch (err) {
    res
      .status(500)
      .json({
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
