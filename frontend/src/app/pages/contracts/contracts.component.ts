import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ContractService } from '../../services/contract.service';
import { AuthService } from '../../services/auth.service';
import { PaymentsEscrowService, BillingData } from '../../services/payments-escrow.service';
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
})
export class ContractsComponent implements OnInit, OnDestroy {
  contracts: any[] = [];
  filteredContracts: any[] = [];
  selectedContract: any = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  statusFilter = 'All';
  companyId = '';
  actionLoading = false;

  // Delivery Modal State
  showDeliveryModal = false;
  deliveryData = {
    pickupLocation: '',
    deliveryLocation: '',
    driverName: '',
    driverPhone: '',
    estimatedArrival: ''
  };

  // Payment Popup State
  currentPaymentId: string | null = null;
  private paymentPopup: Window | null = null;
  private paymentPollingSub?: Subscription;

  statusOptions = ['All', 'Draft', 'Active', 'Approved', 'Rejected', 'Completed'];

  columns = [
    { field: 'contractCode', header: 'Contract ID' },
    { field: 'assetName', header: 'Asset' },
    { field: 'renterName', header: 'Renter' },
    { field: 'ownerName', header: 'Owner' },
    { field: 'totalPrice', header: 'Value' },
    { field: 'status', header: 'Status' },
  ];

  constructor(
    private contractService: ContractService,
    private authService: AuthService,
    private paymentService: PaymentsEscrowService,
    private deliveryService: DeliveryService
  ) {}

  ngOnInit(): void {
    const company = this.authService.getCompany();
    this.companyId = company?._id || company?.id || '';
    this.loadContracts();
  }

  ngOnDestroy(): void {
    this.paymentPollingSub?.unsubscribe();
  }

  loadContracts() {
    this.isLoading = true;
    this.errorMessage = '';
    this.contractService.getContracts().subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res) ? res : res.data || [];
        this.contracts = raw.map((c: any) => ({
          ...c,
          assetName: c.assetId?.assetName || '—',
          renterName: c.companyId?.companyName || '—',
          ownerName: c.ownerCompanyId?.companyName || '—',
          startDateFormatted: c.startDate ? new Date(c.startDate).toLocaleDateString() : '—',
          endDateFormatted: c.endDate ? new Date(c.endDate).toLocaleDateString() : '—',
        }));
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || 'Failed to load contracts';
      },
    });
  }

  applyFilter() {
    let result = this.contracts;

    if (this.statusFilter !== 'All') {
      result = result.filter((c) => c.status === this.statusFilter);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((c) =>
        [c.contractCode, c.assetName, c.renterName, c.ownerName]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(term))
      );
    }

    this.filteredContracts = result;
  }

  onContractAction(contract: any) {
    this.selectedContract = contract;
    this.successMessage = '';
    this.errorMessage = '';
  }

  closePanel() {
    this.selectedContract = null;
  }

  isOwner(contract: any): boolean {
    if (!contract) return false;
    const ownerId = contract.ownerCompanyId?._id || contract.ownerCompanyId;
    return this.companyId === ownerId;
  }

  approveContract() {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contractService.approveContract(this.selectedContract._id).subscribe({
      next: (res: any) => {
        this.actionLoading = false;
        this.successMessage = 'Contract approved successfully!';
        this.selectedContract.status = 'Active';
        this.loadContracts();
      },
      error: (err: any) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.error || err.error?.message || 'Failed to approve contract';
      },
    });
  }

  rejectContract() {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contractService.rejectContract(this.selectedContract._id).subscribe({
      next: (res: any) => {
        this.actionLoading = false;
        this.successMessage = 'Contract rejected.';
        this.selectedContract.status = 'Rejected';
        this.loadContracts();
      },
      error: (err: any) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.error || err.error?.message || 'Failed to reject contract';
      },
    });
  }

  isRenter(contract: any): boolean {
    if (!contract) return false;
    const renterId = contract.companyId?._id || contract.companyId;
    return this.companyId === renterId;
  }

  /**
   * بتجهز billingData من بيانات الشركة بتاعت المستخدم.
   * Paymob بيطلب حقول العنوان (street, building, floor, apartment, city, country)
   * حتى لو مش موجودة فعليًا عند الشركة، فبنبعتها بقيم افتراضية ثابتة.
   */
  private buildBillingData(): BillingData {
    const company = this.authService.getCompany();
    return {
      first_name: company?.companyName || company?.name || 'NA',
      last_name: 'NA',
      email: company?.email || 'noemail@example.com',
      phone_number: company?.phone || company?.phoneNumber || '00000000000',
      street: 'NA',
      building: 'NA',
      floor: 'NA',
      apartment: 'NA',
      city: 'NA',
      country: 'EG',
    };
  }

  payContract() {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const bookingId = this.selectedContract.bookingId?._id || this.selectedContract.bookingId;
    const billingData = this.buildBillingData();

    this.paymentService.createPayment(bookingId, billingData).subscribe({
      next: (res: any) => {
        this.actionLoading = false;
        this.currentPaymentId = res.data.paymentId;
        this.openPaymentPopup(res.data.iframeUrl);
        this.startPaymentPolling();
      },
      error: (err: any) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.error || err.error?.message || 'Failed to initiate payment';
      }
    });
  }

  /**
   * بتفتح صفحة الدفع بتاعة Paymob في نافذة منبثقة حقيقية (popup)
   * في منتصف الشاشة، بدل ما تكون iframe جوه الصفحة نفسها.
   */
  private openPaymentPopup(url: string) {
    const width = 500;
    const height = 700;
    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);

    this.paymentPopup = window.open(
      url,
      'PaymobPayment',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    if (!this.paymentPopup) {
      this.errorMessage = 'Popup blocked. Please allow popups for this site and try again.';
    }
  }

  /**
   * بعد ما المستخدم يدخل بيانات الكارت في نافذة الـ popup، Paymob بتبعت webhook
   * للباك إند. هنا بنسأل كل 4 ثواني عن حالة الدفع لحد ما تتغير.
   * كمان بنراقب لو المستخدم قفل الـ popup يدوي قبل ما الدفع يخلص، عشان نوقف الـ polling.
   */
  private startPaymentPolling() {
    if (!this.currentPaymentId) return;

    this.paymentPollingSub = interval(4000)
      .pipe(switchMap(() => this.paymentService.getPaymentStatus(this.currentPaymentId!)))
      .subscribe({
        next: (res: any) => {
          const status = res.data.paymentStatus;

          if (status === 'Completed') {
            this.finishPaymentFlow();
            this.successMessage = 'Payment successful! Escrow created.';
            this.selectedContract.status = 'Approved';
            this.loadContracts();
          } else if (status === 'Failed') {
            this.finishPaymentFlow();
            this.errorMessage = 'Payment failed. Please try again.';
          } else if (this.paymentPopup && this.paymentPopup.closed) {
            // المستخدم قفل الـ popup يدوي قبل ما الدفع يخلص أو يفشل رسميًا
            this.finishPaymentFlow();
            this.errorMessage = 'Payment window was closed before completion.';
          }
        },
        error: () => {
          // بنتجاهل الأخطاء المؤقتة ومنوقفش الـ polling عليها
        }
      });
  }

  private finishPaymentFlow() {
    this.paymentPopup?.close();
    this.paymentPopup = null;
    this.currentPaymentId = null;
    this.paymentPollingSub?.unsubscribe();
  }

  openDeliveryModal() {
    this.showDeliveryModal = true;
    this.deliveryData = {
      pickupLocation: '',
      deliveryLocation: '',
      driverName: '',
      driverPhone: '',
      estimatedArrival: ''
    };
  }

  closeDeliveryModal() {
    this.showDeliveryModal = false;
  }

  submitDelivery() {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const bookingId = this.selectedContract.bookingId?._id || this.selectedContract.bookingId;

    const payload = {
      ...this.deliveryData,
      bookingId,
      contractId: this.selectedContract._id
    };

    this.deliveryService.createDelivery(payload).subscribe({
      next: () => {
        this.actionLoading = false;
        this.successMessage = 'Delivery initiated successfully!';
        this.showDeliveryModal = false;
      },
      error: (err: any) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.error || err.error?.message || 'Failed to create delivery';
      }
    });
  }

  generatePdf() {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contractService.generatePdf(this.selectedContract._id).subscribe({
      next: (res: any) => {
        this.actionLoading = false;
        this.successMessage = 'PDF generated successfully!';
      },
      error: (err: any) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.message || 'Failed to generate PDF';
      },
    });
  }

  downloadPdf(contractId: string) {
    window.open(this.contractService.getDownloadUrl(contractId), '_blank');
  }

  viewPdf(contractId: string) {
    window.open(this.contractService.getViewUrl(contractId), '_blank');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Draft': return 'status-draft';
      case 'Active': return 'status-active';
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  }
}