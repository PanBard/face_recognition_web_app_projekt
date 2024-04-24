import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [],
  template: `
     <section class="bg-white dark:bg-gray-900 flex justify-center items-center flex-col p-10">
    <!-- <app-items-list *ngIf="showComponent"/> -->
    <!-- <app-web-cam/> -->
    <h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Api status: {{data_from_api ? data_from_api.data : "Connection to the API failed."}}</h2>
    
  </section>
  `,
  styles: ``
})
export class TestApiComponent {

  constructor(private http: HttpClient) { 
    this.loadData();
  }
  data_from_api: any;



fetchData(): Observable<any> {
  return this.http.get<any>('https://localhost:7205/api/api_test');
}

loadData(): void {
  this.fetchData().subscribe(response => {
    this.data_from_api = response;
  });
}

}
