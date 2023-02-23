import { QUERIES } from "./constants";

export const getGpsData = async (conn: any) => {
    const gpsdata = await conn.query(
        QUERIES.GPSDATA
      );
    return gpsdata
}