import fs from "node:fs";

const sourceUrl = new URL(
  "../../data/doha-era5-apparent-temperature-1991-2026-10.json",
  import.meta.url
);
const source = JSON.parse(fs.readFileSync(sourceUrl, "utf8"));
const periods = [
  {period: "Noon", hour: 12},
  {period: "8 pm", hour: 20}
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function median(values) {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

const buckets = new Map();
for (const {period, hour} of periods) {
  for (let month = 0; month < 12; month += 1) {
    buckets.set(`${month}-${hour}`, {period, month, values: []});
  }
}

for (let index = 0; index < source.hourly.time.length; index += 1) {
  const timestamp = source.hourly.time[index];
  const month = Number(timestamp.slice(5, 7)) - 1;
  const hour = Number(timestamp.slice(11, 13));
  const bucket = buckets.get(`${month}-${hour}`);
  if (bucket) bucket.values.push(source.hourly.apparent_temperature[index]);
}

const output = [...buckets.values()]
  .map(({period, month, values}) => ({
    period,
    month,
    monthName: months[month],
    temperature: median(values),
    observations: values.length
  }))
  .sort((a, b) => a.month - b.month || periods.findIndex((d) => d.period === a.period) - periods.findIndex((d) => d.period === b.period));

process.stdout.write(JSON.stringify(output));
