import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490, 2500, 3800, 5000, 6000, 5500];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300, 3000, 2000, 2780, 1890, 2390];
const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SimpleLineChart() {
  const [chartWidth, setChartWidth] = React.useState(window.innerWidth * 0.7);

  React.useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.9);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <LineChart
        width={chartWidth}
        height={300}
        series={[
          { data: pData, showMark: false, color: 'rgb(26 158 62)'  },
          { data: uData, showMark: false, color: 'rgb(49 152 254)' },
        ]}
        xAxis={[{ scaleType: "band", data: xLabels }]}
      />
    </div>
  );
}
