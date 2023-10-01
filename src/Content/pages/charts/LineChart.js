import React from 'react';
import ReactApexChart from "react-apexcharts";

const LineChart = ({ xaxis,yaxis,ytitles,ytitle,color}) => {
  const chartOptions = {
    xaxis:{
      categories: xaxis,
      labels: {
        style: {
          fontSize: '5px', // Ajusta el tamaño de la fuente aquí
        },
      },
    },
    dataLabels: {
      enabled: false
  }, 
  yaxis: {title: {text: ytitle}},
  chart:{
    zoom:{
      enabled: false,
    },
    toolbar: { 
      show: false,
    },  
  },
  stroke: {
    width: 3,
    curve:'smooth'
  },
  legend: {
    show: false
  },
  tooltip:{
    y: {
      formatter: function (value) {
        return value.toLocaleString('es-ES', {minimumFractionDigits: 0,maximumFractionDigits: 2}); 
      },
    },
  }}
  
  const seriesData = [];
  
  for (let i = 0; i < yaxis.length; i++) {
    const data = yaxis[i];
    const name = ytitles[i];
    const colorValue = color[i];
    seriesData.push({ data, name, color: colorValue });
  }
  
  return (
    <>
      <ReactApexChart options={chartOptions} series={seriesData} type="line"  height={'100%'}/>
    </>
  );
}
export default LineChart;