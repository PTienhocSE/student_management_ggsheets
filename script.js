/**
 * CẤU HÌNH VÀ BIẾN TOÀN CỤC
 */
const scriptURL =
  "https://script.google.com/macros/s/AKfycbwMua4-f0jWyqXbkPmhDgEIyARhZHzN3v85v39gXbwrOWG_zQwvZgVeuU1Q-o9QWH3-/exec";
let students = []; // Danh sách tên học sinh dùng cho sơ đồ chỗ ngồi
let transactions = []; // Toàn bộ dữ liệu tài chính

/**
 * Hàm đồng bộ dữ liệu chính từ Google Sheets.
 * Fetch toàn bộ dữ liệu (action=getAllData) và gọi các hàm render tương ứng.
 */
async function syncData() {
  if (!scriptURL) return;
  try {
    const response = await fetch(`${scriptURL}?action=getAllData`);
    const result = await response.json();
    console.log("Dữ liệu từ Google Sheets:", result);

    // 1. Cấu hình chung (Config)
    const config = result.config;
    if (config) {
      const name = config.className || "Lớp";
      // Cập nhật tên lớp ở tất cả các vị trí có class 'class-name-text'
      document
        .querySelectorAll(".class-name-text")
        .forEach((el) => (el.innerText = name));
      document.getElementById("page-title").innerText =
        "Hệ thống Quản lý " + name;

      // Cập nhật thông tin cán bộ lớp và giáo viên
      const tName = config.teacherName || "Đang cập nhật...";
      const mName = config.classMonitor || "Đang cập nhật...";
      const sCount = config.totalStudents || "0";

      if (document.getElementById("teacher-name"))
        document.getElementById("teacher-name").innerText = tName;
      if (document.getElementById("teacher-name-card"))
        document.getElementById("teacher-name-card").innerText = tName;
      if (document.getElementById("monitor-name"))
        document.getElementById("monitor-name").innerText = mName;
      if (document.getElementById("monitor-name-card"))
        document.getElementById("monitor-name-card").innerText = mName;
      if (document.getElementById("student-count"))
        document.getElementById("student-count").innerText = sCount;
      if (document.getElementById("student-count-list"))
        document.getElementById("student-count-list").innerText = sCount;
      if (document.getElementById("teacher-email"))
        document.getElementById("teacher-email").innerText =
          config.teacherEmail || "";
      if (document.getElementById("teacher-phone"))
        document.getElementById("teacher-phone").innerText =
          config.teacherPhone || "";

      // Cập nhật ảnh bìa Hero nếu có link
      if (config.heroImage && document.getElementById("hero-image")) {
        document.getElementById("hero-image").src = config.heroImage;
      }

      // Cập nhật tên các lớp phó
      if (document.getElementById("vice-monitor-hp-name-card"))
        document.getElementById("vice-monitor-hp-name-card").innerText =
          config.viceMonitorHP || "Đang cập nhật...";
      if (document.getElementById("vice-monitor-vn-name-card"))
        document.getElementById("vice-monitor-vn-name-card").innerText =
          config.viceMonitorVN || "Đang cập nhật...";

      // Cập nhật niên khóa/năm học
      if (document.getElementById("school-year"))
        document.getElementById("school-year").innerText =
          config.schoolYear || "Niên khóa 2024 - 2025";
    }

    // 2. Hệ thống thông báo (Notifications)
    const bell = document.getElementById("notif-bell");
    const dropdown = document.getElementById("notif-dropdown");
    const notifContent = document.getElementById("notif-content");
    const badge = document.getElementById("bell-badge");

    if (result.notifications && result.notifications.length > 0) {
      // Hiển thị thông báo mới nhất ở khu vực nổi bật (nếu có)
      const latest =
        result.notifications[result.notifications.length - 1].content;
      const announcementEl = document.getElementById("announcement-text");
      if (announcementEl) announcementEl.innerText = latest;

      // Đổ danh sách thông báo vào menu dropdown
      if (notifContent) {
        notifContent.innerHTML = "";
        [...result.notifications].reverse().forEach((notif) => {
          const dateStr = notif.date
            ? new Date(notif.date).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })
            : "";
          notifContent.innerHTML += `
            <div class="notif-item">
              <div class="flex justify-between items-start mb-1">
                <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider">${dateStr}</span>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">${notif.content}</p>
            </div>
          `;
        });
      }

      // Hiện chấm đỏ thông báo
      if (badge) badge.style.display = "block";

      // Xử lý click vào chuông
      if (bell) {
        bell.onclick = (e) => {
          e.stopPropagation();
          dropdown.classList.toggle("show");
          if (badge) badge.style.display = "none";
        };
      }
    }

    // 3. Tài chính (Finance)
    if (result.finance) {
      transactions = result.finance;
      renderFinance();
    }

    // 4. Học sinh (Students)
    if (result.students) {
      students = result.students.map((s) => s.name);
      renderSeating();
      renderStudentList(result.students);
    }

    // 5. Hình ảnh hoạt động (Media)
    if (result.media) {
      renderMedia(result.media);
    }

    // 6. Thời khóa biểu (Schedule)
    if (result.schedule) {
      renderSchedule(result.schedule);
    }

    // 7. Lịch thi (Exams)
    if (result.exams) {
      renderExams(result.exams);
    }

    // 8. Thi đua (Emulation)
    if (result.emulation) {
      renderEmulation(result.emulation);
    }

    // 9. Công việc (Tasks)
    if (result.tasks) {
      renderTasks(result.tasks);
    }

    // 10. Sự kiện (Events)
    if (result.events) {
      renderEvents(result.events);
    }

    // 11. Dự án học tập (Projects)
    if (result.projects) {
      renderProjects(result.projects);
    }
  } catch (err) {
    console.error("Lỗi đồng bộ dữ liệu:", err);
  } finally {
    // Ẩn màn hình chờ sau khi tải xong
    const loader = document.getElementById("global-loader");
    if (loader) loader.classList.add("hidden");
  }
}

/**
 * XỬ LÝ DANH SÁCH HỌC SINH (PHÂN TRANG)
 */
let studentPage = 1;
const studentsPerPage = 5;
let allStudents = [];

// Hàm định dạng ngày tháng kiểu Việt Nam (dd/mm/yyyy)
function formatDate(dateString) {
  if (!dateString) return "Đang cập nhật";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Đang cập nhật";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Khởi tạo danh sách học sinh
function renderStudentList(studentData) {
  allStudents = studentData;
  studentPage = 1;
  renderStudentPage();
}

// Vẽ dữ liệu học sinh của trang hiện tại lên bảng
function renderStudentPage() {
  const tbody = document.getElementById("student-table-body");
  const pagination = document.getElementById("student-pagination");
  if (!tbody || !pagination) return;

  const start = (studentPage - 1) * studentsPerPage;
  const end = start + studentsPerPage;
  const pageStudents = allStudents.slice(start, end);
  const totalPages = Math.ceil(allStudents.length / studentsPerPage);

  tbody.innerHTML = "";
  pageStudents.forEach((s, i) => {
    const actualIndex = start + i + 1;
    tbody.innerHTML += `
      <tr class="border-b border-gray-50 hover:bg-gray-50 transition">
        <td class="p-8 font-bold text-gray-400">${actualIndex}</td>
        <td class="p-8 font-bold text-[#003a7a]">${s.name}</td>
        <td class="p-8 text-gray-500">${formatDate(s.birthday)}</td>
        <td class="p-8"><span class="text-[10px] font-black uppercase text-gray-400">${s.role || "Học sinh"}</span></td>
        <td class="p-8"><span class="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span><span class="text-xs font-bold text-gray-600">Đang học</span></td>
      </tr>`;
  });

  // Tạo các nút chuyển trang
  pagination.innerHTML = `
    <button onclick="changeStudentPage(${studentPage - 1})" ${studentPage === 1 ? "disabled" : ""} class="px-6 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-gray-700 transition">
      <span class="material-symbols-outlined text-sm align-middle">chevron_left</span> Trước
    </button>
    <span class="text-sm font-bold text-gray-600">Trang ${studentPage} / ${totalPages || 1}</span>
    <button onclick="changeStudentPage(${studentPage + 1})" ${studentPage >= totalPages ? "disabled" : ""} class="px-6 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-gray-700 transition">
      Sau <span class="material-symbols-outlined text-sm align-middle">chevron_right</span>
    </button>
  `;
}

// Chuyển sang trang học sinh khác
function changeStudentPage(page) {
  const totalPages = Math.ceil(allStudents.length / studentsPerPage);
  if (page < 1 || page > totalPages) return;
  studentPage = page;
  renderStudentPage();
  const table = document.getElementById("student-table-body");
  if (table)
    table
      .closest(".bg-white")
      .scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * XỬ LÝ SƠ ĐỒ CHỖ NGỒI
 */
function renderSeating() {
  const grid = document.getElementById("seating-grid");
  if (!grid) return;
  grid.innerHTML = "";
  let idx = 0;
  // Giả định sơ đồ lớp 7 hàng, 9 cột (có lối đi)
  for (let r = 1; r <= 7; r++) {
    for (let c = 1; c <= 9; c++) {
      if (r === 4 || c === 5) {
        // Lối đi giữa lớp
        grid.innerHTML += `<div class="h-4"></div>`;
        continue;
      }
      const name = students[idx] || "";
      idx++;
      grid.innerHTML += `
        <div class="desk-slot p-2 rounded-xl border border-gray-100 flex flex-col items-center justify-center bg-white shadow-sm h-20 transition-all hover:shadow-md hover:border-blue-200">
          <span class="material-symbols-outlined text-lg ${idx % 2 === 0 ? "text-blue-500" : "text-orange-500"}">person</span>
          <p class="text-[9px] font-bold text-gray-700 text-center leading-tight break-words w-full px-1">${name}</p>
        </div>`;
    }
  }
}

/**
 * XỬ LÝ TÀI CHÍNH (THU CHI)
 */
let financePage = 1;
const financePerPage = 8;
let filteredFinance = [];

// Tính toán tổng thu, tổng chi và vẽ danh sách giao dịch gần đây (5 cái)
function renderFinance() {
  const history = document.getElementById("transaction-history");
  if (!history) return;
  let tin = 0;
  let tout = 0;

  transactions.forEach((tr) => {
    const typeNormalized = (tr.type || "").toString().toLowerCase().trim();
    if (typeNormalized === "thu") tin += Math.abs(tr.amount);
    else tout += Math.abs(tr.amount);
  });

  const incomeEl = document.getElementById("total-income");
  const expenseEl = document.getElementById("total-expense");
  const balanceEl = document.getElementById("current-balance");

  if (incomeEl) incomeEl.innerText = tin.toLocaleString() + "đ";
  if (expenseEl) expenseEl.innerText = tout.toLocaleString() + "đ";
  if (balanceEl) balanceEl.innerText = (tin - tout).toLocaleString() + "đ";

  history.innerHTML = "";
  const latest5 = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  latest5.forEach((tr) => {
    const typeNormalized = (tr.type || "").toString().toLowerCase().trim();
    const isThu = typeNormalized === "thu";
    const d = tr.date ? new Date(tr.date).toLocaleDateString("vi-VN") : "--";
    history.innerHTML += `
      <tr class="border-b border-white/5 py-4">
        <td class="py-4 text-gray-400 font-bold">${d}</td>
        <td class="py-4 font-medium">${tr.content}</td>
        <td class="py-4"><span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isThu ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}">${isThu ? "THU" : "CHI"}</span></td>
        <td class="py-4 font-bold ${isThu ? "text-green-400" : "text-red-400"}">${isThu ? "+" : "-"}${Math.abs(tr.amount).toLocaleString()}đ</td>
        <td class="py-4"><span class="material-symbols-outlined text-green-500 text-sm">verified</span></td>
      </tr>`;
  });
}

// Mở cửa sổ xem toàn bộ lịch sử thu chi
function openFinanceModal() {
  const modal = document.getElementById("finance-modal");
  if (!modal) return;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
  filteredFinance = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  financePage = 1;
  renderFullFinance();
}

// Đóng cửa sổ tài chính
function closeFinanceModal(e) {
  const modal = document.getElementById("finance-modal");
  if (!modal) return;
  if (
    !e ||
    e.target.classList.contains("modal-overlay") ||
    e.target.closest(".close-modal")
  ) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

// Lọc dữ liệu tài chính theo nội dung, loại, ngày
function filterFinance() {
  const content = document.getElementById("filter-content").value.toLowerCase();
  const type = document.getElementById("filter-type").value;
  const date = document.getElementById("filter-date").value;
  const sort = document.getElementById("sort-order").value;

  filteredFinance = transactions.filter((tr) => {
    const matchContent = tr.content.toLowerCase().includes(content);
    const matchType = type === "" || tr.type === type;
    const matchDate =
      date === "" ||
      (tr.date && new Date(tr.date).toISOString().split("T")[0] === date);
    return matchContent && matchType && matchDate;
  });

  filteredFinance.sort((a, b) => {
    const dA = new Date(a.date);
    const dB = new Date(b.date);
    return sort === "desc" ? dB - dA : dA - dB;
  });

  financePage = 1;
  renderFullFinance();
}

// Vẽ dữ liệu tài chính đầy đủ vào bảng trong Modal
function renderFullFinance() {
  const tbody = document.getElementById("full-transaction-history");
  const pagination = document.getElementById("finance-pagination");
  if (!tbody || !pagination) return;

  const start = (financePage - 1) * financePerPage;
  const end = start + financePerPage;
  const pageItems = filteredFinance.slice(start, end);
  const totalPages = Math.ceil(filteredFinance.length / financePerPage);

  tbody.innerHTML =
    pageItems.length > 0
      ? ""
      : '<tr><td colspan="5" class="py-20 text-center text-gray-500">Không tìm thấy giao dịch nào</td></tr>';
  pageItems.forEach((tr) => {
    const typeNormalized = (tr.type || "").toString().toLowerCase().trim();
    const isThu = typeNormalized === "thu";
    const d = tr.date ? new Date(tr.date).toLocaleDateString("vi-VN") : "--";
    tbody.innerHTML += `
      <tr class="border-b border-white/5 hover:bg-white/5 transition">
        <td class="py-4 font-bold text-gray-400">${d}</td>
        <td class="py-4">${tr.content}</td>
        <td class="py-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isThu ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}">${isThu ? "THU" : "CHI"}</span></td>
        <td class="py-4 font-bold ${isThu ? "text-green-400" : "text-red-400"}">${isThu ? "+" : "-"}${Math.abs(tr.amount).toLocaleString()}đ</td>
        <td class="py-4"><span class="material-symbols-outlined text-green-500 text-xs">verified</span></td>
      </tr>`;
  });

  pagination.innerHTML = `
    <button onclick="changeFinancePage(${financePage - 1})" ${financePage === 1 ? "disabled" : ""} class="page-btn">Trước</button>
    <span class="text-white font-bold text-sm">Trang ${financePage} / ${totalPages || 1}</span>
    <button onclick="changeFinancePage(${financePage + 1})" ${financePage >= totalPages ? "disabled" : ""} class="page-btn">Sau</button>
  `;
}

// Đổi trang cho bảng tài chính
function changeFinancePage(p) {
  financePage = p;
  renderFullFinance();
  const modalBody = document.querySelector(".modal-body");
  if (modalBody) modalBody.scrollTop = 0;
}

/**
 * CÁC HÀM RENDER DỮ LIỆU KHÁC (MEDIA, SCHEDULE, EXAMS, ETC.)
 */

// Vẽ bộ sưu tập ảnh hoạt động (hiển thị 3 ảnh, ảnh cuối +X more)
let allMediaItems = [];

function renderMedia(list) {
  allMediaItems = list;
  const grid = document.getElementById("media-grid");
  if (!grid) return;
  grid.innerHTML = "";
  
  const displayCount = Math.min(3, list.length);
  const remainingCount = list.length - 3;
  
  for (let i = 0; i < displayCount; i++) {
    const item = list[i];
    const isLast = i === 2 && remainingCount > 0;
    
    grid.innerHTML += `
      <div class="media-item ${i === 0 ? "media-main" : ""} group overflow-hidden relative rounded-[32px] cursor-pointer" onclick="openLightbox(${i})">
        <img src="${item.image_url}" alt="${item.title}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110">
        ${isLast ? `
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-white text-5xl font-black mb-1">+${remainingCount}</span>
          <span class="text-white font-bold text-sm uppercase tracking-wider opacity-80">Xem thêm</span>
        </div>
        ` : `
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 p-6">
          <h4 class="text-white font-bold text-lg">${item.title}</h4>
        </div>
        `}
      </div>`;
  }
}

// Lightbox functions
let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.getElementById("media-lightbox");
  if (!lightbox) return;
  
  renderLightboxContent();
  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeLightbox(e) {
  if (e && !e.target.closest('.lightbox-close') && !e.target.classList.contains('lightbox-overlay')) return;
  const lightbox = document.getElementById("media-lightbox");
  if (lightbox) {
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
  }
}

function renderLightboxContent() {
  const container = document.getElementById("lightbox-content");
  const counter = document.getElementById("lightbox-counter");
  const title = document.getElementById("lightbox-title");
  if (!container || !allMediaItems.length) return;
  
  const item = allMediaItems[currentLightboxIndex];
  container.innerHTML = `<img src="${item.image_url}" alt="${item.title}" class="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl">`;
  if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${allMediaItems.length}`;
  if (title) title.textContent = item.title;
}

function prevLightbox() {
  currentLightboxIndex = (currentLightboxIndex - 1 + allMediaItems.length) % allMediaItems.length;
  renderLightboxContent();
}

function nextLightbox() {
  currentLightboxIndex = (currentLightboxIndex + 1) % allMediaItems.length;
  renderLightboxContent();
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById("media-lightbox");
  if (!lightbox || !lightbox.classList.contains("show")) return;
  
  if (e.key === 'ArrowLeft') prevLightbox();
  else if (e.key === 'ArrowRight') nextLightbox();
  else if (e.key === 'Escape') closeLightbox({ target: { classList: { contains: () => true } } });
});

// Vẽ thời khóa biểu
function renderSchedule(schedule) {
  const grid = document.getElementById("schedule-grid");
  if (!grid) return;
  schedule.forEach((row) => {
    grid.innerHTML += `
      <div class="bg-gray-100 p-4 rounded-2xl font-black text-gray-600">${row.period}</div>
      <div class="bg-white p-4 rounded-2xl font-bold text-gray-700">${row.monday || "-"}</div>
      <div class="bg-white p-4 rounded-2xl font-bold text-gray-700">${row.tuesday || "-"}</div>
      <div class="bg-white p-4 rounded-2xl font-bold text-gray-700">${row.wednesday || "-"}</div>
      <div class="bg-white p-4 rounded-2xl font-bold text-gray-700">${row.thursday || "-"}</div>
      <div class="bg-white p-4 rounded-2xl font-bold text-gray-700">${row.friday || "-"}</div>
    `;
  });
}

// Vẽ danh sách lịch thi & kiểm tra
function renderExams(exams) {
  const container = document.getElementById("exam-list");
  if (!container) return;
  container.innerHTML = "";
  exams.forEach((exam) => {
    if (!exam.content || !exam.subject) return;
    const d = exam.date ? new Date(exam.date) : null;
    const day = d ? d.getDate() : "?";
    const month = d ? "Th" + (d.getMonth() + 1) : "";
    const isImportant =
      exam.isImportant === true || exam.isImportant === "TRUE";
    container.innerHTML += `
      <div class="flex gap-4 items-start pb-6 border-b border-gray-50 ${isImportant ? "" : "opacity-50"}">
        <div class="bg-${isImportant ? "red" : "gray"}-50 text-${isImportant ? "red" : "gray"}-500 p-3 rounded-2xl font-black text-center min-w-[60px]">
          <p class="text-lg">${day}</p>
          <p class="text-[8px] uppercase">${month}</p>
        </div>
        <div>
          <p class="font-black text-gray-700">${exam.content}</p>
          <p class="text-xs text-gray-400">Môn: ${exam.subject}</p>
        </div>
      </div>`;
  });
}

// Vẽ biểu đồ thi đua các tổ và học sinh (TÁCH RIÊNG)
let allEmulationData = [];
let currentEmulationGroup = 'all';

function renderEmulation(groups) {
  allEmulationData = groups;
  
  // Tách dữ liệu: Tổ và Học sinh
  const groupData = groups.filter(g => g.groupName && g.groupName.toLowerCase().startsWith('tổ'));
  const studentData = groups.filter(g => g.groupName && !g.groupName.toLowerCase().startsWith('tổ'));
  
  // Render phần Tổ
  const groupContainer = document.getElementById("emulation-groups");
  if (groupContainer) {
    groupContainer.innerHTML = "";
    const colors = ["orange", "blue", "green", "purple"];
    groupData.forEach((g, i) => {
      const color = colors[i % colors.length];
      const percent = Math.min(100, g.score || 0);
      groupContainer.innerHTML += `
        <div>
          <div class="flex justify-between items-end mb-4">
            <p class="text-xl font-black">${g.groupName}</p>
            <p class="text-4xl font-black text-${color}-400 tracking-tighter">${g.score}<span class="text-xs uppercase ml-1">đ</span></p>
          </div>
          <div class="h-4 w-full bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-${color}-400 rounded-full transition-all duration-1000" style="width: ${percent}%"></div>
          </div>
        </div>`;
    });
  }
  
  // Render phần Học sinh
  renderEmulationStudents(studentData);
}

// Render danh sách học sinh thi đua
function renderEmulationStudents(students) {
  const container = document.getElementById("emulation-students");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (students.length === 0) {
    container.innerHTML = '<p class="col-span-full text-center text-gray-400 py-8">Không có dữ liệu</p>';
    return;
  }
  
  students.forEach((s) => {
    const score = s.score || 0;
    let colorClass = 'bg-green-100 text-green-600 border-green-200';
    let barColor = 'bg-green-500';
    let statusText = 'Tốt';
    
    if (score < 80) {
      colorClass = 'bg-red-100 text-red-600 border-red-200';
      barColor = 'bg-red-500';
      statusText = 'Cần cải thiện';
    } else if (score < 90) {
      colorClass = 'bg-amber-100 text-amber-600 border-amber-200';
      barColor = 'bg-amber-500';
      statusText = 'Trung bình';
    }
    
    const percent = Math.min(100, score);
    const description = s.description ? `<p class="text-xs text-gray-400 mt-1 truncate" title="${s.description}">${s.description}</p>` : '';
    
    container.innerHTML += `
      <div class="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1 min-w-0">
            <p class="font-bold text-gray-800 truncate">${s.groupName}</p>
            ${description}
          </div>
          <span class="text-lg font-black ${score >= 90 ? 'text-green-500' : score >= 80 ? 'text-amber-500' : 'text-red-500'}">${score}</span>
        </div>
        <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full ${barColor} rounded-full transition-all duration-700" style="width: ${percent}%"></div>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="text-[10px] font-bold ${colorClass} px-2 py-0.5 rounded-full">${statusText}</span>
        </div>
      </div>`;
  });
}

// Lọc học sinh theo tổ
function filterEmulationByGroup(group) {
  currentEmulationGroup = group;
  
  // Cập nhật trạng thái tabs
  document.querySelectorAll('.emulation-tab').forEach(tab => {
    tab.classList.remove('active', 'bg-[#003a7a]', 'text-white');
    tab.classList.add('bg-gray-200', 'text-gray-600');
  });
  const activeTab = document.querySelector(`.emulation-tab[data-group="${group}"]`);
  if (activeTab) {
    activeTab.classList.add('active', 'bg-[#003a7a]', 'text-white');
    activeTab.classList.remove('bg-gray-200', 'text-gray-600');
  }
  
  filterEmulationStudents();
}

// Lọc và tìm kiếm học sinh
function filterEmulationStudents() {
  const searchTerm = document.getElementById('emulation-search')?.value.toLowerCase() || '';
  const filterValue = document.getElementById('emulation-filter')?.value || 'all';
  
  // Lấy dữ liệu học sinh (không phải tổ)
  let students = allEmulationData.filter(g => g.groupName && !g.groupName.toLowerCase().startsWith('tổ'));
  
  // Lọc theo tổ (dựa vào thứ tự trong danh sách gốc)
  if (currentEmulationGroup !== 'all') {
    const groupIndex = parseInt(currentEmulationGroup.replace('to', '')) - 1;
    const studentsPerGroup = Math.ceil(students.length / 4);
    const start = groupIndex * studentsPerGroup;
    const end = start + studentsPerGroup;
    students = students.slice(start, end);
  }
  
  // Lọc theo tên
  if (searchTerm) {
    students = students.filter(s => s.groupName.toLowerCase().includes(searchTerm));
  }
  
  // Lọc theo điểm
  if (filterValue === 'good') {
    students = students.filter(s => s.score >= 90);
  } else if (filterValue === 'warning') {
    students = students.filter(s => s.score < 90);
  }
  
  renderEmulationStudents(students);
}

// Vẽ danh sách To-do list (công việc cần làm)
function renderTasks(tasks) {
  const container = document.getElementById("todo-list");
  if (!container) return;
  container.innerHTML = "";
  tasks.forEach((task) => {
    const isDone = task.isDone === true || task.isDone === "TRUE";
    container.innerHTML += `
      <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
        <span class="material-symbols-outlined text-${isDone ? "blue" : "gray"}-500">${isDone ? "check_box" : "check_box_outline_blank"}</span>
        <span class="font-bold text-gray-600 ${isDone ? "line-through opacity-50" : ""}">${task.content}</span>
      </div>`;
  });
}

// Vẽ danh sách sự kiện sắp diễn ra
function renderEvents(events) {
  const container = document.getElementById("event-list");
  if (!container) return;
  container.innerHTML = "";
  events.forEach((event) => {
    const d = event.date ? new Date(event.date) : null;
    let dayStr = "?? / ??";
    if (d && !isNaN(d.getTime()))
      dayStr = `${d.getDate()} / ${d.getMonth() + 1}`;
    const isImportant =
      event.isImportant === true || event.isImportant === "TRUE";
    const color = isImportant ? "orange" : "blue";
    container.innerHTML += `
      <div class="p-4 bg-white rounded-2xl shadow-sm border-l-4 border-${color}-400">
        <p class="text-xs font-bold text-${color}-400 mb-1">${dayStr}</p>
        <p class="font-bold text-gray-700">${event.title}</p>
      </div>`;
  });
}

// Vẽ các dự án học tập đang tiến hành
function renderProjects(projects) {
  const container = document.getElementById("project-list");
  if (!container) return;
  container.innerHTML = "";
  projects.forEach((proj) => {
    const progress = proj.progress || 0;
    container.innerHTML += `
      <div class="bg-white/10 backdrop-blur p-5 rounded-3xl border border-white/20">
        <p class="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">${proj.category || "Dự án"}</p>
        <p class="font-bold text-white">${proj.title}</p>
        <div class="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-white rounded-full transition-all duration-1000" style="width: ${progress}%"></div>
        </div>
      </div>`;
  });
}

/**
 * XỬ LÝ ZOOM & PAN CHO SƠ ĐỒ LỚP
 */
let zoomLevel = 1;
const zoomStep = 0.2,
  minZoom = 0.5,
  maxZoom = 3;

function zoomIn() {
  if (zoomLevel < maxZoom) {
    zoomLevel += zoomStep;
    applyZoom();
  }
}
function zoomOut() {
  if (zoomLevel > minZoom) {
    zoomLevel -= zoomStep;
    applyZoom();
  }
}
function resetZoom() {
  zoomLevel = 1;
  applyZoom();
  const container = document.getElementById("seating-zoom-container");
  if (container) {
    container.scrollLeft = 0;
    container.scrollTop = 0;
  }
}
function applyZoom() {
  const wrapper = document.getElementById("seating-zoom-wrapper");
  if (wrapper) wrapper.style.transform = `scale(${zoomLevel})`;
}

/**
 * TRỢ LÝ AI (DEMO)
 */
const aiResponses = {
  budget: `### 📊 Kế Hoạch Thu Chi Quý II/2026

#### 💰 DỰ KIẾN THU
| Hạng mục | Số tiền | Ghi chú |
|----------|---------|---------|
| Quỹ lớp tháng 3-5 | 3.000.000đ | 40 HS x 25.000đ x 3 tháng |
| Đóng góp tự nguyện | 500.000đ | Phụ huynh hỗ trợ |
| **Tổng thu** | **3.500.000đ** | |

#### 💸 DỰ KIẾN CHI
| Hạng mục | Số tiền | Ưu tiên |
|----------|---------|---------|
| Nước uống hàng tuần | 600.000đ | ⭐⭐⭐ |
| Quà sinh nhật HS | 400.000đ | ⭐⭐ |
| Văn phòng phẩm | 300.000đ | ⭐⭐⭐ |
| Hoạt động dã ngoại | 1.500.000đ | ⭐⭐⭐ |
| Quỹ dự phòng | 700.000đ | ⭐⭐ |
| **Tổng chi** | **3.500.000đ** | |

> 💡 **Gợi ý:** Nên giữ quỹ dự phòng ít nhất 20% tổng thu để xử lý các tình huống phát sinh.`,

  notification: `### 📢 Mẫu Thông Báo Họp Phụ Huynh

---

**TRƯỜNG THCS NGUYỄN KHÁNH TOÀN**  
**Lớp 9/3 - Năm học 2025-2026**

---

#### THÔNG BÁO
##### V/v: Họp phụ huynh học sinh cuối học kỳ II

Kính gửi: Quý Phụ huynh học sinh lớp 9/3

Ban cán sự lớp trân trọng kính mời Quý Phụ huynh tham dự buổi họp phụ huynh với nội dung sau:

**🕐 Thời gian:** 14h00, Thứ Bảy, ngày 15/03/2026  
**📍 Địa điểm:** Phòng học lớp 9/3, Tầng 2, Dãy A  

**📋 Nội dung:**
1. Báo cáo kết quả học tập HK2
2. Định hướng ôn thi tuyển sinh lớp 10
3. Thông qua kế hoạch hoạt động hè
4. Thu chi quỹ lớp

**Lưu ý:** Quý Phụ huynh vui lòng sắp xếp thời gian tham dự đầy đủ.

> Xác nhận tham dự qua Zalo nhóm lớp trước ngày 12/03/2026.

**BAN CÁN SỰ LỚP 9/3**`,

  trip: `### 🏕️ Kế Hoạch Dã Ngoại Cuối Năm

---

#### 📍 THÔNG TIN CHUYẾN ĐI

| | |
|---|---|
| **Địa điểm** | Khu du lịch Suối Mơ, Đồng Nai |
| **Thời gian** | 1 ngày (Chủ nhật, 20/04/2026) |
| **Số lượng** | 42 người (40 HS + 2 GV) |
| **Chi phí dự kiến** | 150.000đ/người |

---

#### ⏰ LỊCH TRÌNH CHI TIẾT

| Thời gian | Hoạt động |
|-----------|-----------|
| 06:00 | Tập trung tại trường, điểm danh |
| 06:30 | Khởi hành |
| 08:30 | Đến nơi, nhận phòng, ăn sáng nhẹ |
| 09:30 | Team building - Trò chơi tập thể |
| 11:30 | Nghỉ ngơi, chuẩn bị ăn trưa |
| 12:00 | Tiệc BBQ ngoài trời 🍖 |
| 14:00 | Tự do: Bơi lội / Đạp xe / Chụp ảnh |
| 16:00 | Tổng kết, trao giải, chụp ảnh lưu niệm |
| 16:30 | Khởi hành về |
| 18:30 | Về đến trường, giải tán |

---

#### 📝 CHECKLIST CHUẨN BỊ
- [ ] Đồ bơi, khăn tắm
- [ ] Kem chống nắng, nón
- [ ] Giày thể thao
- [ ] Thuốc cá nhân (nếu có)
- [ ] Tiền mặt dự phòng

> ⚠️ **Lưu ý:** Tất cả học sinh phải có giấy xác nhận của phụ huynh trước ngày 15/04/2026.`
};

async function askAI(q) {
  const resBox = document.getElementById("ai-result");
  const load = document.getElementById("ai-loading");
  if (load) load.classList.remove("hidden");
  if (resBox) resBox.innerHTML = "";
  
  setTimeout(() => {
    let txt = aiResponses[q] || aiResponses.budget;
    if (resBox && typeof marked !== "undefined") {
      resBox.innerHTML = marked.parse(txt);
    }
    if (load) load.classList.add("hidden");
    
    // Scroll to result
    resBox?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1500);
}

/**
 * CÁC SỰ KIỆN GIAO DIỆN (SCROLL, CLICK NGOÀI, REVEAL ANIM)
 */

// Đóng thông báo khi click ra ngoài
document.addEventListener("click", () => {
  const notifDropdown = document.getElementById("notif-dropdown");
  if (notifDropdown) notifDropdown.classList.remove("show");
});

// Xử lý hiệu ứng scroll Header và nút Scroll-to-top
window.addEventListener("scroll", () => {
  const header = document.getElementById("main-header");
  const scrollTop = document.getElementById("scroll-top");
  if (window.scrollY > 50) {
    if (header) header.classList.add("scrolled");
    if (scrollTop) scrollTop.classList.add("visible");
  } else {
    if (header) header.classList.remove("scrolled");
    if (scrollTop) scrollTop.classList.remove("visible");
  }
});

// Hiệu ứng "Reveal" (hiện dần khi cuộn trang)
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("active");
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

/**
 * KHỞI TẠO KHI TẢI TRANG XONG
 */
window.addEventListener("DOMContentLoaded", () => {
  // Bắt đầu đồng bộ dữ liệu
  syncData();

  // Xử lý gửi Form Góp Ý (Contact Form)
  const feedbackForm = document.getElementById("contact-form");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById("feedback-submit");
      const name = document.getElementById("feedback-name").value;
      const role = document.getElementById("feedback-role").value;
      const message = document.getElementById("feedback-message").value;

      if (!name || !role || !message) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> <span>Đang gửi...</span>`;

      try {
        await fetch(scriptURL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "addFeedback", name, role, message }),
        });
        alert("Cảm ơn bạn! Ý kiến của bạn đã được gửi thành công.");
        feedbackForm.reset();
      } catch (error) {
        alert("Có lỗi xảy ra khi gửi. Vui lòng thử lại sau!");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Xử lý Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const closeMobileMenu = document.getElementById("close-mobile-menu");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileOverlay = document.getElementById("mobile-nav-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function toggleMenu(show) {
    if (show) {
      mobileNav.classList.add("show");
      mobileOverlay.classList.add("show");
      document.body.style.overflow = "hidden";
    } else {
      mobileNav.classList.remove("show");
      mobileOverlay.classList.remove("show");
      document.body.style.overflow = "";
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => toggleMenu(true));
  }

  if (closeMobileMenu) {
    closeMobileMenu.addEventListener("click", () => toggleMenu(false));
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", () => toggleMenu(false));
  }

  // Đóng menu khi click vào link
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });
});
