```js
import * as Plot from "npm:@observablehq/plot";

const temperatures = await FileAttachment("data/doha-monthly.json").json();
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const colors = {
  "Noon": "#a63d00",
  "8 pm": "#174a7e"
};
```

<main class="story">
  <header class="story-header">
    <p class="eyebrow">A year of evenings in Doha</p>
    <h1>In August, Doha still feels like 40.5°C at 8 pm</h1>
    <p class="subtitle">Each point shows the median feels-like temperature at noon or 8 pm for that month from 1991 to 2020.</p>
  </header>

  <figure class="chart-card">

```js
resize((width) => {
  const compact = width < 520;
  const august = temperatures.filter((d) => d.month === 7);
  const endpoints = temperatures.filter((d) => d.month === 11);

  return Plot.plot({
    width,
    height: compact ? 390 : 460,
    marginTop: 28,
    marginRight: compact ? 58 : 76,
    marginBottom: 46,
    marginLeft: compact ? 48 : 58,
    style: {
      background: "transparent",
      color: "#25313a",
      fontFamily: "inherit",
      fontSize: compact ? "12px" : "14px"
    },
    ariaLabel: "Median feels-like temperatures in Doha at noon and 8 pm by month",
    ariaDescription: "Both lines rise from winter to summer. August feels like 44.8 degrees Celsius at noon and 40.5 degrees Celsius at 8 pm.",
    x: {
      domain: [-0.25, 12.45],
      ticks: compact ? [0, 2, 4, 7, 9, 11] : 12,
      tickSize: 0,
      tickPadding: 10,
      tickFormat: (month) => {
        const label = monthLabels[month];
        return label ?? "";
      },
      label: null
    },
    y: {
      domain: [10, 50],
      ticks: 5,
      grid: true,
      tickSize: 0,
      tickPadding: 8,
      tickFormat: (temperature) => `${temperature}°`,
      label: "Median feels like"
    },
    color: {
      domain: ["Noon", "8 pm"],
      range: [colors["Noon"], colors["8 pm"]],
      legend: false
    },
    marks: [
      Plot.ruleY([10], {stroke: "#bac2c8"}),
      Plot.lineY(temperatures, {
        x: "month",
        y: "temperature",
        stroke: "period",
        strokeWidth: 3.5,
        curve: "catmull-rom"
      }),
      Plot.dot(temperatures, {
        x: "month",
        y: "temperature",
        fill: "period",
        stroke: "white",
        strokeWidth: 1.5,
        r: compact ? 4 : 4.5,
        tip: true,
        title: (d) => `${d.monthName}, ${d.period}: ${d.temperature.toFixed(1)}°C`
      }),
      Plot.text(august.filter((d) => d.period === "Noon"), {
        x: "month",
        y: "temperature",
        text: (d) => `${d.temperature.toFixed(1)}°C`,
        fill: "period",
        stroke: "white",
        strokeWidth: 5,
        paintOrder: "stroke",
        dy: -15,
        fontWeight: 700
      }),
      Plot.text(august.filter((d) => d.period === "8 pm"), {
        x: "month",
        y: "temperature",
        text: (d) => `${d.temperature.toFixed(1)}°C`,
        fill: "period",
        stroke: "white",
        strokeWidth: 5,
        paintOrder: "stroke",
        dy: 19,
        fontWeight: 700
      }),
      Plot.text(endpoints.filter((d) => d.period === "Noon"), {
        x: "month",
        y: "temperature",
        text: "period",
        fill: "period",
        dx: 9,
        dy: -8,
        textAnchor: "start",
        fontWeight: 700
      }),
      Plot.text(endpoints.filter((d) => d.period === "8 pm"), {
        x: "month",
        y: "temperature",
        text: "period",
        fill: "period",
        dx: 9,
        dy: 9,
        textAnchor: "start",
        fontWeight: 700
      })
    ]
  });
})
```

  </figure>

  <p class="comparison">At 8 pm, Doha feels like a median 16.3°C in January, compared with 40.5°C in August.</p>

  <footer class="source">Source: Open-Meteo’s ERA5 data, which combines weather observations and modeling to estimate conditions near central Doha.</footer>
</main>
