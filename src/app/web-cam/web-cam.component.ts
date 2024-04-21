import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {WebcamImage, WebcamModule} from 'ngx-webcam';
import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';


export class UtilitiesModule {}

@Component({
  selector: 'app-web-cam',
  standalone: true,
  imports: [NgIf,WebcamModule],
  template: `
    <!-- <webcam [height]="480" [width]="640" ></webcam>   -->

<div class=" mt-5 flex flex-col justify-center items-center">
<button (click)="turn_off_on()"  type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">{{show_hide ? "Turn camera off" : "Turn camera on"}}</button>
<div class=" p-8 rounded-lg">
    

  <div class="flex justify-center mt-5">
    <webcam *ngIf="show_hide" [trigger]="invokeObservable" (imageCapture)="captureImg($event)" class="w-full"></webcam>
  </div>

  <div *ngIf="show_hide" class="flex justify-center mt-5">
    <button class="px-4 py-2 bg-gray-400 text-white rounded-lg" (click)="getSnapshot()">
      Capture Image
    </button>
  </div>
  <div *ngIf="show_hide" class="mt-5">
    <div id="results" class="text-center">Your taken image manifests here...</div>

    <img [src]="webcamImage?.imageAsDataUrl" height="400px" class="mx-auto mt-5" />
  </div>
  </div>
  

</div>


  `,
  styles: ``
})
export class WebCamComponent {

  constructor(private http: HttpClient) { 
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

  public captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsDataUrl;
    // console.info('got webcam image', this.sysImage);
    const imageDataAsString = '"'+ this.webcamImage.imageAsDataUrl + '"';
    console.log("wysylanko:    ",imageDataAsString);
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post('https://localhost:7205/api/response',  imageDataAsString , httpOptions)
        .subscribe((response) => {
          console.log('Zdjęcie wysłane do API:', response);
        }, (error) => {
          console.error('Błąd podczas wysyłania zdjęcia do API:', error);
        });

  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
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

}


