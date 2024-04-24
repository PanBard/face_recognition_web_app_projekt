import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TakeImageFromWebcamComponent } from '../take-image-from-webcam/take-image-from-webcam.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CanvasDrawImageComponent } from '../canvas-draw-image/canvas-draw-image.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [NgIf, TakeImageFromWebcamComponent, CanvasDrawImageComponent],
  template: `
  <!-- <section class="bg-white dark:bg-gray-900 dark:text-white "> -->
    <div class="flex h-screen ">



          <div class="m-10 w-1/5 flex flex-col items-center justify-center border border-white rounded-lg ">
                <div  class="flex flex-col  items-center">
                    <app-take-image-from-webcam  (cameraItemEvent)="updata_local_url_image($event)" />
                    <p class="m-5">OR</p>
                    <input class="p-3 w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm  py-2.5   dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="file" (change)="onFileSelected($event)">
                </div>
          </div>




          <div class="m-10 w-4/5 border border-white rounded-lg ">
            <div  class=" " > 
                                          <h2 *ngIf="!daata_from_model" class="m-4 text-4xl tracking-tight  text-gray-900 dark:text-white">Please upload an image for face detection.</h2>
                                          <h2 *ngIf="daata_from_model" class="m-4 text-4xl tracking-tight  text-gray-900 dark:text-white">{{this.face_detected ? "The face has been detected in the image." : "Face not detected."}}</h2>
                                          <!-- <p *ngIf="daata_from_model && this.face_detected" class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400"><span class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Name: </span>{{this.face_detected ? this.name : ""}}</p> -->
                                          <p *ngIf="daata_from_model" class="m-4 text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400"><span class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Face coordinates: </span>{{ this.face_detected ? "("+daata_from_model.coordinates.top +", "+ daata_from_model.coordinates.right +", "+ daata_from_model.coordinates.bottom +", "+ daata_from_model.coordinates.left+ ")": ";("}} </p>
                                          <br>
                                      </div>   
              <div class="font-light text-gray-500 sm:text-lg dark:text-gray-400 flex flex-col ">
                <!-- <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Create new profile</h2> -->
              
                <div class="font-light text-gray-500 sm:text-lg dark:text-gray-400 flex justify-between items-center">
                    
                      <div class="m-4 ">
                            <div class="grid grid-cols-2 gap-4 mt-8">
                              <div >
                                    <p *ngIf="image_base64" class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400">Uploaded img:</p>
                                    <img *ngIf="image_base64" class="max-w-full max-h-screen rounded-lg" [src]="image_base64" alt="office content 1"> 
                              </div>
                            
                                    <div *ngIf="show_hide" role="status" class="flex items-center justify-center mt-8 text-gray-500 sm:text-lg dark:text-gray-400">
                                          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                          </svg>
                                          <span class="sr-only">Loading...</span>
                                    </div> 
                                    <div class="">
                                      <p *ngIf="image_base64 && !show_hide" class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400">Processed img:</p>
                                      <app-canvas-draw-image [data]="to_canvas_data" />

                                    </div>        
                                                                                    
                                    
                                    
                                    
                            </div>   
                      </div>
                  
                  </div> 
                  <button  *ngIf="this.image_base64" (click)=" make_request_to_api()"   type="button" class="p-6 m-11 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Check image</button>       
                 
                
              
              </div> 
          </div>
          


    </div>                        
  <!-- </section> -->
  



    
  `,
  styles: ``
})
export class UploadImageComponent {

  constructor(private http: HttpClient) { }
  api_url = environment.apiUrl
  

    //----------------------------------------- submit
  to_canvas_data: any;
  image_base64: any;
  show_hide: boolean = false;
  face_detected: boolean = false;
  name = "";
  password="";
  faceCoordinates = [50,50,100,100];
  dataaa = {"coordinates":this.faceCoordinates, "image":'', "name":'' }
  show_after_submit: boolean = false;
  submit_succes: boolean = false;
  update_to_canvas_data(data: any){
    this.dataaa.image = data;
    this.dataaa.coordinates = this.faceCoordinates;
    this.dataaa.name = this.name;
    this.to_canvas_data = this.dataaa; 
  }
  turn_off_on_loading_circle(): void { this.show_hide = this.show_hide ? false : true;}

  updata_local_url_image(image_url: any){
   this.image_base64 = image_url;
  }


  
  //----------------------------------------------- submit


  
  //------------------------------------------ LOAD file from device
  onFileSelected(event: any) 
  {
    const file: File = event.target.files[0];
    if (file) 
    {
      const reader = new FileReader();
      reader.onload = (e: any) => 
        {
        let base64String: string = e.target.result.split(',')[1];
        this.updata_local_url_image('data:image/jpeg;base64,' + base64String)
        // this.update_to_canvas_data('data:image/jpeg;base64,' + base64String)
        }
        reader.readAsDataURL(file);
    }
  }
  //------------------------------------------- LOAD file from device


  //------------------------------------- request to api
  daata_from_model: any = "";
  public async make_request_to_api() : Promise<void>
  {
    if(this.image_base64)
    {
      this.turn_off_on_loading_circle();
    
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
        };
        console.log('Attempt POST request do api');
        try 
        {
          const data ={ ImageURLString: this.image_base64 };
          const response = await this.http.post(this.api_url+'/database/checkFaceforFun', data, httpOptions).toPromise();
          console.log('Odpowiedz z API:', response);
                this.daata_from_model = response;
                this.faceCoordinates[0] = this.daata_from_model.coordinates.top;
                this.faceCoordinates[1] = this.daata_from_model.coordinates.right;
                this.faceCoordinates[2] = this.daata_from_model.coordinates.bottom;
                this.faceCoordinates[3] = this.daata_from_model.coordinates.left;
                console.log(this.faceCoordinates);
                if(this.faceCoordinates[0]==1 && this.faceCoordinates[1]==1 && this.faceCoordinates[2]==1 && this.faceCoordinates[3]==1)
                  {
                    this.face_detected = false;
                  }
                else this.face_detected = true;
                this.turn_off_on_loading_circle();
                this.update_to_canvas_data(this.image_base64 );
        } catch (error) 
        {
          console.error('Błąd podczas wysyłania zdjęcia do API:', error);
        }
    }
    
  }

 
  
  // ------------------------------------- request to api
  
}




























// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

// @Component({
//   selector: 'app-upload-image',
//   standalone: true,
//   imports: [],
//   template: `
//     <input type="file" (change)="onFileSelected($event)">
//     <br><br/>
//     <p class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400">{{daata_from_model ? daata_from_model.name : "elo"}}</p>
//     <p class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400">{{ daata_from_model ? daata_from_model.coordinates.top + daata_from_model.coordinates.right + daata_from_model.coordinates.bottom + daata_from_model.coordinates.left: ""}} </p>
//     <canvas id="viewport"  #canvas></canvas>
//   `,
//   styles: ``
// })
// export class UploadImageComponent implements AfterViewInit  {

//   daata_from_model: any = "";

//   constructor(private http: HttpClient) { 
//     this.canvas = {} as ElementRef<HTMLCanvasElement>;
//   }

//   urlString = "";

//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();

//       reader.onload = (e: any) => {
//         // Przekształć wczytane dane do formatu base64
//         let base64String: string = e.target.result.split(',')[1];
//         // console.log(base64String);
//         this.urlString = 'data:image/jpeg;base64,' + base64String;
//         base64String = '"'+ base64String + '"';
//         const httpOptions = {
//           headers: new HttpHeaders({
//             'Content-Type': 'application/json'
//           }),
//         };
//         console.log('Attempt POST request do api');
//         // this.http.post('http://localhost:5000/api/response',  base64String , httpOptions)
//         this.http.post('https://localhost:7205/api/response',  base64String , httpOptions)
//         // this.http.post('http://localhost:8081/api/response',  base64String , httpOptions)
//             .subscribe((response) => {
//               console.log('Zdjęcie wysłane do API:', response);
//               // this.daata_from_model = response;

//               // this.faceCoordinates[0] = this.daata_from_model.coordinates.top;
//               // this.faceCoordinates[1] = this.daata_from_model.coordinates.right;
//               // this.faceCoordinates[2] = this.daata_from_model.coordinates.bottom;
//               // this.faceCoordinates[3] = this.daata_from_model.coordinates.left;
//               // console.log(this.faceCoordinates);
//               //    this.drawFaceBox();
//             }, (error) => {
//               console.error('Błąd podczas wysyłania zdjęcia do API:', error);
//             });

//         // Tutaj możesz przesłać base64String do serwera lub wykonać inne operacje
//       };

//       reader.readAsDataURL(file);
//     }
//   }



//   @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
//   ctx: CanvasRenderingContext2D | null = null;

//   // Koordynaty twarzy (top, right, bottom, left)
//   faceCoordinates = [132, 3, 4, 5];

 

//   ngAfterViewInit(): void {
//           this.ctx = this.canvas.nativeElement.getContext('2d');
       
//   }

//   drawFaceBox(): void {
//     if (!this.ctx || this.faceCoordinates.length !== 4 ) {
//       console.error('Invalid face coordinates');
//       return;
//     }

//     const [top, right, bottom, left] = this.faceCoordinates;

//     const canvasWidth = this.canvas.nativeElement.width;
//     const canvasHeight = this.canvas.nativeElement.height;

//     // Oblicz współrzędne prostokąta na podstawie otrzymanych koordynatów
//     const rectX = left;
//     const rectY = top;
//     const rectWidth = right - left;
//     const rectHeight = bottom - top;

//     // Wyczyść obszar rysowania
//     this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//     let base_image = new Image();

//     base_image.onload= () => {
//       if(this.ctx != null){
         
//     this.ctx.drawImage(base_image,0,0)
//     // Narysuj prostokąt
//     this.ctx.beginPath();
//     this.ctx.strokeStyle = 'red';
//     this.ctx.lineWidth = 2;
//     this.ctx.rect(rectX, rectY, rectWidth, rectHeight);
//     this.ctx.stroke();
//       }
      
//     }
//     base_image.src = this.urlString;
//   }

// }