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
    if (tr.type === "thu") tin += tr.amount;
    else tout += tr.amount;
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
    const isThu = tr.type === "thu";
    const d = tr.date ? new Date(tr.date).toLocaleDateString("vi-VN") : "--";
    history.innerHTML += `
      <tr class="border-b border-white/5 py-4">
        <td class="py-4 text-gray-400 font-bold">${d}</td>
        <td class="py-4 font-medium">${tr.content}</td>
        <td class="py-4"><span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isThu ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}">${tr.type}</span></td>
        <td class="py-4 font-bold ${isThu ? "text-green-400" : "text-red-400"}">${isThu ? "+" : "-"}${tr.amount.toLocaleString()}</td>
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
    const isThu = tr.type === "thu";
    const d = tr.date ? new Date(tr.date).toLocaleDateString("vi-VN") : "--";
    tbody.innerHTML += `
      <tr class="border-b border-white/5 hover:bg-white/5 transition">
        <td class="py-4 font-bold text-gray-400">${d}</td>
        <td class="py-4">${tr.content}</td>
        <td class="py-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isThu ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}">${tr.type}</span></td>
        <td class="py-4 font-bold ${isThu ? "text-green-400" : "text-red-400"}">${isThu ? "+" : "-"}${tr.amount.toLocaleString()}đ</td>
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

// Vẽ bộ sưu tập ảnh hoạt động
function renderMedia(list) {
  const grid = document.getElementById("media-grid");
  if (!grid) return;
  grid.innerHTML = "";
  list.forEach((item, i) => {
    grid.innerHTML += `
      <div class="bento-item ${i === 0 ? "bento-main" : ""} group overflow-hidden relative rounded-[32px]">
        <img src="${item.image_url}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110">
        <div class="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h4 class="text-white font-bold text-lg">${item.title}</h4>
        </div>
      </div>`;
  });
}

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

// Vẽ biểu đồ thi đua các tổ
function renderEmulation(groups) {
  const container = document.getElementById("emulation-list");
  if (!container) return;
  container.innerHTML = "";
  const colors = ["orange", "blue", "green", "purple"];
  groups.forEach((g, i) => {
    const color = colors[i % colors.length];
    const percent = Math.min(100, g.score || 0);
    container.innerHTML += `
      <div>
        <div class="flex justify-between items-end mb-4">
          <p class="text-xl font-black">${g.groupName}</p>
          <p class="text-4xl font-black text-${color}-400 tracking-tighter">${g.score}<span class="text-xs uppercase ml-1">đ</span></p>
        </div>
        <div class="h-4 w-full bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-${color}-400 rounded-full" style="width: ${percent}%"></div>
        </div>
      </div>`;
  });
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
async function askAI(q) {
  const resBox = document.getElementById("ai-result");
  const load = document.getElementById("ai-loading");
  if (load) load.classList.remove("hidden");
  setTimeout(() => {
    let txt =
      "### Kết quả phân tích Gemini AI\n\nĐây là phản hồi chuyên nghiệp từ hệ thống thông minh.\n\n* **Độ chính xác:** 99%\n* **Trạng thái:** Hoàn tất\n\n> Chúc tập thể lớp có một ngày học tập thật tốt!";
    if (resBox && typeof marked !== "undefined")
      resBox.innerHTML = marked.parse(txt);
    if (load) load.classList.add("hidden");
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
