import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
