import React from 'react';
import ReactApexChart from "react-apexcharts";
 
const PieChart = ({ data,labels,add}) => {
    const chartOptions = {
        labels: labels,
        legend: {
          show: false,  
        },
        theme: {
          fontFamily:'jost',
          monochrome: {
            enabled: true,
            color: '#E53E3E'
          }
        },
        tooltip:{
          y: {
            formatter: function (value) {
              return value.toLocaleString('es-ES', {minimumFractionDigits: 0,maximumFractionDigits: 2}) +add 
            },
          },
        },
        chart: {
          toolbar: { 
            show: false,
          }},dataLabels:{style:{color:'white'}},
          plotOptions: {
            pie: {  
              expandOnClick: true}}
      }
    return (
      <>
        <ReactApexChart options={chartOptions} series={data} type="pie" height={'100%'} />
      </>
    );
  }
  export default PieChart;