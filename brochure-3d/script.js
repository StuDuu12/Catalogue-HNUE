document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const book = document.getElementById('book');
    const instruction = document.querySelector('.instruction');
    
    // Sort pages to ensure correct initialization array order if needed
    // But they are in DOM order. sheet1, sheet2, sheet3.

    pages.forEach((page, index) => {
        page.addEventListener('click', function(e) {
            // Ngăn chặn lật trang nếu người dùng đang click vào nút bấm, link, thẻ có onclick hoặc iframe video
            if (e.target.closest('a') || e.target.closest('iframe') || e.target.closest('button') || e.target.closest('[onclick]')) {
                return;
            }

            // Nếu trang hiện tại ĐÃ LẬT (nằm bên trái) -> Lật ngược lại về phải
            if (this.classList.contains('flipped')) {
                // Đảm bảo chỉ trang nằm trên cùng của chồng bên trái mới được lật về
                // Trang trên cùng bên trái là trang có index lớn nhất trong số các trang bị flipped
                this.classList.remove('flipped');
            } 
            // Nếu trang CHƯA LẬT (nằm bên phải) -> Lật sang trái
            else {
                // Đảm bảo chỉ trang nằm trên cùng của chồng bên phải mới được lật
                this.classList.add('flipped');
            }

            updateBookPosition();
        });
        });

    function updateBookPosition() {
        const flippedCount = document.querySelectorAll('.page.flipped').length;
        const totalPages = pages.length;
        
        if (flippedCount === 0) {
            // Đóng trang đầu
            book.style.transform = `translateX(0%)`;
            instruction.style.display = 'block';
            instruction.textContent = "BẤM VÀO TRANG ĐỂ LẬT CATALOGUE";
        } 
        else if (flippedCount === totalPages) {
            // Đóng bìa sau (tất cả trang đã lật sang trái)
            // Lật thẳng, không nghiêng. Tịnh tiến 100% chiều rộng để căn Spine sang mép phải thực.
            book.style.transform = `translateX(100%)`;
            instruction.style.display = 'block';
            instruction.textContent = "BẤM VÀO TRANG ĐỂ LẬT TRỞ LẠI";
        }
        else {
            // Đang mở ở giữa cuốn
            // Căn gáy sách (Spine) ở giữa màn hình: tịnh tiến 50%
            book.style.transform = `translateX(50%)`;
            instruction.style.display = 'none';
        }
    }

    // Tự động sinh Số Trang cho 16 mặt cắt
    const faces = document.querySelectorAll('.face');
    faces.forEach((face, index) => {
        // Có thể bỏ qua trang bìa đầu (index===0) nếu không thích hiển thị số "01"
        if (index === 0) return;
        
        const pageNum = index + 1;
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page-number';
        pageDiv.textContent = (pageNum < 10 ? '0' : '') + pageNum;
        
        const wrapper = face.querySelector('.content-wrapper');
        if (wrapper) {
            wrapper.appendChild(pageDiv);
        }
    });
});

// ===== MODAL LOGIC (Global Scope) =====
const facultyData = {
    'cnpm': {
        title: 'BỘ MÔN CÔNG NGHỆ PHẦN MỀM',
        url: 'https://fit.hnue.edu.vn/gioi-thieu/bo-mon-trung-tam/cong-nghe-phan-mem.html',
        lecturers: [
            { name: 'TS. Đặng Thành Trung', title: 'Phó Trưởng Khoa / Giảng viên', email: 'trungdt@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/canbo/trungdt.jpg' },
            { name: 'TS. Nguyễn Thị Thanh Huyền', title: 'Trưởng bộ môn', email: 'ntthuyen@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/se_group.jpg' },
            { name: 'ThS. Trần Hải Long', title: 'Giảng viên', email: 'longth@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/se_group.jpg' },
            { name: 'ThS. Nguyễn Thị Xuyến', title: 'Giảng viên', email: 'xuyennth@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/se_group.jpg' },
            { name: 'CN. Bùi Quang Vinh (HVCH)', title: 'Giảng viên tạo nguồn', email: 'vinhbq@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/se_group.jpg' }
        ]
    },
    'httt': {
        title: 'BỘ MÔN HỆ THỐNG THÔNG TIN',
        url: 'https://fit.hnue.edu.vn/gioi-thieu/bo-mon-trung-tam/he-thong-thong-tin.html',
        lecturers: [
            { name: 'PGS. TS. Phạm Thọ Hoàn', title: 'Giảng viên cao cấp', email: 'hoanpt@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/canbo/hungtd.jpg' },
            { name: 'ThS. Lê Xuân Hiền', title: 'Giảng viên', email: 'lexuanhien@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/httt-3.jpg' }        ]
    },
    'khmt': {
        title: 'BỘ MÔN KHOA HỌC MÁY TÍNH',
        url: 'https://fit.hnue.edu.vn/gioi-thieu/bo-mon-trung-tam/khoa-hoc-may-tinh.html',
        lecturers: [
            { name: 'TS. Đỗ Trung Kiên', title: 'Trưởng Khoa / Trưởng bộ môn', email: 'kiendt@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/canbo/kien.jpg' },
            { name: 'TS. Phạm Thị Lan', title: 'Giảng viên chính', email: 'ptlan@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/canbo/longth.jpg' },
            { name: 'ThS. Nguyễn Thị Hồng (NCS)', title: 'Giảng viên chính', email: 'nguyenhong@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/canbo/khmt-3.jpg' },
            { name: 'ThS. Nguyễn Khắc Ân', title: 'Giảng viên', email: 'annk@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/canbo/khmt-3.jpg' }
        ]
    },
    'ktmt': {
        title: 'BỘ MÔN KỸ THUẬT MÁY TÍNH',
        url: 'https://fit.hnue.edu.vn/gioi-thieu/bo-mon-trung-tam/ki-thuat-may-tinh.html',
        lecturers: [
            { name: 'TS. Nguyễn Thế Lộc', title: 'Trưởng bộ môn', email: 'locnt@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/ktmt-2.jpg' },
            { name: 'TS. Vũ Thái Giang', title: 'Giảng viên', email: 'giangvt@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/ktmt-2.jpg' },
            { name: 'ThS. Nguyễn Thị Quỳnh Hoa (NCS)', title: 'Giảng viên', email: 'hoantq@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/to-hanh-chinh-3.jpg' },
            { name: 'ThS. Đỗ Ba Chín', title: 'Giảng viên / Bí thư Đoàn Trường / Bí thư LCĐ Khoa CNTT', email: 'chindb@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/to-hanh-chinh-3.jpg' },
            { name: 'CN. Nguyễn Duy Hải (HVCH)', title: 'Giảng viên tạo nguồn', email: 'ndhai@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/to-hanh-chinh-3.jpg' }
        ]
    },
    'ppgd': {
        title: 'BỘ MÔN PHƯƠNG PHÁP GIẢNG DẠY',
        url: 'https://fit.hnue.edu.vn/gioi-thieu/bo-mon-trung-tam/phuong-phap-giang-day.html',
        lecturers: [
            { name: 'TS. Nguyễn Chí Trung', title: 'Trưởng bộ môn', email: 'trungnc@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/ppgd-2.jpg' },
            { name: 'TS. Kiều Phương Thuỳ', title: 'Giảng viên / CT Công đoàn', email: 'thuykp@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/ppgd-2.jpg' },
            { name: 'ThS. Nguyễn Thị Hồng', title: 'Giảng viên', email: 'nguyenthihong@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/ppgd-2.jpg' },
            { name: 'ThS. Nguyễn Trung Khánh', title: 'Giảng viên', email: 'khanhnt1312@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/ppgd-2.jpg' },
            { name: 'ThS. Trần Thị Thu Bình', title: 'Giáo viên thực hành', email: 'tranbinh@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/tintuc/ppgd-2.jpg' }
        ]
    },
    'thc': {
        title: 'TỔ HÀNH CHÍNH - KỸ THUẬT',
        url: 'https://fit.hnue.edu.vn/gioi-thieu/bo-mon-trung-tam/to-hanh-chinh-ki-thuat.html',
        lecturers: [
            { name: 'ThS. Phạm Công Thành', title: 'Quản lý sinh viên', email: 'thanhpc@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/canbo/thanhpc.jpg' },
            { name: 'CN. Trần Thu Hà', title: 'Giáo vụ Khoa', email: 'hatht@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/canbo/ttha.jpg' },
            { name: 'CN. Đinh Hoàng Minh', title: 'Kỹ thuật viên', email: 'minhdh@hnue.edu.vn', img: 'https://fit.hnue.edu.vn/uploads/fit/canbo/minhdh.jpg' }
        ]
    }
};

function openFacultyModal(deptId) {
    const data = facultyData[deptId];
    if (!data) return;

    document.getElementById('modalTitle').textContent = data.title;
    
    // Nút xem chi tiết bộ môn
    const actionContainer = document.getElementById('modalAction');
    if (data.url) {
        actionContainer.innerHTML = `<a href="${data.url}" target="_blank" style="display: inline-block; background: var(--cyan); color: var(--navy); padding: 8px 15px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.9rem; box-shadow: 0 4px 10px rgba(0, 229, 255, 0.3); transition: transform 0.2s;">Xem chi tiết Bộ môn &rarr;</a>`;
    } else {
        actionContainer.innerHTML = '';
    }

    const grid = document.getElementById('lecturerGrid');
    grid.innerHTML = ''; // Clear previous

    data.lecturers.forEach(lec => {
        grid.innerHTML += `
            <div class="lecturer-card">
                <img src="${lec.img}" alt="${lec.name}" class="lecturer-avatar" onerror="this.style.display='none'">
                <p class="lecturer-name">${lec.name}</p>
                <p class="lecturer-title">${lec.title}</p>
                <a href="mailto:${lec.email}" class="lecturer-email">${lec.email}</a>
            </div>
        `;
    });

    document.getElementById('facultyModal').classList.add('active');
}

function closeFacultyModal() {
    document.getElementById('facultyModal').classList.remove('active');
}

// Close when clicking outside of modal content
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('facultyModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeFacultyModal();
            }
        });
    }
});
