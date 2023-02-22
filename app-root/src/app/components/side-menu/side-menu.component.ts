import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.sass'],
})
export class SideMenuComponent {

  constructor(private router: Router) { 
  }

  isAuth: boolean = window.localStorage['access_token']

  openMenu(bool :boolean) {
    const sideNav = document.querySelector('.side-nav')
    const sideToNav = document.querySelector('.side-to-nav')
    if(bool){
      sideNav?.setAttribute('style', 'width: 16em')
      sideToNav?.setAttribute('style', 'width: 100%')
    }else{
      sideNav?.setAttribute('style', 'width: 0')
      sideToNav?.setAttribute('style', 'width: 0')
    }
    // document.getElementById("mySidenav").style.width = "230px";
  }
}
