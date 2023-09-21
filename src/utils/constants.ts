export const MAX_ITEMS_IN_PAGE = 5;
export const MAX_PAGES = 10;

export const QUERIES = {
  GPSDATA: "SELECT SourceFile,GPSLatitude,GPSLongitude from aviation.gpsdata",
  IMGDATA: "SELECT * from aviation.gpsdata where SourceFile in(",
  GUSHIM: "SELECT * from aviation.gushim where GUSH_NUM=",
  GUSH_ARR: "SELECT * from aviation.gushim where GUSH_NUM in",
} as const;
