import React,{useState} from 'react';
import ReactApexChart from "react-apexcharts";
 
const PieChart = ({ data,labels}) => {
 
    const chartOptions = {
        labels: labels,
        legend: {
          show: true, 
          width:200
       
            },
        theme: {
          fontFamily:'jost',
        },
         
        tooltip:{
          y: {formatter: function (value) {return value.toLocaleString('es-ES', {minimumFractionDigits: 0,maximumFractionDigits: 2}) }}},
        chart: {  animations: {
            enabled: false},
          toolbar: { 
            show:true,
            zoom:{enabled: false}
          }}}
    return (
      <>
        <ReactApexChart options={chartOptions} series={data} type="donut"  width={'600px'} height={'265px'} responsive={true} animate={false}  />
      </>
    )
  }
  export default PieChart;