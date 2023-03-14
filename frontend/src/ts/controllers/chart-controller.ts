import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  ScatterController,
  TimeScale,
  TimeSeriesScale,
  Tooltip,
  type AnimationSpec,
  type CartesianScaleOptions,
  type ChartConfiguration,
  type ChartDataset,
  type ChartType,
  type DefaultDataPoint,
  type PluginChartOptions,
  type ScaleChartOptions,
} from "chart.js";

import chartAnnotation, {
  type AnnotationOptions,
  type LabelOptions,
} from "chartjs-plugin-annotation";
import chartTrendline from "chartjs-plugin-trendline";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  TimeScale,
  TimeSeriesScale,
  Tooltip,
  chartTrendline,
  chartAnnotation
);

(
  Chart.defaults.animation as AnimationSpec<"line" | "bar" | "scatter">
).duration = 0;
Chart.defaults.elements.line.tension = 0.3;
Chart.defaults.elements.line.fill = "origin";

import "chartjs-adapter-date-fns";
import format from "date-fns/format";
import Config from "../config";
import * as ThemeColors from "../elements/theme-colors";
import * as ConfigEvent from "../observables/config-event";
import * as TestInput from "../test/test-input";
import * as Misc from "../utils/misc";

class ChartWithUpdateColors<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
> extends Chart<TType, TData, TLabel> {
  constructor(item: any, config: ChartConfiguration<TType, TData, TLabel>) {
    super(item, config);
  }

  updateColors(): void {
    updateColors(this);
  }
}

export const result: ChartWithUpdateColors<
  "line" | "scatter",
  number[],
  string
> = new ChartWithUpdateColors($("#wpmChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        //@ts-ignore the type is defined incorrectly, have to ingore the error
        clip: false,
        label: "wpm",
        data: [],
        borderColor: "rgba(125, 125, 125, 1)",
        borderWidth: 2,
        yAxisID: "wpm",
        order: 2,
        pointRadius: 2,
      },
      {
        //@ts-ignore the type is defined incorrectly, have to ingore the error
        clip: false,
        label: "raw",
        data: [],
        borderColor: "rgba(125, 125, 125, 1)",
        borderWidth: 2,
        yAxisID: "raw",
        order: 3,
        pointRadius: 2,
      },
      {
        //@ts-ignore the type is defined incorrectly, have to ingore the error
        clip: false,
        label: "errors",
        data: [],
        borderColor: "rgba(255, 125, 125, 1)",
        pointBackgroundColor: "rgba(255, 125, 125, 1)",
        borderWidth: 2,
        order: 1,
        yAxisID: "error",
        type: "scatter",
        pointStyle: "crossRot",
        pointRadius: function (context): number {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return (value ?? 0) <= 0 ? 0 : 3;
        },
        pointHoverRadius: function (context): number {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return (value ?? 0) <= 0 ? 0 : 5;
        },
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        axis: "x",
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
        },
        display: true,
        title: {
          display: false,
          text: "Seconds",
        },
      },
      wpm: {
        axis: "y",
        display: true,
        title: {
          display: true,
          text: "Words per Minute",
        },
        beginAtZero: true,
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
        },
        grid: {
          display: true,
        },
      },
      raw: {
        axis: "y",
        display: false,
        title: {
          display: true,
          text: "Raw Words per Minute",
        },
        beginAtZero: true,
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
        },
        grid: {
          display: false,
        },
      },
      error: {
        axis: "y",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Errors",
        },
        beginAtZero: true,
        ticks: {
          precision: 0,
          autoSkip: true,
          autoSkipPadding: 20,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: [],
      },
      tooltip: {
        animation: { duration: 250 },
        mode: "index",
        intersect: false,
        callbacks: {
          afterLabel: function (ti): string {
            try {
              $(".wordInputAfter").remove();

              const wordsToHighlight =
                TestInput.keypressPerSecond[parseInt(ti.label) - 1].words;

              const unique = [...new Set(wordsToHighlight)];
              unique.forEach((wordIndex) => {
                const wordEl = $(
                  $("#resultWordsHistory .words .word")[wordIndex]
                );
                const input = wordEl.attr("input");
                if (input != undefined) {
                  wordEl.append(
                    `<div class="wordInputAfter">${input
                      .replace(/\t/g, "_")
                      .replace(/\n/g, "_")
                      .replace(/</g, "&lt")
                      .replace(/>/g, "&gt")}</div>`
                  );
                }
              });
            } catch {}
            return "";
          },
        },
      },
    },
  },
});

export let accountHistoryActiveIndex: number;

export const accountHistory: ChartWithUpdateColors<
  "line",
  | MonkeyTypes.HistoryChartData[]
  | MonkeyTypes.AccChartData[]
  | MonkeyTypes.OtherChartData[],
  string
> = new ChartWithUpdateColors($(".pageAccount #accountHistoryChart"), {
  type: "line",
  data: {
    datasets: [
      {
        yAxisID: "wpm",
        data: [],
        fill: false,
        borderWidth: 0,
        order: 10,
        // pointRadius: 2,
      },

      {
        yAxisID: "pb",
        data: [],
        fill: false,
        stepped: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        order: 20,
      },
      {
        yAxisID: "acc",
        fill: false,
        data: [],
        pointStyle: "triangle",
        borderWidth: 0,
        pointBackgroundColor: "rgba(255, 99, 132, 0.5)",
        hoverBorderColor: "#cccccc",
        pointRadius: 3.5,
        order: 6,
      },
      {
        yAxisID: "wpmAvgTen",
        data: [],
        fill: false,
        borderColor: "#cccccc",
        pointRadius: 0,
        pointHoverRadius: 0,
        order: 5,
      },
      {
        yAxisID: "accAvgTen",
        data: [],
        fill: false,
        borderColor: "#cccccc",
        pointRadius: 0,
        pointHoverRadius: 0,
        order: 5,
      },
      {
        yAxisID: "wpmAvgHundred",
        data: [],
        fill: false,
        borderColor: "#808080",
        order: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
      {
        yAxisID: "accAvgHundred",
        label: "accAvgHundred",
        data: [],
        fill: false,
        borderColor: "#808080",
        // borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
        order: 4,
      },
    ],
  },
  options: {
    // responsive: true,
    maintainAspectRatio: false,
    hover: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        axis: "x",
        type: "linear",
        min: 0,
        // max
        ticks: {
          // autoSkip: true,
          // autoSkipPadding: 20,
          stepSize: 10,
        },
        display: true,
        title: {
          display: true,
          text: "Test Number",
        },
        grid: {
          display: false,
        },
      },
      wpm: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 10,
        },
        display: true,
        title: {
          display: true,
          text: "Words per Minute",
        },
        position: "right",
      },
      pb: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 10,
        },
        display: false,
        title: {
          display: false,
          text: "Personal Best",
        },
        position: "right",
      },
      acc: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        max: 100,
        reverse: true,
        ticks: {
          stepSize: 10,
        },
        display: true,
        title: {
          display: true,
          text: "Accuracy",
        },
        grid: {
          display: false,
        },
        position: "left",
      },
      wpmAvgTen: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 10,
        },
        display: false,
        grid: {
          display: false,
        },
        position: "left",
      },
      accAvgTen: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        reverse: true,
        ticks: {
          stepSize: 10,
        },
        display: false,
        grid: {
          display: false,
        },
        position: "left",
      },
      wpmAvgHundred: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 10,
        },
        display: false,
        grid: {
          display: false,
        },
        position: "left",
      },
      accAvgHundred: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        reverse: true,
        ticks: {
          stepSize: 10,
        },
        display: false,
        grid: {
          display: false,
        },
        position: "left",
      },
    },

    plugins: {
      annotation: {
        annotations: [],
      },
      tooltip: {
        animation: { duration: 250 },
        // Disable the on-canvas tooltip
        enabled: true,

        intersect: false,
        external: function (ctx): void {
          if (!ctx) return;
          ctx.tooltip.options.displayColors = false;
        },
        filter: function (tooltipItem): boolean {
          return (
            tooltipItem.datasetIndex !== 1 &&
            tooltipItem.datasetIndex !== 3 &&
            tooltipItem.datasetIndex !== 4 &&
            tooltipItem.datasetIndex !== 5 &&
            tooltipItem.datasetIndex !== 6
          );
        },
        callbacks: {
          title: function (): string {
            return "";
          },

          beforeLabel: function (tooltipItem): string {
            if (tooltipItem.datasetIndex !== 0) {
              const resultData = tooltipItem.dataset.data[
                tooltipItem.dataIndex
              ] as MonkeyTypes.AccChartData;
              return `error rate: ${Misc.roundTo2(
                resultData.errorRate
              )}%\nacc: ${Misc.roundTo2(100 - resultData.errorRate)}%`;
            }
            const resultData = tooltipItem.dataset.data[
              tooltipItem.dataIndex
            ] as MonkeyTypes.HistoryChartData;
            let label =
              `${Config.alwaysShowCPM ? "cpm" : "wpm"}: ${resultData.wpm}` +
              "\n" +
              `raw: ${resultData.raw}` +
              "\n" +
              `acc: ${resultData.acc}` +
              "\n\n" +
              `mode: ${resultData.mode} `;

            if (resultData.mode == "time") {
              label += resultData.mode2;
            } else if (resultData.mode == "words") {
              label += resultData.mode2;
            }

            let diff = resultData.difficulty;
            if (diff == undefined) {
              diff = "normal";
            }
            label += "\n" + `difficulty: ${diff}`;

            label +=
              "\n" +
              `punctuation: ${resultData.punctuation}` +
              "\n" +
              `language: ${resultData.language}` +
              `${resultData.isPb ? "\n\nnew personal best" : ""}` +
              "\n\n" +
              `date: ${format(
                new Date(resultData.timestamp),
                "dd MMM yyyy HH:mm"
              )}`;

            return label;
          },
          label: function (): string {
            return "";
          },
          afterLabel: function (tooltip): string {
            accountHistoryActiveIndex = tooltip.dataIndex;
            return "";
          },
        },
      },
    },
  },
});

export const accountActivity: ChartWithUpdateColors<
  "bar" | "line",
  MonkeyTypes.ActivityChartDataPoint[],
  string
> = new ChartWithUpdateColors($(".pageAccount #accountActivityChart"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        yAxisID: "count",
        label: "Seconds",
        data: [],
        trendlineLinear: {
          style: "rgba(255,105,180, .8)",
          lineStyle: "dotted",
          width: 2,
        },
        order: 3,
      },
      {
        yAxisID: "avgWpm",
        label: "Average Wpm",
        data: [],
        type: "line",
        order: 2,
        tension: 0,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    hover: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        axis: "x",
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
        },
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "d MMM",
          },
        },
        bounds: "ticks",
        display: true,
        title: {
          display: false,
          text: "Date",
        },
        offset: true,
      },
      count: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
          stepSize: 10,
        },
        display: true,
        title: {
          display: true,
          text: "Time Typing",
        },
      },
      avgWpm: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
          stepSize: 10,
        },
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Average Wpm",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: [],
      },
      tooltip: {
        animation: { duration: 250 },
        intersect: false,
        mode: "index",
        callbacks: {
          title: function (tooltipItem): string {
            const resultData = tooltipItem[0].dataset.data[
              tooltipItem[0].dataIndex
            ] as MonkeyTypes.ActivityChartDataPoint;
            return format(new Date(resultData.x), "dd MMM yyyy");
          },
          beforeLabel: function (tooltipItem): string {
            const resultData = tooltipItem.dataset.data[
              tooltipItem.dataIndex
            ] as MonkeyTypes.ActivityChartDataPoint;
            switch (tooltipItem.datasetIndex) {
              case 0:
                return `Time Typing: ${Misc.secondsToString(
                  Math.round(resultData.y),
                  true,
                  true
                )}\nTests Completed: ${resultData.amount}`;
              case 1:
                return `Average ${
                  Config.alwaysShowCPM ? "Cpm" : "Wpm"
                }: ${Misc.roundTo2(resultData.y)}`;
              default:
                return "";
            }
          },
          label: function (): string {
            return "";
          },
        },
      },
    },
  },
});

export const accountHistogram: ChartWithUpdateColors<
  "bar",
  MonkeyTypes.ActivityChartDataPoint[],
  string
> = new ChartWithUpdateColors($(".pageAccount #accountHistogramChart"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        yAxisID: "count",
        label: "Tests",
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    hover: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        axis: "x",
        // ticks: {
        //   autoSkip: true,
        //   autoSkipPadding: 20,
        // },
        bounds: "ticks",
        display: true,
        title: {
          display: false,
          text: "Bucket",
        },
        offset: true,
      },
      count: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
          stepSize: 10,
        },
        display: true,
        title: {
          display: true,
          text: "Tests",
        },
      },
    },
    plugins: {
      annotation: {
        annotations: [],
      },
      tooltip: {
        animation: { duration: 250 },
        intersect: false,
        mode: "index",
        // callbacks: {
        //   title: function (tooltipItem): string {
        //     const resultData = tooltipItem[0].dataset.data[
        //       tooltipItem[0].dataIndex
        //     ] as MonkeyTypes.ActivityChartDataPoint;
        //     return format(new Date(resultData.x), "dd MMM yyyy");
        //   },
        //   beforeLabel: function (tooltipItem): string {
        //     const resultData = tooltipItem.dataset.data[
        //       tooltipItem.dataIndex
        //     ] as MonkeyTypes.ActivityChartDataPoint;
        //     switch (tooltipItem.datasetIndex) {
        //       case 0:
        //         return `Time Typing: ${Misc.secondsToString(
        //           Math.round(resultData.y),
        //           true,
        //           true
        //         )}\nTests Completed: ${resultData.amount}`;
        //       case 1:
        //         return `Average ${
        //           Config.alwaysShowCPM ? "Cpm" : "Wpm"
        //         }: ${Misc.roundTo2(resultData.y)}`;
        //       default:
        //         return "";
        //     }
        //   },
        //   label: function (): string {
        //     return "";
        //   },
        // },
      },
    },
  },
});

export const globalSpeedHistogram: ChartWithUpdateColors<
  "bar",
  MonkeyTypes.ActivityChartDataPoint[],
  string
> = new ChartWithUpdateColors($(".pageAbout #publicStatsHistogramChart"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        yAxisID: "count",
        label: "Users",
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    hover: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        axis: "x",
        bounds: "ticks",
        display: true,
        title: {
          display: false,
          text: "Bucket",
        },
        offset: true,
      },
      count: {
        axis: "y",
        beginAtZero: true,
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
          stepSize: 10,
        },
        display: true,
        title: {
          display: true,
          text: "Users",
        },
      },
    },
    plugins: {
      annotation: {
        annotations: [],
      },
      tooltip: {
        animation: { duration: 250 },
        intersect: false,
        mode: "index",
      },
    },
  },
});

export const miniResult: ChartWithUpdateColors<
  "line" | "scatter",
  number[],
  string
> = new ChartWithUpdateColors($(".pageAccount #miniResultChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "wpm",
        data: [],
        borderColor: "rgba(125, 125, 125, 1)",
        borderWidth: 2,
        yAxisID: "wpm",
        order: 2,
        pointRadius: 2,
      },
      {
        label: "raw",
        data: [],
        borderColor: "rgba(125, 125, 125, 1)",
        borderWidth: 2,
        yAxisID: "raw",
        order: 3,
        pointRadius: 2,
      },
      {
        label: "errors",
        data: [],
        borderColor: "rgba(255, 125, 125, 1)",
        pointBackgroundColor: "rgba(255, 125, 125, 1)",
        borderWidth: 2,
        order: 1,
        yAxisID: "error",
        type: "scatter",
        pointStyle: "crossRot",
        pointRadius: function (context): number {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return (value ?? 0) <= 0 ? 0 : 3;
        },
        pointHoverRadius: function (context): number {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return (value ?? 0) <= 0 ? 0 : 5;
        },
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        axis: "x",
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
        },
        display: true,
        title: {
          display: false,
          text: "Seconds",
        },
      },
      wpm: {
        axis: "y",
        display: true,
        title: {
          display: true,
          text: "Words per Minute",
        },
        beginAtZero: true,
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
        },
        grid: {
          display: true,
        },
      },
      raw: {
        axis: "y",
        display: false,
        title: {
          display: true,
          text: "Raw Words per Minute",
        },
        beginAtZero: true,
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 20,
        },
        grid: {
          display: false,
        },
      },
      error: {
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Errors",
        },
        beginAtZero: true,
        ticks: {
          precision: 0,
          autoSkip: true,
          autoSkipPadding: 20,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      annotation: {
        annotations: [],
      },
      tooltip: {
        animation: { duration: 250 },
        mode: "index",
        intersect: false,
      },
    },
  },
});

function updateAccuracy(): void {
  if (Config.chartAverage10 && Config.chartAverage100) {
    accountHistory.data.datasets[2].hidden = !Config.chartAccuracy;
    accountHistory.data.datasets[4].hidden = !Config.chartAccuracy;
    accountHistory.data.datasets[6].hidden = !Config.chartAccuracy;
  } else if (Config.chartAverage10) {
    accountHistory.data.datasets[2].hidden = !Config.chartAccuracy;
    accountHistory.data.datasets[4].hidden = !Config.chartAccuracy;
  } else if (Config.chartAverage100) {
    accountHistory.data.datasets[2].hidden = !Config.chartAccuracy;
    accountHistory.data.datasets[6].hidden = !Config.chartAccuracy;
  } else {
    accountHistory.data.datasets[2].hidden = !Config.chartAccuracy;
  }

  (accountHistory.options as ScaleChartOptions<"line">).scales["acc"].display =
    Config.chartAccuracy;
  accountHistory.update();
}

function updateAverage10(): void {
  if (Config.chartAccuracy) {
    accountHistory.data.datasets[3].hidden = !Config.chartAverage10;
    accountHistory.data.datasets[4].hidden = !Config.chartAverage10;
  } else {
    accountHistory.data.datasets[3].hidden = !Config.chartAverage10;
  }
  accountHistory.updateColors();
  accountHistory.update();
}

function updateAverage100(): void {
  if (Config.chartAccuracy) {
    accountHistory.data.datasets[5].hidden = !Config.chartAverage100;
    accountHistory.data.datasets[6].hidden = !Config.chartAverage100;
  } else {
    accountHistory.data.datasets[5].hidden = !Config.chartAverage100;
  }
  accountHistory.updateColors();
  accountHistory.update();
}

export async function updateColors<
  TType extends ChartType = "bar" | "line" | "scatter",
  TData =
    | MonkeyTypes.HistoryChartData[]
    | MonkeyTypes.AccChartData[]
    | MonkeyTypes.ActivityChartDataPoint[]
    | number[],
  TLabel = string
>(chart: ChartWithUpdateColors<TType, TData, TLabel>): Promise<void> {
  const bgcolor = await ThemeColors.get("bg");
  const subcolor = await ThemeColors.get("sub");
  const maincolor = await ThemeColors.get("main");
  const errorcolor = await ThemeColors.get("error");
  const textcolor = await ThemeColors.get("text");

  //@ts-ignore
  chart.data.datasets[0].borderColor = (ctx): string => {
    const isPb = ctx.raw?.["isPb"];
    const color = isPb ? textcolor : maincolor;
    return color;
  };

  if (chart.data.datasets[1]) {
    chart.data.datasets[1].borderColor = subcolor;
  }
  if (chart.data.datasets[2]) {
    chart.data.datasets[2].borderColor = errorcolor;
  }

  if (chart.data.datasets[0].type === undefined) {
    if (chart.config.type === "line") {
      (
        chart.data.datasets as ChartDataset<"line", TData>[]
      )[0].pointBackgroundColor = (ctx): string => {
        //@ts-ignore
        const isPb = ctx.raw?.["isPb"];
        const color = isPb ? textcolor : maincolor;
        return color;
      };
    } else if (chart.config.type === "bar") {
      chart.data.datasets[0].backgroundColor = maincolor;
    }
  } else if (chart.data.datasets[0].type === "bar") {
    chart.data.datasets[0].backgroundColor = maincolor;
  } else if (chart.data.datasets[0].type === "line") {
    (
      chart.data.datasets as ChartDataset<"line", TData>[]
    )[0].pointBackgroundColor = maincolor;
  }
  if (chart.data.datasets[1]) {
    if (chart.data.datasets[1].type === undefined) {
      if (chart.config.type === "line") {
        (
          chart.data.datasets as ChartDataset<"line", TData>[]
        )[1].pointBackgroundColor = subcolor;
      } else if (chart.config.type === "bar") {
        chart.data.datasets[1].backgroundColor = subcolor;
      }
    } else if (chart.data.datasets[1].type === "bar") {
      chart.data.datasets[1].backgroundColor = subcolor;
    } else if (chart.data.datasets[1].type === "line") {
      (
        chart.data.datasets as ChartDataset<"line", TData>[]
      )[1].pointBackgroundColor = subcolor;
    }
  }

  //@ts-ignore
  chart.data.datasets[2].borderColor = (): string => {
    const color = subcolor;
    return color;
  };

  if (chart.data.datasets.length === 7) {
    // const color = Misc.getContrastColor(maincolor, subcolor, subaltcolor);

    const text02 = Misc.blendTwoHexColors(bgcolor, textcolor, 0.2);
    const main02 = Misc.blendTwoHexColors(bgcolor, maincolor, 0.2);
    const main04 = Misc.blendTwoHexColors(bgcolor, maincolor, 0.4);

    const sub02 = Misc.blendTwoHexColors(bgcolor, subcolor, 0.2);
    const sub04 = Misc.blendTwoHexColors(bgcolor, subcolor, 0.4);
    if (Config.chartAverage10 && Config.chartAverage100) {
      //wpm
      (
        chart.data.datasets as ChartDataset<"line", TData>[]
      )[0].pointBackgroundColor = main02;

      //pb
      (chart.data.datasets as ChartDataset<"line", TData>[])[1].borderColor =
        text02;

      //acc
      (
        chart.data.datasets as ChartDataset<"line", TData>[]
      )[2].pointBackgroundColor = sub02;

      //ao10 wpm
      (chart.data.datasets as ChartDataset<"line", TData>[])[3].borderColor =
        main04;

      //ao10 acc
      (chart.data.datasets as ChartDataset<"line", TData>[])[4].borderColor =
        sub04;

      //ao100 wpm
      (chart.data.datasets as ChartDataset<"line", TData>[])[5].borderColor =
        maincolor;

      //ao100 acc
      (chart.data.datasets as ChartDataset<"line", TData>[])[6].borderColor =
        subcolor;
    } else if (
      (Config.chartAverage10 && !Config.chartAverage100) ||
      (!Config.chartAverage10 && Config.chartAverage100)
    ) {
      (
        chart.data.datasets as ChartDataset<"line", TData>[]
      )[0].pointBackgroundColor = main04;
      (
        chart.data.datasets as ChartDataset<"line", TData>[]
      )[2].pointBackgroundColor = sub04;
      (chart.data.datasets as ChartDataset<"line", TData>[])[3].borderColor =
        maincolor;
      (chart.data.datasets as ChartDataset<"line", TData>[])[5].borderColor =
        maincolor;
      (chart.data.datasets as ChartDataset<"line", TData>[])[4].borderColor =
        subcolor;
      (chart.data.datasets as ChartDataset<"line", TData>[])[6].borderColor =
        subcolor;
    } else {
      (
        chart.data.datasets as ChartDataset<"line", TData>[]
      )[0].pointBackgroundColor = maincolor;
      (
        chart.data.datasets as ChartDataset<"line", TData>[]
      )[2].pointBackgroundColor = subcolor;
    }
  }

  const chartScaleOptions = chart.options as ScaleChartOptions<TType>;
  Object.keys(chartScaleOptions.scales).forEach((scaleID) => {
    const axis = chartScaleOptions.scales[scaleID] as CartesianScaleOptions;
    axis.ticks.color = subcolor;
    axis.title.color = subcolor;
  });

  try {
    (
      chart.data.datasets[0]
        .trendlineLinear as TrendlineLinearPlugin.TrendlineLinearOptions
    ).style = subcolor;
    (
      chart.data.datasets[1]
        .trendlineLinear as TrendlineLinearPlugin.TrendlineLinearOptions
    ).style = subcolor;
  } catch {}

  (
    (chart.options as PluginChartOptions<TType>).plugins.annotation
      .annotations as AnnotationOptions<"line">[]
  ).forEach((annotation) => {
    if (annotation.id !== "funbox-label") {
      annotation.borderColor = subcolor;
    }
    (annotation.label as LabelOptions).backgroundColor = subcolor;
    (annotation.label as LabelOptions).color = bgcolor;
  });

  chart.update("none");
}

export function setDefaultFontFamily(font: string): void {
  Chart.defaults.font.family = font.replace(/_/g, " ");
}

export function updateAllChartColors(): void {
  ThemeColors.update();
  accountHistory.updateColors();
  accountHistogram.updateColors();
  globalSpeedHistogram.updateColors();
  result.updateColors();
  accountActivity.updateColors();
  miniResult.updateColors();
}

ConfigEvent.subscribe((eventKey, eventValue) => {
  if (eventKey === "chartAccuracy") updateAccuracy();
  if (eventKey === "chartAverage10") updateAverage10();
  if (eventKey === "chartAverage100") updateAverage100();
  if (eventKey === "fontFamily") setDefaultFontFamily(eventValue as string);
});
