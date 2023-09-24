import React from 'react';
import ReactApexChart from "react-apexcharts";

const ColumnChart = ({ xaxis, yaxis1,yaxis2, ytitle1,ytitle2 ,mismaUnidadMedida}) => {
 
  const chartOptions = {

  xaxis: {categories: xaxis,
  labels: {
    style: {
      fontSize:`8px`
    }
  }},
  tooltip:{
    y: {formatter: function (value) {return value.toLocaleString('es-ES', {minimumFractionDigits: 0,maximumFractionDigits: 2}) }}},
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
      : [])
  ],

  plotOptions: {bar: {borderRadius: 1,dataLabels: {position: 'top'},borderRadiusApplication: 'end'}},
  dataLabels: {enabled: false},
  chart: {  animations: {
    enabled: false},
    toolbar: {show: true}, zoom:{enabled: false}}};
    
       
    const seriesData = []
    if (yaxis1 ) {
      seriesData.push({
        data: yaxis1,
        name: ytitle1,
      });
    }
    if (yaxis2) {
      seriesData.push({
        data: yaxis2,
        name: ytitle2,
      });
    }
  return (<><ReactApexChart options={chartOptions} series={seriesData} type="bar"  width={'600px'} height={'253px'} /></>)}
export default ColumnChart;
