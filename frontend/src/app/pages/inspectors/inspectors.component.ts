import { Component, OnInit } from '@angular/core';
import { InspectorService } from '../../services/inspector.service';
import { ToastService } from '../../services/toast.service'; 

@Component({
  selector: 'app-inspectors',
  templateUrl: './inspectors.component.html',
})
export class InspectorsComponent implements OnInit {
  inspectors: any[] = [];
  isLoading = false;
  isModalOpen = false;
  isSubmitting = false;

  newInspector = {
    fullName: '',
    inspectorEmail: '',
    phoneNumber: '',
    password: ''
  };

  constructor(
    private inspectorService: InspectorService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadInspectors();
  }

  loadInspectors() {
    this.isLoading = true;
    this.inspectorService.getCompanyInspectors().subscribe({
      next: (res: any) => {
        // افترضي إن الباك إند بيرجع الداتا في res.data
        this.inspectors = res.data || res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.showError('Failed to load inspectors');
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newInspector = { fullName: '', inspectorEmail: '', phoneNumber: '', password: '' };
  }

  onSubmit() {
    this.isSubmitting = true;
    this.inspectorService.addInspector(this.newInspector).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.showSuccess('Inspector added successfully!');
        this.closeModal();
        this.loadInspectors(); 
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastService.showError(err.error?.message || 'Failed to add inspector');
      }
    });
  }
}