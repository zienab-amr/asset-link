import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatBubbleComponent } from './components/chat-bubble/chat-bubble.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';

/**
 * SharedModule - الوحدة المشتركة لكافة المكونات القابلة لإعادة الاستخدام
 * تقوم بتسجيل وتصدير المكونات التفاعلية الثلاثة (ChatBubble, Timeline, FilterPanel).
 */
@NgModule({
  declarations: [
    ChatBubbleComponent,
    TimelineComponent,
    FilterPanelComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ChatBubbleComponent,
    TimelineComponent,
    FilterPanelComponent
  ]
})
export class SharedModule { }
