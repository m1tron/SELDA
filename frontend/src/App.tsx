import { useRef, useState } from 'react';
import './App.css';
import { DbHandler } from "./database/dbHandler.ts";
import { PlotKeywordSearch, KeywordData } from "./graphs/PlotKeyword.tsx";
import { PlotOccupationTrends, OccupationData } from "./graphs/PlotOccupation.tsx";

const minYear = 2016;
const maxYear = 2024;

function App() {
    // Query parameters
    const [minValue, setMinValue] = useState<number>(minYear);
    const [maxValue, setMaxValue] = useState<number>(maxYear);
    const [fieldValue, setFieldValue] = useState<string>('');
    const [fieldValue2, setFieldValue2] = useState<string>('');

    const [showRange, setShowRange] = useState<boolean>(false);
    const [searchType, setSearchType] = useState<string>('keyword');

    const [searchResults, setSearchResults] = useState<KeywordData[]>([]);
    const [occupationResults, setOccupationResults] = useState<OccupationData[]>([]);
    const [yearRangeData, setYearRangeData] = useState<{ min: number, max: number }>({ min: 0, max: 0 });
    const dbHandler = useRef(new DbHandler()).current;
    const [latestSearchType, setLatestSearchType] = useState<string>('');

    function updateMin(i: number): boolean {
        if (i < minYear) {
            setMinValue(minYear);
            return false;
        }
        else if (i > maxValue) {
            setMinValue(maxValue);
            return false;
        }
        else {
            setMinValue(i);
            return true;
        }
    }

    function updateMax(i: number): boolean {
        if (i > maxYear) {
            setMaxValue(maxYear);
            return false;
        }
        else if (i < minValue) {
            setMaxValue(minValue);
            return false;
        }
        else {
            setMaxValue(i);
            return true;
        }
    }

    function search() {

        let max;
        let min;
        if (showRange) {
            max = maxValue;
            min = minValue;
        } else {
            max = maxYear;
            min = 2022;
        }
        if (searchType === "occupation") {
            dbHandler.getOccupationTrends(min, max).then(res => {
                setOccupationResults(res.data.rows);
                setYearRangeData({ min: min, max: max });
                setLatestSearchType(searchType);

            });
            return
        } else if (searchType === "keyword") {
            dbHandler.searchDescriptionByKeyword(fieldValue, min, max)
            .then(res => dbHandler.addBlankMonths(res)).then(data => {
                setSearchResults(data);
                setLatestSearchType(searchType);
            });
            return;
        }
        else if (searchType === "headline") {
            dbHandler.searchHeadlineByKeyword(fieldValue, min, max, fieldValue2)
            .then(res => dbHandler.addBlankMonths(res)).then(data => {
                setSearchResults(data);
                setLatestSearchType(searchType);
            });
            return;
        }
    }

    const RangeComponent = () => {
        if (!showRange) {
            return null;
        }
        return (
            <div className={"rangeContainer"}>
                <label className={"rangeLabel"}>Start</label>
                <input className={"queryInput"} type="number" value={minValue} onChange={
                    (e) => {
                        e.target.classList.remove('invalid-input');
                        if (!updateMin(parseInt(e.target.value))) {
                            e.target.classList.add('invalid-input');
                        }
                    }
                }
                />
                <label className={"rangeLabel"}>End</label>
                <input className={"queryInput"} type="number" value={maxValue} onChange={
                    (e) => {
                        e.target.classList.remove('invalid-input');
                        if (!updateMax(parseInt(e.target.value))) {
                            e.target.classList.add('invalid-input');
                        }
                    }
                }
                />
            </div>
        );
    }

    return (
        <div>
            <div className={"searchResultsContainer"}>
                {latestSearchType === "keyword" && (
                    <div>
                        <PlotKeywordSearch data={searchResults}></PlotKeywordSearch>
                    </div>

                )}
                {latestSearchType === "headline" && (
                    <div>
                        <PlotKeywordSearch data={searchResults}></PlotKeywordSearch>
                    </div>

                )}
                {latestSearchType === "occupation" && (
                    <div>
                        <p>Most common occupation fields for range: {yearRangeData.min} - {yearRangeData.max}</p>
                        <PlotOccupationTrends data={occupationResults}></PlotOccupationTrends>
                    </div>
                )}
            </div>
            <div className={"searchContainer"}>

                <div className={"searchTypeContainer"}>
                    <button className={`searchButton ${searchType === "occupation" ? "selectedButton" : ""}`} id={"occupationTrendSearchSelect"} onClick={() => {
                        setSearchType("occupation");
                    }}>Occupation Trends</button>
                    <button className={`searchButton ${searchType === "keyword" ? "selectedButton" : ""}`} id={"keywordSearchSelect"} onClick={() => {
                        setSearchType("keyword");
                    }}>Keyword</button>
                    <button className={`searchButton ${searchType === "headline" ? "selectedButton" : ""}`} id={"headlineSearchSelect"} onClick={() => {
                        setSearchType("headline");
                    }}>Headline</button>
                </div>
                <div>
                    <input id={"fieldQuery"} type="text" className={"queryInput"}
                        disabled={searchType === "occupation"} placeholder={searchType != "headline" ? "Enter free text keyword.." : "Enter heading keyword.."} value={fieldValue} onInput={(e) => {
                            setFieldValue(e.currentTarget.value);
                        }} />
                    <input id={"fieldQuery2"} type="text" className={"queryInput"}
                        disabled={searchType != "headline"} hidden={searchType != "headline"} value={fieldValue2} onInput={(e) => {
                            setFieldValue2(e.currentTarget.value)
                        }} placeholder="Optional description filter.."
                    />
                </div>
                <RangeComponent></RangeComponent>
                <button id={"rangeCheckbox"} className={"searchButtonInv"} onClick={() => {
                    setShowRange(!showRange);
                }}>{showRange ? "Search Recent" : "Search by Range"} ⇆</button>
                <div className={"searchButtonContainer"}>
                    <button className={"searchButton"} onClick={search}>Search ⌕</button>
                    <button className={"searchButton"} onClick={() => {
                        setMinValue(minYear);
                        setMaxValue(maxYear);
                        setFieldValue('');
                    }}>Clear 🗑 ️</button>
                </div>
            </div>
            <div className="footer-divider"></div>
            <footer className="footer">
                <div className="footer-glow"></div>
                <p className="footer-text">
                    by emjo2210@miun && heos2200@miun
                </p>
            </footer>
        </div>

    );
}

export default App
