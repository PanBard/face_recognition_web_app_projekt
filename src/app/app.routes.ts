import { Routes } from '@angular/router';
import { ItemsListComponent } from './items-list/items-list.component';
import { MainContentComponent } from './main-content/main-content.component';
import { RegisterComponent } from './register/register.component';
import { LogInComponent } from './log-in/log-in.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { WebCamComponent } from './web-cam/web-cam.component';
import { TestApiComponent } from './test-api/test-api.component';
import { DatabaseComponent } from './database/database.component';
import { AddProfilComponent } from './add-profil/add-profil.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login',  component: LogInComponent },
    { path: 'home', component: MainContentComponent },
    { path: 'about', component: ItemsListComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'upload', component: UploadImageComponent },
    { path: 'logInWithWebcam', component: WebCamComponent },
    { path: 'apiTest', component: TestApiComponent },
    { path: 'database', component: DatabaseComponent },
    { path: 'profil', component: AddProfilComponent },
];
