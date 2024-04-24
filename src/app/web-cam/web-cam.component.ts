import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {WebcamImage, WebcamModule} from 'ngx-webcam';
import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


export class UtilitiesModule {}

@Component({
  selector: 'app-web-cam',
  standalone: true,
  imports: [NgIf,WebcamModule],
  template: `
    <!-- <webcam [height]="480" [width]="640" ></webcam>   -->
    <div class="bg-white dark:bg-gray-900 flex justify-center items-center ">
                    <div class=" mt-5 flex flex-col justify-center items-center">
                            <button (click)="turn_off_on()"  type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">{{show_hide ? "Turn camera off" : "Turn camera on"}}</button>
                            <div class=" p-8 rounded-lg">
                                

                              <div class="flex justify-center mt-5">
                                <webcam *ngIf="show_hide" [width]="640" [height]="480" [videoOptions]="videoOptions" [trigger]="invokeObservable" (imageCapture)="captureImg($event)" class="w-full"></webcam>
                              </div>

                              <div *ngIf="show_hide" class="flex justify-center mt-5">
                                <button class="px-4 py-2 bg-gray-400 text-white rounded-lg" (click)="getSnapshot(); turn_off_on()">
                                  Capture Image
                                </button>
                              </div>
                              <!--<div *ngIf="show_hide" class="mt-5">
                                <div id="results" class="text-center">Your taken image manifests here...</div>
                                 <img [src]="webcamImage?.imageAsDataUrl" height="400px" class="mx-auto mt-5" />                            
                              </div>-->    
                              </div>  
                              
                      <div class="flex row-auto">
                          <canvas id="viewport"  #canvas></canvas>
                          <div  class="ml-4 ">
                            <div *ngIf="run_circle && daata_from_model" class="border p-1" > 
                              <p class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400">{{daata_from_model ?"Name:         ": ""}}{{daata_from_model ? daata_from_model.name : ""}}</p>
                              <p class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400">{{daata_from_model ?"Coordinates:  ":""}}{{ daata_from_model ? "("+daata_from_model.coordinates.top +", "+ daata_from_model.coordinates.right +", "+ daata_from_model.coordinates.bottom +", "+ daata_from_model.coordinates.left+ ")": ""}} </p>
                              <br>
                              <p class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400">Redirection in <span class="font-bold sm:text-lime-200">{{count}}</span> seconds!</p>
                            </div>
                                <div *ngIf="run_circle && !daata_from_model" role="status" class="flex items-center justify-center mt-8 text-gray-500 sm:text-lg dark:text-gray-400">
                                          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                          </svg>
                                          <span class="sr-only">Loading...</span>
                                </div>
                          </div>                  
                    </div>

                    </div>


                      
                    

</div>





  `,
  styles: ``
})
export class WebCamComponent {

  run_circle : boolean = false;

  // ------------------------------- canvas
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null = null;
  faceCoordinates = [132, 3, 4, 5]; 
  urlString = "";
  daata_from_model: any = "";

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
}

drawFaceBox(): void {
if (!this.ctx || this.faceCoordinates.length !== 4 ) {
console.error('Invalid face coordinates');
return;
}

const [top, right, bottom, left] = this.faceCoordinates;
this.canvas.nativeElement.width = 640;
this.canvas.nativeElement.height = 480;
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
  // Oblicz proporcje skalowania
  let scale = Math.min(canvasWidth / base_image.width, canvasHeight / base_image.height);

  // Oblicz szerokość i wysokość obrazu po skalowaniu
  let scaledWidth = base_image.width * scale;
  let scaledHeight = base_image.height * scale;

if(this.ctx != null){

this.ctx.drawImage(base_image,0,0 )
// Narysuj prostokąt
this.ctx.beginPath();
this.ctx.strokeStyle = 'red';
this.ctx.lineWidth = 2;
this.ctx.rect(rectX, rectY, rectWidth, rectHeight);
this.ctx.stroke();
}

}
base_image.src = this.urlString;



// console.log('Start coun down!');
// this.startCountdown();


}
  //-------------------------------- canvas

  constructor(private http: HttpClient, private router: Router) { 
    this.canvas = {} as ElementRef<HTMLCanvasElement>;
  }

  show_hide: boolean = false;
  turn_off_on(): void {
    this.show_hide = this.show_hide ? false : true;
  }

  private trigger: Subject<any> = new Subject();
  webcamImage: any;
  private nextWebcam: Subject<any> = new Subject();

  sysImage = '';

  ngOnInit() {}

  public getSnapshot(): void {
    this.trigger.next(void 0);
  }

  public async captureImg(webcamImage: WebcamImage): Promise<void> {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsDataUrl;
    // console.info('got webcam image', this.sysImage);
    const imageDataAsString = '"'+ this.webcamImage.imageAsDataUrl + '"';

    // console.log(this.webcamImage.imageAsDataUrl);

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
      };
      // this.http.post('http://localhost:5000/api/response',  base64String , httpOptions)
      // this.http.post('http://localhost:5164/api/response',  base64String , httpOptions)
      // this.http.post('http://localhost:8081/api/response',  imageDataAsString , httpOptions)
      //     .subscribe((response) => {
      //       console.log('Zdjęcie wysłane do API:', response);
      //     }, (error) => {
      //       console.error('Błąd podczas wysyłania zdjęcia do API:', error);
      //     });
      console.log('Attempt POST request do api');
      this.urlString = webcamImage!.imageAsDataUrl;
      this.show_captured_image(this.urlString);
      try 
      {
      this.run_circle = true;
      //const response = await this.http.post('http://localhost:5000/api/response',  base64String , httpOptions)
      //const response = await this.http.post('http://localhost:5164/api/response',  base64String , httpOptions)
      //const response = await this.http.post('http://localhost:8081/api/response',  imageDataAsString , httpOptions)
        const response = await this.http.post('https://localhost:7205/api/database/checkFace', imageDataAsString, httpOptions).toPromise();
        console.log('z API:', response);
              this.daata_from_model = response;
              this.faceCoordinates[0] = this.daata_from_model.coordinates.top;
              this.faceCoordinates[1] = this.daata_from_model.coordinates.right;
              this.faceCoordinates[2] = this.daata_from_model.coordinates.bottom;
              this.faceCoordinates[3] = this.daata_from_model.coordinates.left;
              console.log(this.faceCoordinates);
                 this.drawFaceBox();
      } catch (error) 
      {
        console.error('Błąd podczas wysyłania zdjęcia do API:', error);
      }

      // Tutaj możesz przesłać base64String do serwera lub wykonać inne operacje

    // console.log("wysylanko:    ",imageDataAsString);
    
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   })
    // };
    // this.http.post('https://localhost:7205/api/response',  imageDataAsString , httpOptions)
    //     .subscribe((response) => {
    //       console.log('Zdjęcie wysłane do API:', response);
    //     }, (error) => {
    //       console.error('Błąd podczas wysyłania zdjęcia do API:', error);
    //     });

  }

  show_captured_image(image_url: string) {
    let base_image = new Image();
    this.canvas.nativeElement.width = 640;
    this.canvas.nativeElement.height = 480;
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    // Oblicz proporcje skalowania
    let scale = Math.min(canvasWidth / base_image.width, canvasHeight / base_image.height);

    // Oblicz szerokość i wysokość obrazu po skalowaniu
    let scaledWidth = base_image.width * scale;
    let scaledHeight = base_image.height * scale;

    base_image.onload= () => {
      if(this.ctx != null){
      this.ctx.drawImage(base_image,0,0)
      }
    }
    base_image.src = image_url;
    
  }





  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    //you can set ideal,min,max for width and height
            const result: MediaTrackConstraints = {width:640,
            height:480};
    
        
        return result;
      }


  
fetchDataFromApi() {

  // this.http.get('YOUR_API_ENDPOINT', { responseType: 'text' })
  // .subscribe((response) => {
  //   console.log('Zdjęcie wysłane do API:', response);
  // }, (error) => {
  //   console.error('Błąd podczas wysyłania zdjęcia do API:', error);
  // });

  

    // this.http.get<any>('https://localhost:7268/api/allData').subscribe(
    //   (response) => {
    //     this.apiData = response;
    //     console.log(this.apiData);
    //     this.number_of_data_from_db = this.apiData.length
    //   },
    //   (error) => {
    //     console.error('Error:', error);
    //   }
    // );
  }

  count: number = 5; // number of seconds

  startCountdown() {
    setTimeout(() => {
      if (this.count > 0) {
        console.log(this.count);
        this.count--;
        this.startCountdown(); // Rekurencyjne wywołanie funkcji startCountdown
      } else {
        console.log('End!');
        this.router.navigate(['/home']);
      }
    }, 1000); // Czas opóźnienia w milisekundach (1 sekunda)
  }


  // if(this.daata_from_model.name != "-" && this.daata_from_model.name != null)
//   {
//     console.log("odliczanie 3 s");
//     setTimeout(() => 
//       {        
//         this.router.navigate(['/home']);
//       }, 3000);
//   }

}


