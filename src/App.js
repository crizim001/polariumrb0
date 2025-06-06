
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const generateDummyData = () => {
  const data = [];
  let price = 100;
  for (let i = 0; i < 60; i++) {
    const open = price;
    const close = open + (Math.random() - 0.5) * 2;
    const high = Math.max(open, close) + Math.random();
    const low = Math.min(open, close) - Math.random();
    data.push({ time: i, open, close, high, low });
    price = close;
  }
  return data;
};

const detectPatterns = (data) => {
  const signals = [];
  for (let i = 1; i < data.length; i++) {
    const { open, close, high, low } = data[i];
    const body = Math.abs(close - open);
    const candleRange = high - low;

    if (body / candleRange < 0.3 && close > open && (open - low) / candleRange > 0.5) {
      signals.push({ time: data[i].time, type: "Martelo" });
    }

    if (
      data[i - 1].close < data[i - 1].open &&
      close > open &&
      open < data[i - 1].close &&
      close > data[i - 1].open
    ) {
      signals.push({ time: data[i].time, type: "Engolfo de Alta" });
    }
  }
  return signals;
};

function App() {
  const [data, setData] = useState([]);
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const newData = generateDummyData();
    setData(newData);
    setSignals(detectPatterns(newData));
  }, []);

  return (
    <div className="p-4">
      <h2>Análise Gráfica M1</h2>
      <LineChart width={800} height={400} data={data}>
        <XAxis dataKey="time" />
        <YAxis domain={[80, 120]} />
        <Tooltip />
        <Line dataKey="close" stroke="#8884d8" />
      </LineChart>
      <div>
        <h3>Sinais Detectados:</h3>
        <ul>
          {signals.map((s, i) => (
            <li key={i}>Minuto {s.time}: {s.type}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
