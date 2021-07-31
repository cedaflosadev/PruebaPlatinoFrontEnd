import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private BASE_URL = "http://localhost:4000/clients";

  constructor(private http: HttpClient) {}

  getClients(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/list-clients`);
  }

  getOneClient(cedula): Observable<any> {
    return this.http.get(`${this.BASE_URL}/list-client/${cedula}`);
  }

  createClient(client: object): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create-client`, client);
  }

  updateClient(client): any {
    return this.http.post(`${this.BASE_URL}/update-client`, client);
  }

  deleteClient(client): any {
    return this.http.post(`${this.BASE_URL}/delete-client`, client);
  }
}
