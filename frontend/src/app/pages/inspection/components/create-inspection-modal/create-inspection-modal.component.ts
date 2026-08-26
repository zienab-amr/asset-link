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
  @Input() editData: any = null; // 🚀 ده اللي هيستقبل المسودة المبعوتة من الباك إند

  @Output() close = new EventEmitter<void>();
  @Output() submitInspection = new EventEmitter<CreateInspectionPayload>();
  @Output() updateInspection = new EventEmitter<{ id: string; payload: Partial<CreateInspectionPayload> }>(); // 🚀 إيفينت جديد للتحديث

  inspectionForm!: FormGroup;
  isSubmitting = false;

  inspectionPhotos: string[] = [];

  inspectionTypes = [
    { value: 'before_use', label: 'Before Rental' },
    { value: 'after_return', label: 'After Rental' },
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

  // 🚀 دي بتراقب لو بعتنا مسودة للمودال عشان يفتحها يملأ البيانات فوراً
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editData'] && this.isOpen && this.inspectionForm) {
      if (this.editData) {
        this.patchFormWithEditData();
      } else {
        this.inspectionForm.enable(); // لو مفيش مسودة، نفتح كل الحقول للإنشاء
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
      status: ['Pending', Validators.required],
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
        if (!this.editData) { // نعمل الريسيت بس لو بننشئ واحد جديد مش بنعدل
          this.onInspectionTypeChange();
        }
      });

    if (isInspector) {
      this.inspectionForm.get('inspectorName')?.disable();
    }

    // لو المودال فتح بمسودة جاهزة
    if (this.editData) {
      this.patchFormWithEditData();
    }
  }

  // 🚀 دي الدالة السحرية اللي بتعبي الفورم وتقفل الحقول الثابتة للمسودة
  private patchFormWithEditData(): void {
    if (!this.inspectionForm) return;

    this.inspectionForm.patchValue({
      bookingId: this.editData.bookingId?._id || this.editData.bookingId || '',
      assetId: this.editData.assetId?._id || this.editData.assetId || '',
      inspectorName: this.editData.inspectorName || '',
      taxRegister: this.editData.taxRegister || '',
      commercialRegister: this.editData.commercialRegister || '',
      inspectionType: this.editData.inspectionType || 'before_use',
      conditionScore: this.editData.conditionScore || 80,
      status: this.editData.status || 'Pending',
      hasDamage: this.editData.hasDamage || false,
      damageLevel: this.editData.damageLevel || 'none',
      damageCost: this.editData.damageCost || 0,
      notes: this.editData.notes || '',
      brakes: this.editData.checklist?.brakes || false,
      engine: this.editData.checklist?.engine || false,
      body: this.editData.checklist?.body || false,
      tires: this.editData.checklist?.tires || false,
      lights: this.editData.checklist?.lights || false,
    });

    this.inspectionPhotos = this.editData.photos || [];

    // نقفل الحقول اللي مينفعش المفتش يغيرها في المسودة المطلوبة منه
    this.inspectionForm.get('bookingId')?.disable();
    this.inspectionForm.get('assetId')?.disable();
    this.inspectionForm.get('inspectionType')?.disable();
  }

  onPhotosUploaded(images: string[]): void {
    this.inspectionPhotos = images;
    this.inspectionForm.patchValue({ photos: this.inspectionPhotos });
  }

  get filteredBookings(): any[] {
    const type = this.inspectionForm?.getRawValue().inspectionType; // 🚀 getRawValue عشان يقرأ الـ disabled

    if (type === 'before_use') {
      return (this.bookings || []).filter((b: any) => b.status === 'Confirmed');
    }
    return (this.bookings || []).filter((b: any) => b.status === 'Completed');
  }

  onBookingChange(): void {
    if (this.editData) return; // نمنع التغيير لو إحنا في وضع التعديل

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
    const formValues = this.inspectionForm.getRawValue(); // 🚀 لازم getRawValue عشان يقرا الحقول اللي عملنالها disable

    const payload: CreateInspectionPayload = {
      bookingId: formValues.bookingId,
      assetId: formValues.assetId,
      inspectorName: formValues.inspectorName,
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
      // 🚀 التفريعة: لو فيه مسودة بنعمل تحديث، ولو مفيش بنعمل إنشاء
      if (this.editData) {
        this.updateInspection.emit({ id: this.editData._id, payload });
      } else {
        this.submitInspection.emit(payload);
      }
      
      this.isSubmitting = false;
      this.closeModal();
    }, 300);
  }

  closeModal(): void {
    this.inspectionForm.reset({
      bookingId: '', assetId: '', inspectorName: '', taxRegister: '', commercialRegister: '',
      inspectionType: 'before_use', conditionScore: 80, status: 'Pending', hasDamage: false,
      damageLevel: 'none', damageCost: 0, notes: '', photos: [], brakes: false, engine: false,
      body: false, tires: false, lights: false,
    });
    this.inspectionForm.enable(); // نفتح الفورم تاني للمرة الجاية
    
    // لو المفتش، نرجع نقفل حقل الاسم
    const currentUser = this.authService.getCompany();
    if (currentUser?.role === 'Inspector') {
      this.inspectionForm.get('inspectorName')?.disable();
      this.inspectionForm.patchValue({ inspectorName: currentUser.fullName });
    }

    this.inspectionPhotos = []; 
    this.close.emit();
  }
}