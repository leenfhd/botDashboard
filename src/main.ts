import { GridRenderer } from "./grid";
import { fuzzySearch } from "./search";
import {StatController} from "./statController";

class BotDetectionDashboard {
    private fileInput: HTMLInputElement;
    private gridRenderer: GridRenderer;
    private statController:StatController;
    private data: BotDetectionData[] = [];
    private filteredData: BotDetectionData[] = []; 
    private currentPage: number = 1;
    private inputValue: string = "";

    constructor() {
       
        this.fileInput = document.getElementById("jsonPicker") as HTMLInputElement;
        this.gridRenderer = new GridRenderer("output");
        this.statController=new StatController();
        this.initialize();
    }

    private initialize(): void {
       
        this.currentPage = this.getPageFromURL();
        const deleteFileButton=document.getElementById("deleteFile");
        if(deleteFileButton){
            deleteFileButton.addEventListener("click",this.deleteFile.bind(this));
        }
        const storedFile = sessionStorage.getItem('uploadedFile'); 
       const storedFileName = sessionStorage.getItem('uploadedFileName');
       if (storedFile && storedFileName) {
        if(deleteFileButton){
            deleteFileButton.style.visibility= "visible";
        }
        
           this.updateFileLabel(storedFileName); 
           this.parseFile(storedFile); 
       }
   
        if (this.fileInput) {
            this.fileInput.addEventListener("change", this.handleFileUpload.bind(this));
        }
        const searchDisplayButton=document.getElementById("displaySearch") as HTMLButtonElement;
        if(searchDisplayButton){
            searchDisplayButton.addEventListener("click", function(event){
                let input = document.getElementById("myInput");
                if(input){
                input.classList.toggle("show");
                }
            }

        );
        }
        const searchInput = document.getElementById("myInput") as HTMLInputElement;
        if (searchInput) {
            searchInput.addEventListener("input", this.handleSearch.bind(this));
        }

        
    }

    private handleFileUpload(event: Event): void {
        const deleteFileButton=document.getElementById("deleteFile");
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target?.result) {
                    const fileContent = e.target.result as string;
                    sessionStorage.setItem('uploadedFile', fileContent);
                    sessionStorage.setItem('uploadedFileName', file.name); 
                    this.updateFileLabel(file.name); 
                    if(deleteFileButton){
                        deleteFileButton.style.visibility= "visible";
                    }
                    this.parseFile(fileContent);
                }
            };

            reader.readAsText(file);
        }
    }

    private parseFile(fileContent: string): void {
        const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");
        this.data = [];

        lines.forEach((line) => {
            try {
                const jsonData: BotDetectionData = JSON.parse(line);
                this.data.push(jsonData);
            } catch (error) {
                console.error("Invalid JSON format on line:", line);
            }
        });

        /// at first the  filteredData is original data
        this.filteredData = this.data;
        this.gridRenderer.displayGrid(this.filteredData, this.currentPage, this.inputValue, this.updatePage.bind(this));
        this.statController.displayStat(this.data);
    }

    private updatePage(newPage: number): void {
        this.currentPage = newPage;
        this.updateURL(newPage);

    

        const dataToDisplay = this.inputValue!=="" ? this.filteredData : this.data;

        this.gridRenderer.displayGrid(dataToDisplay, this.currentPage, this.inputValue, this.updatePage.bind(this));
    }

    private debounceTimer: any = null;

    private handleSearch(): void {
        const searchInput = document.getElementById("myInput") as HTMLInputElement;
        if (!searchInput) return;
    
        clearTimeout(this.debounceTimer); 
    
        this.debounceTimer = setTimeout(() => {
            this.inputValue = searchInput.value.toLowerCase();
            this.filteredData = fuzzySearch(this.data, this.inputValue);
            
            if (this.inputValue === "") {
                this.filteredData = this.data; 
            }
    
            this.currentPage = 1;
           
            this.gridRenderer.displayGrid(this.filteredData, this.currentPage, this.inputValue, this.updatePage.bind(this));
        }, 300); 
    }
    

    private updateURL(page: number): void {
        const url = new URL(window.location.href);
        url.searchParams.set("page", page.toString());
        window.history.pushState({}, "", url.toString());
    }

    private getPageFromURL(): number {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get("page") || "1", 10);
    }


    private updateFileLabel(fileName: string): void {
        const fileLabel = document.getElementById("fileLabel") as HTMLLabelElement;
        if (fileLabel) {
            fileLabel.textContent = fileName;
        }
    }

    private deleteFile(event: Event): void {
        sessionStorage.removeItem('uploadedFile');
        sessionStorage.removeItem('uploadedFileName');
    
        this.updateFileLabel("Choose a file"); // Reset label text
       let deleteFileButton= document.getElementById("deleteFile");
            if(deleteFileButton){
                deleteFileButton.style.visibility="hidden"
            }
      
    
       
        if (this.fileInput) {
            this.fileInput.value = ""; 
        }
    }
    
    
}

document.addEventListener("DOMContentLoaded", () => {
    new BotDetectionDashboard();
});
