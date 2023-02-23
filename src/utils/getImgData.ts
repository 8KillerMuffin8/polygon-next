import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { QUERIES } from "./constants";
import turf from "turf";

export const getImgData = async (newPoly: any[], gpsdata: any, conn: any) => {
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
            return null;
        }
        const baseq = `${QUERIES.IMGDATA}${imgArr.map(
          (img) => `'${img}'`
        )})`;
        const imgData = await conn.query(baseq);
        return imgData
}