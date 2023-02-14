import React, { useEffect, useState } from 'react';
// import DATA from './data/gemini_BTCUSD_2020_1min.csv';
import LineCharts from './LineChart';
import BarCharts from './BarChart';
import LoadingSpinner from './LoadingSpinner';

const options = [
  { value: 'Open', label: 'Open' },
  { value: 'Low', label: 'Low' },
  { value: 'High', label: 'High' },
  { value: 'Close', label: 'Close' },
  { value: 'Volume', label: 'Volume' },
];

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getMonthYear(date) {
  var dt = new Date(date);
  return months[dt.getMonth()] + '-' + dt.getFullYear().toString().slice(-2);
}

function groupBy(xs, f) {
  return xs.reduce((r, v, i, a, k = f(v)) => {
    (r[k] || (r[k] = [])).push(v);
    return r;
  }, {});
}

function randomGen(item) {
  let result = [];

  for (let i = 0; i < 20000; i++) {
    let random = Math.floor(Math.random() * (item.length - 1)) + 1;
    result.push(item[random]);
  }

  // return result.sort((a, b) => new Date(a["Date"]).getTime() - new Date(b["Date"]).getTime());
  return result;
}

function App() {
  const [column, setColumn] = useState('Open');
  const [data, setData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [isLoading, setIsLoading] = useState(false);

  const load = function () {
    setIsLoading(true);
    setColumn('Open');
    fetch(DATA)
      .then((response) => response.text())
      .then((responseText) => {
        csvToObjs(responseText);
      });
  };

  useEffect(load, []);

  const handleChartType = (type) => {
    setProcessedData([]);
    setChartType(type);
    if (type === 'bar') {
      processBarData(data);
      document.getElementById('line').classList.remove('active-tab');
      document.getElementById('bar').classList.add('active-tab');
    } else {
      processLineData(data);
      document.getElementById('bar').classList.remove('active-tab');
      document.getElementById('line').classList.add('active-tab');
    }
  };

  const processLineData = (item) => {
    setTimeout(() => {
      setProcessedData(randomGen(item));
    }, 1000);
  };

  const processBarData = (item) => {
    let input = randomGen(item);
    let chartData = [];
    input.forEach((d) => {
      if (d['Unix Timestamp']) {
        chartData.push({
          month: getMonthYear(d.Date),
          open: d.Open,
          high: d.High,
          low: d.Low,
          close: d.Close,
          volume: d.Volume,
        });
      }
    });
    chartData = groupBy(chartData, (c) => c.month);
    let chartInput = [];
    for (var key in chartData) {
      let openSum = 0;
      let lowSum = 0;
      let highSum = 0;
      let closeSum = 0;
      let volumeSum = 0;
      var len = chartData[key].length;
      chartData[key].forEach((item) => {
        openSum += Number(item.open);
        lowSum += Number(item.low);
        highSum += Number(item.high);
        closeSum += Number(item.close);
        volumeSum += Number(item.volume);
      });
      let openAvg = openSum / len;
      let lowAvg = lowSum / len;
      let highAvg = highSum / len;
      let closeAvg = closeSum / len;
      let volumeAvg = volumeSum / len;
      chartInput.push({
        Date: key,
        Open: openAvg,
        Low: lowAvg,
        High: highAvg,
        Close: closeAvg,
        Volume: volumeAvg,
      });
    }

    setTimeout(() => {
      setProcessedData(chartInput);
    }, 1000);
  };

  const handleColumnChange = ({ target }) => {
    setProcessedData([]);
    setColumn(target.value);

    setTimeout(() => {
      chartType === 'line'
        ? setProcessedData(randomGen(data))
        : processBarData(data);
    }, 100);
  };

  function csvToObjs(string) {
    const lines = string.split(/\r\n|\n/);
    let input = [];
    let [headings, ...entries] = lines;
    headings = headings.split(',');
    const objs = [];
    entries.map((entry) => {
      let obj = entry.split(',');
      objs.push(Object.fromEntries(headings.map((head, i) => [head, obj[i]])));
      return objs;
    });
    objs.pop();
    setData(objs);
    setIsLoading(false);
    setTimeout(() => {
      setProcessedData(randomGen(objs));
    }, 0);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Time Series Data</h1>
      <hr></hr>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div
            style={{
              display: 'flex',
              paddingBottom: '1rem',
              justifyContent: 'space-between',
            }}
          >
            <select
              style={{ padding: '5px 20px' }}
              value={column}
              onChange={handleColumnChange}
            >
              {options.map(({ value, label }, index) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <div>
              <button
                id="line"
                className="active-tab"
                onClick={() => handleChartType('line')}
                style={{ padding: '6px 40px', border: '0' }}
              >
                Line
              </button>
              <button
                id="bar"
                onClick={() => handleChartType('bar')}
                style={{ padding: '6px 40px', border: '0' }}
              >
                Bar
              </button>
            </div>
          </div>
          <div style={{ border: '0.625px solid #d0d0d0' }}>
            {chartType === 'line' ? (
              <LineCharts data={processedData} column={column} />
            ) : (
              <BarCharts data={processedData} column={column} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
