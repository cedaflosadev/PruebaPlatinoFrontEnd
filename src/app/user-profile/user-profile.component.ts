import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutComponent } from "app/layouts/admin-layout/admin-layout.component";
import { BehaviorSubject, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AbstractControl } from "@angular/forms";
import { DetailMov } from "app/core/models/detail-mov.model";
import { AccountingsService } from "app/core/services/accounting.service";
import { AccountModel } from "app/core/models/account.model";
import { StatesGlobalModel } from "app/core/models/states-global.model";
import { StatesGlobalService } from "app/core/services/state-global.service";
import { TypeAccountingService } from "app/core/services/type-account.service";
import { TypeAccountModel } from "app/core/models/types-account.model";

import { TypeAccountingMovService } from "app/core/services/type-account-mov.service";
import { UserService } from "app/core/services/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TypeAccountSeatService } from "app/core/services/type-account-seat.service";
import { TypeMoveService } from "app/core/services/type-move.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  public data: DetailMov[];
  public dataAccountPlan: AccountModel[];
  public typesAccountSeat: any[];
  public dataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
  public displayColumnsDetails = [
    "id_cta_mov",
    "des_cta_mov",
    "id_state_cta_mov",
    "val_cta_mov",
    "glo_cta_mov",
    "cancel",
  ];
  public rowsDetails: FormArray = this.formBuilder.array([]);
  public formDetails: FormGroup = this.formBuilder.group({
    dataDetails: this.rowsDetails,
  });
  public errorToCreateSeat: any = {
    state: false,
    message: "",
  };

  public formDetailsErrors: any = {
    id_cta_mov: "",
    des_cta_mov: "",
    id_state_cta_mov: "",
    val_cta_mov: "",
    glo_cta_mov: "",
  };
  public typeAccountsMov: any;
  public filteredOptions: Observable<string[]>;
  public filteredOptionsAccount: Observable<string[]>[] = [];

  public formHeader: FormGroup;
  public formHeaderErrors: any = {
    id_number_mov: "",
    date_mov: "",
    name_por_mov: "",
    check_mov: "",
  };
  public statesGlobal: StatesGlobalModel[];
  public typesAccount: TypeAccountModel[];

  public typeMove: any[];
  public options: any = [];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public displayedColumns: string[] = [
    "id_account",
    "type_account",
    "name_account",
    "edit",
    "delete",
  ];

  constructor(
    public father: AdminLayoutComponent,
    private formBuilder: FormBuilder,
    private accountingService: AccountingsService,
    private stateGlobalService: StatesGlobalService,
    private typeAccountService: TypeAccountingService,
    private typeAccountingMovService: TypeAccountingMovService,
    private typeAccountSeatService: TypeAccountSeatService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private typeMoveService: TypeMoveService
  ) {}

  ngOnInit() {
    this.CreateForm();
    this.GetGlobalStates();
    this.GetAccounts();
    this.GetTypesAccounts();
    this.GetTypeAccountMov();
    this.GetTypesAccountsSeat();
    this.GetUser();
    this.GetTypeMove();
    this.AddFilterOptionsIdentification();
  }
  public AddFilterOptionsIdentification() {
    this.filteredOptions =
      this.formHeader.controls.id_number_mov.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );
  }
  public GetGlobalStates() {
    this.stateGlobalService
      .getAllStatesGlobal()
      .subscribe((data: StatesGlobalModel[]) => {
        this.statesGlobal = data;
      });
  }

  emptyTable() {
    while (this.rowsDetails.length !== 0) {
      this.rowsDetails.removeAt(0);
    }
  }
  public deleteRow(i: any) {
    this.rowsDetails.removeAt(i);
    this.filteredOptionsAccount;

    const index = this.filteredOptionsAccount.indexOf(
      this.filteredOptionsAccount[i]
    );
    if (index > -1) {
      this.filteredOptionsAccount.splice(index, 1);
    }

    this.updateView();
  }

  public GetUser() {
    this.userService.getAllUser().subscribe((data) => {
      this.options = data;
    });
  }

  public addRow(d?: DetailMov, noUpdate?: boolean) {
    const row = this.formBuilder.group({
      id_cta_mov: [
        d && d.id_cta_mov ? d.id_cta_mov : null,
        [Validators.required],
      ],
      des_cta_mov: [
        d && d.des_cta_mov ? d.des_cta_mov : null,
        [Validators.required],
      ],
      id_type_account_seat: [
        d && d.id_type_account_seat ? d.id_type_account_seat : null,
      ],

      id_state_cta_mov: [
        d && d.id_state_cta_mov ? d.id_state_cta_mov : null,
        [Validators.required],
      ],
      val_cta_mov: [
        d && d.val_cta_mov ? d.val_cta_mov : null,
        [Validators.required],
      ],
      glo_cta_mov: [
        d && d.glo_cta_mov ? d.glo_cta_mov : null,
        [Validators.required],
      ],
    });

    this.rowsDetails.push(row);

    const outerGroup: FormGroup = this.formDetails.controls
      .dataDetails as FormGroup;

    const innerGroup: FormGroup = outerGroup.controls[
      this.rowsDetails.length - 1
    ] as FormGroup;

    this.filteredOptionsAccount.push(
      innerGroup.controls.id_cta_mov.valueChanges.pipe(
        startWith(""),
        map((value) => this._filterAccount(value))
      )
    );

    if (!noUpdate) {
      this.updateView();
    }
  }

  public updateView() {
    this.dataSourceDetails.next(this.rowsDetails.controls);
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

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.id_number.toLowerCase().includes(filterValue)
    );
  }

  private _filterAccount(value: string): any {
    const filterValue = value.toLowerCase();
    return this.dataAccountPlan.filter((data) =>
      data.id_account.toLowerCase().includes(filterValue)
    );
  }

  public getPosts(element) {
    let nameAccountSelected = this.options.filter((elementFilter) => {
      return elementFilter.id_number === element;
    });
    nameAccountSelected[0]
      ? this.formHeader.controls.name_por_mov.setValue(
          nameAccountSelected[0].name
        )
      : this.formHeader.controls.name_por_mov.setValue("");
  }

  public pressFindVal(element) {
    this.getPosts(element);
  }

  public getPostsNameAccount(element, index) {
    let nameAccountSelected: AccountModel[] = this.dataAccountPlan.filter(
      (elementFilter) => {
        return elementFilter.id_account === element;
      }
    );

    const outerGroup: FormGroup = this.formDetails.controls
      .dataDetails as FormGroup;

    const innerGroup: FormGroup = outerGroup.controls[index] as FormGroup;

    nameAccountSelected[0] && nameAccountSelected[0].id_type_account !== 1
      ? (innerGroup.controls.des_cta_mov.setValue(
          nameAccountSelected[0].name_account
        ),
        innerGroup.controls.id_type_account_seat.setValue(
          nameAccountSelected[0].id_type_account_seat
        ))
      : (innerGroup.controls.des_cta_mov.setValue(""),
        innerGroup.controls.id_type_account_seat.setValue(null));
  }
  public pressFind(element, index) {
    this.getPostsNameAccount(element, index);
  }

  public GetAccounts() {
    this.accountingService.getAllAcount().subscribe((data: AccountModel[]) => {
      data = data.filter((element) => {
        return element.id_state_global === this.statesGlobal[0].id_state_global;
      });
      this.dataAccountPlan = data;
    });
  }

  public GetTypeAccountMov() {
    this.typeAccountingMovService.getAllTypeAcountMov().subscribe((data) => {
      this.typeAccountsMov = data;
    });
  }

  public GetTypesAccountsSeat() {
    this.typeAccountSeatService
      .getAllTypeAcountSeat()
      .subscribe((data: any[]) => {
        this.typesAccountSeat = data;
      });
  }
  public GetTypesAccounts() {
    this.typeAccountService
      .getAllTypeAcount()
      .subscribe((data: TypeAccountModel[]) => {
        this.typesAccount = data;
      });
  }

  public GetTypeMove() {
    this.typeMoveService.getAllTypeMove().subscribe((data: any[]) => {
      this.typeMove = data;
    });
  }

  public CreateForm() {
    this.formHeader = this.formBuilder.group({
      id_type_mov: [{ value: null, disabled: false }],
      date_mov: [{ value: new Date(), disabled: false }, [Validators.required]],
      id_number_mov: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      name_por_mov: [{ value: null, disabled: false }, [Validators.required]],
      check_mov: [{ value: null, disabled: false }],
      user_name_mov: [{ value: "Usuario", disabled: false }],
      details: [{ value: null, disabled: false }],
    });
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  public SaveMov() {
    if (this.formHeader.valid && this.formDetails.valid) {
      if (this.validateTotalVal(this.formDetails.value)) {
        if (this.validateTypeSeat(this.formDetails.value) !== null) {
          this.errorToCreateSeat.state = false;
          this.errorToCreateSeat.message = "";
          let val = this.validateTypeSeat(this.formDetails.value);

          this.formHeader.controls.id_type_mov.setValue(
            this.typeMove[val - 1].id_type_mov
          );
          this.formHeader.controls.details.setValue(this.formDetails.value);

          console.log("EL HEADER", this.formHeader.value);

          // llamar al servicio que registra el movimiento y enviarle los dos objetos
        } else {
          this.errorToCreateSeat.state = true;
          this.errorToCreateSeat.message =
            "No se pudo identificar el asiento contable";
        }
      } else {
        this.errorToCreateSeat.state = true;
        this.errorToCreateSeat.message = "Asiento contable no cuadra";
      }
    } else {
      this.formHeader.markAllAsTouched();
      this.formDetails.markAllAsTouched();
    }
  }

  public validateTypeSeat(form: any): number {
    let isEntry: boolean = false,
      isDischarge: boolean = false,
      isDaily: boolean = false;
    let isBoxandBankHasTo: boolean = false;
    let isBoxandBankToHave: boolean = false;

    form.dataDetails.forEach((element) => {
      if (element.id_type_account_seat) {
        if (
          (element.id_type_account_seat.toString() ===
            this.typesAccountSeat[0].id_type_account_seat.toString() &&
            element.id_state_cta_mov.toString() ===
              this.typeAccountsMov[0].id_type_account_mov.toString()) ||
          (element.id_type_account_seat.toString() ===
            this.typesAccountSeat[1].id_type_account_seat.toString() &&
            element.id_state_cta_mov.toString() ===
              this.typeAccountsMov[0].id_type_account_mov.toString())
        ) {
          isBoxandBankHasTo = true;
        }
        if (
          (element.id_type_account_seat.toString() ===
            this.typesAccountSeat[0].id_type_account_seat.toString() &&
            element.id_state_cta_mov.toString() ===
              this.typeAccountsMov[1].id_type_account_mov.toString()) ||
          (element.id_type_account_seat.toString() ===
            this.typesAccountSeat[1].id_type_account_seat.toString() &&
            element.id_state_cta_mov.toString() ===
              this.typeAccountsMov[1].id_type_account_mov.toString())
        ) {
          isBoxandBankToHave = true;
        }
      }
    });

    if (
      (!isBoxandBankHasTo && !isBoxandBankToHave) ||
      (isBoxandBankHasTo && isBoxandBankToHave)
    ) {
      isDaily = true;
    }
    if (isBoxandBankHasTo && !isBoxandBankToHave) {
      isEntry = true;
    }
    if (!isBoxandBankHasTo && isBoxandBankToHave) {
      isDischarge = true;
    }

    return isEntry
      ? this.typeMove[0].id_type_mov
      : isDischarge
      ? this.typeMove[1].id_type_mov
      : isDaily
      ? this.typeMove[2].id_type_mov
      : null;
  }

  public validateTotalVal(form: any): boolean {
    let resultSeat: number = 0;
    form.dataDetails.forEach((element) => {
      element.id_state_cta_mov ===
      this.typeAccountsMov[0].id_type_account_mov.toString()
        ? (resultSeat = resultSeat + element.val_cta_mov)
        : (resultSeat = resultSeat - element.val_cta_mov);
    });

    return resultSeat === 0 ? true : false;
  }
}
