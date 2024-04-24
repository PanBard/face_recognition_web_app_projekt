import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarableStoreService {

  constructor() { }

  setLoggedUser(username: string): void {
    localStorage.setItem('login', username);
  }

  getCurrentUser(): any {
    // Zwróć dane aktualnie zalogowanego użytkownika
    return localStorage.getItem('login');
  }


  removeCurrentUser(): any {
    // Zwróć dane aktualnie zalogowanego użytkownika
    localStorage.removeItem('login');
  }
  

}
