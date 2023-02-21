import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit {
  menu: string[] = ['all', 'favorite', 'menuPoint'];
  menuPoint: number = 0;
  preview_emoji: string = '';
  ngOnInit() {
    fetch('https://api.github.com/emojis')
      .then((r) => r.json())
      .then((data) => {
        const first_e = Object.keys(data)[0]
        console.log(first_e)
        this.preview_emoji = data[first_e];
      });
  }

  pickPoint(i: number) {
    this.menuPoint = i;
    console.log(this.menuPoint);
  }
}
