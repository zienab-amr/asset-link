import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InspectorService } from 'src/app/services/inspector.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-assign-inspector-modal',
  templateUrl: './assign-inspector-modal.component.html'
})
export class AssignInspectorModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() bookingId: string | null = null; // بيستقبل الـ ID بتاع الحجز
  @Output() close = new EventEmitter<void>();
  @Output() assigned = new EventEmitter<void>(); // بننادي عليها لما التعيين ينجح عشان نحدث الجدول

  availableInspectors: any[] = [];
  selectedInspectorId: string = '';
  isLoading = false;
  isSubmitting = false;

  constructor(
    private inspectorService: InspectorService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (this.isOpen) {
      this.loadAvailableInspectors();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.selectedInspectorId = '';
      this.loadAvailableInspectors();
    }
  }

  loadAvailableInspectors() {
    this.isLoading = true;
    this.inspectorService.getCompanyInspectors().subscribe({
      next: (res: any) => {
        const allInspectors = res.data || res;
        this.availableInspectors = allInspectors.filter((insp: any) => insp.isAvailable);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.showError('Failed to load inspectors');
      }
    });
  }

  onSubmit() {
    if (!this.selectedInspectorId || !this.bookingId) return;

    this.isSubmitting = true;
    this.inspectorService.assignInspector(this.bookingId, this.selectedInspectorId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.showSuccess('Inspector assigned successfully!');
        this.assigned.emit(); 
        this.closeModal();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastService.showError(err.error?.message || 'Failed to assign inspector');
      }
    });
  }

  closeModal() {
    this.isOpen = false;
    this.close.emit();
  }
}