import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-delivery-tracking',
  templateUrl: './delivery-tracking.component.html',
  styleUrls: ['./delivery-tracking.component.css'],
})
export class DeliveryTrackingComponent implements OnInit {
  deliveries: any[] = [];
  selectedDelivery: any = null;
  timeline: any[] = [];
  companyId = '';

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const company = this.authService.getCompany();
    this.companyId = company?._id || company?.id || '';
    this.loadDeliveryHistory();
  }

  loadDeliveryHistory(): void {
    this.deliveryService.getDeliveryHistory().subscribe({
      next: (response) => {
        this.deliveries = response;
        if (this.deliveries.length > 0) {
          if (this.selectedDelivery) {
            // Keep the currently selected delivery selected after a refresh
            const current = this.deliveries.find(
              (d) => d._id === this.selectedDelivery._id,
            );
            this.selectDelivery(current || this.deliveries[0]);
          } else {
            // Only auto-select the first delivery the first time the page loads
            this.selectDelivery(this.deliveries[0]);
          }
        } else {
          this.selectedDelivery = null;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  selectDelivery(delivery: any): void {
    this.selectedDelivery = delivery;
    this.loadTimeline(delivery._id);
  }

  loadTimeline(id: string): void {
    this.deliveryService.getDeliveryTimeline(id).subscribe({
      next: (response) => {
        this.timeline = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // Owner: the asset owner (ownerCompanyId) shipping the equipment out
  isOwner(): boolean {
    if (!this.selectedDelivery?.bookingId) return false;
    const ownerId = this.selectedDelivery.bookingId.ownerCompanyId?._id
      || this.selectedDelivery.bookingId.ownerCompanyId;
    return this.companyId === ownerId;
  }

  // Only the owner can advance delivery status, including the final
  // "Delivered" confirmation. The renter has no confirmation role here.
  canUpdateStatus(): boolean {
    if (!this.selectedDelivery) return false;
    return this.isOwner();
  }

  updateNextStatus(): void {
    if (!this.selectedDelivery || !this.canUpdateStatus()) return;

    const statuses = ['Preparing', 'Picked Up', 'In Transit', 'Delivered'];
    const currentIndex = statuses.indexOf(this.selectedDelivery.status);

    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      this.deliveryService
        .updateDeliveryStatus(this.selectedDelivery._id, nextStatus)
        .subscribe({
          next: () => {
            this.loadDeliveryHistory();
          },
          error: (err) => console.error(err),
        });
    }
  }

  getNextStatusText(): string {
    if (!this.selectedDelivery) return '';
    const statuses = ['Preparing', 'Picked Up', 'In Transit', 'Delivered'];
    const currentIndex = statuses.indexOf(this.selectedDelivery.status);
    return currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : '';
  }

  /**
   * Determines where the asset currently is based on the delivery status and
   * the linked booking. Returned as an object with label/holder/description
   * so the HTML can color the card accordingly.
   */
  getAssetLocation(): { label: string; holder: 'company' | 'renter' | 'closed'; description: string } {
    if (!this.selectedDelivery) {
      return { label: 'No data', holder: 'company', description: '' };
    }

    const booking = this.selectedDelivery.bookingId;

    // Rental fully closed
    if (booking?.status === 'Completed') {
      return {
        label: 'Rental Completed',
        holder: 'closed',
        description: 'Asset returned and rental fully closed.',
      };
    }

    // Returned by renter, awaiting final inspection
    if (booking?.returnedAt) {
      return {
        label: 'With Company',
        holder: 'company',
        description: 'Asset returned by renter, awaiting final inspection.',
      };
    }

    // Delivered to renter (confirmed by owner)
    if (this.selectedDelivery.status === 'Delivered') {
      return {
        label: 'With Renter',
        holder: 'renter',
        description: 'Asset delivered and currently in use by the renter.',
      };
    }

    // Still being prepared/shipped, so still with the company
    return {
      label: 'With Company',
      holder: 'company',
      description: 'Asset is being prepared/shipped and has not reached the renter yet.',
    };
  }
}