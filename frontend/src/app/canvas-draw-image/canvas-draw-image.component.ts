import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas-draw-image',
  standalone: true,
  imports: [],
  template: `
      <canvas id="viewport"  #canvas></canvas>
  `,
  styles: ``
})
export class CanvasDrawImageComponent {

  faceCoordinates = []; 
  image_data_url: any;
  person_name: any;

  @Input()
  set data(value: any) {
    if(value){
          this.image_data_url = value.image;
          this.faceCoordinates = value.coordinates;
          this.person_name = value.name;

    console.log('canvas get data from parent componet:',this.person_name);
    this.drawFaceBox()
    }

  }



  
//-----------------------  CANCVAS

@ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
ctx: CanvasRenderingContext2D | null = null;

constructor() { 
  this.canvas = {} as ElementRef<HTMLCanvasElement>;
 
}

ngAfterViewInit(): void {
  this.ctx = this.canvas.nativeElement.getContext('2d');
  this.canvas.nativeElement.width = 1;
  this.canvas.nativeElement.height = 1;
}

drawFaceBox(): void {
  if (!this.ctx || this.faceCoordinates.length !== 4 ) {
  console.error('Invalid face coordinates');
  return;
  }
  
  const [top, right, bottom, left] = this.faceCoordinates;

  const canvasWidth = this.canvas.nativeElement.width;
  const canvasHeight = this.canvas.nativeElement.height;
  

  const rectX = left;
  const rectY = top;
  const rectWidth = right - left;
  const rectHeight = bottom - top;

  this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  console.log("canvas draw")
  let base_image = new Image();
  
  base_image.onload= () => {

    this.canvas.nativeElement.width = base_image.width;
    this.canvas.nativeElement.height = base_image.height;

  
  if(this.ctx != null){
  
  this.ctx.drawImage(base_image,0,0 )
  // Narysuj prostokąt
  this.ctx.beginPath();
  this.ctx.strokeStyle = 'red';
  this.ctx.lineWidth = 2;
  this.ctx.rect(rectX, rectY, rectWidth, rectHeight);
  this.ctx.stroke();

//   // Wysokość i szerokość tekstu
// const textWidth = this.ctx.measureText('Nazwa').width;
// const textHeight = 20; // Dowolna wysokość tekstu

// // Pozycja tekstu nad boxem
// const textX = rectX + rectWidth / 2 - textWidth / 2;
// const textY = rectY - textHeight - 5; // 5 to odstęp między tekstem a boxem

// // Narysuj nazwę nad boxem
this.ctx.fillStyle = 'red';
this.ctx.font = "20px bold Arial";
this.ctx.fillText(this.person_name, rectX, rectY-5);

  }
  
  }
  base_image.src = this.image_data_url;
  }

//------------------------ CANVAS
}
