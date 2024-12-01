import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // User API 
  apiUrl: string = "http://localhost:3000/users";

  constructor(private _http: HttpClient) { }


   // Lấy tất cả người dùng
   getUsers(): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl);
  }

  // Lấy người dùng theo ID
  getUserById(id: string): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Thêm người dùng mới
  addUser(user: any): Observable<any> {
    return this._http.post<any>(this.apiUrl, user);
  }

  // Cập nhật người dùng
  updateUser(id: string, user: Partial<any>): Observable<any> {
    return this._http.put<any>(`${this.apiUrl}/update/${id}`, user);
  }

  // Xóa người dùng
  deleteUser(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }


}
