import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { QUERIES } from "./constants";
import turf from "turf";

export const getImgData = async (newPoly: any[], gpsdata: any, conn: any) => {
    return new Promise(async (resolve, reject) => {
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
            reject(new Error("No data"))
            return;
        }
        const baseq = `${QUERIES.IMGDATA}${imgArr.map(
          (img) => `'${img}'`
        )})`;
        const imgData = await conn.query(baseq);
        resolve(imgData)
    })
}