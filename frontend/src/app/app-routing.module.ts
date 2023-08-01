import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/errors/not_found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/blocks',
    pathMatch: 'full'
  },
  {
    path: 'blocks',
    loadChildren: () =>
      import('./blocks/blocks.module').then(m => m.BlocksPageModule)
  },
  {
    path: 'block/:hash',
    loadChildren: () =>
      import('./block/block.module').then(m => m.BlockPageModule)
  },
  {
    path: 'block-rawdata',
    loadChildren: () =>
      import('./block-rawdata/block-rawdata.module').then(
        m => m.BlockRawdataPageModule
      )
  },
  {
    path: 'color/:colorId',
    loadChildren: () =>
      import('./color/color.module').then(m => m.ColorPageModule)
  },
  {
    path: 'tx/recent',
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        m => m.TransactionsPageModule
      )
  },
  {
    path: 'tx/:txid',
    loadChildren: () =>
      import('./transaction/transaction.module').then(
        m => m.TransactionPageModule
      )
  },
  {
    path: 'material_tracking_validation',
    loadChildren: () =>
      import(
        './material_tracking_validation/material_tracking_validation.module'
      ).then(m => m.MaterialTrackingValidationPageModule)
  },
  {
    path: 'material_tracking_validation/:openedValue',
    loadChildren: () =>
      import(
        './material_tracking_validation/material_tracking_validation.module'
      ).then(m => m.MaterialTrackingValidationPageModule)
  },
  {
    path: 'transaction-rawdata',
    loadChildren: () =>
      import('./transaction-rawdata/transaction-rawdata.module').then(
        m => m.TransactionRawdataPageModule
      )
  },
  {
    path: 'addresses/:address',
    loadChildren: () =>
      import('./address/address.module').then(m => m.AddressPageModule)
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      statusCode: 404,
      statusMsg: 'Page Not Found',
      detailMsg: 'The requested page does not found.'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
