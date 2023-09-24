import React from 'react';
import ReactApexChart from "react-apexcharts";

const AreaChart = ({xaxis,yaxis1,yaxis2,ytitle1,ytitle2,mismaUnidadMedida}) =>{
 
  const chartOptions = {
  xaxis: {categories: xaxis, labels: {
    style: {
      fontSize: '8px', 
    },
  }},
  tooltip:{
    y: {formatter: function (value) {return value.toLocaleString('es-ES', {minimumFractionDigits: 0,maximumFractionDigits: 2}) }}},
 
  dataLabels: {enabled: false}, 
  chart:{
    animations: {
      enabled: false},
    id:'chart2',
    toolbar: {show: true},
    zoom:{enabled: false},
    fill: {type: 'gradient',gradient: {opacityFrom: 0.91,opacityTo: 0.1}}},
    yaxis: [
      {
        title: {
          text: ytitle1,
        },
 
      },
      ...(yaxis2 && !mismaUnidadMedida
        ? [
            {
              opposite: true,
              title: {
                text: ytitle2,
              },
     
            },
          ]
        : []),
    ],}
      
    const seriesData = []
    if (yaxis1) {
      const roundedYAxis1 = yaxis1.map((value) => parseFloat(value.toFixed(2)));
      seriesData.push({
        data: roundedYAxis1,
        type: 'area',
        name: ytitle1,
      });
    }
    if (yaxis2) {
      const roundedYAxis2 = yaxis2.map((value) => parseFloat(value.toFixed(2)));
      seriesData.push({
        data: roundedYAxis2,
        type: 'area',
        name: ytitle2,
      });
    }
 
    return (<><ReactApexChart options={chartOptions} series={seriesData} type="area" stroke={{curve:'smooth'}} width={'600px'} height={'253px'} /></>)}
    export default AreaChart