# 📚 TÀI LIỆU HƯỚNG DẪN TRẢ LỜI BAN GIÁM KHẢO

## Dự án: Hệ thống Quản lý Lớp học Thông minh

### Tác giả: Nguyễn Văn Quốc Anh & Ngô Nguyễn Kim Ngân – Lớp 9/3

> **Mục đích:** Tài liệu này giúp các bạn hiểu rõ từng từ ngữ chuyên ngành, từng đoạn code trong dự án để tự tin trả lời mọi câu hỏi của ban giám khảo.

---

## 📖 MỤC LỤC

1. [Từ điển thuật ngữ chuyên ngành](#-từ-điển-thuật-ngữ-chuyên-ngành)
2. [Giải thích kiến trúc tổng thể](#-giải-thích-kiến-trúc-tổng-thể)
3. [Giải thích chi tiết từng file code](#-giải-thích-chi-tiết-từng-file-code)
   - [Google Apps Script (backend)](#-google-apps-script-backend)
   - [script.js (frontend logic)](#-scriptjs--bộ-não-của-trang-web)
   - [style.css (giao diện)](#-stylecss--bộ-áo-của-trang-web)
4. [Câu hỏi thường gặp & cách trả lời](#-câu-hỏi-thường-gặp--cách-trả-lời)

---

## 📝 TỪ ĐIỂN THUẬT NGỮ CHUYÊN NGÀNH

### Nhóm A – Kiến trúc & Hệ thống

| Thuật ngữ                                   | Giải thích đơn giản                                                                                                                                                                                                   |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Web App / Ứng dụng Web**                  | Phần mềm chạy trực tiếp trên trình duyệt (Chrome, Firefox...) mà không cần cài đặt. Giống như Facebook, YouTube – bạn chỉ cần mở link là dùng được.                                                                   |
| **SPA – Single-Page Application**           | "Ứng dụng một trang". Toàn bộ website nằm trong 1 file HTML duy nhất. Khi bấm vào mục khác, trang không tải lại từ đầu mà chỉ thay đổi nội dung bên trong – giúp tốc độ rất nhanh, mượt mà như app điện thoại.        |
| **Client – Server (Kiến trúc khách – chủ)** | Mô hình giao tiếp 2 phía: **Client** (trình duyệt của người dùng) gửi yêu cầu; **Server** (máy chủ) nhận yêu cầu, xử lý và trả kết quả về. Giống như khách hàng gọi món (Client) và nhà bếp nấu rồi mang ra (Server). |
| **Frontend (Giao diện)**                    | Phần người dùng nhìn thấy và tương tác trực tiếp: màu sắc, nút bấm, bảng biểu... Được xây dựng bằng HTML, CSS, JavaScript.                                                                                            |
| **Backend (Máy chủ xử lý)**                 | Phần hoạt động "bên trong", người dùng không thấy. Nó nhận yêu cầu, đọc/ghi dữ liệu và trả kết quả. Dự án này dùng Google Apps Script làm backend.                                                                    |
| **Database (Cơ sở dữ liệu)**                | Nơi lưu trữ tất cả thông tin có tổ chức. Dự án này dùng **Google Sheets** như một cơ sở dữ liệu – mỗi tab (trang tính) là một "bảng dữ liệu".                                                                         |
| **Hosting (Lưu trữ website)**               | Dịch vụ cho thuê máy chủ để đặt file website, giúp mọi người trên internet truy cập được. Dự án dùng **Vercel** – hoàn toàn miễn phí.                                                                                 |
| **Serverless (Không cần máy chủ riêng)**    | Mô hình lập trình không cần tự quản lý máy chủ. Google Apps Script chạy tự động trên cơ sở hạ tầng của Google khi có yêu cầu gửi đến.                                                                                 |
| **CDN – Content Delivery Network**          | Mạng lưới server toàn cầu lưu trữ các file dùng chung (thư viện CSS, JS). Khi dùng TailwindCSS qua CDN, trình duyệt tải file từ server gần nhất – nhanh hơn.                                                          |

---

### Nhóm B – Ngôn ngữ lập trình & Công nghệ

| Thuật ngữ                        | Giải thích đơn giản                                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **HTML5**                        | Ngôn ngữ tạo **cấu trúc** trang web. Giống như bộ xương của cơ thể – nó định nghĩa "đây là tiêu đề", "đây là bảng", "đây là nút bấm".         |
| **CSS (Cascading Style Sheets)** | Ngôn ngữ tạo **giao diện đẹp**. Giống như quần áo – nó quyết định màu sắc, kích thước, font chữ, hiệu ứng động...                             |
| **JavaScript (JS)**              | Ngôn ngữ tạo **tính năng và logic**. Giống như hệ thần kinh – nó xử lý khi người dùng bấm nút, tải dữ liệu, tính toán...                      |
| **Vanilla JavaScript**           | JavaScript "thuần túy", không dùng thư viện nào thêm (không dùng React, Vue...). Code nhỏ gọn, tải cực nhanh.                                 |
| **TailwindCSS**                  | Thư viện CSS tiện ích. Thay vì viết nhiều dòng CSS, chỉ cần thêm tên class như `text-blue-500` hay `p-4` vào thẻ HTML là có hiệu ứng ngay.    |
| **Google Apps Script**           | Ngôn ngữ lập trình của Google (dựa trên JavaScript) chạy trên các dịch vụ Google. Dự án dùng nó để đọc/ghi dữ liệu từ Google Sheets.          |
| **marked.js**                    | Thư viện JavaScript chuyển **Markdown** (văn bản có ký hiệu đặc biệt như `**in đậm**`, `# Tiêu đề`) sang HTML đẹp để hiển thị phần trợ lý AI. |
| **Markdown**                     | Ngôn ngữ đánh dấu văn bản nhẹ. Dùng ký hiệu đơn giản để tạo tiêu đề (`# Tiêu đề`), in đậm (`**từ**`), bảng biểu (`\| cột 1 \| cột 2 \|`).     |

---

### Nhóm C – Giao tiếp & Dữ liệu

| Thuật ngữ                                   | Giải thích đơn giản                                                                                                                                                                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API (Application Programming Interface)** | "Cổng kết nối" giữa các phần mềm. Giống như ổ cắm điện – có chuẩn chung để thiết bị nào cũng cắm vào được. Website dùng API để "hỏi" Google Sheets lấy dữ liệu.                                                                           |
| **HTTP Request (Yêu cầu HTTP)**             | Tin nhắn gửi từ trình duyệt đến server qua mạng internet. Có 2 loại chính trong dự án: **GET** (lấy dữ liệu) và **POST** (gửi dữ liệu).                                                                                                   |
| **GET Request**                             | Yêu cầu **lấy** dữ liệu từ server. Dự án dùng GET để tải toàn bộ dữ liệu từ Google Sheets khi trang web khởi động.                                                                                                                        |
| **POST Request**                            | Yêu cầu **gửi** dữ liệu lên server. Dự án dùng POST khi người dùng điền form góp ý – dữ liệu được ghi vào Google Sheets.                                                                                                                  |
| **JSON (JavaScript Object Notation)**       | Định dạng dữ liệu văn bản, dễ đọc cho cả máy tính lẫn con người. Giống như danh sách mua hàng có cấu trúc rõ ràng: `{"name": "Quốc Anh", "class": "9/3"}`. Google Apps Script trả về JSON, JavaScript đọc JSON để hiển thị lên trang web. |
| **fetch() API**                             | Hàm JavaScript dùng để gửi HTTP Request và nhận phản hồi. Thay thế cách cũ (XMLHttpRequest) bằng cú pháp gọn gàng hơn nhiều.                                                                                                              |
| **async / await**                           | Từ khóa JavaScript xử lý các tác vụ mất thời gian (như chờ dữ liệu từ internet) mà không làm đơ trang web. `async` đánh dấu hàm có tác vụ chờ; `await` bảo "dừng tại đây, chờ có kết quả rồi làm tiếp".                                   |
| **Promise (Lời hứa)**                       | Đối tượng JavaScript đại diện cho kết quả của tác vụ bất đồng bộ trong tương lai. `fetch()` trả về Promise – tức là "tôi hứa sẽ có dữ liệu, nhưng cần chờ chút".                                                                          |
| **HTTPS**                                   | Phiên bản bảo mật của HTTP. Dữ liệu được mã hóa khi truyền qua mạng – không ai "nghe lén" được. Website dùng HTTPS để bảo vệ thông tin người dùng.                                                                                        |

---

### Nhóm D – Giao diện & Thiết kế

| Thuật ngữ                       | Giải thích đơn giản                                                                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Responsive Design**           | Thiết kế "co giãn" – giao diện tự điều chỉnh để hiển thị đẹp trên mọi kích cỡ màn hình: điện thoại, máy tính bảng, máy tính.                                                                                              |
| **Glassmorphism**               | Xu hướng thiết kế tạo hiệu ứng "kính mờ" – nền trong suốt có độ mờ, viền mỏng. Tạo cảm giác hiện đại, cao cấp. Dự án dùng cho thanh điều hướng (navbar).                                                                  |
| **DOM (Document Object Model)** | Cách trình duyệt tổ chức file HTML thành cây cấu trúc để JavaScript có thể tìm và chỉnh sửa từng phần. Khi JS dùng `document.getElementById("teacher-name")`, nó đang "tìm trong cây DOM" để cập nhật nội dung.           |
| **Micro-animations**            | Hiệu ứng chuyển động nhỏ, tinh tế khi người dùng tương tác: hover làm nổi card lên, nút bấm thu lại khi click, phần mới hiện dần khi cuộn trang.                                                                          |
| **Bento Grid**                  | Kiểu bố cục lưới với các ô có kích thước khác nhau, giống hộp cơm Nhật Bản (bento). Dự án dùng cho phần bộ sưu tập ảnh – ảnh chính to chiếm 2 hàng, ảnh phụ nhỏ hơn.                                                      |
| **Lightbox**                    | Hiệu ứng xem ảnh toàn màn hình: khi click vào ảnh, ảnh phóng lớn và nền tối lại, có nút chuyển ảnh trái/phải hoặc dùng phím mũi tên.                                                                                      |
| **Dark Mode Section**           | Một vùng trên trang web có nền tối (màu đêm) xen giữa các vùng sáng, tạo sự đối lập thị giác và nhấn mạnh nội dung quan trọng.                                                                                            |
| **IntersectionObserver**        | Công cụ JavaScript theo dõi khi phần tử nào đó xuất hiện trong vùng nhìn thấy của màn hình. Dự án dùng để kích hoạt hiệu ứng "hiện dần" (`.reveal`) khi người dùng cuộn đến phần đó.                                      |
| **CSS Variables (Biến CSS)**    | Giá trị được đặt tên một lần ở đầu file (`:root`), rồi dùng lại ở nhiều nơi. Ví dụ: `--primary-blue: #0056b3` – sau đó dùng `var(--primary-blue)` ở bất kỳ đâu. Giúp thay đổi màu toàn bộ trang chỉ bằng 1 lần chỉnh sửa. |
| **z-index**                     | Thứ tự lớp (độ ưu tiên hiển thị) khi các phần tử chồng lên nhau. z-index cao hơn = hiển thị trên cùng. Header có z-index: 1000; lightbox có z-index: 9999 để luôn đứng trên mọi thứ.                                      |

---

### Nhóm E – Tính năng đặc biệt

| Thuật ngữ                              | Giải thích đơn giản                                                                                                                                             |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pagination (Phân trang)**            | Kỹ thuật chia danh sách dài thành nhiều trang nhỏ để tránh hiển thị tất cả cùng lúc gây nặng trang. Bấm "Trước/Sau" để chuyển trang.                            |
| **Render (Vẽ/Hiển thị)**               | Quá trình JavaScript lấy dữ liệu thô (JSON) và tạo ra HTML để hiển thị lên trang. Ví dụ: `renderStudentPage()` tạo ra các hàng `<tr>` trong bảng học sinh.      |
| **Template Literal (Chuỗi mẫu)**       | Cú pháp JavaScript dùng dấu backtick `` ` `` thay vì ngoặc kép, cho phép nhúng biến vào chuỗi dễ dàng với `${biến}`. Giúp tạo HTML động ngắn gọn.               |
| **Event Listener (Lắng nghe sự kiện)** | Đoạn code "canh" một sự kiện cụ thể để thực thi hành động tương ứng. VD: `.addEventListener("click", () => {...})` – khi người dùng click, chạy code bên trong. |
| **Modal (Cửa sổ nổi)**                 | Hộp nội dung xuất hiện chồng lên trang chính, nền mờ đi. Dự án dùng modal để xem toàn bộ lịch sử thu chi tài chính mà không cần chuyển trang.                   |
| **Dropdown (Menu thả xuống)**          | Menu xuất hiện khi click vào biểu tượng. Dự án dùng dropdown cho hệ thống thông báo (hình chuông).                                                              |
| **Web App URL (Đường link ứng dụng)**  | Link đặc biệt được tạo khi triển khai Google Apps Script. Đây là "địa chỉ cổng API" – website gọi đến link này để lấy/gửi dữ liệu.                              |

---

## 🏛️ GIẢI THÍCH KIẾN TRÚC TỔNG THỂ

### Hỏi: "Dự án hoạt động như thế nào?"

**Trả lời ngắn gọn:**

> Dự án gồm 3 phần chính: **Giao diện web** (người dùng thấy), **Google Apps Script** (cầu nối xử lý) và **Google Sheets** (nơi lưu dữ liệu). Khi mở trang web, trình duyệt tự động "hỏi" Google Apps Script xin dữ liệu, Apps Script đọc từ Sheets rồi gửi về dạng JSON, cuối cùng JavaScript hiển thị lên màn hình.

**Minh họa luồng dữ liệu:**

```
Người dùng mở web
      ↓
Trình duyệt tải: index.html + style.css + script.js
      ↓
script.js gọi hàm syncData()
      ↓
fetch("...apps-script-url...?action=getAllData")
      ↓   [Gửi yêu cầu HTTP GET qua Internet]
Google Apps Script nhận được yêu cầu
      ↓
doGet() → đọc 12 tab từ Google Sheets
      ↓
Trả về 1 object JSON chứa tất cả dữ liệu
      ↓   [Dữ liệu về qua Internet]
script.js nhận JSON, gọi các hàm render...()
      ↓
Cập nhật giao diện DOM → Người dùng thấy dữ liệu
```

**Khi người dùng gửi góp ý (chiều ngược lại):**

```
Người dùng điền form → click "Gửi"
      ↓
script.js thu thập dữ liệu form
      ↓
fetch(POST) → gửi JSON lên Apps Script
      ↓
doPost() → ghi dòng mới vào tab "Feedback" trong Sheets
      ↓
Thông báo thành công cho người dùng
```

---

### Hỏi: "Tại sao lại dùng Google Sheets làm database?"

**Trả lời:**

> Vì Google Sheets **miễn phí hoàn toàn**, ai cũng biết dùng (kể cả giáo viên không biết code), và dữ liệu được đồng bộ tức thì. Thay vì phải học cách dùng MySQL hay MongoDB phức tạp, giáo viên chỉ cần mở Sheets như Excel và chỉnh sửa – trang web tự động cập nhật lần tải sau. Đây là điểm sáng tạo nhất của dự án.

---

## 💻 GIẢI THÍCH CHI TIẾT TỪNG FILE CODE

---

## 🔵 Google Apps Script (Backend)

### Hàm `doGet(e)` – Nhận và xử lý yêu cầu GET

```javascript
function doGet(e) {
  var action = e.parameter.action; // Lấy tham số "action" từ URL
  var ss = SpreadsheetApp.getActiveSpreadsheet(); // Mở file Sheets hiện tại

  if (action === "getAllData") {
    return createResponse({
      config: getConfigData(ss), // Tab Config
      students: getSheetLines(ss, "Students"), // Tab Students
      // ... 9 tab khác
    });
  }
}
```

**Giải thích:**

- `e.parameter.action`: Khi website gọi `?action=getAllData`, tham số `action` có giá trị `'getAllData'`. Script đọc tham số này để biết phải làm gì.
- `SpreadsheetApp.getActiveSpreadsheet()`: Lệnh của Apps Script để mở file Google Sheets đang liên kết.
- Hàm gom dữ liệu từ **11 tab** vào 1 object duy nhất rồi trả về → Trang web chỉ cần gọi **1 lần** để có tất cả dữ liệu, tiết kiệm thời gian và lượt kết nối.

---

### Hàm `getSheetLines(ss, name)` – Đọc dữ liệu từ 1 tab

```javascript
function getSheetLines(ss, name) {
  var sheet = ss.getSheetByName(name); // Tìm tab theo tên
  var data = sheet.getDataRange().getValues(); // Lấy toàn bộ dữ liệu (dạng mảng 2D)
  var headers = data[0]; // Hàng đầu tiên = tên cột (headers)
  var result = [];

  for (var i = 1; i < data.length; i++) {
    // Duyệt từ hàng 2 trở đi (bỏ header)
    var item = {};
    for (var j = 0; j < headers.length; j++) {
      item[headers[j]] = data[i][j]; // Ghép key (tên cột) với value (ô dữ liệu)
    }
    result.push(item);
  }
  return result; // Trả về mảng các object
}
```

**Giải thích từng bước:**

1. `getSheetByName(name)`: Tìm tab tên `"Students"`, `"Finance"`...
2. `getDataRange().getValues()`: Lấy tất cả dữ liệu trong tab thành **mảng 2 chiều** (giống bảng Excel). `data[0]` = hàng 1 (tên cột), `data[1]` = hàng 2 (dữ liệu đầu tiên).
3. Vòng lặp `for` chuyển mảng 2D thành **mảng các object**: `[{name: "An", birthday: "..."}, {name: "Bình", ...}]`
4. Kết quả JSON này được gửi về website để hiển thị.

**Ví dụ thực tế:**

- Sheets có: | name | birthday | role |
- `data[1]` = `["Nguyễn Văn An", "2010-05-15", "Lớp trưởng"]`
- Sau hàm: `{name: "Nguyễn Văn An", birthday: "2010-05-15", role: "Lớp trưởng"}`

---

### Hàm `getConfigData(ss)` – Đọc cấu hình dạng Key-Value

```javascript
function getConfigData(ss) {
  var sheet = ss.getSheetByName("Config");
  var data = sheet.getDataRange().getValues();
  var obj = {};

  for (var i = 1; i < data.length; i++) {
    var key = data[i][0].toString().trim(); // Cột A = tên (key)
    var value = data[i][1]; // Cột B = giá trị (value)
    obj[key] = value;
  }
  return obj;
}
```

**Giải thích:** Tab Config có 2 cột: Cột A là "tên cài đặt", Cột B là "giá trị". Hàm đọc và tạo object theo kiểu `{className: "9/3", teacherName: "Thảo", ...}`. Website dùng object này để cập nhật tên lớp, tên giáo viên ở tất cả mọi nơi.

---

### Hàm `doPost(e)` – Nhận và xử lý yêu cầu POST (Hòm thư góp ý)

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents); // Đọc dữ liệu JSON từ body request

  if (data.action === "addFeedback") {
    var sheet = ss.getSheetByName("Feedback");
    sheet.appendRow([
      new Date(), // Thời gian tự động
      data.name, // Tên người gửi
      data.role, // Vai trò
      data.message, // Nội dung góp ý
    ]);
    return createResponse({ status: "success" });
  }
}
```

**Giải thích:**

- `e.postData.contents`: Nội dung JSON được gửi kèm trong POST request.
- `JSON.parse(...)`: Chuyển chuỗi JSON thành object JavaScript để đọc dữ liệu.
- `sheet.appendRow([...])`: Tự động thêm 1 hàng mới vào cuối tab Feedback – ghi nhận góp ý.
- `new Date()`: Tự động lấy thời gian hiện tại, không cần người dùng điền.

---

## 🟡 script.js – Bộ não của trang web

### Hàm `syncData()` – Tải và đồng bộ toàn bộ dữ liệu

```javascript
async function syncData() {
  try {
    const response = await fetch(`${scriptURL}?action=getAllData`);
    const result = await response.json();

    // Cập nhật từng phần giao diện
    renderFinance(result.finance);
    renderStudentList(result.students);
    // ...
  } catch (err) {
    console.error("Lỗi đồng bộ dữ liệu:", err);
  } finally {
    // Ẩn màn hình loading dù thành công hay thất bại
    document.getElementById("global-loader").classList.add("hidden");
  }
}
```

**Từ khóa quan trọng:**

- `async`: Đánh dấu hàm này có tác vụ bất đồng bộ (chờ dữ liệu từ mạng).
- `await fetch(...)`: **Dừng lại đây**, gửi yêu cầu và **chờ** cho đến khi nhận được phản hồi từ server. Trong lúc chờ, trình duyệt vẫn hoạt động bình thường (không bị đơ).
- `await response.json()`: Chuyển phản hồi thô thành object JavaScript để sử dụng.
- `try...catch...finally`: Xử lý lỗi an toàn – nếu mạng bị ngắt hoặc có lỗi, chương trình không bị crash mà hiển thị thông báo lỗi; `finally` luôn chạy dù thành công hay thất bại.

---

### Hàm `renderStudentPage()` – Hiển thị danh sách học sinh có phân trang

```javascript
function renderStudentPage() {
  const start = (studentPage - 1) * studentsPerPage; // VD: trang 2 → start = 5
  const end = start + studentsPerPage; // end = 10
  const pageStudents = allStudents.slice(start, end); // Lấy 5 học sinh của trang này
  const totalPages = Math.ceil(allStudents.length / studentsPerPage);

  tbody.innerHTML = "";
  pageStudents.forEach((s, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${start + i + 1}</td>   <!-- Số thứ tự đúng dù ở trang nào -->
        <td>${s.name}</td>
        <td>${formatDate(s.birthday)}</td>
      </tr>`;
  });
}
```

**Giải thích logic phân trang:**

- `studentsPerPage = 5`: Mỗi trang hiển thị 5 học sinh.
- **Trang 1**: start=0, end=5 → hiển thị học sinh 1–5.
- **Trang 2**: start=5, end=10 → hiển thị học sinh 6–10.
- `array.slice(start, end)`: Cắt mảng, lấy phần từ vị trí `start` đến `end`.
- `Math.ceil(40/5) = 8`: Tổng số trang = làm tròn lên của (tổng HS ÷ số HS/trang).
- **Template Literal** (dấu backtick): Tạo HTML động dễ dàng, nhúng biến bằng `${...}`.

---

### Hàm `renderSeating()` – Vẽ sơ đồ chỗ ngồi lưới 7x9

```javascript
function renderSeating() {
  let idx = 0;
  for (let r = 1; r <= 7; r++) {
    // 7 hàng
    for (let c = 1; c <= 9; c++) {
      // 9 cột
      if (r === 4 || c === 5) {
        // Đây là lối đi: hàng 4 (ngang) và cột 5 (dọc)
        grid.innerHTML += `<div class="h-4"></div>`;
        continue; // Bỏ qua ô này, không vẽ bàn
      }
      const name = students[idx] || ""; // Lấy tên học sinh theo thứ tự
      idx++;
      grid.innerHTML += `<div class="desk-slot">...${name}...</div>`;
    }
  }
}
```

**Giải thích:**

- Vòng lặp lồng nhau (nested loop): vòng ngoài duyệt 7 hàng, vòng trong duyệt 9 cột → tạo lưới 63 ô.
- Điều kiện `r === 4 || c === 5`: Hàng 4 và cột 5 là lối đi giữa lớp, bỏ trống.
- Thực tế có: 7×9 = 63 ô, trừ lối đi = ~48 chỗ ngồi.
- Tên học sinh được gán tuần tự theo danh sách từ Sheets.

---

### Hàm `renderFinance()` – Tính toán và hiển thị thu chi

```javascript
function renderFinance() {
  let tin = 0; // Tổng thu
  let tout = 0; // Tổng chi

  transactions.forEach((tr) => {
    const typeNormalized = tr.type.toLowerCase().trim(); // "Thu" → "thu"
    if (typeNormalized === "thu") tin += Math.abs(tr.amount);
    else tout += Math.abs(tr.amount);
  });

  // Hiển thị số tiền dạng có dấu phẩy (1000000 → "1.000.000")
  incomeEl.innerText = tin.toLocaleString() + "đ";
  balanceEl.innerText = (tin - tout).toLocaleString() + "đ";

  // Hiển thị 5 giao dịch gần nhất
  const latest5 = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sắp theo ngày mới nhất
    .slice(0, 5);
}
```

**Giải thích:**

- `.toLowerCase().trim()`: Chuẩn hóa text để tránh lỗi "Thu" ≠ "thu" ≠ " thu ".
- `Math.abs(tr.amount)`: Lấy giá trị tuyệt đối, tránh trừ nhầm số âm.
- `toLocaleString()`: Tự động thêm dấu phân cách hàng nghìn theo vùng miền.
- Spread operator `[...transactions]`: Sao chép mảng rồi sắp xếp, không làm thay đổi mảng gốc.
- `sort((a, b) => new Date(b.date) - new Date(a.date))`: Sắp xếp theo ngày giảm dần (mới nhất trên cùng).

---

### Hàm `renderEmulation()` – Hiển thị điểm thi đua với màu sắc tự động

```javascript
function renderEmulationStudents(students) {
  students.forEach((s) => {
    const score = s.score || 0;
    let colorClass = "bg-green-100 text-green-600"; // Mặc định: Tốt
    let statusText = "Tốt";

    if (score < 80) {
      colorClass = "bg-red-100 text-red-600";
      statusText = "Cần cải thiện";
    } else if (score < 90) {
      colorClass = "bg-amber-100 text-amber-600";
      statusText = "Trung bình";
    }

    // Vẽ thanh tiến trình theo %
    container.innerHTML += `
      <div style="width: ${Math.min(100, score)}%"></div>`;
  });
}
```

**Giải thích:**

- Hệ thống phân loại **3 mức** hoàn toàn tự động: ≥90 (Tốt/xanh), 80-89 (Trung bình/vàng), <80 (Cần cải thiện/đỏ).
- `Math.min(100, score)`: Giới hạn thanh tiến trình tối đa 100%, tránh tràn ra khỏi khung.
- Chỉ cần thay đổi điểm trong Sheets → màu sắc và trạng thái tự động thay đổi trên web.

---

### Hàm `filterFinance()` – Bộ lọc tài chính đa điều kiện

```javascript
function filterFinance() {
  const content = document.getElementById("filter-content").value.toLowerCase();
  const type = document.getElementById("filter-type").value; // "thu" hoặc "chi"
  const date = document.getElementById("filter-date").value; // "2026-01-15"

  filteredFinance = transactions.filter((tr) => {
    const matchContent = tr.content.toLowerCase().includes(content);
    const matchType = type === "" || tr.type === type;
    const matchDate =
      date === "" || new Date(tr.date).toISOString().split("T")[0] === date;

    return matchContent && matchType && matchDate; // Phải thỏa CẢ 3 điều kiện
  });
}
```

**Giải thích:**

- `array.filter(callback)`: Tạo mảng mới chỉ chứa các phần tử thỏa điều kiện trong `callback`.
- `string.includes(searchTerm)`: Kiểm tra xem chuỗi có chứa từ khóa tìm kiếm không.
- `.toISOString().split("T")[0]`: Chuyển Date thành chuỗi `"2026-01-15T00:00:00Z"`, cắt lấy phần ngày `"2026-01-15"` để so sánh.
- `matchContent && matchType && matchDate`: Dùng toán tử AND (&&) – phải khớp CẢ 3 điều kiện cùng lúc mới hiện lên.

---

### Cơ chế IntersectionObserver – Hiệu ứng hiện dần khi cuộn

```javascript
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting)
        // Nếu phần tử đã vào vùng nhìn thấy
        e.target.classList.add("active"); // Thêm class "active" để kích hoạt animation
    });
  },
  { threshold: 0.1 }, // Kích hoạt khi 10% phần tử đã có thể nhìn thấy
);

// Đăng ký theo dõi tất cả phần tử có class "reveal"
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
```

**Giải thích:**

- `IntersectionObserver`: API trình duyệt hiện đại, theo dõi phần tử có xuất hiện trong vùng nhìn thấy của màn hình không.
- `threshold: 0.1`: Kích hoạt khi 10% phần tử vào màn hình (không cần 100% mới kích hoạt).
- Kết hợp với CSS: class `.reveal` (opacity: 0, translateY: 40px) + `.reveal.active` (opacity: 1, translateY: 0) tạo hiệu ứng trượt lên và hiện dần.
- **Lợi ích**: Tiết kiệm tài nguyên hơn cách nghe sự kiện `scroll` truyền thống.

---

### Tính năng Lightbox (Xem ảnh toàn màn hình)

```javascript
// Mở lightbox
function openLightbox(index) {
  currentLightboxIndex = index;           // Ghi nhớ ảnh đang xem
  lightbox.classList.add("show");         // Hiện lightbox
  document.body.style.overflow = "hidden"; // Khóa cuộn trang
}

// Chuyển ảnh với vòng lặp (ảnh cuối → ảnh đầu)
function nextLightbox() {
  currentLightboxIndex = (currentLightboxIndex + 1) % allMediaItems.length;
  renderLightboxContent();
}

// Hỗ trợ phím tắt bàn phím
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevLightbox();
  else if (e.key === 'ArrowRight') nextLightbox();
  else if (e.key === 'Escape') closeLightbox(...);
});
```

**Giải thích:**

- `% allMediaItems.length` (toán tử chia lấy dư – modulo): Tạo vòng lặp tuần hoàn. Ví dụ có 5 ảnh: ảnh index 4 (cuối) → `(4+1) % 5 = 0` → quay về ảnh đầu.
- `document.body.style.overflow = "hidden"`: Khóa cuộn trang khi lightbox mở, tránh nền bị cuộn khi người dùng tương tác.
- `addEventListener('keydown', ...)`: Bắt phím bấm trên bàn phím, hỗ trợ điều hướng bằng mũi tên và đóng bằng Escape.

---

## 🟢 style.css – Bộ áo của trang web

### CSS Variables (Biến CSS) – Hệ thống màu sắc thống nhất

```css
:root {
  --primary-blue: #0056b3; /* Xanh chủ đạo */
  --accent-orange: #ff8500; /* Cam nhấn */
  --bg-light: #fdfdfd; /* Nền sáng */
  --text-main: #2d3436; /* Màu chữ chính */
  --card-radius: 20px; /* Bo góc card */
}
```

**Giải thích:**

- `:root` là phần tử gốc của toàn trang HTML – biến đặt ở đây áp dụng cho toàn bộ.
- Dùng `var(--primary-blue)` thay vì gõ lại mã màu `#0056b3` ở nhiều nơi.
- **Lợi ích lớn**: Muốn đổi theme màu toàn bộ website, chỉ cần đổi 1 dòng trong `:root`.

---

### Glassmorphism Header – Thanh điều hướng kính mờ

```css
header {
  background: rgba(255, 255, 255, 0.8); /* Trắng 80% trong suốt */
  backdrop-filter: blur(12px); /* Làm mờ nền phía sau */
  -webkit-backdrop-filter: blur(12px); /* Tương thích Safari */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* Chuyển động mượt */
}
header.scrolled {
  background: rgba(255, 255, 255, 0.95); /* Đục hơn khi cuộn */
  box-shadow: 0 10px 30px rgba(0, 86, 179, 0.08); /* Đổ bóng nhẹ */
}
```

**Giải thích:**

- `rgba(255, 255, 255, 0.8)`: Màu trắng với độ trong suốt 80% (1 = không trong suốt, 0 = vô hình).
- `backdrop-filter: blur(12px)`: Làm mờ nội dung phía sau header – tạo hiệu ứng kính mờ (glassmorphism).
- `cubic-bezier(...)`: Hàm chuyển động nâng cao – tạo chuyển động tự nhiên như vật lý thực (không phải tuyến tính).
- Class `scrolled` được thêm bởi JavaScript khi người dùng cuộn quá 50px.

---

### Hiệu ứng Reveal Animation – Hiện dần khi cuộn trang

```css
.reveal {
  opacity: 0; /* Ban đầu: vô hình */
  transform: translateY(40px); /* Dịch xuống 40px */
  transition: all 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.active {
  opacity: 1; /* Hiện rõ */
  transform: translateY(0); /* Về vị trí gốc */
}
```

**Hoạt động phối hợp với JS:**

1. CSS đặt phần tử ở trạng thái "ẩn + dịch xuống"
2. IntersectionObserver (JS) phát hiện phần tử vào màn hình
3. JS thêm class `.active` vào phần tử
4. CSS transition tạo animation mượt: phần tử trượt lên và hiện rõ dần

---

### Bento Grid Layout – Bố cục lưới sáng tạo

```css
#media-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 cột bằng nhau */
  grid-template-rows: repeat(2, 200px); /* 2 hàng cao 200px */
  gap: 16px;
}

#media-grid .media-main {
  grid-row: span 2; /* Ảnh chính chiếm 2 hàng (cao gấp đôi) */
}

/* Responsive: Thu về 1 cột trên điện thoại */
@media (max-width: 768px) {
  #media-grid {
    grid-template-columns: 1fr; /* Chỉ 1 cột */
  }
}
```

**Giải thích:**

- `display: grid`: Kích hoạt CSS Grid – hệ thống bố cục 2 chiều mạnh nhất của CSS.
- `1fr`: "1 phần fraction" – chia đều không gian còn lại. `repeat(2, 1fr)` = 2 cột bằng nhau.
- `grid-row: span 2`: Phần tử chiếm 2 hàng → ảnh chính to gấp đôi các ảnh phụ.
- `@media (max-width: 768px)`: Media query – áp dụng style khác trên màn hình ≤768px (điện thoại).

---

### Hiệu ứng Shimmer Loading

```css
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

**Giải thích:**

- Hiệu ứng "sóng sáng" chạy qua khi đang tải dữ liệu – thay cho spinner xoay thông thường.
- `linear-gradient(90deg, ...)`: Dải màu ngang từ xám → sáng → xám.
- `animation: shimmer 1.5s infinite`: Chạy animation tên `shimmer`, 1.5 giây/vòng, lặp vô hạn.
- `background-position` thay đổi từ `200%` → `-200%`: Làm dải màu sáng "chạy" từ phải sang trái.

---

## ❓ CÂU HỎI THƯỜNG GẶP & CÁCH TRẢ LỜI

### 🔴 Câu hỏi về tính năng

**H: "Tại sao dữ liệu không tự động cập nhật theo thời gian thực mà phải tải lại trang?"**

> Vì dự án dùng cơ chế "đồng bộ khi tải trang" (on-load sync) thay vì polling (liên tục hỏi server theo chu kỳ) hoặc WebSocket (kết nối 2 chiều liên tục). Trong môi trường trường học, dữ liệu không thay đổi quá thường xuyên, nên chỉ cần tải lại trang là đủ cập nhật. Điều này còn giúp **tiết kiệm tài nguyên** và **không tốn chi phí** so với duy trì kết nối liên tục.

**H: "Nếu mất mạng thì sao?"**

> Lần đầu khi mất mạng, trang sẽ không tải được dữ liệu mới. Tuy nhiên, hệ thống có khối `try...catch` để bắt lỗi và hiển thị thông báo thay vì bị crash. Trong tương lai, có thể nâng cấp bằng cách dùng **localStorage** để lưu cache dữ liệu lần cuối, giúp xem được dữ liệu cũ khi offline.

**H: "Bảo mật dữ liệu như thế nào?"**

> Dự án dùng giao thức **HTTPS** cho toàn bộ kết nối – dữ liệu được mã hóa khi truyền qua internet. Google Apps Script Web App có thể cấu hình quyền truy cập (chỉ tổ chức, hoặc tất cả mọi người). Dữ liệu nằm trong Google Sheets của tài khoản Google riêng, được bảo vệ bởi hệ thống bảo mật của Google.

**H: "Có thể nhân bản cho lớp khác không?"**

> Có! Chỉ cần 2 bước:
>
> 1. Sao chép Google Sheets sang Google account khác và triển khai Apps Script mới, lấy URL mới.
> 2. Thay dòng `const scriptURL = "..."` trong `script.js` bằng URL mới.
>    Giao diện web có thể dùng chung hoàn toàn – chỉ đổi nguồn dữ liệu.

---

### 🟡 Câu hỏi về công nghệ

**H: "Tại sao không dùng Framework như React hay Vue?"**

> React và Vue mạnh mẽ nhưng cần môi trường cài đặt phức tạp (Node.js, npm...), file khi build nặng hơn, và học sinh THCS chưa cần đến mức đó. **Vanilla JavaScript** cho phép chạy thẳng trên trình duyệt không cần cài đặt gì, code dễ đọc hơn để giáo viên và học sinh hiểu, và tốc độ tải trang cực nhanh – phù hợp với mục tiêu thực tiễn của dự án.

**H: "Tại sao không dùng database thực sự như MySQL?"**

> MySQL cần máy chủ riêng (chi phí thuê server), cần kiến thức SQL và quản trị server. Google Sheets **miễn phí hoàn toàn**, giáo viên và học sinh đã quen dùng, không cần cài đặt gì thêm. Với quy mô 1 lớp học (~40 học sinh), Google Sheets đủ mạnh và còn có ưu điểm là dễ chỉnh sửa trực tiếp.

**H: "Google Apps Script có giới hạn gì không?"**

> Có một số giới hạn của Google:
>
> - Tối đa 6 phút thực thi mỗi lần chạy (dự án dùng <1 giây nên không ảnh hưởng).
> - 20.000 lần đọc Sheets/ngày với tài khoản thường (dư thừa cho lớp học).
> - Tuy nhiên đây là **giới hạn miễn phí**, đủ dùng cho mục tiêu của dự án.

**H: "mode: 'no-cors' trong fetch POST nghĩa là gì?"**

> Khi website từ domain A gọi API ở domain B (Google), trình duyệt mặc định chặn vì lý do bảo mật (CORS policy). `mode: 'no-cors'` cho phép gửi request nhưng không đọc được phản hồi – chấp nhận được vì chúng ta chỉ cần **gửi** dữ liệu góp ý đi, không cần đọc phản hồi chi tiết.

---

### 🟢 Câu hỏi về thiết kế

**H: "Glassmorphism là gì và tại sao dùng?"**

> Glassmorphism là xu hướng thiết kế tạo hiệu ứng "kính mờ" – nền trong suốt có độ mờ, viền mỏng sáng. Tạo cảm giác hiện đại và cao cấp, đồng thời vẫn thấy được nội dung phía sau. Dự án dùng cho thanh điều hướng để vừa có phong cách đẹp vừa không che khuất nội dung trang khi cuộn.

**H: "Responsive là gì? Dự án có Responsive không?"**

> Responsive (thiết kế đáp ứng) có nghĩa giao diện tự co giãn để hiển thị đẹp trên mọi thiết bị. Dự án dùng **TailwindCSS** với prefix responsive (`md:`, `lg:`) và **CSS Media Queries** (`@media (max-width: 768px)`) để tối ưu cho cả điện thoại lẫn máy tính. Ví dụ: bố cục Bento Grid thu về 1 cột trên điện thoại.

**H: "Tại sao dùng TailwindCSS kết hợp với CSS tùy chỉnh?"**

> TailwindCSS xử lý các style thông thường nhanh chóng (padding, margin, màu sắc...) giúp code HTML gọn hơn. Nhưng các hiệu ứng phức tạp như Glassmorphism, Lightbox, animation tùy chỉnh, hay Bento Grid cần CSS thuần (style.css) vì TailwindCSS không có sẵn. Kết hợp cả hai giúp vừa nhanh vừa linh hoạt.

---

### 🔵 Câu hỏi về tương lai & cải tiến

**H: "Dự án có thể phát triển thêm tính năng gì?"**

> Có nhiều hướng phát triển:
>
> 1. **Đăng nhập phân quyền**: Giáo viên có thể chỉnh sửa trực tiếp trên web (không cần vào Sheets), học sinh chỉ xem.
> 2. **Thông báo push**: Dùng Web Push API để gửi thông báo đến điện thoại khi có bài thi hoặc sự kiện mới.
> 3. **Biểu đồ trực quan**: Tích hợp thư viện Chart.js để vẽ biểu đồ thi đua theo thời gian.
> 4. **Đa ngôn ngữ**: Thêm tính năng chuyển sang tiếng Anh.
> 5. **PWA**: Đóng gói thành Progressive Web App để cài được trên điện thoại như app thật.

**H: "Trợ lý AI trong dự án là AI thật không?"**

> Phiên bản hiện tại dùng **dữ liệu demo có sẵn** (pre-written responses) để mô phỏng phản hồi AI – khi bấm nút, nó hiển thị văn bản mẫu được lập trình sẵn. Đây là bước đầu để minh họa ý tưởng. Phiên bản tiếp theo có thể tích hợp **Google Gemini API** thật để tạo nội dung động, cá nhân hóa theo dữ liệu thực của lớp.

---

## 📌 TỔNG KẾT CÁC ĐIỂM MẠNH ĐỂ NHẤN MẠNH

Khi trả lời ban giám khảo, hãy nhấn mạnh các điểm sau:

1. **Chi phí = 0 đồng** – Tận dụng hoàn toàn hệ sinh thái miễn phí: Google Apps Script + Google Sheets + Vercel.

2. **Không cần biết code vẫn quản lý được** – Giáo viên chỉ cần mở Google Sheets như Excel và cập nhật, giao diện web tự động phản ánh.

3. **Tốc độ tải nhanh** – Dùng Vanilla JS (không framework nặng), không có build step phức tạp.

4. **Thiết kế chuẩn 2025-2026** – Glassmorphism, Micro-animations, Bento Grid, Dark Section – đều là xu hướng thiết kế hiện đại nhất.

5. **Dễ nhân bản** – Chỉ đổi URL API là có thể dùng cho lớp khác, câu lạc bộ, thậm chí doanh nghiệp nhỏ.

6. **Bảo mật** – HTTPS, kiểm soát quyền truy cập qua Google, dữ liệu không lưu trên server thứ ba.

---

_Tài liệu này được soạn để hỗ trợ tác giả dự án tự tin trình bày và giải đáp thắc mắc. Chúc các bạn thi tốt! 🏆_
