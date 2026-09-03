import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ContractService } from '../../services/contract.service';
import { AuthService } from '../../services/auth.service';
import { PaymentsEscrowService, BillingData } from '../../services/payments-escrow.service';
import { DeliveryService } from '../../services/delivery.service';
import { RentalCompletionService } from '../../services/rental-completion.service';
import { PenaltyService } from '../../services/penalty.service';
import { DamageReportService } from '../../services/damage-report.service';
import { EscrowService, EscrowRecord } from '../../services/escrow.service';

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

  // Delivery existence check state
  deliveryExists = false;
  loadingDeliveryStatus = false;

  // Payment Popup State
  currentPaymentId: string | null = null;
  private paymentPopup: Window | null = null;
  private paymentPollingSub?: Subscription;

  // Rental Completion State
  damageReport: any = null;
  loadingDamageReport = false;
  penaltyLoading = false;
  
  // Escrow breakdown, shown so renters/owners understand rental payout vs deposit refund
escrowInfo: EscrowRecord | null = null;
loadingEscrowInfo = false;

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
    private deliveryService: DeliveryService,
    private rentalCompletionService: RentalCompletionService,
    private penaltyService: PenaltyService,
    private damageReportService: DamageReportService,
    private escrowService: EscrowService
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

        // Keep the currently open panel in sync with fresh data
        if (this.selectedContract) {
          const refreshed = this.contracts.find((c) => c._id === this.selectedContract._id);
          if (refreshed) {
            this.selectedContract = refreshed;
            this.checkDamageReport();
            this.checkDeliveryStatus();
                this.loadEscrowInfo();
          }
        }
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
    this.damageReport = null;
    this.checkDamageReport();
    this.checkDeliveryStatus();
    this.loadEscrowInfo();
  }

  closePanel() {
    this.selectedContract = null;
    this.damageReport = null;
    this.deliveryExists = false;
      this.escrowInfo = null;
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
            this.finishPaymentFlow();
            this.errorMessage = 'Payment window was closed before completion.';
          }
        },
        error: () => {
          // Ignore transient polling errors, keep polling
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
        this.deliveryExists = true;
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

  // ==========================================
  // Rental Completion Flow (Return / Damage / Penalty / Complete)
  // ==========================================

  get bookingId(): string {
    if (!this.selectedContract) return '';
    return this.selectedContract.bookingId?._id || this.selectedContract.bookingId;
  }

  get isReturned(): boolean {
    return !!this.selectedContract?.bookingId?.returnedAt;
  }

  // Checks whether a delivery already exists for this contract's booking,
  // so the "Create Delivery" button does not keep showing after it was already created.
  checkDeliveryStatus(): void {
    if (!this.selectedContract) {
      this.deliveryExists = false;
      return;
    }

    this.loadingDeliveryStatus = true;
    this.deliveryService.getDeliveryHistory().subscribe({
      next: (deliveries: any[]) => {
        this.deliveryExists = (deliveries || []).some((d: any) => {
          const dBookingId = d.bookingId?._id || d.bookingId;
          return dBookingId === this.bookingId;
        });
        this.loadingDeliveryStatus = false;
      },
      error: () => {
        this.deliveryExists = false;
        this.loadingDeliveryStatus = false;
      },
    });
  }

  checkDamageReport(): void {
    if (!this.selectedContract || !this.isReturned) {
      this.damageReport = null;
      return;
    }

    this.loadingDamageReport = true;
    this.damageReportService.getDamageReportByBooking(this.bookingId).subscribe({
      next: (report: any) => {
        this.damageReport = report;
        this.loadingDamageReport = false;
      },
      error: () => {
        this.damageReport = null;
        this.loadingDamageReport = false;
      },
    });
  }
  
  // Loads escrow so we can clearly show: rental amount -> owner, deposit -> renter
loadEscrowInfo(): void {
  if (!this.selectedContract) {
    this.escrowInfo = null;
    return;
  }

  this.loadingEscrowInfo = true;
  this.escrowService.getEscrowByBooking(this.bookingId).subscribe({
    next: (escrow) => {
      this.escrowInfo = escrow;
      this.loadingEscrowInfo = false;
    },
    error: () => {
      this.escrowInfo = null;
      this.loadingEscrowInfo = false;
    },
  });
}

  returnAsset(): void {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.rentalCompletionService.returnAsset(this.bookingId).subscribe({
      next: () => {
        this.actionLoading = false;
        this.successMessage = 'Asset marked as returned. Waiting for final inspection.';
        this.loadContracts();
      },
      error: (err: any) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || 'Failed to mark asset as returned';
      },
    });
  }

  applyPenalty(): void {
    if (!this.selectedContract || !this.damageReport) return;
    this.penaltyLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const assetId = this.selectedContract.assetId?._id || this.selectedContract.assetId;

    this.penaltyService.createPenalty({
      bookingId: this.bookingId,
      assetId,
      damageCost: this.damageReport.damageCost,
      damageLevel: this.damageReport.damageLevel,
    }).subscribe({
      next: () => {
        this.penaltyLoading = false;
        this.successMessage = 'Penalty applied and deducted from security deposit.';
        this.checkDamageReport();
      },
      error: (err: any) => {
        this.penaltyLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || 'Failed to apply penalty';
      },
    });
  }

  completeRental(): void {
    if (!this.selectedContract) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.rentalCompletionService.completeRental(this.bookingId).subscribe({
      next: () => {
        this.actionLoading = false;
        this.successMessage = 'Rental completed successfully! Escrow released.';
        this.selectedContract.status = 'Completed';
        this.loadContracts();
      },
      error: (err: any) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || 'Failed to complete rental';
      },
    });
  }
}