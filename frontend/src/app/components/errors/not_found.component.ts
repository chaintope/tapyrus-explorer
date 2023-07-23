import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not_found.component.html',
  styleUrls: ['./not_found.component.scss']
})
export class NotFoundComponent implements OnInit {
  statusCode: string;
  statusMsg: string;
  detailMsg: string;

  constructor(private activatedroute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.statusCode = data.statusCode;
      this.statusMsg = data.statusMsg;
      this.detailMsg = data.detailMsg;
    });
  }
}
