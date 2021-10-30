export class DetailMov {
  id_cta_mov: string;
  des_cta_mov: string;
  id_state_cta_mov: number;
  val_cta_mov: number;
  glo_cta_mov: string;
  id_type_account_seat: number;

  clear() {
    this.id_cta_mov = null;
    this.des_cta_mov = null;
    this.id_state_cta_mov = null;
    this.val_cta_mov = null;
    this.glo_cta_mov = null;
    this.id_type_account_seat = null;
  }
}
