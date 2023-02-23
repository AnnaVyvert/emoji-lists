import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getStoreArr, setStoreArr } from '../../helpers/storage-controller';
import { Isrcs } from './grid.interfaces';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: [
    './grid.component.css',
    './grid.layouts.css',
    './hat-content.css',
  ],
})
export class GridComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}

  menu: string[] = ['all', 'favorite', 'deleted'];
  menuPoint: number = 0;
  previewEmoji: string = '';
  srcs: Isrcs[] = [];
  amount_plus: number = 15;
  amount_state: number = this.amount_plus;
  AllEmojisData: any = {};
  allKeys: string[] = [];
  foundKeys: string[] = [];
  restKeys: string[] = [];

  @ViewChild('emojiName') emojiName!: ElementRef;
  @ViewChild('loadMoreBtn') loadMoreBtn!: ElementRef;

  clearInput() {
    this.emojiName.nativeElement.value = '';
    this.allKeys = this.getList();
    this.foundKeys = [...this.allKeys];
    this.restKeys = [...this.foundKeys];
    const partKeys = this.restKeys.splice(0, this.amount_plus);
    this.mapKeys(partKeys);
    this.amount_state = this.amount_plus;
    this.updLoadMoreBtn();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((entities: any) => {
      this.menuPoint = this.menu.indexOf(entities.listname);
      fetch('https://api.github.com/emojis')
        .then((r) => r.json())
        .then((data) => {
          this.AllEmojisData = data;
          this.allKeys = this.getList();
          this.foundKeys = [...this.allKeys];
          this.restKeys = [...this.foundKeys];
          const partKeys = this.restKeys.splice(0, this.amount_plus);
          let favorite = getStoreArr(this.menu[1]);
          this.srcs = partKeys.map((e: any) => {
            return {
              name: e,
              link: this.AllEmojisData[e],
              favorite: favorite.includes(e),
            };
          });
          this.amount_state = this.amount_plus;
          this.updLoadMoreBtn();
        });
    });
  }

  getList(): string[] {
    if (this.menuPoint === 0) {
      this.allKeys = Object.keys(this.AllEmojisData);
      let deleted = getStoreArr(this.menu[2]);
      this.allKeys = this.allKeys.filter((e: string) => !deleted.includes(e));
    } else {
      this.allKeys = getStoreArr(this.menu[this.menuPoint]).sort();
    }
    return this.allKeys;
  }

  loadMore(): void {
    const partKeys = this.restKeys.splice(0, this.amount_plus);
    let favorite = getStoreArr(this.menu[1]);
    const more_srcs = partKeys.map((e: any) => {
      return {
        name: e,
        link: this.AllEmojisData[e],
        favorite: favorite.includes(e),
      };
    });
    this.srcs = [...this.srcs, ...more_srcs];

    this.amount_state += this.amount_plus;
    this.updLoadMoreBtn();
  }

  findKeys(): void {
    let s = this.emojiName.nativeElement.value;

    this.allKeys = this.getList();
    this.foundKeys = [...this.allKeys].filter((e: string) => e.includes(s));
    this.restKeys = [...this.foundKeys];
    const partKeys = this.restKeys.splice(0, this.amount_plus);
    this.mapKeys(partKeys);

    this.updLoadMoreBtn();
  }

  addFavorite(e: any, name: string): void {
    let target = e.target || e.srcElement || e.currentTarget;
    let img = target.parentElement.previousSibling.firstChild;
    img.style.filter = 'brightness(1.2)';
    this.srcs.find((e) => e.name === name)!.favorite = true;

    let favorite = getStoreArr('favorite');
    favorite.push(name);
    setStoreArr('favorite', favorite);
  }

  addDeleted(name: string): void {
    this.hideGridRow(name);

    let deleted = getStoreArr('deleted');
    deleted.push(name);
    setStoreArr('deleted', deleted);
  }

  removeElemFromList(listName: string, name: string): void {
    this.hideGridRow(name);

    const list = getStoreArr(listName);
    this.removeElemArr(list, name);
    setStoreArr(listName, list);
  }

  removeElemArr(arr: string[], val: string): any[] {
    const index = arr.indexOf(val);
    if (index !== -1) arr.splice(index, 1);
    return arr;
  }

  hideGridRow(name: string): void {
    const partKeys = this.restKeys.splice(0, 1);
    const index = this.srcs.findIndex((e) => e.name === name);
    if (index !== -1) this.srcs.splice(index, 1);
    // this.allKeys = this.getList();
    // this.foundKeys = [...this.allKeys];
    // this.restKeys = [...this.foundKeys];
    let favorite = getStoreArr(this.menu[1]);
    const more_srcs = partKeys.map((e: any) => {
      return {
        name: e,
        link: this.AllEmojisData[e],
        favorite: favorite.includes(e),
      };
    });
    this.srcs = [...this.srcs, ...more_srcs];

    this.amount_state += 1;
    this.updLoadMoreBtn();
  }

  updLoadMoreBtn = (): void => {
    this.loadMoreBtn.nativeElement.hidden =
      this.foundKeys.length <= this.amount_state;
  };

  updAmount = (plus: number): void => {
    this.amount_state += plus;
  };

  mapKeys(partKeys: string[]): void {
    let favorite = getStoreArr(this.menu[1]);
    this.srcs = partKeys.map((e: any) => {
      return {
        name: e,
        link: this.AllEmojisData[e],
        favorite: favorite.includes(e),
      };
    });
  }
}
