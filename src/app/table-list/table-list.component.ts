import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { AccountModel } from "app/core/models/account.model";
import { filterTableAccounts } from "app/core/models/filter-data-accounting.model";
import { filterDataUser } from "app/core/models/filter-data-user.model";
import { TypeAccountModel } from "app/core/models/types-account.model";
import { UserModel } from "app/core/models/user.model";
import { AccountingsService } from "app/core/services/accounting.service";
import { AttentionsService } from "app/core/services/attentions.service";
import { CredentialService } from "app/core/services/credential.service";
import { RoleService } from "app/core/services/role.service";
import { TypeAccountingService } from "app/core/services/type-account.service";
import { UserTypeService } from "app/core/services/user-type.service";
import { UserService } from "app/core/services/user.service";
import { AdminLayoutComponent } from "app/layouts/admin-layout/admin-layout.component";

@Component({
  selector: "app-table-list",
  templateUrl: "./table-list.component.html",
  styleUrls: ["./table-list.component.css"],
})
export class TableListComponent implements OnInit {
  public formCreateUser: FormGroup;
  public formCreateCredential: FormGroup;
  public showTypeRol: boolean;
  public formCreateUserErrors: any = {};
  public formCreateCredentialErrors: any = {};
  public selectedTab: number;
  public dataSource: MatTableDataSource<UserModel> = new MatTableDataSource();
  public formFilterData: FormGroup;
  public attentions = [];
  public typesUsers: any[];
  public typeRole: any[];
  public filteredValues = {
    id_number: "",
    id_user_type: "",
    name: "",
  };

  public displayedColumns: string[] = [
    "id_number",
    "name",
    "email",
    "phone",
    "edit",
    "delete",
  ];
  constructor(
    public attentionServices: AttentionsService,
    private accountingService: AccountingsService,
    private formBuilder: FormBuilder,
    private userType: UserTypeService,
    private roleType: RoleService,
    public father: AdminLayoutComponent,
    public userService: UserService,
    public credentialService: CredentialService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.GetAllUser();
    this.GetTypesUsers();
    this.GetRole();
    this.CreateForm();
  }
  public cleanForm(form: FormGroup[]) {
    form.forEach((element) => {
      element.reset();
    });
  }

  public SelectTypeUser(event: any) {
    event === this.typesUsers[0].id_user_type.toString()
      ? ((this.showTypeRol = true),
        this.formCreateCredential.controls.id_role.setValidators(
          Validators.required
        ),
        this.formCreateCredential.controls.id_role.updateValueAndValidity())
      : ((this.showTypeRol = false),
        this.formCreateCredential.controls.id_role.setValue(null),
        this.formCreateCredential.controls.id_role.clearValidators(),
        this.formCreateCredential.controls.id_role.updateValueAndValidity());
  }

  public GetAllUser() {
    this.userService.getAllUser().subscribe((data) => {
      this.dataSource.data = data;
    });
  }
  public GetRole() {
    this.roleType.getAllRole().subscribe((data) => {
      this.typeRole = data;
    });
  }
  public CreateForm() {
    this.formCreateUser = this.formBuilder.group({
      id_number: [{ value: null, disabled: false }, [Validators.required]],
      name: [{ value: null, disabled: false }, [Validators.required]],
      address: [{ value: null, disabled: false }, [Validators.required]],
      birthday: [{ value: null, disabled: false }, [Validators.required]],
      id_user_type: [{ value: null, disabled: false }, [Validators.required]],
      _id_credentials: [{ value: null, disabled: false }],
    });

    this.formCreateCredential = this.formBuilder.group({
      password: [{ value: null, disabled: false }],
      email: [{ value: null, disabled: false }, [Validators.required]],
      username: [{ value: null, disabled: false }],
      phone: [{ value: null, disabled: false }, [Validators.required]],
      id_role: [{ value: null, disabled: false }],
    });

    this.formFilterData = this.formBuilder.group({
      id_number: [{ value: null, disabled: false }],
      id_user_type: [{ value: null, disabled: false }],
      name: [{ value: null, disabled: false }],
    });
    this.formFilterData.controls.id_number.valueChanges.subscribe(
      (nameFilterValue) => {
        this.filteredValues.id_number = nameFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      }
    );
    this.formFilterData.controls.id_user_type.valueChanges.subscribe(
      (positionFilterValue) => {
        this.filteredValues.id_user_type = positionFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      }
    );
    this.formFilterData.controls.name.valueChanges.subscribe((newfilter) => {
      this.filteredValues.name = newfilter;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  public customFilterPredicate() {
    const myFilterPredicate = (
      data: filterDataUser,
      filter: string
    ): boolean => {
      let searchString: any = JSON.parse(filter);
      let filterState: any;
      filterState =
        data.id_number
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.id_number.toString().trim().toLowerCase()) !==
          -1 &&
        data.id_user_type
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(
            searchString.id_user_type.toString().trim().toLowerCase()
          ) !== -1 &&
        data.name
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.name.toString().trim().toLowerCase()) !== -1;

      return filterState;
    };

    return myFilterPredicate;
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
  public GetTypesUsers() {
    this.userType.getAllTypeUser().subscribe((data: any[]) => {
      this.typesUsers = data;
    });
  }
  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  public CreateAccount() {
    if (this.formCreateUser.valid && this.formCreateCredential.valid) {
      this.credentialService
        .createCredential(this.formCreateCredential.value)
        .subscribe((data) => {
          if (data.response) {
            this.formCreateUser.controls._id_credentials.setValue(
              data.response
            );
            this.userService
              .createUser(this.formCreateUser.value)
              .subscribe((data) => {
                this.openSnackBar(data.mensaje, "Continuar");
                this.GetAllUser();
              });
          }
        });
    } else {
      this.formCreateUser.markAllAsTouched();
      this.formCreateCredential.markAllAsTouched();
    }
  }
}
