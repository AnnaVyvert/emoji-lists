import { Component, OnInit, ViewChild } from '@angular/core';
import { getStoreArr, setStoreArr } from '../helpers/storage-controller';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit {
  menu: string[] = ['all', 'favorite', 'deleted'];
  menuPoint: number = 0;
  previewEmoji: string = '';
  srcs: any[] = [''];
  amount_plus: number = 10;
  amount_state: number = this.amount_plus;
  emojis: any = {};
  allKeys: any = [];
  foundKeys: any = [];

  @ViewChild('emojiName') emojiName: any;
  @ViewChild('loadMoreBtn') loadMoreBtn: any;
  @ViewChild('previewModal') previewModal: any;

  ngOnInit() {
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
  }

  getList() {
    if (this.menuPoint === 0) {
      this.allKeys = Object.keys(this.emojis);
      // let favorite = getStoreArr(this.menu[1]);
      let deleted = getStoreArr(this.menu[2]);
      this.allKeys = this.allKeys.filter((e: string) => !deleted.includes(e));
    } else {
      this.allKeys = getStoreArr(this.menu[this.menuPoint]);
    }
    return this.allKeys;
  }

  pickPoint(i: number) {
    this.emojiName.nativeElement.value = '';
    this.menuPoint = i;
    this.allKeys = this.getList();
    console.log(this.allKeys);

    this.foundKeys = this.allKeys;
    const partKeys = this.foundKeys.splice(0, this.amount_plus);
    let favorite = getStoreArr(this.menu[1]);
    this.srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e], favorite: favorite.includes(e) };
    });
    this.amount_state = 0;
    this.updLoadMoreBtn()
  }

  loadMore() {
    const partKeys = this.foundKeys.splice(0, this.amount_plus);
    let favorite = getStoreArr(this.menu[1]);
    const more_srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e], favorite: favorite.includes(e) };
    });
    this.srcs = [...this.srcs, ...more_srcs];

    this.amount_state += this.amount_plus;
    this.updLoadMoreBtn()
  }

  findKeys() {
    let s = this.emojiName.nativeElement.value;
    this.allKeys = this.getList();
    const found = this.allKeys.filter((e: string) => e.includes(s));
    this.updLoadMoreBtn()
    const partKeys = found.splice(0, this.amount_plus);
    // console.log(s, fitKeys)
    let favorite = getStoreArr(this.menu[1]);
    this.srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e], favorite: favorite.includes(e) };
    });
  }

  showPreview(e: any, link: string) {
    let target = e.target || e.srcElement || e.currentTarget;
    target = target.parentElement;
    const preview = this.previewModal.nativeElement;
    preview.src = link;
    setTimeout(() => {
      preview.style.display = 'block';
      let rect = target.getBoundingClientRect();
      // console.log(rect.top, rect.right, rect.bottom, rect.left);
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

  removeElem(e: any, name: string, i: number) {

    this.hideGridRow(i)
    let deleted = getStoreArr('deleted');
    deleted.push(name);
    setStoreArr('deleted', deleted);
  }

  removeFav(e: any, name: string, i: number) {
    const rowNodes = document.querySelectorAll('.rows' + i);
    rowNodes.forEach((e: any) => (e.hidden = true));
    const favorite = getStoreArr('favorite');

    this.deleteArrElem(favorite, name);

    setStoreArr('favorite', favorite);
  }

  restoreElem(e: any, name: string, i: number) {
    const rowNodes = document.querySelectorAll('.rows' + i);
    rowNodes.forEach((e: any) => (e.hidden = true));
    const deleted = getStoreArr('deleted');

    this.deleteArrElem(deleted, name);

    setStoreArr('deleted', deleted);
  }

  deleteArrElem(arr: string[], val: string) {
    const index = arr.indexOf(val);
    if (index !== -1) arr.splice(index, 1);
  }

  hideGridRow(i: number){
    const rowNodes = document.querySelectorAll('.rows' + i);
    rowNodes.forEach((e: any) => (e.hidden = true));
  }

  updLoadMoreBtn(){
    this.loadMoreBtn.nativeElement.hidden = this.foundKeys < this.amount_plus;
  }
}
