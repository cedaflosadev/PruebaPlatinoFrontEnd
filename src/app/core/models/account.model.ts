export class AccountModel {
  _id_accounting: string;
  id_account: string;
  name_account: string;
  id_type_account: number;
  id_state_global?: number;
  id_type_account_seat: number;

  clear() {
    this._id_accounting = null;
    this.id_account = null;
    this.name_account = null;
    this.id_type_account = null;
    this.id_state_global = null;
  }
}
