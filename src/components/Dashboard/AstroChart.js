import React from "react";
import styled from 'styled-components'
import { ResponsiveContainer, XAxis, Tooltip, AreaChart, Area } from 'recharts'
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
  height: 100%;
  position: relative;
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

const getChartColors = ({ isChangePositive }) => {
  return isChangePositive
    ? { gradient1: '#f1b152', gradient2: '#f1b1526b', stroke: '#ffb84d' }
    : { gradient1: '#ED4B9E', gradient2: '#ED4B9E', stroke: '#ED4B9E ' }
}

const data = [
  { name: 'Page A', uv: 60, date: '09:00PM', amt: 1400 },
  { name: 'Page B', uv: 50, date: '12:00AM', amt: 1210 },
  { name: 'Page C', uv: 40, date: '03:00AM', amt: 1290 },
  { name: 'Page D', uv: 80, date: '06:00AM', amt: 1000 },
  { name: 'Page E', uv: 20, date: '09:00AM', amt: 1181 },
  { name: 'Page F', uv: 50, date: '12:00PM', amt: 1500 },
  { name: 'Page G', uv: 60, date: '03:00PM', amt: 1100 },
  { name: 'Page C', uv: 70, date: '06:00PM', amt: 1290 },
];

const MagicChart = ({ isChangePositive }) => {
  const colors = getChartColors({ isChangePositive })
  if (data.length === 0) {
    return (
      <LineChartLoader />
    )
  }
  return (
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPv2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor={colors.gradient1} stopOpacity={1} />
            <stop offset="100%" stopColor={colors.gradient2} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={true}
          tickLine={false}
        />
        <Tooltip 
          labelStyle={{
            color: 'green'
          }} 
        />
        <Area type='monotoneX' dataKey='uv' stroke={colors.stroke} strokeWidth={2} fillOpacity={1}
          fill="url(#colorPv2)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default MagicChart;
