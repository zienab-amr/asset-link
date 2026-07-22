import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from './components/button/button.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';

import { ChatBubbleComponent } from './components/chat-bubble/chat-bubble.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { ModalComponent } from './components/modal/modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';


@NgModule({
  declarations: [
    
    ButtonComponent, 
    StepperComponent, 
    ImageGalleryComponent,
    
    ChatBubbleComponent,
    TimelineComponent,
    FilterPanelComponent,
    ModalComponent,
    PaginationComponent,
    DateRangePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    
    ButtonComponent, 
    StepperComponent, 
    ImageGalleryComponent,
    
    ChatBubbleComponent,
    TimelineComponent,
    FilterPanelComponent,
    ModalComponent  
  ]
})
export class SharedModule { }