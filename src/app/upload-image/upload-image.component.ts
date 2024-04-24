import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [],
  template: `
    <input type="file" (change)="onFileSelected($event)">
    <br><br/>
    <p class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400">{{daata_from_model ? daata_from_model.name : "elo"}}</p>
    <p class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400">{{ daata_from_model ? daata_from_model.coordinates.top + daata_from_model.coordinates.right + daata_from_model.coordinates.bottom + daata_from_model.coordinates.left: ""}} </p>
    <canvas id="viewport"  #canvas></canvas>
  `,
  styles: ``
})
export class UploadImageComponent implements AfterViewInit  {

  daata_from_model: any = "";

  constructor(private http: HttpClient) { 
    this.canvas = {} as ElementRef<HTMLCanvasElement>;
  }

  urlString = "";

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Przekształć wczytane dane do formatu base64
        let base64String: string = e.target.result.split(',')[1];
        // console.log(base64String);
        this.urlString = 'data:image/jpeg;base64,' + base64String;
        base64String = '"'+ base64String + '"';
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
        };
        console.log('Attempt POST request do api');
        // this.http.post('http://localhost:5000/api/response',  base64String , httpOptions)
        this.http.post('https://localhost:7205/api/response',  base64String , httpOptions)
        // this.http.post('http://localhost:8081/api/response',  base64String , httpOptions)
            .subscribe((response) => {
              console.log('Zdjęcie wysłane do API:', response);
              // this.daata_from_model = response;

              // this.faceCoordinates[0] = this.daata_from_model.coordinates.top;
              // this.faceCoordinates[1] = this.daata_from_model.coordinates.right;
              // this.faceCoordinates[2] = this.daata_from_model.coordinates.bottom;
              // this.faceCoordinates[3] = this.daata_from_model.coordinates.left;
              // console.log(this.faceCoordinates);
              //    this.drawFaceBox();
            }, (error) => {
              console.error('Błąd podczas wysyłania zdjęcia do API:', error);
            });

        // Tutaj możesz przesłać base64String do serwera lub wykonać inne operacje
      };

      reader.readAsDataURL(file);
    }
  }



  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null = null;

  // Koordynaty twarzy (top, right, bottom, left)
  faceCoordinates = [132, 3, 4, 5];

 

  ngAfterViewInit(): void {
          this.ctx = this.canvas.nativeElement.getContext('2d');
       
  }

  drawFaceBox(): void {
    if (!this.ctx || this.faceCoordinates.length !== 4 ) {
      console.error('Invalid face coordinates');
      return;
    }

    const [top, right, bottom, left] = this.faceCoordinates;

    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Oblicz współrzędne prostokąta na podstawie otrzymanych koordynatów
    const rectX = left;
    const rectY = top;
    const rectWidth = right - left;
    const rectHeight = bottom - top;

    // Wyczyść obszar rysowania
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    let base_image = new Image();

    base_image.onload= () => {
      if(this.ctx != null){
         
    this.ctx.drawImage(base_image,0,0)
    // Narysuj prostokąt
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 2;
    this.ctx.rect(rectX, rectY, rectWidth, rectHeight);
    this.ctx.stroke();
      }
      
    }
    base_image.src = this.urlString;
  }

}
