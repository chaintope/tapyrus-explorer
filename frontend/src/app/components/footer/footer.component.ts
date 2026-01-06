import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  goTo(url: string) {
    const win = window.open(url, '_blank');
    win.focus();
  }
}
