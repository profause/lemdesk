import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingComponents, AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { AppMaterialDesignModule } from './app-material-design.module';
import { HttpClientModule } from '@angular/common/http';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { AppbarComponent } from './shared/components/appbar/appbar.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppRoutingComponents,
    AppComponent,
    AppbarComponent
  ],
  imports: [
    UserModule,
    SharedModule,
    AppMaterialDesignModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
