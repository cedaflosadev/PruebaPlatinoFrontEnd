export class TypeAccountModel {
  id_type_account: number;
  desc_type_account: string;

  clear() {
    this.id_type_account = null;
    this.desc_type_account = null;
  }
}
