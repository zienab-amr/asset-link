import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './components/button/button.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';

@NgModule({
  declarations: [ButtonComponent, StepperComponent, ImageGalleryComponent],
  imports: [CommonModule],
  exports: [ButtonComponent, StepperComponent, ImageGalleryComponent],
})
export class SharedModule {}