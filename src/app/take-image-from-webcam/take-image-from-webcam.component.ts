import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-take-image-from-webcam',
  standalone: true,
  imports: [NgIf,WebcamModule],
  template: `
  <div >
        <button (click)="turn_off_on()"  type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">{{show_hide_camera ? "Turn camera off" : "Take selfe from camera"}}</button>
        <div *ngIf="show_hide_camera" class="fixed inset-0 z-50 bg-black bg-opacity-80  overflow-auto">
              <div class=" p-8 rounded-lg mt-5 flex flex-col justify-center items-center">

                  <div class="flex justify-center mt-5">
                  <webcam *ngIf="show_hide_camera" [width]="640" [height]="480" [videoOptions]="videoOptions" [trigger]="invokeObservable"  (imageCapture)="captureImg($event)" class="w-full"></webcam>
                  </div>

                  <div *ngIf="show_hide_camera" class="flex justify-center mt-5">
                        <button class="px-4 py-2 bg-gray-400 text-white rounded-lg" (click)="getSnapshot(); turn_off_on()">
                        Capture Image
                        </button>
                  </div>
              <!--<div *ngIf="show_hide" class="mt-5">
              <div id="results" class="text-center">Your taken image manifests here...</div>
              <img [src]="webcamImage?.imageAsDataUrl" height="400px" class="mx-auto mt-5" />                            
              </div>-->    
              </div>  
        </div>
  </div>
  `,
  styles: ``
})
export class TakeImageFromWebcamComponent {

  @Output() cameraItemEvent = new EventEmitter<string>();

  sendStringToParentComponent(value: string) {
    this.cameraItemEvent.emit(value);
  }

  show_hide_camera: boolean = false;
  turn_off_on(): void { this.show_hide_camera = this.show_hide_camera ? false : true;}

    public get videoOptions(): MediaTrackConstraints { const result: MediaTrackConstraints = {width:640, height:480}; return result; }
    private trigger: Subject<any> = new Subject();
    private webcamImage: any;
     urlString: any;
  
    public get invokeObservable(): Observable<any> {
        return this.trigger.asObservable();
        }
    public async captureImg(webcamImage: WebcamImage): Promise<void> {
        this.webcamImage = webcamImage;
        this.sendStringToParentComponent(webcamImage!.imageAsDataUrl);                
        // const imageDataAsString = '"'+ this.webcamImage.imageAsDataUrl + '"';   
        // console.log(this.urlString);      
        }
    public getSnapshot(): void { this.trigger.next(void 0);}

    
}
