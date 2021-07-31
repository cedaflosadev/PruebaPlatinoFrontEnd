import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AttentionsService } from "app/core/services/attentions.service";

@Component({
  selector: "app-table-list",
  templateUrl: "./table-list.component.html",
  styleUrls: ["./table-list.component.css"],
})
export class TableListComponent implements OnInit {
  public dataSource;
  public attentions = [];

  displayedColumns: string[] = ["id_client", "description", "attention_date"];
  constructor(public attentionServices: AttentionsService) {}

  ngOnInit() {
    this.GetAttentions();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public GetAttentions() {
    this.attentionServices.getAttentions().subscribe((data) => {
      this.attentions = data.data;
      const ascending: any = this.attentions.sort((a, b) => (a > b ? 1 : -1));
      this.dataSource = new MatTableDataSource(ascending);
    });
  }
}
