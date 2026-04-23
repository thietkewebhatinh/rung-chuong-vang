# 🔔 Rung Chuông Vàng - Trường Mầm non Bắc Hà

Ứng dụng trò chơi trắc nghiệm vui nhộn, đầy màu sắc được thiết kế đặc biệt dành riêng cho trẻ em mầm non. Dự án bao gồm hai phiên bản ngôn ngữ giúp các bé vừa học vừa chơi một cách hiệu quả và sinh động.

## 🌟 Tính Năng Nổi Bật

- **🎯 Hai Ngôn Ngữ Tích Hợp:**
  - **🇻🇳 Tiếng Việt (Khối 5 tuổi)**: Bộ 54 câu hỏi phủ sóng các chủ đề như Toán học, Tự nhiên, Xã hội, Khoa học, Giao thông. Hỗ trợ âm thanh thu âm giọng người thật để đọc câu hỏi và đáp án, mang đến sự gần gũi và hấp dẫn (khắc phục hoàn toàn lỗi khó nghe của trình duyệt với TTS tiếng Việt).
  - **🇬🇧 Tiếng Anh (Pikachu Edition)**: Bộ 30 câu hỏi cơ bản về Màu sắc, Con vật, Đồ vật gia đình, Số đếm. Sử dụng công nghệ đọc Text-to-Speech (TTS) chuẩn tiếng Anh.
- **🎮 Hai Chế Độ Chơi:**
  - **Luyện tập:** Chơi tự do, chọn câu bất kỳ qua hệ thống lưới (Grid), không áp lực thời gian, thoải mái trải nghiệm và sửa sai.
  - **Thi đấu:** Tự động dẫn truyện và di chuyển lần lượt từ câu đầu đến cuối, có đồng hồ đếm ngược 5 giây, hệ thống chấm điểm tổng kết và hiển thị đánh giá thành tích phân tầng kèm hiệu ứng pháo hoa chúc mừng ở cuối game.
- **✨ Trải Nghiệm Đa Phương Tiện Thực Tế:**
  - Hỗ trợ xử lý các câu hỏi Media đặc biệt như: Nghe đoạn nhạc cụ đoán tên (Câu 43), Nghe bài hát (Câu 42), Xem video vui nhộn (Gummy Bear), hoặc nghe tiếng kêu động vật (Tiếng Sư tử).
  - Hoạt ảnh CSS động hấp dẫn cuốn hút trẻ thơ (Màn hình nhấp nháy chuyển màu, Hiệu ứng sấm sét, Nút bấm hiệu ứng nhấn, Pháo hoa rơi).
- **📱 PWA (Progressive Web App):** Hỗ trợ "Cài đặt App" trực tiếp lên màn hình chính điện thoại, máy tính bảng của phụ huynh hay nhà trường, giúp truy cập vào game offline nhẹ nhàng mà không cần thông qua AppStore/GooglePlay.

## 🚀 Công Nghệ Sử Dụng

- **Core System:** [Hono](https://hono.dev/) v4 chạy cấu trúc Router kết hợp JSX-renderer.
- **Bundler:** [Vite](https://vitejs.dev/) v6 với plugins chạy dev-server và build hệ thống nhanh chóng.
- **Giao Diện Frontend:** Giao diện được tạo hoàn toàn bằng các template HTML/CSS Vanilla kết hợp TailwindCSS nhẹ (qua CDN). Mã nguồn JavaScript ở phía client được tối ưu hoá trực tiếp trên trang, giúp ứng dụng có thời gian tải siêu tốc và khả năng phản hồi mượt mà trên nhiều thiết bị cấu hình thấp.
- **Hosting / Deploy:** Tối ưu hóa mạnh mẽ để sẵn sàng biên dịch (build) dưới dạng Cloudflare Pages bằng Wrangler CLI.

## 🛠 Hướng Dẫn Cài Đặt Và Chạy Local

*Yêu cầu đã cài đặt **Node.js** (phiên bản 18+).*

```bash
# 1. Cài đặt các thư viện cần thiết (Dependencies)
npm install

# 2. Khởi động môi trường phát triển (Local Server)
npm run dev

# Mở trình duyệt ở địa chỉ báo hiển thị trong terminal (thường là http://localhost:5173/)
```

## 🌐 Hướng Dẫn Triển Khai Lên Cloudflare Pages

Mã nguồn rỗng này được tinh chỉnh để bạn có thể host hoàn toàn miễn phí trên [Cloudflare Pages](https://pages.cloudflare.com/). 

### Cách 1: Nhanh gọn — Sử dụng trình tải Upload của Cloudflare (Không cần cài đặt CLI)
1. Mở cửa sổ terminal, chạy lệnh `npm run build`. Điều này sẽ tạo một thư mục mang tên `dist/`.
2. Vì Cloudflare upload nội dung tĩnh (static) nên bạn cần nhúng thêm thư mục ảnh và tiếng, copy bằng tay thư mục `public/assets` thả thẳng vào bên trong `dist` (đường dẫn tạo thành `dist/assets`).
3. Nén nguyên thư mục `dist` thành `rungchuongvang.zip`.
4. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/) → Chọn **Pages**.
5. Nhấn **"Create a project"** → Chọn tab **"Direct Upload"** → Chọn file zip và hoàn tất.

### Cách 2: Chuyên nghiệp — Sử dụng Wrangler CLI

```bash
# Đăng nhập môi trường Cloudflare
npx wrangler login

# Build mã code ra thư mục /dist và chuyển resources vào
npm run build
cp -r public/assets dist/

# Khởi tạo và Deploy tự động lên Cloudflare
npx wrangler pages project create rung-chuong-vang --production-branch main
npx wrangler pages deploy dist --project-name rung-chuong-vang
```

## 📁 Cấu Trúc Mã Nguồn

- `src/index.tsx`: Trái tim của hệ thống. Chứa toàn bộ Backend Routing cùng mã Frontend logic, style HTML, biến hệ thống game và các hàm JS cho Tiếng Anh / Tiếng Việt. Toàn bộ logic hiển thị đều nằm ở đây.
- `public/assets/`: Khu vực lưu trữ tài nguyên đa phương tiện như ảnh câu hỏi `vi/cau1.png`, file âm thanh đọc câu `vi/cau1.wav`, nhạc nền, video, và icon. Toàn bộ dữ liệu nằm tĩnh ở đây.
- `package.json` & `vite.config.ts` & `wrangler.jsonc`: File cấu hình nền tảng dự án.

## 📋 Ghi Chú Về Hệ Thống Âm Thanh (Audio)

- Ở phiên bản tiếng Anh, các câu hỏi dùng thư viện `window.speechSynthesis` (trình đọc văn bản có sẵn trên trình duyệt web) để tự phát âm vì âm Anh-Mỹ rất chuẩn trên Chrome/Safari/Edge.
- Tại bộ **54 câu tiếng Việt khối 5 tuổi**, hệ thống được ánh xạ động để mở file thu âm `.wav` do giáo viên đọc.
  - Ví dụ CÂU 01: Câu hỏi là `/assets/audio/vi/cau1.wav`, file đáp án là `/assets/audio/vi/cau1_ans.wav`.
  - Nếu trường muốn thay Giọng đọc nam/nữ, chỉ cần thay thế đúng tên file vào thư mục `/public/assets/audio/vi/` là có hiệu lực ngay lập tức. Cực kỳ dễ chỉnh sửa mà không cần làm xước mã nguồn.

---
*Dự án lấy mục tiêu giáo dục làm đầu, thiết kế bằng tình yêu nhằm mang lại tiếng cười và niềm vui cho các thiên thần nhỏ độ tuổi mầm non! 🎈*
