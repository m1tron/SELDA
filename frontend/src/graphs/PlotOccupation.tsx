import * as d3 from 'd3';
import {useEffect, useRef} from "react";
import * as React from "react";

export interface OccupationData {
    occupation_field_label: string;
    count: string;
}


interface BarChartProps {
    data: OccupationData[];
}


export const PlotOccupationTrends: React.FC<BarChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const topData = data
            .map(d => ({ ...d, count: Number(d.count) }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 25);

        const margin = { top: 20, right: 30, bottom: 80, left: 200 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .html("")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(topData, d => d.count)!])
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(topData.map(d => d.occupation_field_label))
            .range([0, height])
            .padding(0.3);

        svg.selectAll(".bar")
            .data(topData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", d => yScale(d.occupation_field_label)!)
            .attr("width", d => xScale(d.count))
            .attr("height", yScale.bandwidth())
            .attr("fill", "steelblue")
            .on("mouseenter", (_, d) => {
                tooltip.style("visibility", "visible")
                    .text(`${d.occupation_field_label}: ${d.count} posts`);
            })
            .on("mousemove", (event) => {
                tooltip.style("top", `${event.pageY - 10}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseleave", () => {
                tooltip.style("visibility", "hidden");
            });

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .selectAll("text")
            .style("text-anchor", "middle");

        svg.append("g")
            .call(d3.axisLeft(yScale));

        const tooltip = d3.select("body").append("div")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.7)")
            .style("color", "white")
            .style("padding", "5px 10px")
            .style("border-radius", "5px")
            .style("font-size", "12px")
            .style("visibility", "hidden");

    }, [data]);

    return <svg ref={svgRef}></svg>;
}