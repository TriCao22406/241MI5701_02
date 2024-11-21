import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private jsonUrl = 'assets/blog/BlogTitle.json';
  private blogUrl = 'assets/blog/blog.json';

  constructor(private http: HttpClient) { }

  getBlogPosts(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }  
  
  getBlogDetail(): Observable<any> {
    return this.http.get<any>(this.blogUrl);
  }


}
