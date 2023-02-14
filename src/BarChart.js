import BarChart from 'echarts-for-react';
import React from 'react';

const BarCharts = ({data, column}) => {

    return (
        <BarChart
        option={{
          xAxis: {
            type: 'category',
            data: data.map(x => x["Date"]),
            name: "Date"
          },
          yAxis: {
            type: 'value',
            name: column
          },
          series: [
            {
              data: data.map(x => x[column]),
              type: 'bar'
            }
          ]
        }}
        showLoading = {data.length === 0}
      />
    )
}

export default BarCharts;