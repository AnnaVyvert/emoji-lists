import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  getStoreArr,
  getStoreMenuPoint,
  setStoreArr,
  setStoreMenuPoint,
} from '../helpers/storage-controller';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}

  menu: string[] = ['all', 'favorite', 'deleted'];
  menuPoint: number = 0;
  previewEmoji: string = '';
  srcs: any[] = [''];
  amount_plus: number = 15;
  amount_state: number = this.amount_plus;
  emojis: any = {};
  allKeys: any = [];
  foundKeys: any = [];

  @ViewChild('emojiName') emojiName: any;
  @ViewChild('loadMoreBtn') loadMoreBtn: any;
  @ViewChild('previewModal') previewModal: any;

  ngOnInit() {
    this.activatedRoute.params.subscribe((entities: any) => {
      this.menuPoint = this.menu.indexOf(entities.listname)
      fetch('https://api.github.com/emojis')
      .then((r) => r.json())
      .then((data) => {
        this.emojis = data;
        this.amount_state = 0;

        this.allKeys = this.getList();
        this.foundKeys = this.allKeys;
        let favorite = getStoreArr(this.menu[1]);
        const partKeys = this.foundKeys.splice(0, this.amount_plus);
        this.srcs = partKeys.map((e: any) => {
          return {
            name: e,
            link: this.emojis[e],
            favorite: favorite.includes(e),
          };
        });
      });
    });
  }

  getList() {
    if (this.menuPoint === 0) {
      this.allKeys = Object.keys(this.emojis);
      let deleted = getStoreArr(this.menu[2]);
      this.allKeys = this.allKeys.filter((e: string) => !deleted.includes(e));
    } else {
      this.allKeys = getStoreArr(this.menu[this.menuPoint]).sort();
    }
    return this.allKeys;
  }

  pickPoint(i: number) {
    setStoreMenuPoint(i);
    this.emojiName.nativeElement.value = '';
    this.menuPoint = i;

    this.allKeys = this.getList();
    this.foundKeys = this.allKeys;

    const partKeys = this.foundKeys.splice(0, this.amount_plus);
    this.mapKeys(partKeys)

    this.amount_state = 0;
    this.updLoadMoreBtn();
  }

  loadMore() {
    const partKeys = this.foundKeys.splice(0, this.amount_plus);
    let favorite = getStoreArr(this.menu[1]);
    const more_srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e], favorite: favorite.includes(e) };
    });
    this.srcs = [...this.srcs, ...more_srcs];

    this.amount_state += this.amount_plus;
    this.updLoadMoreBtn();
  }

  findKeys() {
    let s = this.emojiName.nativeElement.value;

    this.allKeys = this.getList();
    const found = this.allKeys.filter((e: string) => e.includes(s));
    const partKeys = found.splice(0, this.amount_plus);
    this.mapKeys(partKeys)
    
    this.updLoadMoreBtn();
  }

  showPreview(e: any, link: string) {
    let target = e.target || e.srcElement || e.currentTarget;
    target = target.parentElement;
    const preview = this.previewModal.nativeElement;
    preview.src = link;
    setTimeout(() => {
      preview.style.display = 'block';
      let rect = target.getBoundingClientRect();
      let preview_top_position = rect.top + target.offsetWidth / 2;
      let preview_left_position = rect.left - target.offsetWidth / 2;
      preview.style.top = preview_top_position + 'px';
      preview.style.left = preview_left_position + 'px';
    }, 500);
  }

  hidePreview() {
    const preview = this.previewModal.nativeElement;
    preview.style.display = 'none';
    setTimeout(() => {
      preview.style.display = 'none';
    }, 500);
  }

  addFavorite(e: any, name: string) {
    let target = e.target || e.srcElement || e.currentTarget;
    let img = target.parentElement.previousSibling.firstChild;
    img.style.filter = 'brightness(1.2)';
    this.srcs.find((e) => e.name === name).favorite = true;

    let favorite = getStoreArr('favorite');
    favorite.push(name);
    setStoreArr('favorite', favorite);
  }

  addDeleted(e: any, name: string, i: number) {
    this.hideGridRow(i);

    let deleted = getStoreArr('deleted');
    deleted.push(name);
    setStoreArr('deleted', deleted);
  }

  removeElemFromList(listName: string, name: string, i: number) {
    this.hideGridRow(i);

    const list = getStoreArr(listName);
    this.removeElemArr(list, name);
    setStoreArr(listName, list);

    // this.updSrcs(1)
  }

  removeElemArr(arr: string[], val: string) {
    const index = arr.indexOf(val);
    if (index !== -1) arr.splice(index, 1);
  }

  hideGridRow(i: number) {
    const rowNodes = document.querySelectorAll('.rows' + i);
    rowNodes.forEach((e: any) => (e.hidden = true));
  }

  updLoadMoreBtn() {
    this.loadMoreBtn.nativeElement.hidden = this.foundKeys < this.amount_plus;
  }

  updSrcs(length: number) {
    this.allKeys = this.getList();
    this.foundKeys = this.allKeys;
    let favorite = getStoreArr(this.menu[1]);
    const partKeys = this.foundKeys.splice(
      this.amount_state + this.amount_plus,
      length
    );
    const add_srcs = partKeys.map((e: any) => {
      return {
        name: e,
        link: this.emojis[e],
        favorite: favorite.includes(e),
      };
    });
    if (add_srcs.length === 0) this.srcs = [...this.srcs, ...add_srcs];
    this.updLoadMoreBtn();
  }

  mapKeys(partKeys: {}[]){
    let favorite = getStoreArr(this.menu[1]);
    this.srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e], favorite: favorite.includes(e) };
    });
  }
}
