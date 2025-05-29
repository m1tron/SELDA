import * as d3 from 'd3';
import {useEffect, useRef, useState} from "react";
import * as React from "react";

interface LineChartProps {
    data: KeywordData[];
}

export interface KeywordData {
    date: Date;
    total_postings: number;
}

export const PlotKeywordSearch: React.FC<LineChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [width, setWidth] = useState(window.innerWidth * 0.9);
    const [formattedData, setFormattedData] = useState<{ date: Date; total_postings: number }[]>([]);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth * 0.9);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        console.log(formattedData);
        
        if (!data || data.length === 0 || !svgRef.current) return;
       
        const formatted = data
        .map(d => ({
            date: d.date,
            total_postings: Number(d.total_postings),
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

        setFormattedData(formatted); // Store for download button

        const height = 400;
        const margin = { top: 20, right: 30, bottom: 50, left: 50 };

        const xExtent = d3.extent(formatted, d => d.date) as [Date, Date];
        const yExtent = d3.extent(formatted, d => d.total_postings) as [number, number];

        const yMin = Math.min(0, yExtent[0]);
        const yMax = yExtent[1];

        const xScale = d3.scaleTime()
            .domain(xExtent) // Använder exakt min/max för att visa dem på axeln
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("background", "black");

        svg.selectAll("*").remove();

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
            )
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale)
                .ticks(6)
            )
            .call(g => g.select(".domain").remove()) // Ta bort axellinjen för renare utseende
            .call(g =>
                g.append("g")
                    .attr("transform", `translate(-10,${yScale(yMin)})`)
                    .append("text")
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .text(yMin)
            )
            .call(g =>
                g.append("g")
                    .attr("transform", `translate(-10,${yScale(yMax)})`)
                    .append("text")
                    .attr("fill", "black")
                    .attr("text-anchor", "end")
                    .text(yMax)
            );

        const line = d3.line<{ date: Date; total_postings: number }>()
            .x(d => xScale(d.date))
            .y(d => yScale(d.total_postings))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(formatted)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.selectAll("circle")
            .data(formatted)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.total_postings))
            .attr("r", 4)
            .attr("fill", "lightblue");

        const tooltip = d3.select("body").append("div")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.7)")
            .style("color", "white")
            .style("padding", "5px 10px")
            .style("border-radius", "5px")
            .style("font-size", "12px")
            .style("visibility", "hidden");

        svg.selectAll(".dot")
            .data(formatted)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.total_postings))
            .attr("r", 5)
            .attr("fill", "steelblue")
            .on("mouseenter", (_, d) => {
                tooltip.style("visibility", "visible")
                    .text(`[${d.date.toISOString().slice(0, 7)}] ${d.total_postings} posts`);
            })
            .on("mousemove", (event) => {
                tooltip.style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseleave", () => {
                tooltip.style("visibility", "hidden");
            });

    }, [data, width]);

    const handleDownload = () => {
        const header = "date,total_postings";
        const rows = formattedData.map(d =>
            `${d.date.toISOString().slice(0, 10)},${d.total_postings}`
        );
        const csvContent = [header, ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "keyword_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col items-center space-y-4 text-black">
          <button onClick={handleDownload}>⬇ Download Data</button>
          <div><svg ref={svgRef}></svg></div>
        </div>
      );
};
