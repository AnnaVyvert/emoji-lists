import { Component, OnInit, ViewChild } from '@angular/core';

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
  amount_state: number = this.amount_plus;
  emojis: any = {}
  allKeys: any = []
  foundKeys: any = []
  
  @ViewChild('emojiName') emojiName: any;
  @ViewChild('loadMoreBtn') loadMoreBtn: any;

  ngOnInit() {
    fetch('https://api.github.com/emojis')
      .then((r) => r.json())
      .then((data) => {
        this.emojis = data

        this.allKeys = Object.keys(this.emojis);
        this.foundKeys = this.allKeys

        const partKeys = this.foundKeys.splice(0, 0);
        this.srcs = partKeys.map((e: any) => {
          return { name: e, link: this.emojis[e] };
        });

      });
  }

  pickPoint(i: number) {
    this.menuPoint = i;
    console.log(this.menuPoint);
  }

  loadMore(){
    const partKeys = this.foundKeys.splice(this.amount_state, this.amount_plus);
    const more_srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e] };
    });
    this.srcs = [...this.srcs, ...more_srcs]

    this.amount_state += this.amount_plus
  }

  findKeys(){
    let s = this.emojiName.nativeElement.value
    this.foundKeys = this.allKeys.filter((e: string)=>e.includes(s))
    this.loadMoreBtn.nativeElement.hidden = this.foundKeys < this.amount_plus
    const partKeys = this.foundKeys.splice(0, this.amount_plus);
    // console.log(s, fitKeys)
    this.srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e] };
    });
  }
}
