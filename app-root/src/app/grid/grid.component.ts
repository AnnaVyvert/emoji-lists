import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit {
  menu: string[] = ['all', 'favorite', 'menuPoint'];
  menuPoint: number = 0;
  previewEmoji: string = '';
  srcs: any[] = [''];
  amount_plus: number = 50;
  amount_state: number = 50;
  emojis: any = {}

  ngOnInit() {
    fetch('https://api.github.com/emojis')
      .then((r) => r.json())
      .then((data) => {
        this.emojis = data
        const allKeys = Object.keys(data);
        const partKeys = allKeys.splice(0, this.amount_plus);
        this.srcs = partKeys.map((e) => {
          return { name: e, link: data[e] };
        });

      });
  }

  pickPoint(i: number) {
    this.menuPoint = i;
    console.log(this.menuPoint);
  }

  loadMore(){
    const allKeys = Object.keys(this.emojis);
    const partKeys = allKeys.splice(this.amount_state, this.amount_plus);
    const more_srcs = partKeys.map((e) => {
      return { name: e, link: this.emojis[e] };
    });
    this.srcs = [...this.srcs, ...more_srcs]

    this.amount_state += this.amount_plus
  }
}
