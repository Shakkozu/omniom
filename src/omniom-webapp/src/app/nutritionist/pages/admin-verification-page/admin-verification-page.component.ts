import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-verification-page',
  template: `
    <div class="flex">
	<div style="flex: 0.4; height: 90vh;">
      <app-pending-verification-requests></app-pending-verification-requests>
    </div>
    <div style="flex: 0.1; height: 90vh;">
    </div>
    <div style="flex: 0.5; height: 90vh;">
    </div>
</div>

  `
})
export class AdminVerificationPage {

}
