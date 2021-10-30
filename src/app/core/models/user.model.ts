export class UserModel {
  email: string;
  id_number: string;
  name: string;
  phone: string;
  id_user_type: string;

  clear() {
    this.email = null;
    this.id_number = null;
    this.name = null;
    this.phone = null;
    this.id_user_type = null;
  }
}
