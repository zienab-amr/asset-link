import { Component, EventEmitter, Input, Output } from '@angular/core';

// Matches the 4 real button styles seen across the Figma screens:
// primary (filled blue), secondary (white/outline), success (filled green), danger (outline red)
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  get classes(): string {
    // Base shared styles: rounded-lg (not full-round), medium font weight, icon+text gap
    const base =
      'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

    // Each variant mapped 1:1 to what's actually used in the design:
    // - primary: "Save Changes", "Book Now", "Counter Offer"
    // - secondary: "Discard", "Details", "Cancel" (white bg, gray border)
    // - success: "Accept Offer", "Join Waitlist" (solid green)
    // - danger: "Reject Offer" (outline red, NOT filled)
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-white text-text border border-border hover:bg-page',
      success: 'bg-success text-white hover:bg-success/90',
      danger: 'bg-white text-danger border border-danger hover:bg-danger-bg',
    };

    return `${base} ${variants[this.variant]}`;
  }
}