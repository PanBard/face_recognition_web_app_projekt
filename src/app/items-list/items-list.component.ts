import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [NgFor],
  template: `
   <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
      <div class="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400 ">
      <h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Downloaded <span class="font-extrabold">200,000+</span> documents from db</h2>

          <div *ngFor="let data of apiData" #elo class="p-4 border border-r-teal-700 m-4 hover:border-r-4 cursor-pointer flex ">
            <p  class="mb-4 font-medium w-1/3 p-3">{{data.title}}</p>
            <p class="mb-4 font-light w-1/3 p-3">{{data.params[0].value.value}} zł</p>
            <!-- <a href="" class="inline-flex items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700">
                Learn more
                <svg class="ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
            </a> -->
            <img class="w-1/3 p-3 w-64 h-64  p-5" alt="Obrazek" src="{{data.photos[0].link.split(';')[0]}}" alt=""/>
          </div>
                                      
      </div>
    </div>
  `,
  styles: ``
})
export class ItemsListComponent {
  
  constructor(private http: HttpClient) { 
    this.fetchDataFromApi();
  }
  apiData: any;


  fetchDataFromApi() {
    this.http.get<any>('https://localhost:7268/api/allData').subscribe(
      (response) => {
        this.apiData = response;
        console.log(this.apiData);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
