import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-validation',
  templateUrl: './material_tracking_validation.page.html',
  styleUrls: ['./material_tracking_validation.page.scss'],
  standalone: false
})
export class MaterialTrackingValidationPage implements OnInit {
  openedValue: string;
  alg: string;
  payload: TrackingPayload;
  valid: boolean = null;
  hasError: boolean;
  errorMsg: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private backendService: BackendService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.openedValue = this.activatedRoute.snapshot.paramMap.get('openedValue');
    if (this.openedValue != null && this.openedValue.length > 0) {
      this.validate();
    }
  }

  goToTransaction(txid: string) {
    this.navCtrl.navigateForward(`/tx/${txid}`);
  }

  validate() {
    this.backendService.validateOpenedValue(this.openedValue).subscribe(
      data => {
        this.alg = data.header.alg;
        this.payload = data.payload;
        this.valid = data.valid;
        this.hasError = !data.valid;
        this.errorMsg = data.error;
        this.cdr.detectChanges();
      },
      err => {
        this.alg = null;
        this.payload = null;
        this.valid = false;
        this.hasError = true;
        this.errorMsg = err.error;
        this.cdr.detectChanges();
      }
    );
  }
  onValidate() {
    this.resetError();
    if (this.openedValue == null || this.openedValue.trim().length === 0) {
      return;
    }
    this.openedValue = this.openedValue.trim();
    this.validate();
  }
  resetError() {
    this.valid = null;
    this.hasError = false;
    this.errorMsg = '';
  }
}

interface Material {
  name: string;
  quantity: number;
  unit: string;
}

interface TrackingPayload {
  item_id: string;
  txid: string;
  index: number;
  commitment: string;
  R: string;
  materials: Array<{ [key: string]: Material }>;
}
