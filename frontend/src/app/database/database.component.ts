import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-database',
  standalone: true,
  imports: [NgFor],
  template: `
     <section class="bg-white dark:bg-gray-900 flex justify-center items-center flex-col p-10">

    <h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">{{data_from_api ? "DB content: " : "DB status: Connection failed."}}</h2>
    <!-- <h3  class="mb-4 text-4xl tracking-tight  text-gray-900 dark:text-white">ID : Name : Password</h3>
    <h3 *ngFor="let data of data_from_api" class="mb-4 text-4xl tracking-tight  text-gray-900 dark:text-white">{{data.id}} : {{data.name}} : {{data.password}}</h3> -->
    
    

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Id
                </th>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Password
                </th>

                <th scope="col" class="px-6 py-3">
                    Status
                </th>
                <th scope="col" class="px-6 py-3">
                    Img
                </th>
               
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Remove</span>
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let data of data_from_api" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" class="px-6 py-4" >
                {{data.id}}
                </th >
                <td  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{data.name}}
                </td>
                <td class="px-6 py-4">
                {{data.password}}
                </td>
                <td class="px-6 py-4">
                --
                </td>
                <td class="px-6 py-4">
                  <img class=" w-24 h-24  " src="{{data.image}}" alt="">

                </td>
                <td class="px-6 py-4">
                    <button (click)="deleteDataFromDB(data.id)" class="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</button>
                </td>
             
                <td class="px-6 py-4 text-right">
                    <button  class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                </td>
            </tr>
         
        </tbody>
    </table>
</div>
<button class="bg-slate-400 dark:text-white "  (click)="sendDataToApi()">Send Data</button>

  </section>
  `,
  styles: ``
})
export class DatabaseComponent {
  api_url = environment.apiUrl

  constructor(private http: HttpClient) { 
    this.loadData();
  }
  data_from_api: any;

  fetchData(): Observable<any> {
    return this.http.get<any>(this.api_url + '/database_test');
  }

  sendData(data: any) {
    return this.http.post(this.api_url+'/database/add', data);
  }

  deleteData(id: number) {
    return this.http.delete(this.api_url+`/database/delete/${id}`);
  }
  
  loadData(): void {
    this.fetchData().subscribe(response => {
      this.data_from_api = response;
      console.log(response)
    });
  }

  sendDataToApi(): void {
    const data = { Name: "jacek", Password: "elo" }; // Dane do wysłania

    this.sendData(data).subscribe(response => {
      console.log('Response from API:', response);
      // Tutaj możesz przetwarzać odpowiedź z API
      this.loadData();
    }, error => {
      console.error('Error sending data:', error);
    });
  }

  deleteDataFromDB(id: number): void {
    this.deleteData(id).subscribe(response => {
      console.log('Response from API:', response);
      // Tutaj możesz przetwarzać odpowiedź z API
      this.loadData();
    }, error => {
      console.error('Error deleting data:', error);
    });
  }

}
