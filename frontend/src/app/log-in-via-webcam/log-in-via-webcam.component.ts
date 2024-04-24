import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TakeImageFromWebcamComponent } from '../take-image-from-webcam/take-image-from-webcam.component';
import { CanvasDrawImageComponent } from '../canvas-draw-image/canvas-draw-image.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GlobalVarableStoreService } from '../global-varable-store.service';

@Component({
  selector: 'app-log-in-via-webcam',
  standalone: true,
  imports: [NgIf, TakeImageFromWebcamComponent, CanvasDrawImageComponent],
  template: `
  <section>
              <div *ngIf="!user_login"  class="bg-white dark:bg-gray-900 flex justify-center items-center col-auto flex-col space-y-4 "> 

            
              
              <div *ngIf="!this.to_canvas_data_preview" class=" flex justify-center items-center flex-col">
                <h2 class="m-4 text-xl font-bold text-gray-900 dark:text-white ">Launch camera:</h2>
                <app-take-image-from-webcam class="m-4" (cameraItemEvent)="updata_local_url_image($event)" />
              </div>

              <div class="flex flex-row m-10">
                    <app-canvas-draw-image *ngIf="!to_canvas_data_with_box" [data]="to_canvas_data_preview" />  
                    <app-canvas-draw-image  [data]="to_canvas_data_with_box" />  
                    <div *ngIf="show_hide" class="fixed inset-0 top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50    top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  flex justify-center items-center">
                                      <div  role="status" class=" flex items-center justify-center mt-8 text-gray-500 sm:text-lg dark:text-gray-400">
                                                                  <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                                  </svg>
                                                                  <span class="sr-only">Loading...</span>
                                    </div>      
                    </div>
                    <div *ngIf="message_after_response_from_api" class=" flex justify-center items-center flex-col">
                    <h2 class="m-4 text-xl font-bold text-gray-900 dark:text-white ">{{this.message_after_response_from_api}}</h2>
                    <a *ngIf="login_Unauthorized" href="/profil" class="bg-gray-500 text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Make new face profil</a>
                    <a *ngIf="login_api_error" href="/loginViaWebcam" class=" bg-gray-500 text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Try again</a>
              </div>
              </div> 
              

              </div>

              <div *ngIf="user_login" class="flex flex-col items-center mt-14 px-6 py-8 mx-auto md:h-screen lg:py-0">
                  <h1 class="m-6 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">You are logged in as:  {{user_login}}</h1>
                  <div class="flex items-center">
                  <h4 class="m-6 text-xl leading-tight tracking-tight text-gray-900 md:text-1xl dark:text-white">Now you can log out:</h4>
                  <button (click)="logOut()"  class="max-w-xl text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Log out</button>
              </div>
        
              </div>
  </section>

    
  `,
  styles: ``
})
export class LogInViaWebcamComponent {
  api_url = environment.apiUrl
  constructor(private http: HttpClient,  private globalLogin: GlobalVarableStoreService) 
  { 
   this.checkLogin()
  }

  user_login: any;
  checkLogin() {
    const currentUser = this.globalLogin.getCurrentUser();
    if (currentUser) {
      console.log("login stored in localstorage: ",currentUser)
      this.user_login = currentUser;
    }
  }
  setUserNameGlobally(name: string) {
    if (name) {
      console.log("login inserted in localstorage: ",name)
      this.globalLogin.setLoggedUser(name);
      // this.user_login = name;
    }
  }

  logOut() {
    this.globalLogin.removeCurrentUser();
    this.user_login = null;
  }


  //--------------------------------- image stuff
  image_base64: any;
  to_canvas_data_preview: any;
  to_canvas_data_with_box: any;
  faceCoordinates = [0,0,0,0];
  data = {"coordinates":this.faceCoordinates, "image":'', "name":'' }

  update_to_canvas_data_preview_prewiew(data: any){
    this.data.image = data;
    this.data.coordinates = this.faceCoordinates;
    this.data.name = "";
    this.to_canvas_data_preview = this.data; 
    this.make_request_to_api();
  }

  update_to_canvas_data_box(data_from_model:any){
    this.data.image = this.image_base64;
    this.data.coordinates = [data_from_model.coordinates.top, data_from_model.coordinates.right, data_from_model.coordinates.bottom, data_from_model.coordinates.left]
    console.log(this.data.coordinates);
    this.data.name = data_from_model.name;
    this.to_canvas_data_with_box = this.data; 
    this.turn_off_on_loading_circle();
  }


   updata_local_url_image(image_url: any){
    this.image_base64 = image_url;
    this.update_to_canvas_data_preview_prewiew(image_url);
   }
  //--------------------------------- image stuff



 //------------------------------------- request to api

login_api_error: boolean = false;
login_Unauthorized: boolean = false;
message_after_response_from_api: any;
 public async make_request_to_api() : Promise<void>
 {
   if(this.image_base64)
   {
     this.turn_off_on_loading_circle();
      const httpOptions = 
      {
        headers: new HttpHeaders( {'Content-Type': 'application/json'} ),
      };

      console.log('Attempt POST request do api');
      try 
      {
        const response = await this.http.post(this.api_url+'/database/checkFace', '"'+this.image_base64+'"', httpOptions).toPromise();
        console.log('Response from API:', response);
        this.update_to_canvas_data_box(response);
        this.check_data_from_api(response);
      } catch (error) 
      {
        console.error('Błąd podczas wysyłania zdjęcia do API:', error);
      }
   }
   
 }
 // ------------------------------------- request to api

 check_data_from_api(response: any){

  if(response.name == "Unrecognized")
    {
      this.message_after_response_from_api = "Unauthorized! \n Sorry, but you don't have an account. \n Create an account with this form:"
      this.login_Unauthorized = true;
    }
  else if (response.name == "FACE NOT DETECTED")
    {
      this.message_after_response_from_api = "Sorry, but we can't detect your face in the photo. \n Please try again."
      this.login_api_error = true;
    }
  else 
  {
    this.message_after_response_from_api = "Welcome " + response.name + "! You are successfully logged into our page via face recognition.";
    this.setUserNameGlobally(response.name);

  }
 }

 show_hide: boolean = false;
 turn_off_on_loading_circle(): void { setTimeout(()=>{this.show_hide = this.show_hide ? false : true;},500) }


   count: number = 5; // number of seconds
   startCountdown() {
    setTimeout(() => {
      if (this.count > 0) {
        console.log(this.count);
        this.count--;
        this.startCountdown(); // Rekurencyjne wywołanie funkcji startCountdown
      } else {
        console.log('End!');
        // this.router.navigate(['/home']);
      }
    }, 1000); // Czas opóźnienia w milisekundach (1 sekunda)
  }
}
