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
  emojis: any = {}
  allKeys: any = []
  foundKeys: any = []
  
  @ViewChild('emojiName') emojiName: any;
  @ViewChild('loadMoreBtn') loadMoreBtn: any;
  @ViewChild('previewModal') previewModal: any;

  ngOnInit() {
    fetch('https://api.github.com/emojis')
      .then((r) => r.json())
      .then((data) => {
        this.emojis = data

        this.amount_state = 0

        this.allKeys = this.getList()

        this.foundKeys = this.allKeys

        const partKeys = this.foundKeys.splice(0, this.amount_plus);
        this.srcs = partKeys.map((e: any) => {
          return { name: e, link: this.emojis[e] };
        });

      });
  }

  getList(){
    if (this.menuPoint===0){
      this.allKeys = Object.keys(this.emojis)
      let favorite = getStoreArr(this.menu[1]);
      let deleted = getStoreArr(this.menu[2]);
      console.log(favorite, deleted)
      this.allKeys = this.allKeys.filter((e: string)=>!favorite.includes(e) && !deleted.includes(e))
    }else{
      this.allKeys = getStoreArr(this.menu[this.menuPoint]);
    }
    return this.allKeys
  }

  pickPoint(i: number) {
    this.emojiName.nativeElement.value = ''
    this.menuPoint = i;
    this.allKeys = this.getList()
    console.log(this.allKeys);
    
    this.foundKeys = this.allKeys
    const partKeys = this.foundKeys.splice(0, this.amount_plus);
    console.log(partKeys);
    this.srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e] };
    });
    this.amount_state = 0
    this.loadMoreBtn.nativeElement.hidden = this.foundKeys < this.amount_plus
  }

  loadMore(){
    const partKeys = this.foundKeys.splice(0, this.amount_plus);
    console.log(this.amount_state, this.amount_plus, partKeys);
    
    const more_srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e] };
    });
    this.srcs = [...this.srcs, ...more_srcs]

    this.amount_state += this.amount_plus
    this.loadMoreBtn.nativeElement.hidden = this.foundKeys < this.amount_plus
  }

  findKeys(){
    let s = this.emojiName.nativeElement.value
    this.allKeys = this.getList()
    const found = this.allKeys.filter((e: string)=>e.includes(s))
    this.loadMoreBtn.nativeElement.hidden = this.foundKeys < this.amount_plus
    const partKeys = found.splice(0, this.amount_plus);
    // console.log(s, fitKeys)
    this.srcs = partKeys.map((e: any) => {
      return { name: e, link: this.emojis[e] };
    });
  }

  showPreview(e: any, link: string){
    let target = e.target || e.srcElement || e.currentTarget;
    target = target.parentElement
    const preview = this.previewModal.nativeElement
    preview.src = link
    setTimeout(()=>{
      preview.style.display = 'block'
      let rect = target.getBoundingClientRect();
      // console.log(rect.top, rect.right, rect.bottom, rect.left);
      let preview_top_position = rect.top + target.offsetWidth/2
      let preview_left_position = rect.left - target.offsetWidth/2
      preview.style.top = preview_top_position+'px'
      preview.style.left = preview_left_position+'px'
    }, 500)
    
  }

  hidePreview(){
    const preview = this.previewModal.nativeElement
    preview.style.display = 'none'
    setTimeout(()=>{
      preview.style.display = 'none'
    }, 500)
  }

  addFavorite(e: any, name: string){
    let target = e.target || e.srcElement || e.currentTarget;
    let img = target.parentElement.previousSibling.firstChild
    img.style.filter = 'brightness(1.2)';
    let favorite = getStoreArr('favorite')
    favorite.push(name)
    setStoreArr('favorite', favorite)
  }

  removeElem(e: any, name: string, i: number){
    let target = e.target || e.srcElement || e.currentTarget;
    let img = target.parentElement.previousSibling.firstChild
    // img.style.filter = 'brightness(1.2)';
    const rowNodes = document.querySelectorAll('#rows'+i)
    rowNodes.forEach((e: any)=>e.hidden = true)
    let deleted = getStoreArr('deleted')
    deleted.push(name)
    setStoreArr('deleted', deleted)
  }
}
