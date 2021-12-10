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
import { DashboardModule, DashboardRoutingComponents } from './dashboard/dashboard.module';
import { ServiceManagementModule, ServiceManagementRoutingComponents } from './service-management/service-management.module';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { AngularEditorModule } from '@kolkov/angular-editor';

export function playerFactory() {
  return player;
}

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  observer: true,
  direction: 'horizontal',
  threshold: 50,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: true
};

@NgModule({
  declarations: [
    AppRoutingComponents,
    DashboardRoutingComponents,
    ServiceManagementRoutingComponents,
    AppComponent,
    AppbarComponent
  ],
  imports: [
    UserModule,
    SharedModule,
    AppMaterialDesignModule,
    DashboardModule,
    ServiceManagementModule,
    SwiperModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularEditorModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [{
    provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
