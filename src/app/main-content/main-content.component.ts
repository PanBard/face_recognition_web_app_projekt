import { Component } from '@angular/core';
import { ItemsListComponent } from '../items-list/items-list.component';
import { NgIf } from '@angular/common';
import { WebCamComponent } from '../web-cam/web-cam.component';
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [NgIf,ItemsListComponent, WebCamComponent],
  template: `
  <section class="bg-white dark:bg-gray-900 flex justify-center items-center ">
    <!-- <app-items-list *ngIf="showComponent"/> -->
    <app-web-cam/>
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
