export class QuotesModel {
  _id: string;
  date_quote: string;
  hour_quote: string;
  state: string;
  id_client: string;

  clear() {
    this._id = "";
    this.date_quote = "";
    this.hour_quote = "";
    this.state = "";
    this.id_client = "";
  }
}
