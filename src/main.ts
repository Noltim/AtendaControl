import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

if (environment.production) {
  enableProdMode();
}
registerLocaleData(localePt);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
