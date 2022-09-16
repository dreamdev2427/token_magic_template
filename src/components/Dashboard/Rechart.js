import React, { useEffect, useCallback, useState } from "react";
import { createChart } from "lightweight-charts";
import moment from 'moment-business-days';
// import Chip from '@mui/material/Chip';
import styled from 'styled-components'
import { getMagicPriceInWeb3 } from "../../core/web3";
import { numberWithCommas } from '../../components/utils';
import LineChartLoaderSVG from './ChartLoaderSVG'

const LoadingText = styled.div`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
`

const LoadingIndicator = styled.div`
  position: absolute;
  top: 0;
  width: calc(100% - 24px);
  height: 100%;
`
const LineChartLoader = () => {
  return (
    <LoadingIndicator>
      <LineChartLoaderSVG />
      <LoadingText>
        <span className="fs-20">Loading chart data...</span>
      </LoadingText>
    </LoadingIndicator>
  )
}

function MagicChart() {
  const [areaSeries, setArea] = useState(null);
  const [data, setSeriesData] = useState([]);
  const [updateInterval, setUpdateInterval] = useState(0);
  const [magicPrice, setMagicPrice] = useState(0);
  // const [chartType, setChartType] = useState(0);

  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (magicPrice === 0) {
      return;
    }
    let newData = [];
    if (data.length > 1) {
      newData = data.concat({ time: moment(new Date((new Date()).getTime() + updateInterval * 3600 * 24 * 1000)).format("YYYY-MM-DD"), value: magicPrice });
    } else {
      newData = data.concat({ time: moment(new Date()).format("YYYY-MM-DD"), value: magicPrice });
    }
    setSeriesData(newData);
    if (areaSeries != null) {
      areaSeries.setData(newData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateInterval]);

  const init = useCallback(() => {
    var chart = createChart(document.getElementById("chart1"), {
      width: document.getElementById("chart1").offsetWidth,
      height: 310,
      priceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.00001
        },
        borderVisible: false
      },
      layout: {
        backgroundColor: "transparent",
        textColor: "#d1d4dc"
      },
      grid: {
        vertLines: {
          color: "rgba(156, 156, 157, 0.2)"
        },
        horzLines: {
          color: "rgba(156, 156, 157, 0.2)"
        }
      },
      timeScale: {
        visible: false,
      },
    });

    var series = chart.addAreaSeries({
      topColor: "rgba(241,177,82, 0.6)",
      bottomColor: "rgba(241,177,82, 0.04)",
      lineColor: "rgba(241,177,82, 1)",
      lineWidth: 2
    });
    series.applyOptions({
      priceFormat: {
        type: 'price',
        precision: 5,
        minMove: 0.00001,
      },
    });
    setArea(series);

    var timerID;
    document.body.onresize = function () {
      if (timerID) clearTimeout(timerID);
      timerID = setTimeout(function () {
        if (document.getElementById("chart1")) {
          chart.resize(document.getElementById("chart1").offsetWidth, 310);
        }
      }, 200);
    }

    const getData = async function () {
      const result = await getMagicPriceInWeb3();
      if (result.success) {
        setMagicPrice(result.magicPrice);
      }
      setUpdateInterval((prev) => {
        return prev + 1;
      });
      if (timeIndex > 1) {
        timerID = setTimeout(getData, 6000);
      } else {
        timerID = setTimeout(getData, 1000);
      }
      timeIndex++;
    }
    let timeIndex = 0;
    timerID = setTimeout(() => {
      getData();
    }, 10);
    return (() => {
      clearTimeout(timerID);
    });
  }, []);

  // const handleChart = (type) => {
  //   setChartType(type);
  // }

  return (
    <div className='row full-height'>
      <div className='col-md-12 mt-2 mb-2 flex flex-column flex-md-row justify-between align-items-center'>
        <p className='fs-16 f-semi-b text-white mb-0 lh-1'>${numberWithCommas(magicPrice, 5)} / $MGV</p>
        {/* <div className='flex gap-2'>
          <Chip label="01M" variant={chartType === 0 ? 'filled' : ''} onClick={() => handleChart(0)} />
          <Chip label="06M" variant={chartType === 1 ? 'filled' : ''} onClick={() => handleChart(1)} />
          <Chip label="01Y" variant={chartType === 2 ? 'filled' : ''} onClick={() => handleChart(2)} />
          <Chip label="All" variant={chartType === 3 ? 'filled' : ''} onClick={() => handleChart(3)} />
        </div> */}
      </div>
      <div className='col-md-12 relative' style={{ height: '310px' }}>
        {data.length <= 1 && (
          <LineChartLoader />
        )}
        <div id="chart1" className={data.length > 1 ? '' : 'visibility-hidden'} />
      </div>
    </div>
  );
}

export default MagicChart;