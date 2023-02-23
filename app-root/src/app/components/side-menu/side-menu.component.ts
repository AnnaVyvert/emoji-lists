import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.sass'],
})
export class SideMenuComponent {
  menu: string[] = ['all', 'favorite', 'deleted'];

  activePoint: string = 'all';

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((entities: any) => {
      this.activePoint = entities.listname;
    });
  }

  isAuth: boolean = window.localStorage['access_token'];

  openMenu(bool: boolean) {
    const sideNav = document.querySelector('.side-nav');
    const sideToNav = document.querySelector('.side-to-nav');
    if (bool) {
      sideNav?.setAttribute('style', 'width: 16em');
      sideToNav?.setAttribute('style', 'width: 100%');
    } else {
      sideNav?.setAttribute('style', 'width: 0');
      sideToNav?.setAttribute('style', 'width: 0');
    }
  }
}
