import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BlogService } from '../../../service/blog.service';

interface BlogPost {
  "id": number;
  "Title": string;
  "Intro": string;
  "TitleImage": string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.blogService.getBlogPosts().subscribe(
      (posts) => (this.blogPosts = posts),
      (error) => console.error('Có lỗi khi tải dữ liệu:', error)
    );
  }

  // Điều hướng tới chi tiết bài viết
  navigateToPost(postId: number): void {
    this.router.navigate(['/Blog', postId]);
  }

}