import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from './main-content/main-content.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MainContentComponent, FooterComponent],
  template: `

    <app-header/>
    <div class="flex-grow min-h-screen">
       <router-outlet />
    </div>
    <app-footer/>
 
  `,
  styles: [],
})
export class AppComponent {
  title = 'shop_project';
}
