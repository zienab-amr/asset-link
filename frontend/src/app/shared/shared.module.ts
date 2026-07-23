import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< Updated upstream
=======
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // needed for routerLink inside AuthLayout/Login
>>>>>>> Stashed changes

import { ButtonComponent } from './components/button/button.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
<<<<<<< Updated upstream

@NgModule({
  declarations: [ButtonComponent, StepperComponent, ImageGalleryComponent],
  imports: [CommonModule],
  exports: [ButtonComponent, StepperComponent, ImageGalleryComponent],
=======
import { CardComponent } from './components/card/card.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { ScoreWidgetComponent } from './components/score-widget/score-widget.component';
import { QrCodeWidgetComponent } from './components/qr-code-widget/qr-code-widget.component';
// TEMPORARILY DISABLED: chat-bubble.component.html has unterminated tag errors (NG5002)
// blocking the entire build. Re-enable once fixed by the owner.
// import { ChatBubbleComponent } from './components/chat-bubble/chat-bubble.component';
import { TimelineComponent } from './components/timeline/timeline.component';
// TEMPORARILY DISABLED: filter-panel.component.html has unterminated tag errors (NG5002)
// blocking the entire build. Re-enable once fixed by the owner.
// import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { ModalComponent } from './components/modal/modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';

@NgModule({
  declarations: [
    ButtonComponent,
    StepperComponent,
    ImageGalleryComponent,
    CardComponent,
    TabsComponent,
    StatCardComponent,
    ScoreWidgetComponent,
    QrCodeWidgetComponent,
    // ChatBubbleComponent,
    TimelineComponent,
    // FilterPanelComponent,
    ModalComponent,
    PaginationComponent,
    DateRangePickerComponent,
    AuthLayoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    StepperComponent,
    ImageGalleryComponent,
    CardComponent,
    TabsComponent,
    StatCardComponent,
    ScoreWidgetComponent,
    QrCodeWidgetComponent,
    // ChatBubbleComponent,
    TimelineComponent,
    // FilterPanelComponent,
    ModalComponent,
    PaginationComponent,
    DateRangePickerComponent,
    AuthLayoutComponent,
  ],
>>>>>>> Stashed changes
})
export class SharedModule {}