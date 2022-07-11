import React , { useState, useEffect, useRef, useMemo } from 'react';
import LineChart from './LineChart';

import {
  TableauViz,
} from 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';

const Chart = ({url, width = 800, height= 500}) => {

  const [data, setData] = useState([]);
  const [view, setView] = useState('table');
  const [columns, setColumns] = useState([]);

  const viewOptions = ['table', 'tableau', 'custom']

  const getUnderlyingData = async (viz) => {
    const sheet = viz.workbook.activeSheet;
    const underlyingTable = await sheet.getUnderlyingTablesAsync();
    const underlyingData = await sheet.getUnderlyingTableDataAsync(underlyingTable[0].id);
    setData(underlyingData._data);
    setColumns(underlyingData._columns);
    console.log(underlyingData._columns);
    console.log(underlyingData._data);
  }

  const viz =  new TableauViz();
  viz.addEventListener('firstinteractive', (e) => { getUnderlyingData(e.target) });
  viz.src = url;
  viz.toolbar = 'hidden';
  viz.height = height;
  viz.width = width;
  const containerRef = useRef();

  const dataReformatted = useMemo(() => {
    return data.map((d) => {
      return d.reduce((acc, curr, i) => {
        acc[columns[i]._fieldName] = curr._nativeValue;
        return acc;
      }, {})
    })
  }, [data, columns])
  
  useEffect(() => {
    containerRef.current.appendChild(viz);
  }, [])

  return (
    <div>
      <div>
        <label>
          {
            viewOptions.map((option) => (
              <label>
                <input type="radio"
                  checked={view === option}
                  value={option}
                  name="view-option"
                  onChange={() => {setView(option)}}
                  />
                {option}
              </label>
            ))
          }
        </label>
      </div>
      <div style={{width: `${width}px`, height: `${height}px`, display: `${view === 'tableau' ? 'block' : 'none'}`}} ref={containerRef}></div>
      <div style={{width: `${width}px`, height: `${height}px`, overflow: 'scroll', display: `${view === 'table' ? 'block' : 'none'}`}}>
        <table>
          <tbody>
            <tr>
              {
                columns.map((col) => (<th key={col._fieldName.split(' ').join('-')}>{col._fieldName}</th>))
              }
            </tr>
            {
              data.map((row, i) => <tr key={`row-${i}`}>{row.map((d) => <td>{d._formattedValue}</td>)}</tr>)
            }
          </tbody>
        </table>
      </div>
      <div style={{display: `${view === 'custom' ? 'block' : 'none'}`}}>
        <LineChart dataset={dataReformatted} width={width} height={height} xAccessor={columns[0]._fieldName} />
      </div>
    </div>
  )
}

export default Chart;