import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerWaitComponent } from "./spinner-wait/spinner-wait.component";

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ModalCreateUserComponent } from "./modal-create-user/modal-create-user.component";
import { ModalEditUserComponent } from "./modal-edit-user/modal-edit-user.component";
import { ModalDeleteUserComponent } from "./modal-delete-user/modal-delete-user.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { AdminLayoutRoutes } from "app/layouts/admin-layout/admin-layout.routing";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTabsModule } from "@angular/material/tabs";
import { ModalConfirmEditUserComponent } from "./modal-confirm-edit-user/modal-confirm-edit-user.component";
import { ModalEditQuoteComponent } from "./modal-edit-quote/modal-edit-quote.component";
import { ModalAttentQuoteComponent } from "./modal-attent-quote/modal-attent-quote.component";

@NgModule({
  declarations: [
    SpinnerWaitComponent,
    ModalCreateUserComponent,
    ModalEditUserComponent,
    ModalConfirmEditUserComponent,
    ModalDeleteUserComponent,
    ModalEditQuoteComponent,
    ModalAttentQuoteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
})
export class PartialsModule {}
