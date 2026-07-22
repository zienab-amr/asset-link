import { Component } from '@angular/core';
import { StepperStep } from './shared/components/stepper/stepper.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'AssetLink Shared Components Demo';

  // Matches "Delivery Progress" stepper exactly
  deliverySteps: StepperStep[] = [
    { label: 'Preparing', subLabel: 'Jul 10 · 8:00 AM', icon: '📦' },
    { label: 'Picked Up', subLabel: 'Jul 10 · 9:15 AM', icon: '🚚' },
    { label: 'In Transit', subLabel: 'In progress...', icon: '📍' },
    { label: 'Delivered', subLabel: 'Est. 11:30 AM', icon: '✓' },
  ];
  currentStep = 2; // "In Transit" is active, matches the screenshot

  demoImages: string[] = [];

  onFilesSelected(files: FileList) {
    console.log('Files selected for upload:', files);
  }

  onImagesChange(images: string[]) {
    this.demoImages = images;
  }
}