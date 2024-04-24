import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { TakeImageFromWebcamComponent } from '../take-image-from-webcam/take-image-from-webcam.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CanvasDrawImageComponent } from '../canvas-draw-image/canvas-draw-image.component';

@Component({
  selector: 'app-add-profil',
  standalone: true,
  imports: [NgIf,WebcamModule, TakeImageFromWebcamComponent, CanvasDrawImageComponent],
  template: `
  <section class="bg-white dark:bg-gray-900 flex justify-between items-center flex-col p-10">
                                <div *ngIf="daata_from_model" class=" " > 
                                      <h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">New profile was created! </h2>
                                      <p class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400"><span class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Name: </span>{{daata_from_model ? this.name : ""}}</p>
                                      <p class="text-gray-500 tracking-tight font-bold sm:text-lg dark:text-gray-400"><span class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Face coordinates: </span>{{ daata_from_model ? "("+daata_from_model.coordinates.top +", "+ daata_from_model.coordinates.right +", "+ daata_from_model.coordinates.bottom +", "+ daata_from_model.coordinates.left+ ")": ""}} </p>
                                      <br>
                                  </div>   
        <div class="font-light text-gray-500 sm:text-lg dark:text-gray-400 flex flex-col ">
            <!-- <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Create new profile</h2> -->
          
             <div class="font-light text-gray-500 sm:text-lg dark:text-gray-400 flex justify-between items-center">
                  <section class="bg-white dark:bg-gray-900 border border-l-gray-50 rounded-xl flex flex-col items-center">
                            <div *ngIf="show_hide==false && !this.to_canvas_data" class="py-8 px-4 mx-auto max-w-max lg:py-16">
                                <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Enter data to create new profil</h2>
                                <form submit="">
                                    <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                        <div class="sm:col-span-2">
                                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                            <input #name_form (input)="onInputName(name_form)"  (ngModel)="this.name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type  name" required="">
                                        </div>
                                        <div class="sm:col-span-2">
                                          {{name}}
                                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                            <input #password_form (input)="onInputPassword(password_form)"  type="text" name="password"  id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type pass" required="">
                                        </div>                                                                    
                                    </div>
                                   
                                </form>
                            </div>
                           
                  </section> 

                  
                  <div class="m-4 ">
                        <div class="grid grid-cols-2 gap-4 mt-8">
                          
                                <img *ngIf="image_base64" class=" rounded-lg" [src]="image_base64" alt="office content 1"> 
                                <div *ngIf="show_hide" role="status" class="flex items-center justify-center mt-8 text-gray-500 sm:text-lg dark:text-gray-400">
                                      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                      </svg>
                                      <span class="sr-only">Loading...</span>
                                </div> 
                                <div class="flex flex-row">
                                  <app-canvas-draw-image [data]="to_canvas_data" />
                                  
                                </div>        
                                                                                 
                                
                                
                                
                        </div>
                        <div *ngIf="show_hide==false && !this.to_canvas_data" class="flex flex-col  items-center">
                          <app-take-image-from-webcam class="m-2" (cameraItemEvent)="updata_local_url_image($event)" />
                          <p>OR</p>
                          <input class="px-4 py-2 bg-gray-400 text-white rounded-lg" type="file" (change)="onFileSelected($event)">
                        </div>
                        
                  </div>
              
              </div>     
            
                 
              <button type="submit" *ngIf="show_hide==false && !this.to_canvas_data" (click)=" make_request_to_api()"  type="button" class="  mt-10 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Create new profil</button>
            
          
        </div>
</section>
  



    
  `,
  styles: ``
})
export class AddProfilComponent {

  constructor(private http: HttpClient) { }
  

    //----------------------------------------- submit
  to_canvas_data: any;
  image_base64: any;
  show_hide: boolean = false;
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

  onInputName(form: any){
    this.name = form.value;
    console.log(form.value)
  }

  onInputPassword(form: any){
    this.password = form.value;
    console.log(form.value)
  }
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
    if(this.check_data_before_api())
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
          const data ={ Name: this.name, Password: "pass", ImageString: this.image_base64 };
        //const response = await this.http.post('http://localhost:5000/api/response',  base64String , httpOptions)
        //const response = await this.http.post('http://localhost:5164/api/response',  base64String , httpOptions)
        //const response = await this.http.post('http://localhost:8081/api/response',  imageDataAsString , httpOptions)
          const response = await this.http.post('https://localhost:7205/api/database/addNewProfile', data, httpOptions).toPromise();
          console.log('Odpowiedz z API:', response);
                this.daata_from_model = response;
                this.faceCoordinates[0] = this.daata_from_model.coordinates.top;
                this.faceCoordinates[1] = this.daata_from_model.coordinates.right;
                this.faceCoordinates[2] = this.daata_from_model.coordinates.bottom;
                this.faceCoordinates[3] = this.daata_from_model.coordinates.left;
                console.log(this.faceCoordinates);
                this.turn_off_on_loading_circle();
                this.update_to_canvas_data(this.image_base64 );
        } catch (error) 
        {
          console.error('Błąd podczas wysyłania zdjęcia do API:', error);
        }
    }
    
  }

  public  check_data_before_api() :boolean
  {
    if(!this.image_base64)
    {
      alert("Load image!");
      return false
    }
    else if(!this.name)
    {
      alert("Enter name!")
      return false
    }
    return true
  }
  
  // ------------------------------------- request to api
  
}
