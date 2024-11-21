import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blogContent: any; // Dữ liệu bài blog hiện tại
  relatedPosts: any[] = []; // Danh sách bài viết liên quan

  constructor(
    private route: ActivatedRoute, // Dùng để lấy `id` từ URL
    private http: HttpClient // HttpClient để gọi API
  ) {}

  ngOnInit(): void {
    // Lắng nghe sự thay đổi của tham số `id`
    this.route.paramMap.subscribe((params) => {
      const blogId = Number(params.get('id')); // Lấy id từ URL và chuyển sang số

      // Lấy dữ liệu bài viết hiện tại
      this.http.get('/assets/blog/blog.json').subscribe((data: any) => {
        this.blogContent = data.find((blog: any) => blog.id === blogId);
      });

      // Lấy dữ liệu sidebar (các bài viết liên quan)
      this.http.get<any[]>('/assets/blog/BlogTitle.json').subscribe((data) => {
        this.relatedPosts = data.filter((post: any) => post.id !== blogId);
      });
    });
  }
}
