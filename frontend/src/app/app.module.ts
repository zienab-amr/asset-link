import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CheckCircle2, Clock3 } from 'lucide-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { StepperComponent } from './shared/components/stepper/stepper.component';
import { ImageGalleryComponent } from './shared/components/image-gallery/image-gallery.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { DateRangePickerComponent } from './shared/components/date-range-picker/date-range-picker.component';
import { CompanyProfileComponent } from './pages/company/company-profile/company-profile.component';
import { ProfileHeaderComponent } from './pages/company/company-profile/components/profile-header/profile-header.component';
import { CompanyStatsComponent } from './pages/company/company-profile/components/company-stats/company-stats.component';
import { ProfileTabsComponent } from './pages/company/company-profile/components/profile-tabs/profile-tabs.component';
import { CompanyInformationComponent } from './pages/company/company-profile/components/company-information/company-information.component';
import { ContactCardComponent } from './pages/company/company-profile/components/contact-card/contact-card.component';
import { AccountStatusComponent } from './pages/company/company-profile/components/account-status/account-status.component';
import { CertificationsComponent } from './pages/company/company-profile/components/certifications/certifications.component';
import { TeamMembersComponent } from './pages/company/company-profile/components/team-members/team-members.component';
import { ListedAssetsComponent } from './pages/company/company-profile/components/listed-assets/listed-assets.component';
import { ReviewsComponent } from './pages/company/company-profile/components/reviews/reviews.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    StepperComponent,
    ImageGalleryComponent,
    ModalComponent,
    PaginationComponent,
    DateRangePickerComponent,
    CompanyProfileComponent,
    ProfileHeaderComponent,
    CompanyStatsComponent,
    ProfileTabsComponent,
    CompanyInformationComponent,
    ContactCardComponent,
    AccountStatusComponent,
    CertificationsComponent,
    TeamMembersComponent,
    ListedAssetsComponent,
    ReviewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
     LucideAngularModule.pick({
      CheckCircle2,
      Clock3
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
