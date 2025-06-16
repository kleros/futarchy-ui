import React, { useMemo } from "react";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { type IChartData } from "@/hooks/useChartData";

const Chart: React.FC<{ data: IChartData }> = ({ data }) => {
  const series = useMemo(() => {
    let validStartIndex = 0;
    const dataLength = data.length;

    for (let i = 0; i < dataLength; i++) {
      const isExtreme = data[i].value > 3.99 || data[i].value < 0.1;

      if (!isExtreme && i > 0) {
        validStartIndex = i;
        break;
      }
    }

    const normalizedData = data.slice(validStartIndex);

    const timestamps = getTimestamps(data[0].timestamp, Date.now() / 1000);

    let currentIndex = 0;
    const processed = [];
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i];
      let currentData = normalizedData[currentIndex] ?? normalizedData.at(-1);
      while (
        currentIndex < normalizedData.length &&
        currentData.timestamp < timestamp
      ) {
        currentData = normalizedData[currentIndex];
        currentIndex = currentIndex + 1;
      }
      processed.push({ "Project 1": currentData.value, timestamp });
    }

    return processed;
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={series}>
        <Line dataKey="Project 1" type="monotone" stroke="red" dot={false} />
        <XAxis
          dataKey="timestamp"
          type="number"
          tickFormatter={(timestamp) =>
            format(new Date(timestamp * 1000), "dd-MM-yyyy")
          }
          domain={["dataMin", "dataMax"]}
        />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip
          formatter={(value) => [value, "Project 1"]}
          labelFormatter={(label) =>
            format(new Date(label * 1000), "dd-MM-yyyy")
          }
        />
        <Legend
          verticalAlign="top"
          formatter={(value) => `${value} ${series.at(-1)?.["Project 1"]}`}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const getTimestamps = (firstTimestamp: number, lastTimestamp: number) => {
  let currentTimestamp = firstTimestamp;
  const timestamps: Array<number> = [];
  while (currentTimestamp <= lastTimestamp) {
    timestamps.push(currentTimestamp);
    currentTimestamp += 60 * 60 * 12;
  }
  return timestamps;
};

export default Chart;
