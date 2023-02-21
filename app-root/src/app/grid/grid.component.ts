import { Component } from '@angular/core';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  menu: string[] = ['all','favorite','menuPoint']
  menuPoint: number = 0
  
  pickPoint(i: number){
    this.menuPoint = i
    console.log(this.menuPoint);
    
  }
}
