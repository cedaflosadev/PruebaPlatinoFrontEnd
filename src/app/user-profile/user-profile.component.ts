import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { QuotesModel } from "app/core/models/quotes.model";
import { AdminLayoutComponent } from "app/layouts/admin-layout/admin-layout.component";
import { MatTableDataSource } from "@angular/material/table";
import { QuotesService } from "app/core/services/quotes.service";
import { ClientService } from "app/core/services/client.service";
import { MatDialog } from "@angular/material/dialog";
import { ModalDeleteUserComponent } from "app/partials/modal-delete-user/modal-delete-user.component";
import { ModalEditQuoteComponent } from "app/partials/modal-edit-quote/modal-edit-quote.component";
import { ModalAttentQuoteComponent } from "app/partials/modal-attent-quote/modal-attent-quote.component";
import { AttentionsService } from "app/core/services/attentions.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  public formSearch: FormGroup;
  public formScheduleQuote: FormGroup;
  public quotes = [];
  public clients = [];
  public formScheduleQuoteErrors: QuotesModel = new QuotesModel();

  displayedColumns: string[] = [
    "_id",
    "date_quote",
    "hour_quote",
    "state",
    "id_client",
    "edit",
    "delete",
    "atent",
  ];
  public dataSource;
  public selectedDate: Date | null = null;
  public selectedHour: String | null = null;
  public hourAvaibles: string[] = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  constructor(
    public father: AdminLayoutComponent,
    private formBuilder: FormBuilder,
    private quotesService: QuotesService,
    private clientService: ClientService,
    private attentionsServices: AttentionsService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.CreateForm();
    this.GetQuotes();
    this.GetAllClients();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public CreateForm() {
    this.formSearch = this.formBuilder.group({
      number_id: [
        { value: null, disabled: false },
        [Validators.required, this.father.ValidIDFormControl],
      ],
    });

    this.formScheduleQuote = this.formBuilder.group({
      date_quote: [{ value: null, disabled: false }, [Validators.required]],
      hour_quote: [{ value: null, disabled: false }, [Validators.required]],
      state: [{ value: "P", disabled: false }, [Validators.required]],
      id_client: [
        { value: null, disabled: false },
        [Validators.required, this.father.ValidIDFormControl],
      ],
    });
  }

  public GetAllClients() {
    this.clientService.getClients().subscribe((data) => {
      this.clients = data.data;
    });
  }

  public SelectedDate(date: any) {
    this.selectedDate = date;
    this.formScheduleQuote.controls["date_quote"].setValue(this.selectedDate);
  }

  public SelectHour(hour: any) {
    console.log(hour);
    this.selectedHour = hour;
    this.formScheduleQuote.controls["hour_quote"].setValue(this.selectedHour);
  }

  public GetQuotes() {
    this.quotesService.getQuotes().subscribe((data) => {
      console.log(data);
      this.quotes = data.data;

      this.dataSource = new MatTableDataSource(this.quotes);
    });
  }

  public EditQuotes(element: QuotesModel) {
    const dialogRef3 = this.dialog.open(ModalEditQuoteComponent, {
      disableClose: true,
      maxWidth: "600px",
      data: element,
    });
    dialogRef3.afterClosed().subscribe((result) => {
      console.log(result);
      if (result !== false) {
        this.quotesService.updateQuotes(result).subscribe((data) => {
          if (data) {
            console.log(data);
            // alert(data.mensaje);
            this.openSnackBar(data.mensaje, "Continuar");
          }
          if (data.transaccion) {
            this.GetQuotes();
          }
        });
      }
    });
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  public DeleteQuotes(element: QuotesModel) {
    this.quotesService.deleteQuotes(element).subscribe((data) => {
      if (data) {
        // alert(data.mensaje);
        this.openSnackBar(data.mensaje, "Continuar");
      }
      if (data.transaccion) {
        this.GetQuotes();
      }
    });
  }

  public CreateQuotes() {
    if (this.formScheduleQuote.valid) {
      this.quotesService
        .createQuotes(this.formScheduleQuote.value)
        .subscribe((data) => {
          if (data) {
            // alert(data.mensaje);
            this.openSnackBar(data.mensaje, "Continuar");
          }
          if (data.transaccion) {
            this.GetQuotes();
          }
        });
    } else {
      this.formScheduleQuote.markAllAsTouched();
    }
  }

  public CreateAttention(element) {
    const dialogRef = this.dialog.open(ModalAttentQuoteComponent, {
      disableClose: true,
      maxWidth: "600px",
      data: element,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== false) {
        this.attentionsServices.createAttentions(result).subscribe((data) => {
          if (data.transaccion) {
            console.log(result.id_quote);
            this.quotesService
              .updateStateQuotes({ id_quote: result.id_quote })
              .subscribe((data1) => {
                if (data1) {
                  // alert(data1.mensaje);
                  this.openSnackBar(data1.mensaje, "Continuar");
                }
                if (data1.transaccion) {
                  this.GetQuotes();
                }
              });
          }
        });
      }
    });

    console.log(element);
  }
}
