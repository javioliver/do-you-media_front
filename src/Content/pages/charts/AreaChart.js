import React from 'react';
import ReactApexChart from "react-apexcharts";

const AreaChart = ({xaxis,yaxis,ytitle,color}) =>{
  const chartOptions = {
  xaxis: {categories: xaxis, labels: {
    style: {
      fontSize: '10px', // Ajusta el tamaño de la fuente aquí
    },
  },},
  tooltip:{
    y: {
      formatter: function (value) {
        return value.toLocaleString('es-ES', {minimumFractionDigits: 0,maximumFractionDigits: 2})
      },
    },
  },
 
  dataLabels: {enabled: false}, 
  chart:{
    id:'chart2',
    toolbar: {show: false},
    zoom:{enabled: false},
   
    fill: {type: 'gradient', color: color,gradient: {opacityFrom: 0.91,opacityTo: 0.1}}}};
    const seriesData = [{ data: yaxis,name:ytitle,color:color}];
    return (<><ReactApexChart options={chartOptions} series={seriesData} type="area" stroke={{curve:'smooth'}} height={'100%'} /></>)}
    export default AreaChart