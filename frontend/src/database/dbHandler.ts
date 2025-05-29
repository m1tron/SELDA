import axios from "axios";
import { KeywordData } from "../graphs/PlotKeyword";

const localURL = "http://localhost:3000";
const apiPath = "/api/v1";

const connection = axios.create({
    baseURL: localURL + apiPath,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    responseType: "json",
});

export class DbHandler {
    constructor() { }

    searchDescriptionByKeyword = async (queryString: string, rangeLowerLim: number, rangeUpperLim: number): Promise<KeywordData[]> => {
        const url = "/search/description";
        const res = await connection.post(url, {
            searchString: queryString,
            min: `${rangeLowerLim.toString()}-01-01 00:00:00`,
            max: `${rangeUpperLim.toString()}-12-31 23:59:59`,
        })
        return res.data.rows.map((d: { date: string; total_postings: number }) => ({
            date: new Date(d.date),
            total_postings: d.total_postings,
          }));
    }

    searchHeadlineByKeyword = async (queryString: string, rangeLowerLim: number, rangeUpperLim: number, descriptionString: string | undefined): Promise<KeywordData[]> => {
        const url = `/search/headline${descriptionString ? "_description" : ""}`;
        const res = await connection.post(url, {
            searchString: queryString,
            min: `${rangeLowerLim.toString()}-01-01 00:00:00`,
            max: `${rangeUpperLim.toString()}-12-31 23:59:59`,
            descriptionString,
        })
        return res.data.rows.map((d: { date: string; total_postings: number }) => ({
            date: new Date(d.date),
            total_postings: d.total_postings,
          }));
    }

    getOccupationTrends = async (rangeLowerLim: number, rangeUpperLim: number): Promise<any> => {
        const res = await connection.post("/occupations", {
            min: `${rangeLowerLim.toString()}-01-01 00:00:00`,
            max: `${rangeUpperLim.toString()}-12-31 23:59:59`,
        })
        return res;
    }

    addBlankMonths = (data: KeywordData[]): KeywordData[] => {
        if (!data.length) return [];
      
        const filled: KeywordData[] = [];
        let i = 0;
      
        let current = new Date(data[0].date);
        const end = new Date(data[data.length - 1].date);
      
        while (current <= end) {
          const currentMonth = current.getFullYear() + "-" + String(current.getMonth() + 1).padStart(2, "0");
          const dataMonth = data[i].date.getFullYear() + "-" + String(data[i].date.getMonth() + 1).padStart(2, "0");
      
          const total_postings = currentMonth === dataMonth
            ? data[i++].total_postings
            : 0;
      
          filled.push({
            date: new Date(current),
            total_postings,
          });
      
          current.setMonth(current.getMonth() + 1);
        }
      
        return filled;
      };
}

