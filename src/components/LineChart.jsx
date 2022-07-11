import { scaleLinear, scaleTime, scaleOrdinal } from '@visx/scale';
import { LinePath, Bar } from '@visx/shape';
import { extent, max } from 'd3-array';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom } from '@visx/axis';
import { AxisLeft } from '@visx/axis';
import { format } from 'date-fns';
import { LegendOrdinal } from '@visx/legend';
import React from 'react';
import COLORS from '../constants/COLORS';


const defaultMargin = {top: 30, right: 25, bottom: 50, left: 70};
const defaultColorScheme = Object.values(COLORS);

const ArrestsChart = ({dataset, xAccessor, width, height, margin = defaultMargin, colorScheme = defaultColorScheme}) => {

  const keys = Object.keys(dataset[0]).filter((k) => k !== xAccessor);

  const lines = keys.map((k) => ({label: k, data: dataset.map( (d) => ({x: d[xAccessor], y: d[k]}) )} ));

  const getX = (d) => d.x;
  const getY = (d) => d.y;
  const getMaxY = (d) => Math.max(...keys.map((k) => d[k]));

  const xScale = scaleTime({
    domain: extent(dataset, (d) => d[xAccessor])
  });

  const yScale = scaleLinear({
    domain: [0, max(dataset, getMaxY)]
  });

  const colorScale = scaleOrdinal({
    domain: keys,
    range: colorScheme,
  })

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  return (<svg width={width} height={height}>
    <Group top={margin.top} left={margin.left}>
      <Grid 
        xScale={xScale}
        yScale={yScale}
        fill="#fff"
        strokeWidth={1}
        numTicksColumns={0}
        numTicksRows={9}
        width={xMax}
        height={yMax}
      />
      {
        lines.map((points) => <LinePath 
            key={`line-${points.label.split(' ').join('-')}`}
            data={points.data}
            x={(d) => xScale(getX(d)) ?? 0}
            y={(d) => yScale(getY(d)) ?? 0}
            stroke={colorScale(points.label)}
            strokeWidth={2} />
        )
      }
      <AxisBottom 
        scale={xScale}
        top={yMax}
        tickFormat={(d) => format(d, "MMM ''yy")}
      />
      <AxisLeft 
        scale={yScale}
        top={0}
      />
    </Group>
    <LegendOrdinal scale={colorScale}>
      {
        (labels) => (
          <Group
            top={height - 10}
            left={width / 2 - 75}
          >
            {
              labels.map((label, i) => (
                <Group left={i * 85}
                  key={`group-${label.value.split(' ').join('-')}`}
                >
                  <Bar height="2" width="10" fill={label.value} />
                  <text
                    x="15"
                    y="5"
                    fontSize="12"
                    textAnchor="top"
                  >
                    {label.text}
                  </text>
                </Group>
              ))
            }
          </Group>
        )
      }
    </LegendOrdinal>
  </svg>);
}

export default ArrestsChart;
