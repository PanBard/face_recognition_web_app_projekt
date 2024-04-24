import { Component } from '@angular/core';
import { ItemsListComponent } from '../items-list/items-list.component';
import { NgIf } from '@angular/common';
import { WebCamComponent } from '../web-cam/web-cam.component';
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [NgIf,ItemsListComponent, WebCamComponent],
  template: `
  <section class="bg-white dark:bg-gray-900 flex justify-center items-center flex-col p-10">
    <!-- <app-items-list *ngIf="showComponent"/> -->
    <!-- <app-web-cam/> -->
    <h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Welcome to the home page!</h2>
    <h2 class="mb-4 text-4xl tracking-tight  text-gray-900 dark:text-white">Congratulations, you have successfully logged in using facial recognition!</h2>
  </section>
  `,
  styles: ``
})
export class MainContentComponent {
  showComponent = true;
  
  toggleComponent() {
    this.showComponent = !this.showComponent;
  }

}
