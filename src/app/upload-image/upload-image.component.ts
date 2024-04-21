import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [],
  template: `
    <input type="file" (change)="onFileSelected($event)">
  `,
  styles: ``
})
export class UploadImageComponent {

  constructor(private http: HttpClient) { 
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Przekształć wczytane dane do formatu base64
        let base64String: string = e.target.result.split(',')[1];
        // console.log(base64String);
        base64String = '"'+ base64String + '"';
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
        };
        // this.http.post('http://localhost:5000/api/response',  base64String , httpOptions)
        // this.http.post('http://localhost:5164/api/response',  base64String , httpOptions)
        this.http.post('http://localhost:8081/api/response',  base64String , httpOptions)
            .subscribe((response) => {
              console.log('Zdjęcie wysłane do API:', response);
            }, (error) => {
              console.error('Błąd podczas wysyłania zdjęcia do API:', error);
            });

        // Tutaj możesz przesłać base64String do serwera lub wykonać inne operacje
      };

      reader.readAsDataURL(file);
    }
  }

}
