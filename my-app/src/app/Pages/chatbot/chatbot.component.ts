import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isChatOpen = false; // Trạng thái mở/đóng chatbot
  userMessage: string = '';
  messages: { sender: string, text: string, time: string }[] = [
    { sender: 'bot', text: 'Xin chào quý khách', time: this.getCurrentTime() },
    { sender: 'bot', text: 'Trợ lý ảo có thể cung cấp thông tin về sản phẩm phù hợp với nhu cầu.', time: this.getCurrentTime() }
  ];

  constructor(private http: HttpClient) {}

  // Hàm mở/đóng chatbot
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  // Hàm gửi tin nhắn
  sendMessage() {
    if (this.userMessage.trim() !== '') {
      // Thêm tin nhắn của người dùng
      this.messages.push({ sender: 'user', text: this.userMessage, time: this.getCurrentTime() });

      // Gọi API để nhận phản hồi từ chatbot
      this.sendMessageToAPI(this.userMessage).subscribe(
        response => {
          this.messages.push({ sender: 'bot', text: response.response, time: response.time });
          this.scrollToBottom(); // Cuộn xuống cuối sau khi nhận phản hồi từ bot
        },
        error => {
          console.error('Có lỗi xảy ra khi gọi API:', error);
          this.messages.push({ sender: 'bot', text: 'Xin lỗi, hiện tại không thể trả lời. Vui lòng thử lại sau.', time: this.getCurrentTime() });
          this.scrollToBottom(); // Cuộn xuống cuối sau khi có lỗi
        }
      );

      this.userMessage = ''; // Xóa nội dung sau khi gửi
      this.scrollToBottom(); // Cuộn xuống cuối sau khi người dùng gửi tin nhắn
    }
  }

  // Hàm gửi tin nhắn đến API (tích hợp với FastAPI)
  sendMessageToAPI(message: string): Observable<any> {
    console.log(message)
    return this.http.post<any>('http://127.0.0.1:8000/chat', { message: message });
  }

  // Hàm lấy thời gian hiện tại
  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Hàm tự động cuộn xuống tin nhắn cuối
  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll failed:', err);
    }
  }

  // AfterViewChecked để luôn cuộn sau mỗi lần view được cập nhật
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
}
