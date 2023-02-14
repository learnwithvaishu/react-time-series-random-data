import LineChart from 'echarts-for-react';
import React from 'react';

const LineCharts = ({data, column}) => {

    return (
        <LineChart
        option={{
          xAxis: {
            type: 'category',
            data: data.map(x => x["Unix Timestamp"]),
            name: 'Unix Timestamp'
          },
          yAxis: {
            type: 'value',
            name: column
          },
          series: [
            {
              data: data.map(x => x[column]),
              type: 'line',
            }
          ],
        }}
        showLoading = {data.length === 0}
      />
    )
}

export default LineCharts;