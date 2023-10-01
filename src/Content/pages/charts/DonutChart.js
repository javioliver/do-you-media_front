import React from 'react';
import ReactApexChart from "react-apexcharts";

const DonutChart = ({data,labels}) => {
    const chartOptions = {
        labels: labels,
        legend: {
          show: false, 
        },
        theme: {
          monochrome: {
            color:'#E53E3E',
            enabled: true
          }
        },
        chart: {
          toolbar: {   
            show: false,
          }}}
    return (
      <>
        <ReactApexChart options={chartOptions} series={data} type="donut" height={'100%'} width='100%' responsive={true}/>
      </>
    );
  }
  export default DonutChart;