import { Component } from '@angular/core';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.css']
})
export class AccountStatusComponent {
items = [
    {
      title: 'Identity Verified',
      status: 'Done',
      completed: true
    },
    {
      title: 'Bank Account Linked',
      status: 'Done',
      completed: true
    },
    {
      title: 'Insurance on File',
      status: 'Done',
      completed: true
    },
    {
      title: '2FA Enabled',
      status: 'Pending',
      completed: false
    }
  ];
}
