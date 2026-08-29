import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateInspectionPayload } from '../../models/inspection.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-create-inspection-modal',
  templateUrl: './create-inspection-modal.component.html',
  styleUrls: ['./create-inspection-modal.component.css'],
})
export class CreateInspectionModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() assets: any[] = [];
  @Input() bookings: any[] = [];
  @Input() editData: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() submitInspection = new EventEmitter<any>();

  inspectionForm!: FormGroup;
  isSubmitting = false;

  inspectionPhotos: string[] = [];

  // FIXED: 'after_return' -> 'after_use' عشان يتطابق مع rentalCompletion.service.js
  // اللي بيدور تحديدًا على inspectionType === "after_use"
  inspectionTypes = [
    { value: 'before_use', label: 'Before Rental' },
    { value: 'after_use', label: 'After Rental' },
  ];

  damageLevels = ['none', 'minor', 'moderate', 'severe'];
  statuses = ['Pending', 'Passed', 'Failed'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && this.isOpen && this.inspectionForm) {
      if (this.editData) {
        this.patchFormWithEditData();
      } else {
        this.inspectionForm.enable();

        const currentUser = this.authService.getCompany();
        if (currentUser?.role === 'Inspector') {
          this.inspectionForm.get('inspectorName')?.disable();
        }
      }
    }
  }

  private initForm(): void {
    const currentUser = this.authService.getCompany();
    const isInspector = currentUser?.role === 'Inspector';

    this.inspectionForm = this.fb.group({
      bookingId: ['', Validators.required],
      assetId: ['', Validators.required],
      inspectorName: [
        isInspector ? currentUser.fullName : '',
        [Validators.required, Validators.minLength(2)]
      ],
      taxRegister: [''],
      commercialRegister: [''],
      inspectionType: ['before_use', Validators.required],
      conditionScore: [
        80,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      status: ['Passed', Validators.required],
      hasDamage: [false],
      damageLevel: ['none'],
      damageCost: [0],
      notes: ['', Validators.minLength(3)],
      photos: [[]],
      brakes: [false],
      engine: [false],
      body: [false],
      tires: [false],
      lights: [false],
    });

    this.inspectionForm
      .get('inspectionType')
      ?.valueChanges.subscribe(() => {
        if (!this.editData) {
          this.onInspectionTypeChange();
        }
      });

    if (isInspector) {
      this.inspectionForm.get('inspectorName')?.disable();
    }

    if (this.editData) {
      this.patchFormWithEditData();
    }
  }

  private patchFormWithEditData(): void {
    if (!this.inspectionForm) return;

    this.inspectionForm.patchValue({
      bookingId: this.editData._id || '',
      assetId: this.editData.assetId?._id || this.editData.assetId || '',
      inspectorName: this.inspectionForm.get('inspectorName')?.value || '',
      taxRegister: '',
      commercialRegister: '',
      inspectionType: 'before_use',
      conditionScore: 80,
      status: 'Passed',
      hasDamage: false,
      damageLevel: 'none',
      damageCost: 0,
      notes: '',
      brakes: false,
      engine: false,
      body: false,
      tires: false,
      lights: false,
    });

    this.inspectionPhotos = [];

    this.inspectionForm.get('bookingId')?.disable();
    this.inspectionForm.get('assetId')?.disable();
    this.inspectionForm.get('inspectionType')?.disable();
  }

  onPhotosUploaded(images: string[]): void {
    this.inspectionPhotos = images;
    this.inspectionForm.patchValue({ photos: this.inspectionPhotos });
  }

  get filteredBookings(): any[] {
    const type = this.inspectionForm?.getRawValue().inspectionType;

    // FIXED: كان بيفلتر على status === 'Completed' للـ after_use
    // لكن الـ booking بيتحول لـ Completed بس بعد ما الفحص ده نفسه يخلص!
    // يعني الدروب داون كان هيفضل فاضي دايمًا. الصح إن الـ booking
    // بيفضل "Confirmed" طول فترة الإيجار (قبل وبعد الرجوع)، لحد ما يتقفل فعليًا.
    if (type === 'before_use') {
      return (this.bookings || []).filter((b: any) => b.status === 'Confirmed');
    }
    return (this.bookings || []).filter((b: any) => b.status === 'Confirmed');
  }

  onBookingChange(): void {
    if (this.editData) return;

    const bookingId = this.inspectionForm.get('bookingId')?.value;
    const booking = this.bookings.find((b: any) => b._id === bookingId);
    if (!booking) return;

    const assetId = typeof booking.assetId === 'object' ? booking.assetId._id : booking.assetId;
    this.inspectionForm.patchValue({ assetId });
  }

  onInspectionTypeChange(): void {
    const type = this.inspectionForm.get('inspectionType')?.value;
    this.inspectionForm.patchValue({ bookingId: '', assetId: '' });

    if (type === 'before_use') {
      this.inspectionForm.patchValue({ hasDamage: false, damageLevel: 'none', damageCost: 0 });
    }
  }

  onSubmit(): void {
    if (this.inspectionForm.invalid) {
      this.inspectionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.inspectionForm.getRawValue();
    const currentUser = this.authService.getCompany();

    const payload: any = {
      bookingId: formValues.bookingId,
      assetId: formValues.assetId,
      inspectorName: formValues.inspectorName,
      inspectorId: currentUser?.id,
      taxRegister: formValues.taxRegister,
      commercialRegister: formValues.commercialRegister,
      inspectionType: formValues.inspectionType,
      conditionScore: formValues.conditionScore,
      status: formValues.status,
      hasDamage: formValues.hasDamage,
      damageLevel: formValues.damageLevel,
      damageCost: formValues.damageCost,
      notes: formValues.notes || '',
      photos: this.inspectionPhotos,
      checklist: {
        brakes: formValues.brakes,
        engine: formValues.engine,
        body: formValues.body,
        tires: formValues.tires,
        lights: formValues.lights,
      },
    };

    setTimeout(() => {
      this.submitInspection.emit(payload);
      this.isSubmitting = false;
      this.closeModal();
    }, 300);
  }

  closeModal(): void {
    this.inspectionForm.reset({
      bookingId: '', assetId: '', inspectorName: '', taxRegister: '', commercialRegister: '',
      inspectionType: 'before_use', conditionScore: 80, status: 'Passed', hasDamage: false,
      damageLevel: 'none', damageCost: 0, notes: '', photos: [], brakes: false, engine: false,
      body: false, tires: false, lights: false,
    });
    this.inspectionForm.enable();

    const currentUser = this.authService.getCompany();
    if (currentUser?.role === 'Inspector') {
      this.inspectionForm.get('inspectorName')?.disable();
      this.inspectionForm.patchValue({ inspectorName: currentUser.fullName });
    }

    this.inspectionPhotos = [];
    this.close.emit();
  }
}