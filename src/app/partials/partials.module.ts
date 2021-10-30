import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
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
import { ModalEditPlanComponent } from "./account-plan/modal-edit-plan/modal-edit-plan.component";
import { ModalConfirmDeletePlanComponent } from "./account-plan/modal-confirm-delete-plan/modal-confirm-delete-plan.component";
import { ModalReactiveAccountComponent } from './account-plan/modal-reactive-account/modal-reactive-account.component';

@NgModule({
  declarations: [ModalEditPlanComponent, ModalConfirmDeletePlanComponent, ModalReactiveAccountComponent],
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
