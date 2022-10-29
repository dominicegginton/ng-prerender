# ng-prerender

What if pre-rendering an Angular application wasn't difficult and didnt require multiple builds? **ng-prerender** uses [@nguniversal/common/clover](https://github.com/angular/universal/tree/main/modules/common/clover) under the hood to just make it simple.

## Documentation

### Install the dependencies

``` shell
npm install @nguniversal/common ng-prerender
```

### Include the **NgUniversal** modules in the Angular application

#### app/app.module.ts (NgModules)

``` diff
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';

  import { AppComponent } from './app.component';
+ import { RendererModule, TransferHttpCacheModule } from '@nguniversal/common/clover';

  @NgModule({
    declarations: [AppComponent],
    imports: [
-     BrowserModule,
+     BrowserModule.withServerTransition({
+      appId: 'myapp',
+     }),
+     RendererModule.forRoot(),
+     TransferHttpCacheModule,
    ],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
```

#### main.ts (Standalone Components)

``` diff
  import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
  import { importProvidersFrom } from '@angular/core';
+ import {
+  RendererModule,
+  TransferHttpCacheModule,
+ } from '@nguniversal/common/clover';

  import { AppComponent } from './app/app.component';

  bootstrapApplication(AppComponent, {
    providers: [
-     importProvidersFrom(BrowserModule),
+     importProvidersFrom(BrowserModule.withServerTransition({ appId: 'app' })),
+     importProvidersFrom(RendererModule.forRoot()),
+     importProvidersFrom(TransferHttpCacheModule),
    ],
  }).catch((err) => console.error(err));
```

### Create a prerender script

#### scripts/prerender.mjs

``` diff
+ import { prerender } from 'ng-prerender';

+ const routes = [''];

+ await prerender('dist/app', routes);
```

#### package.json


``` diff
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
+   "preprerender": "npm run build",
+   "prerender": "node scripts/prerender.mjs"
  },
```

### Run the Prerender script

``` shell
npm run prerender
```
