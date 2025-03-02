import Chart from 'chart.js/auto';

export class StatController {
  private totalSites: string;
  private staticFiles: string;
  private errorSites: string;
  private sitesWithCaptcha: string;
  private sitesWithBlockingCapptcha: string;
  private myPieChart: Chart | null = null;
  private myLineChart: Chart | null = null;
  private myBarChart: Chart | null = null;

  constructor() {
    this.totalSites = "";
    this.staticFiles = "";
    this.errorSites = "";
    this.sitesWithCaptcha = "";
    this.sitesWithBlockingCapptcha = "";
  }

  displayStat(data: BotDetectionData[]) {

      const pieCanvas = document.getElementById("myChart") as HTMLCanvasElement;
      const lineCanvas = document.getElementById("myLineChart") as HTMLCanvasElement;
      const barCanvas = document.getElementById("myBarChart") as HTMLCanvasElement;

      if (!pieCanvas || !lineCanvas || !barCanvas) {
        console.error("One or more canvas elements not found!");
        return;
      }

      const pieCtx = pieCanvas.getContext("2d");
      const lineCtx = lineCanvas.getContext("2d");
      const barCtx = barCanvas.getContext("2d");

      if (!pieCtx || !lineCtx || !barCtx) {
        console.error("Could not get canvas context!");
        return;
      }

      let totalSitesNum = 0;
      let staticFilesNum = 0;
      let errorSitesNum = 0;
      let sitesWithCaptchaNum = 0;
      let sitesWithBlockingCapptchaNum = 0;

      data.forEach((d) => {
        totalSitesNum++;
        if (d.apiInfo.result !== null) {
          if (d.apiInfo.result.isStaticFile !== null) {
            staticFilesNum++;
          }
          if (d.apiInfo.result.customCaptcha.detected) {
            sitesWithCaptchaNum++;
          }
          if (d.apiInfo.result.customCaptcha.isBlocking) {
            sitesWithBlockingCapptchaNum++;
          }
        }
        if (d.apiInfo.error !== null) {
          errorSitesNum++;
        }
      });

      document.getElementById("totalSites")!.textContent = totalSitesNum.toString();
      document.getElementById("staticFiles")!.textContent = staticFilesNum.toString();
      document.getElementById("errorSites")!.textContent = errorSitesNum.toString();
      document.getElementById("sitesWithCaptcha")!.textContent = sitesWithCaptchaNum.toString();
      document.getElementById("sitesWithBlockingCaptcha")!.textContent = sitesWithBlockingCapptchaNum.toString();

      let chartLabels = ["Total Sites", "Static Files", "Error Sites", "Sites With Captcha", "Blocking Captcha"];
      let chartData = [totalSitesNum, staticFilesNum, errorSitesNum, sitesWithCaptchaNum, sitesWithBlockingCapptchaNum];
      let colors = ["#36A2EB", "#FF6384", "#FFCE56", "#000", "#9966FF"];

     
      if (this.myPieChart) this.myPieChart.destroy();
      if (this.myLineChart) this.myLineChart.destroy();
      if (this.myBarChart) this.myBarChart.destroy();

    
      this.myPieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: chartLabels,
          datasets: [{ data: chartData, backgroundColor: colors }],
        },
      });

     
      this.myLineChart = new Chart(lineCtx, {
        type: "line",
        data: {
          labels: chartLabels,
          datasets: [{
            label: "Data",
            data: chartData,
            borderColor: "#36A2EB",
            fill: false,
            tension: 0.1
          }],
        },
      });

     
      this.myBarChart = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: chartLabels,
          datasets: [{
            label: "Site Data",
            data: chartData,
            backgroundColor: colors,
          }],
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });

   
  }
}
