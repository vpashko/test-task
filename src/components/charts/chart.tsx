import * as d3 from "d3";
import { Selection } from "d3-selection";
import React, { useEffect, useRef, useState } from "react";
import './chart.css';

const BarChart = ( {initialData} ) => {
  const ref = useRef<SVGSVGElement>(null);
  const [selection, setSelection] = useState<Selection<SVGSVGElement | null, unknown, null, undefined> | null>(null);
  const [data, setData] = useState<{ period_month: string, period_year: string, pay_package: string }[]>(initialData);

  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth * 0.5, 
    height: window.innerHeight * 0.3 
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ 
        width: window.innerWidth * 0.5, 
        height: window.innerHeight * 0.3 
      });
    };
  
    window.addEventListener('resize', handleResize);
  
    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setData(initialData);
  } , [initialData]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.pay_package)!])
    .range([0, dimensions.height]);

  const x = d3.scaleBand()
    .domain(data.map(d => d.pay_package))
    .range([0, dimensions.width])
    .padding(0.05);

  const tooltip = d3.select('body')
    .append('div')
    .style('cursor', 'pointer')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'honeydew')
    .style('opacity', 0);

  useEffect(() => {
    if (!selection) {
      setSelection(d3.select(ref.current) as Selection<SVGSVGElement | null, unknown, null, undefined>);
    } else {
        const rects = selection
          .selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('width', x.bandwidth())
          .attr('height', 0)
          .attr('x', d => x(d.pay_package)!)
          .attr('y', dimensions.height)
          .attr('fill', 'orange')
          .attr('cursor', 'pointer');

        rects.transition()
          .duration(300)
          .attr('height', d => y(+d.pay_package))
          .attr('y', d => dimensions.height - y(+d.pay_package))
          .delay((d, i) => i * 100);

        rects.on('mouseenter', (event, d) => {
          tooltip.transition().duration(0)
            .style('opacity', .9);
          tooltip.html(`${d.period_month}/${d.period_year} <br> ${d.pay_package}`)
            .style('left', (event.x - 40) + 'px')
            .style('top', (event.y - 60) + 'px');
        } )

        rects.on('mouseleave', () => {
          tooltip.style('opacity', 0);
        })
        
    }
  }, [selection, data, x, y]);

  const updateChart = () => {
    if (selection) {
      const rects = selection.selectAll('rect').data(data);

      rects.attr('opacity', 0);

      rects.exit().remove();

      const newRects = rects.enter()
        .append('rect')
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('x', d => x(d.pay_package)!)
        .attr('y', dimensions.height)
        .attr('fill', 'orange')
        .attr('cursor', 'pointer');

      newRects.transition()
        .duration(300)
        .attr('height', d => y(+d.pay_package))
        .attr('y', d => dimensions.height - y(+d.pay_package))
        .delay((d, i) => i * 100);

      rects.transition()
        .duration(300)
        .attr('width', x.bandwidth())
        .attr('height', d => y(+d.pay_package))
        .attr('x', d => x(d.pay_package)!)
        .attr('y', d => dimensions.height - y(+d.pay_package))
        .delay((d, i) => i * 100)
        .attr('opacity', 1)
    }
  }

  useEffect(() => {
    updateChart();
  } , [data, dimensions]);

  return (
    <div className="chart">
      <svg ref={ref} width={dimensions.width} height={dimensions.height}/>
    </div>
  );
};

export default BarChart;