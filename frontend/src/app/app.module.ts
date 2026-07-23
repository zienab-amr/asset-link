import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
<<<<<<< Updated upstream
import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { StepperComponent } from './shared/components/stepper/stepper.component';
import { ImageGalleryComponent } from './shared/components/image-gallery/image-gallery.component';
=======
import { SharedModule } from './shared/shared.module';
>>>>>>> Stashed changes

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
<<<<<<< Updated upstream
    ButtonComponent,
    StepperComponent,
    ImageGalleryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
=======
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
>>>>>>> Stashed changes
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
