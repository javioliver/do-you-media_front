import React from 'react'
import ReactApexChart from "react-apexcharts"

const TreeMapSim = ({xaxis,yaxis}) => {

const TreeMap_dic = xaxis.map((x, index) => ({ x, y: yaxis[index]}));
const treeMapData = [{data: TreeMap_dic}]

const chartOptions = {
    chart: {
      type: "treemap",
      animations: {
        enabled: false},
      toolbar: {   
        show: true,
      }, zoom:{enabled: false},
      theme: {
        fontFamily:'jost'},
      },
      tooltip:{
        y: {formatter: function (value) {return value.toLocaleString('es-ES', {minimumFractionDigits: 0,maximumFractionDigits: 2}) }}}}
  return (
    <>
      <ReactApexChart options={chartOptions} series={treeMapData} width={'600px'} height={'253px'} type="treemap" /></>)}

export default TreeMapSim