export class ClientsModel {
  _id: string;
  address: string;
  birthday: string;
  email: string;
  name: string;
  number_id: string;
  phone: string;

  clear() {
    this._id = "";
    this.address = "";
    this.birthday = "";
    this.email = "";
    this.name = "";
    this.number_id = "";
    this.phone = "";
  }
}
