import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutComponent } from "app/layouts/admin-layout/admin-layout.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AccountingsService } from "app/core/services/accounting.service";
import { MatTableDataSource } from "@angular/material/table";
import { TypeAccountingService } from "app/core/services/type-account.service";
import { ModalEditPlanComponent } from "../partials/account-plan/modal-edit-plan/modal-edit-plan.component";
import { AccountModel } from "app/core/models/account.model";
import { ModalConfirmDeletePlanComponent } from "../partials/account-plan/modal-confirm-delete-plan/modal-confirm-delete-plan.component";
import { TypeAccountModel } from "app/core/models/types-account.model";

import { StatesGlobalModel } from "../core/models/states-global.model";
import { StatesGlobalService } from "app/core/services/state-global.service";
import { filterTableAccounts } from "app/core/models/filter-data-accounting.model";
import { ModalReactiveAccountComponent } from "app/partials/account-plan/modal-reactive-account/modal-reactive-account.component";
import { MatSort } from "@angular/material/sort";
import { TypeAccountSeatService } from "app/core/services/type-account-seat.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  // * Valores parametrizados
  public numberStringStates: number = 1;
  public selectedTab: number;
  public formCreateAccount: FormGroup;
  public formFilterData: FormGroup;
  public typesAccount: TypeAccountModel[];
  public statesGlobal: StatesGlobalModel[];
  public typesAccountSeat: any[];

  public filteredValues = {
    id_account: "",
    id_type_account: "",
    name_account: "",
  };
  public formCreateClientErrors: AccountModel = new AccountModel();
  public dataSource: MatTableDataSource<AccountModel> =
    new MatTableDataSource();
  public displayedColumns: string[] = [
    "id_account",
    "type_account",
    "name_account",
    "desc_type_account_seat",
    "edit",
    "delete",
  ];

  constructor(
    private accountingService: AccountingsService,
    private formBuilder: FormBuilder,
    public father: AdminLayoutComponent,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private typeAccountService: TypeAccountingService,
    private stateGlobalService: StatesGlobalService,
    private typeAccountSeatService: TypeAccountSeatService
  ) {}

  ngOnInit() {
    this.GetGlobalStates();
    this.GetAccounts();
    this.GetTypesAccounts();
    this.GetTypesAccountsSeat();
    this.CreateForm();
  }
  public CreateForm() {
    this.formCreateAccount = this.formBuilder.group({
      id_account: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      id_type_account: [
        { value: null, disabled: false },
        [Validators.required],
      ],
      name_account: [{ value: null, disabled: false }, [Validators.required]],
      id_type_account_seat: [{ value: null, disabled: false }],
    });
    this.formFilterData = this.formBuilder.group({
      id_account: [{ value: null, disabled: false }],
      id_type_account: [{ value: null, disabled: false }],
      name_account: [{ value: null, disabled: false }],
    });
    this.formFilterData.controls.id_account.valueChanges.subscribe(
      (nameFilterValue) => {
        this.filteredValues.id_account = nameFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      }
    );
    this.formFilterData.controls.id_type_account.valueChanges.subscribe(
      (positionFilterValue) => {
        this.filteredValues.id_type_account = positionFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      }
    );
    this.formFilterData.controls.name_account.valueChanges.subscribe(
      (newfilter) => {
        this.filteredValues.name_account = newfilter;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      }
    );

    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  public customFilterPredicate() {
    const myFilterPredicate = (
      data: filterTableAccounts,
      filter: string
    ): boolean => {
      let searchString: any = JSON.parse(filter);
      let filterState: any;
      filterState =
        data.id_account
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.id_account.trim().toLowerCase()) !== -1 &&
        data.id_type_account
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.id_type_account.trim().toLowerCase()) !== -1 &&
        data.name_account
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.name_account.trim().toLowerCase()) !== -1;

      return filterState;
    };

    return myFilterPredicate;
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
  public cleanForm(form: FormGroup) {
    form.reset();
  }

  public keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  public GetAccounts() {
    this.accountingService.getAllAcount().subscribe((data: AccountModel[]) => {
      data = data.filter((element) => {
        return element.id_state_global === this.statesGlobal[0].id_state_global;
      });
      this.dataSource.data = data;
    });
  }
  public GetGlobalStates() {
    this.stateGlobalService
      .getAllStatesGlobal()
      .subscribe((data: StatesGlobalModel[]) => {
        this.statesGlobal = data;
      });
  }
  public GetTypesAccounts() {
    this.typeAccountService
      .getAllTypeAcount()
      .subscribe((data: TypeAccountModel[]) => {
        this.typesAccount = data;
      });
  }

  public GetTypesAccountsSeat() {
    this.typeAccountSeatService
      .getAllTypeAcountSeat()
      .subscribe((data: any[]) => {
        this.typesAccountSeat = data;
      });
  }
  public CreateAccount() {
    if (this.formCreateAccount.valid) {
      this.formCreateAccount.controls.id_type_account_seat.value === ""
        ? this.formCreateAccount.controls.id_type_account_seat.setValue(null)
        : "";

      this.ConfirmCreateAccount(this.formCreateAccount);
    } else {
      this.formCreateAccount.markAllAsTouched();
    }
  }

  public ConfirmCreateAccount(formCreate: FormGroup) {
    this.accountingService.createAccount(formCreate.value).subscribe((data) => {
      if (data.transaccion) {
        this.openSnackBar(data.mensaje, "Continuar");
        this.GetAccounts();
      } else {
        const dialogRefModalEdit = this.dialog.open(
          ModalReactiveAccountComponent,
          {
            disableClose: true,
            maxWidth: "600px",
            autoFocus: false,
            maxHeight: "90vh",
            data: { message: data.mensaje },
          }
        );
        dialogRefModalEdit.afterClosed().subscribe((result) => {
          if (result) {
            this.accountingService
              .reactiveAccount(formCreate.value)
              .subscribe((data) => {
                if (data.transaccion) {
                  this.openSnackBar(data.mensaje, "Continuar");
                  this.GetAccounts();
                }
              });
          }
        });
      }
    });
  }

  public DeleteAccount(item: AccountModel) {
    const dialogRefModalEdit = this.dialog.open(
      ModalConfirmDeletePlanComponent,
      {
        disableClose: true,
        maxWidth: "600px",
        autoFocus: false,
        maxHeight: "90vh",
        data: item,
      }
    );
    dialogRefModalEdit.afterClosed().subscribe((result) => {
      result._id_account ? this.ConfirmDeleteAccount(result._id_account) : null;
    });
  }

  public ConfirmDeleteAccount(accountDelete: AccountModel) {
    this.accountingService
      .deleteAccount({ _id_account: accountDelete })
      .subscribe((data) => {
        if (data) {
          this.openSnackBar(data.mensaje, "Continuar");
        }
        if (data.transaccion) {
          this.GetAccounts();
        }
      });
  }

  public EditAccount(item: any) {
    const dialogRefModalEdit = this.dialog.open(ModalEditPlanComponent, {
      disableClose: true,
      maxWidth: "600px",
      autoFocus: false,
      maxHeight: "90vh",
      data: item,
    });
    dialogRefModalEdit.afterClosed().subscribe((result) => {
      if (result) {
        this.ConfirmEditAccount(result);
      }
    });
  }

  public ConfirmEditAccount(accountUpdate: any) {
    this.accountingService.updateAccount(accountUpdate).subscribe((data) => {
      if (data) {
        this.openSnackBar(data.mensaje, "Continuar");
      }
      if (data.transaccion) {
        this.GetAccounts();
      }
    });
  }
}
