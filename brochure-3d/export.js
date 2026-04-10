const puppeteer = require('puppeteer');
const path = require('path');

const url = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
const outputDir = path.resolve(__dirname, 'output');

(async () => {
    console.log('Khởi động trình duyệt...');
    const browser = await puppeteer.launch({ 
        headless: 'new',
        defaultViewport: { width: 750, height: 1050, deviceScaleFactor: 2 }
    });
    const page = await browser.newPage();
    
    console.log('Mở trang HTML...');
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Đợi load font & ảnh
    await new Promise(r => setTimeout(r, 2000));

    // Tổng số sheet
    const sheetCount = await page.$$eval('.page', pages => pages.length);
    console.log(`Tìm thấy ${sheetCount} tờ (sheet) => ${sheetCount * 2} trang.`);

    let pageNum = 1;
    for (let i = 1; i <= sheetCount; i++) {
        // === CHỤP MẶT TRƯỚC (front) ===
        await page.evaluate((sheetIndex, total) => {
            // Ẩn toàn bộ UI không cần thiết
            document.querySelectorAll('.nav-btn, .book-container, .scene').forEach(el => {
                el.style.perspective = 'none';
            });
            
            // Ẩn tất cả các sheet
            for (let j = 1; j <= total; j++) {
                document.getElementById('sheet' + j).style.display = 'none';
            }
            
            // Hiện sheet hiện tại
            const sheet = document.getElementById('sheet' + sheetIndex);
            sheet.style.display = 'block';
            sheet.style.position = 'relative';
            sheet.style.transform = 'none';
            sheet.style.width = '750px';
            sheet.style.height = '1050px';
            sheet.style.zIndex = '999';

            // Chỉ hiện mặt front
            const front = sheet.querySelector('.front');
            const back = sheet.querySelector('.back');
            front.style.position = 'relative';
            front.style.transform = 'none';
            front.style.backfaceVisibility = 'visible';
            front.style.width = '750px';
            front.style.height = '1050px';
            front.style.zIndex = '10';
            back.style.display = 'none';

            // Ẩn book container margins
            const book = document.querySelector('.book');
            book.style.transform = 'none';
            book.style.transformStyle = 'flat';
            book.style.width = '750px';
            book.style.height = '1050px';

            const scene = document.querySelector('.scene');
            if (scene) {
                scene.style.perspective = 'none';
                scene.style.display = 'flex';
                scene.style.justifyContent = 'center';
                scene.style.alignItems = 'flex-start';
                scene.style.padding = '0';
                scene.style.margin = '0';
            }
            
            const bc = document.querySelector('.book-container');
            if (bc) bc.style.perspective = 'none';
        }, i, sheetCount);

        await new Promise(r => setTimeout(r, 300));

        // Lấy đúng vùng của face front
        const frontEl = await page.$(`#sheet${i} .front`);
        if (frontEl) {
            const frontPath = path.join(outputDir, `Trang_${pageNum.toString().padStart(2, '0')}.png`);
            await frontEl.screenshot({ path: frontPath });
            console.log(`✅ Đã lưu: Trang_${pageNum.toString().padStart(2, '0')}.png`);
        }
        pageNum++;

        // === CHỤP MẶT SAU (back) ===
        await page.evaluate((sheetIndex) => {
            const sheet = document.getElementById('sheet' + sheetIndex);
            const front = sheet.querySelector('.front');
            const back = sheet.querySelector('.back');
            
            // Ẩn front, hiện back
            front.style.display = 'none';
            back.style.display = 'block';
            back.style.position = 'relative';
            back.style.transform = 'none';
            back.style.backfaceVisibility = 'visible';
            back.style.width = '750px';
            back.style.height = '1050px';
            back.style.zIndex = '10';
        }, i);

        await new Promise(r => setTimeout(r, 300));

        const backEl = await page.$(`#sheet${i} .back`);
        if (backEl) {
            const backPath = path.join(outputDir, `Trang_${pageNum.toString().padStart(2, '0')}.png`);
            await backEl.screenshot({ path: backPath });
            console.log(`✅ Đã lưu: Trang_${pageNum.toString().padStart(2, '0')}.png`);
        }
        pageNum++;
    }

    console.log('\n🎉 Hoàn thành xuất toàn bộ 16 ảnh catalogue!');
    console.log(`📂 Thư mục: ${outputDir}`);
    await browser.close();
})();
