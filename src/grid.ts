import { fuzzySearch } from "./search";
export class GridRenderer {
  private outputContainer: HTMLDivElement;
  private currentPage: number;
  private rowsPerPage: number;
  private fullData: BotDetectionData[] = []; 
  private updatePageCallback: (newPage: number) => void = () => {};   
  
  constructor(outputContainerId: string) {
    this.outputContainer = document.getElementById(
      outputContainerId
    ) as HTMLDivElement;
    this.currentPage = 1;
    this.rowsPerPage = 10;
  }

  public displayGrid(
    data: BotDetectionData[],
    page: number,
    inputValue:string,
    updatePageCallback: (newPage: number) => void
  ): void {
    this.currentPage = page;
    this.fullData=data;
    this.updatePageCallback=updatePageCallback;
    if (!this.outputContainer) return;
    if (data.length === 0) {
      this.outputContainer.innerHTML = "<p>No valid JSON data found.</p>";
      return;
    }
    
    const totalPages = Math.ceil(data.length / this.rowsPerPage);
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const visibleData = data.slice(startIndex, startIndex + this.rowsPerPage);

    let gridHTML = ``;

    // Data rows
    visibleData.forEach((row, index) => {
      let websiteUrl = row.apiInfo.parameters.websiteUrl;
      let runId = row.apiInfo.runId;
      let projectId = row.project.id;
      let result=null;
      let captchaNetworkDetected = false;
      let googleCaptchaDetected = false;
      let googleCaptchaisBlocking = false;
      let isStatic = false;
      let hCaptch = false;
      let captchaHeadersDetected = false;
      let captchaBehaviorDetected = false;
      let customCaptchDetected = false;
      let customCaptchaIsBlocking = false;
      let cloudflareDetected = false;
      let cloudflareIsBlocking = false;
      let myResult = row.apiInfo.result;

      if (myResult !== null) {
        result = row.apiInfo.result;

        let cloudflare = row.apiInfo.result.cloudflare;

        cloudflareDetected = false;
        cloudflareIsBlocking = false;
        if (cloudflare !== null) {
          cloudflareDetected = row.apiInfo.result.cloudflare.detected;
          cloudflareIsBlocking = row.apiInfo.result.cloudflare.isBlocking;
        }

        captchaNetworkDetected = row.apiInfo.result.captchaNetworkDetected;
        googleCaptchaDetected = row.apiInfo.result.googleCaptcha.detected;
        googleCaptchaisBlocking = row.apiInfo.result.googleCaptcha.isBlocking;
        isStatic = row.apiInfo.result.isStaticFile;
        hCaptch = row.apiInfo.result.hCaptchaDetected;
        captchaHeadersDetected = row.apiInfo.result.captchaHeadersDetected;
        captchaBehaviorDetected = row.apiInfo.result.captchaBehaviorDetected;
        customCaptchDetected = row.apiInfo.result.customCaptcha.detected;
        customCaptchaIsBlocking = row.apiInfo.result.customCaptcha.isBlocking;
      }

      let error = row.apiInfo.error;
      let errorname = "";
      let errormsg = "";
      if (error !== null) {
        errorname = row.apiInfo.error.error;
        errormsg = row.apiInfo.error.message;
      }

      gridHTML += `<div class="grid-row">`;

      //First Cell
      gridHTML += `<div class="grid-cell" style="position: relative;">
                <a href="${websiteUrl}" class="url-link" target="_blank">
                    ${
                      websiteUrl.length > 20
                        ? websiteUrl.substring(0, 17) + "..."
                        : websiteUrl
                    }
                </a>
                
            </div>`;

      //Second Cell
      gridHTML += `<div class="grid-cell" style="position: relative;">
            <a href="https://app.intuned.io/projects/${projectId}/runs/${runId}" class="url-link" target="_blank">
               ${runId}
            </a>
             
         </div>`; //end of

      //Third Cell
      var statDesc = {};
      if (result === null) {
        statDesc = `Error Name: ${errorname} \nError Message: ${errormsg}`;
      }
      if (result !== null) {
        statDesc = `cloudflare : <br>detected: ${cloudflareDetected}<br>isBlocking: ${cloudflareIsBlocking}<br> websiteUrl:${websiteUrl}<br> isStaticFile:${isStatic}<br> customCaptcha:<br>detected:${customCaptchDetected}<br>isBlocking:${customCaptchaIsBlocking} `;
        statDesc += `<br>googleCaptcha:<br>detected:${googleCaptchaDetected}<br>isBlocking:${googleCaptchaisBlocking} <br>hCaptchaDetected: ${hCaptch} <br> captchaHeadersDetected:${captchaHeadersDetected}<br>`;
        statDesc += `captchaNetworkDetected:${captchaNetworkDetected}<br> captchaBehaviorDetected:${captchaBehaviorDetected}`;
      }

      gridHTML += `<div class="grid-cell" style="position:relative;">
            ${
              result !== null
                ? `<span class="error-icon">✅ 
                <div class="error-popup">
                    <pre>${statDesc}</pre> 
                    <button class="copy-msg-btn" data-error="${statDesc}">Copy</button>
                </div>
                </span>`
                : `<span class="error-icon">❌
                <div class="error-popup">
                <pre>${statDesc}</pre> 
                <button class="copy-msg-btn" data-error="${statDesc}">Copy</button>
                </div>
            </span>`
            }  
            </div> `;

      //End of grid row
      gridHTML += `</div>`;
    });
    // gridHTML += `</div>`;

    gridHTML += `<div class="pagination-controls">`;
    if (this.currentPage > 1) {
      gridHTML += `<button id="prev-page-btn"> \< </button>`;
    }
    gridHTML += `<span> Page ${this.currentPage} of ${totalPages} </span>`;
    if (this.currentPage < totalPages) {
      gridHTML += `<button id="next-page-btn"> \> </button>`;
    }
    gridHTML += `</div>`;

    this.outputContainer.innerHTML = gridHTML;

    this.addListeners(updatePageCallback);
  }

  private addListeners(updatePageCallback: (newPage: number) => void) {
   
   
    document.querySelectorAll(".copy-msg-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const errorText = button.getAttribute("data-error");

        if (!errorText) {
          console.error("No error text found!");
          return;
        }

        navigator.clipboard
          .writeText(errorText)
          .then(() => {
            alert("Details copied!");
          })
          .catch((err) => {
            console.error("Failed to copy:", err);
          });
      });
    });

    const prevBtn = document.getElementById("prev-page-btn");
    const nextBtn = document.getElementById("next-page-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () =>
        updatePageCallback(this.currentPage - 1)
      );
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () =>
        updatePageCallback(this.currentPage + 1)
      );
    }
      
   
         
    
  }

  
  copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard:", text);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  }




  
}
