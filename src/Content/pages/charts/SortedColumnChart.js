import React from 'react';
import ReactApexChart from "react-apexcharts";

const ColumnChart = ({ xaxis, yaxis, ytitle,fontSize }) => {
 

  const chartOptions = {
    yaxis: {title: {text: ytitle}},
  xaxis: {categories: xaxis,
  labels: {
    style: {
      fontSize: fontSize ? `${fontSize}px` : undefined
    }
  }},
  plotOptions: {bar: {borderRadius: 1,dataLabels: {position: 'top'},borderRadiusApplication: 'end'}},
  dataLabels: {enabled: false},
  chart: {
    toolbar: {show: false}},colors:['#E53E3E']};
  const seriesData = [{ data: yaxis, name: ytitle }];
  return (<><ReactApexChart options={chartOptions} series={seriesData} type="bar" height={'100%'} /></>)}

export default ColumnChart;
