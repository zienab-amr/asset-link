import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { StepperComponent } from './shared/components/stepper/stepper.component';
import { ImageGalleryComponent } from './shared/components/image-gallery/image-gallery.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { DateRangePickerComponent } from './shared/components/date-range-picker/date-range-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    StepperComponent,
    ImageGalleryComponent,
    ModalComponent,
    PaginationComponent,
    DateRangePickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
