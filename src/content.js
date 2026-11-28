// Every word and fact on the page, in Vietnamese and English. The page components are in App.jsx.

// The release offered is in server/release.js, which the download counter (functions/tai) reads too.
import { VERSION, r2Url } from '../server/release.js';

export { VERSION };

export const links = {
  // The download buttons count the click (functions/tai) and send the browser to the ISO on Cloudflare R2; the backup
  // links go the same way to SourceForge. ?from=<place> on a button says where the click came from.
  download: '/tai/cinnamon',
  downloadXfce: '/tai/xfce',
  mirrorCinnamon: '/tai/cinnamon?mirror=sourceforge',
  mirrorXfce: '/tai/xfce?mirror=sourceforge',
  // The files themselves, for search engines and llms.txt (not counted).
  isoCinnamon: r2Url('cinnamon'),
  isoXfce: r2Url('xfce'),
  release: `https://github.com/VN-Linux-Family/CaramOS/releases/tag/v${VERSION}`,
  checksums: `https://github.com/VN-Linux-Family/CaramOS/releases/download/v${VERSION}/SHA256SUMS`,
  checksumsXfce: `https://github.com/VN-Linux-Family/CaramOS/releases/download/v${VERSION}/SHA256SUMS-xfce`,
  repo: 'https://github.com/VN-Linux-Family/CaramOS',
  org: 'https://github.com/VN-Linux-Family',
  vnlf: 'https://vietnamlinuxfamily.net',
  apps: 'https://apps.vietnamlinuxfamily.net',
  facebook: 'https://www.facebook.com/groups/vietnamlinuxcommunity',
  telegram: 'https://t.me/vietnamlinuxfamily',
  discord: 'https://discord.gg/gVAJDUMC2n',
  issues: 'https://github.com/VN-Linux-Family/CaramOS/issues',
  appExplorer: 'https://github.com/VN-Linux-Family/apps-vietnamlinuxfamily',
  mirror: 'https://github.com/VN-Linux-Family/mirror',
  unikorn: 'https://unikorn.vn/p/caramos?ref=embed-caramos',
  installer: '/install-caramos-ota.sh',
  // Where the contact forms of the Education and Business pages send their email. The same address is in the
  // CaramOS packages' metadata; change it here only.
  contactEmail: 'developer@vietnamlinuxfamily.net',
  // The Facebook profile the owner gave for the contact block of the Education and Business pages (2026-11-23).
  contactFacebook: 'https://www.facebook.com/mrd.900s/',
};

export const installCommand = 'curl -fsSL https://caramos.vietnamlinuxfamily.net/install-caramos-ota.sh | sudo bash';
export const upgradeCommand = 'sudo caramos-ota --upgrade --yes';
export const shots = '/assets/screenshots';
// The first picture of the home page: the App Center at the first login (redesigned in 1.5.0). The prerender preloads
// it and names it in the JSON-LD; its phone copy is in smallCopies.
export const heroShot = `${shots}/first-login-150.webp`;

// The Canon CAPT printers Driver Check sets up, as in its tables (caramos-ota: canon_capt.USB_MODELS and MODELS,
// knowledge.CAPTDRIVER_MODELS and CAPTDRIVER_WORKS). [name, experimental]
export const canonUsbPrinters = ['LBP-1120', 'LBP-1210', 'LBP3200', 'LBP3210', 'LBP3300', 'LBP3310', 'LBP3500', 'LBP5000',
  'LBP5050', 'LBP5100', 'LBP5300', 'LBP6020', 'LBP6200', 'LBP6300dn', 'LBP7010C/LBP7018C', 'LBP7200C/LBP7200Cdn',
  'LBP9100Cdn'].map((name) => [name, false]);
export const captdriverPrinters = [['LBP2900/LBP2900B', false], ['LBP3000', true], ['LBP3010/LBP3018/LBP3050', false],
  ['LBP3100/LBP3108/LBP3150', true], ['LBP6000/LBP6018', true]];
export const networkPrinters = ['LBP3300', 'LBP3310', 'LBP3500', 'LBP5000', 'LBP5050', 'LBP5300', 'LBP6300dn', 'LBP6300n',
  'LBP6310dn', 'LBP7200C/LBP7200Cdn', 'LBP7210Cdn', 'LBP9100Cdn', 'LBP9200C'].map((name) => [name, false]);

export const banners = [
  [`${shots}/first-login.webp`, 'heroLightAlt'],
  [`${shots}/desktop-dark.webp`, 'heroDarkAlt'],
];

export const githubApi = {
  repo: 'https://api.github.com/repos/VN-Linux-Family/CaramOS',
  contributors: 'https://api.github.com/repos/VN-Linux-Family/CaramOS/contributors?per_page=12',
};

export const fallbackRepo = {
  stargazers_count: '—',
  forks_count: '—',
  open_issues_count: '—',
  license: { spdx_id: 'GPL-3.0' },
};

export function compactNumber(value) {
  if (typeof value !== 'number') return value;
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}



export const copy = {
  vi: {
    language: 'EN',
    nav: ['Tổng quan', 'Bản Xfce', 'Tính năng', 'Máy in', 'Nâng cấp', 'Release note', 'Hệ sinh thái', 'Tải ISO'],
    heroBadge: `Bản chính thức ${VERSION} · Linux Mint 22.3 Cinnamon và Xfce · GPL-3.0`,
    upgradeNotice: `Đang dùng CaramOS? Lên ${VERSION} không cần cài lại`,
    seoTitle: `CaramOS ${VERSION} — hệ điều hành Linux cho người Việt`,
    seoDescription: `CaramOS ${VERSION}, bản phát hành chính thức dựa trên Linux Mint 22.3 Cinnamon và Ubuntu 24.04 LTS, có thêm bản Xfce cho máy 2 GB và phòng máy ở trường học: tiếng Việt và bộ gõ Lotus có sẵn, App Center cài ứng dụng bằng một nút, Kiểm tra driver, Control Center, Góp ý & hỗ trợ và cập nhật OTA không cần cài lại.`,
    heroTitle: 'CaramOS — bản phân phối Linux cho người dùng Việt Nam',
    heroLead: `Bản phát hành chính thức ${VERSION} trên nền Linux Mint 22.3 và Ubuntu 24.04 LTS, có hai bản: Cinnamon cho máy từ 4 GB RAM, và Xfce nhẹ hơn cho máy 2 GB và phòng máy ở trường. Tiếng Việt và bộ gõ Lotus có sẵn, App Center cài ứng dụng bằng một nút, Kiểm tra driver báo ngay máy còn thiếu gì, và cộng đồng Vietnam Linux Family ở ngay trên thanh tác vụ.`,
    downloadCinnamon: 'Tải bản Cinnamon',
    downloadCinnamonNote: '2,9 GB, cho máy từ 4 GB RAM',
    downloadXfce: 'Tải bản Xfce',
    downloadXfceNote: '2,7 GB, cho máy 2 GB và phòng máy',
    mirrorLead: 'Không tải được? Dùng link dự phòng trên SourceForge:',
    mirrorCinnamon: 'bản Cinnamon',
    mirrorXfce: 'bản Xfce',
    mirrorLink: 'Link dự phòng (SourceForge)',
    featuresCta: 'Xem tính năng',
    checksums: 'SHA256 bản Cinnamon',
    releaseDetails: 'Chi tiết phát hành',
    heroLightAlt: 'CaramOS ở lần đăng nhập đầu tiên: App Center và Kiểm tra driver',
    heroDarkAlt: 'CaramOS ở chế độ tối, mở Control Center',
    bannerStackLabel: 'Đổi giữa hai ảnh chụp CaramOS',
    otaBadge: 'Trung tâm cập nhật CaramOS',
    otaFlowLabel: 'Ba bước nâng cấp trong Trung tâm cập nhật',
    otaFlow: [
      [`${shots}/update-available-131.webp`, 'Trung tâm cập nhật báo có bản 1.3.1', 'Trung tâm cập nhật tự báo khi có bản mới.'],
      [`${shots}/update-progress.webp`, 'Trung tâm cập nhật đang cập nhật CaramOS', 'Bấm Cập nhật và nhập mật khẩu, CaramOS tự làm từng bước.'],
      [`${shots}/update-done.webp`, 'Cập nhật CaramOS thành công', 'Xong là dùng tiếp. Dữ liệu và ứng dụng của bạn vẫn nguyên.'],
    ],
    source: 'Mã nguồn',
    community: 'Cộng đồng',
    supportPage: 'Donate',
    statLabels: ['Stars', 'Forks', 'Issues', 'License'],
    contributorsTitle: 'Người đóng góp',
    contributorsLead: 'Danh sách lấy trực tiếp từ kho mã CaramOS trên GitHub.',
    contributorsFallback: 'Chưa tải được danh sách từ GitHub. Bạn xem danh sách mới nhất trên GitHub nhé.',
    xfce: {
      tag: 'Mới trong 1.4.0',
      title: 'CaramOS Xfce: nhẹ cho máy 2 GB và phòng máy ở trường',
      lead: 'Bản mới dành cho máy 2 GB RAM, máy cũ và phòng máy ở trường học. Nhẹ hơn bản Cinnamon mà vẫn đủ những thứ quen thuộc của CaramOS.',
      points: [
        'Vừa bật máy, Task Manager báo khoảng 610 MB RAM trên máy 2 GB; bản Cinnamon đo cùng cách khoảng 780 MB.',
        'Vẫn có thanh tác vụ ba đảo, Control Center, App Center, Kiểm tra driver, Góp ý & hỗ trợ, bộ gõ tiếng Việt và Trung tâm cập nhật.',
        'Giao diện mặc định là tiếng Anh, đúng chữ trong sách Tin học (New, Folder, Copy, Paste…), học sinh nhìn sách là làm theo được. Chọn tiếng Việt lúc cài thì có giao diện tiếng Việt; gõ tiếng Việt vẫn như bình thường.',
        'Tệp: bấm chuột phải chọn New ▸ Folder, có sẵn mẫu Word, Excel, PowerPoint; khung bên trái là cây thư mục như Windows Explorer.',
      ],
      download: 'Tải bản Xfce (2,7 GB)',
      checksums: 'SHA256 bản Xfce',
      stackLabel: 'Đổi giữa hai ảnh chụp bản Xfce',
      images: [
        [`${shots}/xfce-desktop-140.webp`, 'CaramOS Xfce với Control Center mở ở góc phải thanh tác vụ'],
        [`${shots}/xfce-files-140.webp`, 'Tệp trên bản Xfce: chuột phải chọn New ▸ Folder, khung trái là cây thư mục'],
      ],
      cards: [
        {
          title: 'Phòng máy: quản lý lớp học bằng vài cú bấm',
          text: 'Công cụ Phòng máy tự cài và thiết lập Veyon (hoặc Epoptes, nhẹ hơn) để giáo viên xem màn hình, gửi tin nhắn và điều khiển máy học sinh. Máy giáo viên hiện một mã 6 số; máy học sinh tự tìm máy giáo viên trong mạng của trường, nhập mã là vào lớp.',
          image: [`${shots}/lab-veyon-140.webp`, 'Veyon Master trên máy giáo viên thấy màn hình của máy học sinh'],
          overlay: [`${shots}/lab-code-140.webp`, 'Mã ghép nối 6 số trên máy giáo viên'],
        },
        {
          title: 'Phần mềm học tập trong App Center',
          text: 'Hai bước Tin học cho các em và Lập trình, Toán, Khoa học và soạn bài giảng có 17 phần mềm, trong đó có GCompris, Tux Paint, Klavaro (luyện gõ phím), KTurtle, Thonny (học Python), Stellarium, TurboWarp (Scratch 3) và GeoGebra. Không có gì chọn sẵn, nên máy ở nhà không phải tải về nếu không cần.',
          image: [`${shots}/app-center-edu-150.webp`, 'Phần mềm học tập trong App Center (ảnh chụp bản 1.5.0)'],
        },
      ],
      note: 'Phòng máy, phần mềm học tập, Mới ▸ Thư mục và cây thư mục có trên cả hai bản. Máy đang chạy bản Cinnamon không tự chuyển sang Xfce; muốn dùng bản Xfce thì cài mới từ ISO Xfce.',
    },
    featuresTitle: 'Dùng Linux có khó không?',
    featuresLead: 'Trên CaramOS thì không. Cài ứng dụng, cài driver, đổi thiết lập hay cập nhật máy đều làm bằng nút bấm, không phải gõ lệnh. Gặp khó thì bạn hỏi cộng đồng ngay trên thanh tác vụ.',
    features: [
      {
        id: 'app-center', tag: 'Mới trong 1.3.0',
        title: 'Cài Zalo, Chrome, bộ văn phòng bằng một nút',
        lead: 'Lần đầu đăng nhập, App Center mở ra với các ứng dụng hay dùng đã chọn sẵn. Bấm Cài một lần, rồi cứ dùng máy trong lúc CaramOS tải và cài.',
        points: [
          'Bộ văn phòng: ONLYOFFICE, WPS Office hoặc LibreOffice, bộ nào cũng mở được tệp Word, Excel. Trình duyệt: Chrome, Cốc Cốc, Edge, Brave, Firefox.',
          'Liên lạc: Zalo, Telegram, Zoom, Teams for Linux, Discord. Mở Zalo lần đầu, bạn quét mã QR bằng Zalo trên điện thoại là đăng nhập được.',
          'Mỗi ứng dụng ghi rõ ưu, nhược điểm, dung lượng và nguồn cài (Flathub, kho Ubuntu hay gói tải về), để bạn chọn cái hợp với máy.',
          'Không dùng nữa thì bấm Gỡ cạnh tên ứng dụng. App Center mở lại được từ Desktop hoặc menu.',
        ],
        media: { type: 'single', main: [`${shots}/app-center-store-150.webp`, 'App Center: các ứng dụng xếp theo mục Văn phòng, Giáo dục…, mỗi ứng dụng có dung lượng và nút Cài đặt; danh sách mục ở bên trái'] },
        link: ['Tìm thêm ứng dụng ở Kho ứng dụng VNLF', links.apps],
      },
      {
        id: 'driver-check', tag: 'Mới trong 1.3.0',
        title: 'Biết máy chạy được không, trước khi cài',
        lead: 'Chạy thử CaramOS từ USB là Kiểm tra driver báo máy còn thiếu gì: Wi-Fi, âm thanh, đồ họa hay máy in. Máy tính cũ nên qua bước này trước khi cài. Cài xong, Kiểm tra driver chạy lại ở lần đăng nhập đầu tiên, sau đó chỉ báo khi có vấn đề mới.',
        points: [
          'Kiểm tra Wi-Fi, mạng dây, đồ họa, âm thanh, Bluetooth, webcam, đầu đọc vân tay và máy in Canon dùng CAPT (LBP2900, LBP6300dn…).',
          'Thiếu driver NVIDIA hay Wi-Fi Broadcom thì bấm một nút là cài, đúng bản Ubuntu khuyên dùng cho máy đó. Máy in Canon cũng vậy, kể cả máy in qua mạng LAN.',
          'Chưa vào được mạng? Kiểm tra driver chỉ cách nối dây LAN, chia mạng từ điện thoại qua USB, hoặc cài driver thẳng từ USB CaramOS.',
          'Vẫn chưa xong thì bấm Nhờ giúp đỡ. Cộng đồng VNLF nhận lời nhắn kèm thông tin phần cứng của máy.',
        ],
        media: { type: 'single', main: [`${shots}/driver-check.webp`, 'Kiểm tra driver khi chạy thử từ USB báo “Máy này chạy tốt với CaramOS”, kèm tình trạng Wi-Fi, mạng dây, đồ họa, âm thanh, Bluetooth và webcam'] },
      },
      // The Update Center block (automatic updates since 1.5.0) is in whatsNew for now.
      {
        id: 'control-center', tag: 'Desktop',
        title: 'Wi-Fi, âm lượng, chế độ tối ở cùng một chỗ',
        lead: 'Bấm góc phải thanh tác vụ là mở Control Center. Mạng, âm thanh, Bluetooth, chế độ tối và chế độ nguồn nằm chung một bảng.',
        points: [
          'Chỉnh âm lượng loa, micro và chọn phát ra tai nghe hay loa; lăn chuột trên biểu tượng là chỉnh âm lượng.',
          'Bật tắt mạng dây, Wi-Fi, VPN, Bluetooth; mỗi ô có danh sách để chọn nhanh.',
          'Chế độ tối, Ánh sáng đêm, Không làm phiền và Chế độ nguồn: Hiệu năng, Cân bằng, Tiết kiệm pin.',
          'Độ sáng màn hình laptop và màn hình rời hỗ trợ DDC/CI, pin laptop, chụp màn hình, mở Cài đặt, khoá máy, tắt máy.',
        ],
        media: { type: 'pair', main: [`${shots}/control-center-light.webp`, 'Control Center giao diện sáng'], second: [`${shots}/control-center-dark.webp`, 'Control Center giao diện tối'] },
      },
      {
        id: 'help', tag: 'Mới trong 1.3.0',
        title: 'Gặp khó thì hỏi ngay trên thanh tác vụ',
        lead: 'Bấm dấu hỏi Góp ý & hỗ trợ ở góc phải thanh tác vụ để nhờ giúp đỡ, báo lỗi hay góp ý. Lời nhắn đi thẳng tới cộng đồng Vietnam Linux Family, và người trong cộng đồng trả lời bằng tiếng Việt.',
        points: [
          'Đính kèm ảnh chụp màn hình (làm mờ được chỗ riêng tư) hoặc video tối đa 1 phút, đã nén nhỏ và bỏ thông tin vị trí.',
          'Khi bạn đồng ý, lời nhắn kèm thông tin phần cứng và kết quả Kiểm tra driver, đã bỏ tên người dùng, tên máy và địa chỉ IP.',
          'Theo dõi yêu cầu của mình và nhận thông báo khi có người trả lời.',
          'VNLF duyệt trước khi đăng; thông tin liên hệ của bạn không công khai.',
        ],
        media: { type: 'stack', main: [`${shots}/help-form.webp`, 'Cửa sổ Góp ý & hỗ trợ'], overlay: [`${shots}/help-menu.webp`, 'Menu Góp ý & hỗ trợ với tình trạng các yêu cầu'] },
      },
      {
        id: 'island-dock', tag: 'Desktop', wide: true,
        title: 'Thanh tác vụ quen tay như Windows',
        lead: 'Thanh tác vụ chia thành ba đảo bo tròn: Start Menu bên trái, ứng dụng ở giữa, đồng hồ và cài đặt nhanh bên phải. Người quen Windows nhìn là biết bấm vào đâu.',
        points: [
          'Đảo trái: Start Menu tìm ứng dụng bằng tiếng Việt, gõ không dấu vẫn ra; giữ Ctrl rồi lăn chuột để phóng to, thu nhỏ biểu tượng.',
          'Đảo giữa: ứng dụng ghim và đang chạy, có chấm nhỏ dưới ứng dụng đang mở; để ở giữa hay sát bên trái tùy bạn, trong ô Thanh tác vụ của Control Center.',
          'Đảo phải: khay hệ thống, bộ gõ, đồng hồ, Control Center và Góp ý & hỗ trợ.',
        ],
        media: { type: 'wide', main: [`${shots}/island-dock.webp`, 'Ba đảo của thanh tác vụ CaramOS'], phone: `${shots}/island-dock-mobile.webp` },
      },
      {
        id: 'look', tag: 'Giao diện',
        title: 'Sáng hay tối, đổi bằng một lần bấm',
        lead: 'Từ menu khởi động tới màn hình chính dùng chung một giao diện: theme Cinnamon Delight, biểu tượng Tela Circle và phông Be Vietnam Pro.',
        points: [
          'Bấm một lần trong Control Center là chuyển sang chế độ tối, hình nền đổi theo.',
          'Năm hình nền vẽ riêng cho CaramOS: Sage Mist khi sáng, Indigo Night khi tối.',
          'Menu khởi động, màn hình chờ, trình cài đặt và menu GRUB cùng một giao diện.',
          'Menu Start và menu chuột phải bo tròn góc, như các đảo của thanh tác vụ.',
        ],
        media: { type: 'single', main: [`${shots}/desktop-dark.webp`, 'CaramOS ở chế độ tối'] },
      },
      {
        id: 'vietnamese', tag: 'Tiếng Việt',
        title: 'Gõ tiếng Việt ngay sau khi cài',
        lead: 'Cài xong là gõ được tiếng Việt, không phải cài thêm bộ gõ. Giờ Việt Nam và cách ghi ngày tháng cũng đặt sẵn.',
        points: [
          'Bộ gõ Fcitx5 + Lotus bật sẵn kiểu Telex. Muốn gõ VNI thì chọn trong Cài đặt Lotus ▸ Tổng quan ▸ Kiểu gõ.',
          'Ctrl+Shift chuyển giữa tiếng Việt và tiếng Anh. Khay hệ thống hiện chữ V khi gõ tiếng Việt, chữ A trong ô vuông khi gõ tiếng Anh.',
          'Ứng dụng cài từ Flathub vẫn gõ được tiếng Việt và dùng phông hệ thống như thường.',
          'Đổi sang ngôn ngữ khác trong Cài đặt thì cả hệ thống đổi theo.',
        ],
        media: { type: 'single', main: [`${shots}/installer-lotus.webp`, 'Trang giới thiệu bộ gõ Fcitx5 Lotus trong trình chiếu hiện ra lúc đang cài CaramOS'] },
      },
    ],
    printers: {
      tag: 'Mới trong 1.3.9',
      title: 'Có máy in laser Canon? Driver cài bằng một\u00a0nút',
      lead: 'Máy in laser Canon dùng CAPT như LBP2900, LBP3300 hay LBP6300dn vốn khó cài trên Linux. Trên CaramOS, Kiểm tra driver tự nhận ra máy in, cài đúng driver và tạo hàng đợi in. Bạn không phải gõ lệnh nào.',
      steps: [
        ['Cắm máy in', 'Có ngay thông báo “Máy in chưa có driver”.'],
        ['Bấm cài driver', 'Bấm nút cài trong Kiểm tra driver rồi nhập mật khẩu. Driver của Canon cần bạn đồng ý điều khoản của Canon trước.'],
        ['In', 'Khi in, chọn máy in vừa cài. Rút ra cắm lại hay khởi động lại máy vẫn in được.'],
      ],
      image: [`${shots}/printer-canon-driver-check.webp`, 'Kiểm tra driver báo máy in Canon LBP6300 chưa có driver, với nút Cài driver của Canon'],
      models: 'dòng máy',
      usbTitle: 'Cắm cáp USB',
      usbHow: 'Kiểm tra driver tự nhận ra máy in ngay khi cắm vào.',
      canonGroup: 'Driver chính hãng của Canon',
      newLabel: 'Mới',
      captGroup: 'Driver mã nguồn mở captdriver',
      captSince: 'có từ bản 1.3.7',
      experimental: 'thử nghiệm',
      networkTitle: 'Máy in qua mạng LAN',
      networkHow: 'Mở Kiểm tra driver, bấm “Thêm máy in…”, chọn mẫu máy rồi nhập địa chỉ IP của máy in.',
      otherTitle: 'Máy in phun Canon PIXMA hay máy in hãng khác?',
      other: 'Các máy này dùng driver có sẵn trong CaramOS, không nằm trong danh sách trên. Mở Máy in trong menu để thêm máy, rồi chọn hãng và mẫu máy, ví dụ Canon PIXMA MG8120 hay PIXMA iP8720.',
      note: 'Chưa hỗ trợ: LBP810, LBP3600, LBP5200. CaramOS tải driver của Canon thẳng từ máy chủ của Canon và kiểm tra trước khi cài. Điều khoản của Canon cho phép dùng cho mục đích cá nhân, phi thương mại.',
    },
    statsTitle: 'Nhẹ hơn Linux Mint gốc, không đơ khi hết RAM',
    statsLead: 'Đo trên cùng một máy ảo (4 nhân, 6 GB RAM) với Linux Mint 22.3 Cinnamon gốc; RAM đo 5 phút sau khi khởi động.',
    stats: [
      ['2,9 GB', 'ISO cài đặt', 'Linux Mint 22.3: 3,1 GB'],
      ['865 MiB', 'RAM khi máy rảnh', 'Linux Mint 22.3: 941 MiB'],
      ['0 lần', 'đơ máy khi RAM cạn, nhờ earlyoom', 'Linux Mint 22.3 đơ hơn 30 phút (ổ cứng chậm)'],
      ['2029', 'hỗ trợ bảo mật', 'nền Ubuntu 24.04 LTS'],
    ],
    extrasTitle: 'Những thứ nhỏ đã có sẵn',
    extras: [
      ['palette', 'Bộ hình nền CaramOS', 'Năm hình nền vẽ riêng cho CaramOS, đổi theo chế độ sáng và tối.', 'Giao diện'],
      ['camera', 'Chụp màn hình nhanh', 'PrtSc chụp cả màn hình vào bộ nhớ tạm, Ctrl+V là dán vào Zalo hay Word. Super+Shift+S mở Flameshot để chọn vùng, vẽ, làm mờ rồi lưu.', 'Tiện ích'],
      ['shield', 'Menu khởi động CaramOS', 'Menu khởi động, màn hình chờ và menu GRUB của máy cài nhiều hệ điều hành đều mang giao diện CaramOS.', 'Khởi động'],
      ['locale', 'Ngôn ngữ, giờ và ngày tháng kiểu Việt', 'Tiếng Việt, múi giờ Asia/Ho_Chi_Minh, ngày giờ ghi theo kiểu Việt Nam và phông chữ tiếng Việt, đặt sẵn từ đầu.', 'Tiếng Việt'],
    ],
    ecosystemTitle: 'Hệ sinh thái VNLF',
    ecosystemLead:
      'Các kênh và tài nguyên chính thức của Vietnam Linux Family phục vụ trao đổi cộng đồng, phân phối nội dung và phát triển dự án.',
    openSourceTitle: 'Thông tin dự án mã nguồn mở',
    openSourceLead:
      'Bọn mình làm CaramOS công khai trên GitHub, theo giấy phép GPL-3.0. Kho mã có hướng dẫn đóng góp, quy tắc ứng xử, cách dựng ISO và cách bản cập nhật tới máy người dùng.',
    buildTitle: 'Cách dựng ISO',
    buildLead:
      'CaramOS dựng ISO theo cách remaster: giải nén ISO Linux Mint gốc, thêm gói, tệp cấu hình và các bước cập nhật vào hệ thống tệp, rồi đóng gói lại bằng squashfs và xorriso.',
    otaTitle: `Nâng cấp lên CaramOS ${VERSION} không cần cài lại`,
    otaLead:
      `Máy chạy CaramOS 1.0.2 trở lên đã có Trung tâm cập nhật. Nó tự kiểm tra bản mới và báo khi có bản ${VERSION}, bạn bấm Cập nhật là xong. Từ bản 1.5.0, máy tự cài bản mới trong lúc bạn làm việc, trừ khi bạn tắt Tự động cập nhật. Máy còn ở bản 1.0.1 thì chạy lệnh cài Trung tâm cập nhật một lần.`,
    otaInstallLabel: 'Máy CaramOS 1.0.1 (chưa có Trung tâm cập nhật):',
    otaInstallHint: 'Chạy một lần, rồi mở “Trung tâm cập nhật CaramOS” từ Start Menu.',
    otaUpgradeLabel: 'Muốn nâng cấp ngay, không chờ thông báo:',
    otaUpgradeHint: 'Không vội thì bỏ qua bước này. Trung tâm cập nhật tự kiểm tra mỗi ngày và báo khi có bản mới.',
    otaCopy: 'Copy lệnh',
    otaCopyInstallLabel: 'Chép lệnh cài Trung tâm cập nhật',
    otaCopyUpgradeLabel: 'Chép lệnh nâng cấp ngay',
    otaCopied: 'Đã copy',
    otaSteps: [
      ['Máy 1.0.2 trở lên', 'Chờ thông báo của Trung tâm cập nhật rồi bấm Cập nhật.'],
      ['Máy 1.0.1', 'Chạy lệnh cài Trung tâm cập nhật một lần duy nhất.'],
      ['Cần nâng cấp ngay', 'Chạy sudo caramos-ota --upgrade --yes trong Terminal.'],
    ],
    releaseNotesTitle: 'Có gì mới qua từng bản',
    releaseNotesLead:
      (latest) => `${latest} là bản mới nhất. CaramOS phát hành chính thức từ bản 1.3.0; các bản 1.0.x trước đó là Open Beta. Cuộn danh sách để xem thay đổi đáng chú ý của từng bản.`,
    releaseListLabel: 'Danh sách các bản phát hành, cuộn để xem thêm',
    releaseCurrent: 'Mới nhất',
    releaseScrollHint: 'Cuộn để xem các bản trước ↓',
    initialRelease: ['1.0.1', 'Phát hành đầu tiên', ['Bản Open Beta đầu tiên của CaramOS dành cho người dùng Việt Nam.', 'Cung cấp nền tảng Linux Mint 22.3 Cinnamon với cấu hình tiếng Việt, branding CaramOS và bộ ứng dụng cơ bản.']],
    releaseNotes: [
      // A hotfix: CaramOS's own programs only, no ISO (docs/release-version-tracking.md); VERSION stays the ISO's.
      ['1.5.2.3', 'Máy kiểm tra cập nhật sau mỗi lần mở máy', [
        'Ngoài lần kiểm tra lúc nửa đêm, máy kiểm tra cập nhật khoảng 15 phút sau mỗi lần mở máy. Máy văn phòng hay phòng máy tắt trước nửa đêm giờ nhận bản sửa ngay trong ngày được dùng, không phải chờ tới lần mở máy sau.',
        'Lịch mới có hiệu lực từ lần mở máy đầu tiên sau khi cập nhật.',
      ]],
      ['1.5.2.2', 'Thanh âm lượng bản Xfce hiện đúng sau khi máy tự cập nhật', [
        'Bản Xfce: máy tự cập nhật trong lúc bạn đang dùng thì thanh âm lượng hiện trong một khung cao, thay vì thanh dẹt có số phần trăm, cho tới lần đăng nhập sau. Giờ thanh âm lượng hiện đúng ngay, không cần đăng xuất.',
        'Bản cập nhật nào đổi Trung tâm điều khiển thì Trung tâm điều khiển khởi động lại ngay sau khi cài: đồng hồ và nút Trung tâm điều khiển trên thanh tác vụ tắt đi vài giây rồi hiện lại.',
      ]],
      ['1.5.2.1', 'Máy dùng bản cũ tự lên bản mới; máy Cinnamon không còn thấy mục cập nhật của Xfce', [
        'Máy còn ở CaramOS 1.3.3 trở về trước (các bản 1.0.x, 1.3.0 đến 1.3.3) trước giờ gần như không tự lên bản mới, vì các bản cập nhật cũ chỉ được tự cài khi không ai đăng nhập. Giờ máy cài bản đó ở lần khởi động sau, trước màn hình đăng nhập; màn hình khởi động ghi “Đang cập nhật CaramOS” kèm số bước đã xong, thường mất vài phút.',
        'Việc này chỉ diễn ra một lần duy nhất với mỗi máy dùng bản cũ. Sau đó máy tự cập nhật ngầm trong lúc bạn làm việc như các bản mới.',
        'Máy Cinnamon không còn thấy mục “Thông báo hiện ở góc dưới bên phải”, vốn chỉ dành cho bản Xfce.',
      ]],
      ['1.5.2', 'Cài ứng dụng từ trang web bằng một nút, Phòng máy ổn định, Zalo và Lark không tự đăng xuất', [
        'Trên apps.vietnamlinuxfamily.net, bấm Cài trên CaramOS là App Center mở đúng ứng dụng đó để cài, không phải gõ lệnh. App Center 0.4.0 có thêm nhóm Tin học cho các em (Tux Typing, KTouch, KolourPaint, Klickety và trang tập dùng chuột không quảng cáo), nhóm Lập trình, Toán, Khoa học và soạn bài giảng (eXeLearning, LeoCAD, Polypad), nhóm Phim, nhạc, ảnh và thiết kế (VLC, Spotify, OBS, Kdenlive, GIMP, Inkscape), cùng Obsidian, RustDesk, AnyDesk và OpenConnect cho VPN công ty.',
        'Phòng máy: máy học sinh không tự khóa, tắt màn hình hay ngủ trong giờ học; Veyon tự chạy lại khi bị tắt, nên Veyon Master không còn ô màu cam. Khóa màn hình và Trình chiếu toàn màn hình hiện đúng trên máy học sinh. Máy đã rời phòng máy không tự bật Veyon nữa.',
        'Máy tự đăng nhập, không gõ mật khẩu: Zalo, Lark và trình duyệt giữ đăng nhập, không còn hỏi “Hãy chọn mật khẩu cho chùm chìa khóa mới” hay mật khẩu chùm chìa khóa. Chùm chìa khóa cũ có mật khẩu được cất sang một thư mục riêng, không xóa gì.',
        'Màn hình vẫn tối sau 15 phút không dùng, nhưng khoảng nửa tiếng mới khóa: đi uống nước về không phải gõ lại mật khẩu.',
        'Tự động cập nhật cài được cả lúc bạn đang dùng máy: phần đổi thanh tác vụ hay màn hình nền chờ lần đăng nhập sau mới hiện, không có gì nhảy trên màn hình khi bạn đang làm việc.',
        'Thêm tài khoản Google, Microsoft trong Tài khoản trực tuyến không còn dừng giữa chừng ở Firefox. Góp ý & hỗ trợ gửi kèm thông tin máy (dòng máy, linh kiện, driver, máy in, cách máy khóa và ngủ), nên nhóm hỗ trợ trả lời được ngay mà không phải hỏi lại. Chuyển dữ liệu từ Windows báo rõ khi ổ bị BitLocker khóa và chỉ cách tắt. Màn hình khóa và màn hình đăng nhập dùng phông Be Vietnam Pro.',
        'Mỗi ngày một lần, máy báo cho trang CaramOS rằng máy đang được dùng, kèm phiên bản, bản Cinnamon hay Xfce, và một mã đổi mỗi ngày nên không lần ra được máy nào; ngoài ra không gửi gì. Muốn tắt: chạy `sudo caramos-ota --stats off`.',
      ]],
      ['1.5.1', 'Cập nhật chắc chắn hơn; Thùng rác, Hiện màn hình nền và PrtSc như Windows', [
        'Mở Trung tâm cập nhật là máy hỏi máy chủ ngay, không cần mật khẩu, rồi mới báo. Không kiểm tra được thì nói rõ lý do (mất mạng, mạng công ty chặn) thay vì báo “đã là bản mới nhất”. Lần kiểm tra hằng ngày bị lỗi thì một giờ sau tự thử lại. Máy từng kẹt ở bản cũ vì một câu hỏi trong lúc cập nhật nay tự cập nhật tiếp.',
        'Như Windows, trên cả hai bản: bấm vào mép phải thanh tác vụ để hiện màn hình nền; PrtSc chụp cả màn hình vào bộ nhớ tạm, bấm Ctrl+V để dán vào Zalo hay Word (Super+Shift+S vẫn chọn một vùng); Thùng rác nằm sẵn trên màn hình nền. Bản Xfce có thêm Super+D để hiện màn hình nền và Super+E để mở Tệp.',
        'Khi bật bộ gõ tiếng Việt, mật khẩu không còn hiện ra lúc đang gõ (bản Cinnamon). Tên dưới biểu tượng trên màn hình nền có bóng mờ, đọc rõ cả trên hình nền sáng. Biểu tượng ở khay đổi màu ngay khi bật, tắt Chế độ tối và luôn đứng đúng chỗ.',
        'Bản Cinnamon: chữ V của bộ gõ hiện ngay khi đăng nhập. Trước đây khay hiện chữ A đến khi bấm vào một ô nhập chữ, dù tiếng Việt đã bật, và bấm vào chữ A đó lại tắt tiếng Việt.',
        'Tạo lối tắt trên màn hình cho cả thư mục trong Google Drive, thư mục chia sẻ trong mạng và điện thoại.',
        'Bản Xfce: chép tệp từ màn hình nền rồi dán vào Tệp được; Mở trong Terminal của Tệp chạy; nút Control Center hiện ổ USB đang cắm, kèm nút Tháo an toàn; bật được âm thanh sự kiện trong Appearance.',
        'Gõ fastfetch trong Terminal để xem logo CaramOS cùng thông tin máy. Máy cài mới có phân vùng hệ thống mang tên CaramOS.',
        'CaramOS Doanh nghiệp 0.3.1 (miễn phí): nhân viên thấy thông báo trước khi công ty áp dụng thiết lập; khóa máy, gửi tin nhắn, hỗ trợ từ xa tới máy nhân viên trong vài giây; kết quả cập nhật ghi bằng tiếng Việt; máy nhân bản giữ đúng màn hình nền của người dùng.',
      ]],
      ['1.5.0', 'Tự động cập nhật, chuyển từ Windows sang dễ hơn, âm lịch trên đồng hồ', [
        'Tự động cập nhật, bật sẵn: bản CaramOS mới tự cài trong lúc bạn làm việc, xong thì báo “CaramOS đã cập nhật lên …”. Máy chờ khi dùng mạng tính theo dung lượng, pin dưới 50% chưa cắm sạc, ổ đĩa sắp đầy hoặc đang cài phần mềm khác. Muốn tự bấm cập nhật như trước: mở Trung tâm cập nhật, tắt Tự động cập nhật (cần mật khẩu quản trị), hoặc chạy `sudo caramos-ota --auto-update off`.',
        'Chuyển dữ liệu từ Windows: chép Màn hình nền, Tài liệu, Ảnh, Tải về, Nhạc, Video, tệp nhận qua Zalo, dấu trang Chrome, Edge, Cốc Cốc, thư Outlook (.pst) và phông chữ từ ổ Windows, ổ cứng của máy cũ hay thư mục chia sẻ trên mạng. Máy Windows không bị thay đổi gì, không tệp nào bị ghi đè.',
        'Văn bản cũ gõ bằng .VnTime hay VNI-Times: bấm chuột phải vào tệp, chọn Chuyển mã sang Unicode; tệp mới có “(Unicode)” trong tên, tệp cũ giữ nguyên. Phông Carlito có cùng độ rộng từng chữ với Calibri, nên tài liệu Word, Excel từ Windows không còn xô dòng hay tràn sang trang sau.',
        'Chuột phải ▸ Mới ▸ Văn bản hành chính: công văn, quyết định, tờ trình, báo cáo, thông báo, giấy mời, biên bản và biên bản bàn giao tài sản, trình bày sẵn theo Nghị định 30/2020/NĐ-CP. Mẫu Văn bản Word dùng Times New Roman cỡ 13; tệp mẫu đã có trong thư mục Mẫu giữ nguyên.',
        'Âm lịch trong lịch của thanh tác vụ, trên cả hai bản: bấm vào đồng hồ, dưới mỗi ngày có ngày âm, mùng 1 và rằm tô đỏ, đầu lịch ghi ngày âm hôm nay.',
        'Super+V mở lịch sử clipboard, Super+L khóa máy, Ctrl+Alt+Delete mở hộp đăng xuất, bấm Super rồi gõ là tìm. Trên bản Xfce, tổ hợp có phím Super không còn mở menu Start kèm theo.',
        'Control Center có ô Thanh tác vụ để đặt ứng dụng ở giữa hay bên trái, ô Không làm phiền, và thanh độ sáng cho màn hình rời hỗ trợ DDC/CI; lăn chuột trên biểu tượng của nó để chỉnh âm lượng, mỗi nấc 2, 5 hay 10%. Menu Start và menu chuột phải bo tròn góc.',
        'Trung tâm cập nhật và App Center có giao diện mới; App Center có bước Dùng cho công ty với CaramOS Doanh nghiệp (miễn phí) và Remmina. Máy từ 4 GB RAM trở xuống hoặc chưa có driver card đồ họa: App Center, Kiểm tra driver, Góp ý & hỗ trợ và Phòng máy dùng ít hơn 52–79 MB RAM mỗi ứng dụng. Kiểm tra driver có nút Lưu báo cáo.',
      ]],
      ['1.4.0', 'Bản Xfce cho máy 2 GB và phòng máy ở trường học', [
        'Có thêm bản Xfce, nhẹ hơn, cho máy 2 GB và phòng máy: vừa bật máy, Task Manager báo khoảng 610 MB RAM trên máy 2 GB. Vẫn có thanh tác vụ ba đảo, Control Center, App Center, Kiểm tra driver và bộ gõ tiếng Việt. Giao diện mặc định là tiếng Anh cho khớp với sách Tin học; chọn tiếng Việt lúc cài thì có tiếng Việt.',
        'Tệp: bấm chuột phải chọn Mới ▸ Thư mục (bản Xfce: New ▸ Folder) như Windows và sách giáo khoa, có sẵn mẫu Word, Excel, PowerPoint. Máy cài mới có cây thư mục ở khung bên trái như Windows Explorer.',
        'Phòng máy (Computer Lab): tự cài và thiết lập Veyon hoặc Epoptes để giáo viên xem và điều khiển máy học sinh. Máy giáo viên hiện một mã 6 số; máy học sinh tìm máy giáo viên trong mạng của trường, nhập mã là xong.',
        'App Center có mục Giáo dục: GCompris, Tux Paint, Klavaro, KTurtle, Thonny, Stellarium, TurboWarp (Scratch 3) và GeoGebra 6.',
        'Mở tệp Word, Excel, PowerPoint khi máy chưa có bộ ứng dụng văn phòng: CaramOS gợi ý cài ONLYOFFICE, WPS Office hoặc LibreOffice từ App Center, thay vì chỉ mở thư mục chứa tệp. Tệp .zip mở bằng trình giải nén.',
        'Thanh trượt trong Control Center dài hơn, rãnh của nó hiện rõ ở giao diện tối.',
      ]],
      ['1.3.11', 'Hình nền Việt Nam mỗi ngày, chọn màu cho Control Center', [
        'Hình nền Việt Nam mỗi ngày: mở Cài đặt hệ thống > Hình nền, bấm thư mục Việt Nam mỗi ngày rồi chọn một ảnh. Từ đó mỗi ngày hình nền là một ảnh mới về thiên nhiên, cảnh đẹp, công trình của Việt Nam (45 ảnh từ Wikimedia Commons, có ghi tác giả). Chọn hình nền khác là tắt.',
        'Control Center có ô Màu nhấn: 8 màu có sẵn, theo chủ đề hệ thống, hoặc bấm Màu khác… để tự chọn màu bất kỳ. Máy cập nhật lên 1.3.11 thấy ô này từ lần đăng nhập sau.',
        'Máy khởi động mà không vào được màn hình làm việc (màn hình đen, đứng máy) thì lần bật sau menu khởi động tự hiện 30 giây, có mục Advanced options để vào chế độ khôi phục.',
        'Tệp: bấm chuột phải có thêm Sao chép đường dẫn vào clipboard và Tạo lối tắt trên màn hình; ảnh thu nhỏ hiện cả trên điện thoại, ổ mạng và Google Drive.',
        'USB cài đặt: menu khởi động đếm ngược 10 giây, chữ to hơn, hướng dẫn phím bằng tiếng Việt (máy bật Secure Boot vẫn dùng chữ nhỏ mặc định). Lệnh sudo apt update không còn hiện dòng báo i386 của bộ gõ Lotus.',
      ]],
      ['1.3.10', 'Trung tâm cập nhật báo đúng lý do, Kiểm tra driver bớt báo nhầm', [
        'Lỡ đóng ô nhập mật khẩu khi cập nhật, Trung tâm cập nhật không còn báo "Cập nhật thất bại" mà báo "Chưa cập nhật", kèm nút Thử lại.',
        'Bấm cập nhật khi máy đang tự cập nhật, hay khi đang mở một cửa sổ cập nhật khác, sẽ có thông báo "Đang có một lần cập nhật khác": đợi lần đó xong rồi bấm Thử lại.',
        'Máy in Canon cắm USB mà máy tính không giao tiếp được (cáp lỏng, cổng USB hỏng, cắm qua hub) được báo "Máy in chưa kết nối được" kèm cách đổi cổng, đổi cáp, thay vì đề xuất một driver rồi cài không được.',
        'Laptop dùng card đồ họa Intel GM45 (Mobile 4 Series) không còn bị báo nhầm là card đồ họa chưa có driver.',
      ]],
      ['1.3.9', 'Driver máy in Canon chính hãng cho LBP6300dn và các máy CAPT khác, phím PrtSc chụp màn hình', [
        'Kiểm tra driver cài driver chính hãng của Canon cho các máy Canon dùng CAPT mà captdriver chưa chạy được, như LBP6300dn, LBP3300, LBP5000, LBP6200, LBP7200C. Máy cắm USB: cắm vào là có thông báo, bấm Cài driver của Canon, đồng ý điều khoản của Canon, khoảng một phút sau máy in đã sẵn sàng (22 dòng máy).',
        'Máy in qua mạng LAN (13 dòng có cổng mạng): trong Kiểm tra driver bấm Thêm máy in…, chọn mẫu máy và nhập địa chỉ IP.',
        'Driver được tải thẳng từ máy chủ của Canon và kiểm tra trước khi cài; CaramOS lo hàng đợi in, dịch vụ in tự chạy khi bật máy, rút ra cắm lại vẫn in được, và chặn máy khác trong mạng kết nối vào dịch vụ in. Điều khoản của Canon cho phép dùng cho mục đích cá nhân, phi thương mại.',
        'Bấm PrtSc hoặc Win+Shift+S để chụp màn hình (trước đây hai phím này không có tác dụng): kéo chọn vùng, Ctrl+C để chép ảnh dán vào Zalo hay Messenger, Ctrl+S để lưu vào thư mục Ảnh.',
      ]],
      ['1.3.8', 'Phóng to, thu nhỏ icon Start Menu bằng Ctrl + lăn chuột', [
        'Như trên Windows: mở Start Menu, giữ Ctrl rồi lăn chuột trên danh sách ứng dụng. Lăn lên thì icon to dần, lăn xuống thì nhỏ dần, mỗi nấc một chút.',
        'Icon nhỏ thì mỗi hàng xếp được nhiều ứng dụng hơn (tới 7), icon to thì ít hơn. Cỡ mặc định trông như cũ.',
        'Start Menu vẫn mở, giữ nguyên mục hay kết quả tìm kiếm đang xem, và nhớ cỡ đã chọn cho lần sau.',
      ]],
      ['1.3.7', 'Máy in Canon LBP2900 cài được bằng một nút', [
        'Cắm máy in vào là có thông báo "Máy in chưa có driver". Bấm Xem chi tiết rồi Cài driver máy in, máy in sẽ tự được thiết lập. Trước đây hệ thống gán cho các máy in Canon dùng CAPT một driver PostScript không hợp: lệnh in báo xong mà máy không ra giấy.',
        'Driver là captdriver, mã nguồn mở. Theo captdriver, LBP2900/LBP2900B và LBP3010/LBP3018/LBP3050 chạy được, còn LBP3000, LBP3100 và LBP6000 mới ở mức thử nghiệm. Các máy CAPT khác chỉ chạy với driver của Canon.',
        'Cài driver không được thì màn hình báo lỗi có nút Nhờ giúp đỡ, kèm nhật ký cài đặt. Máy có máy in thì mọi yêu cầu giúp đỡ tự kèm nhật ký máy in, đã bỏ số serial và tên tài liệu.',
        'Rút máy in hay USB Wi-Fi ra không còn bị báo nhầm "Đã xử lý xong vấn đề phần cứng".',
      ]],
      ['1.3.6', 'Trung tâm cập nhật không còn đứng hình khi cập nhật dài', [
        'Lần cập nhật hoàn tất một driver NVIDIA bị cài dở in ra khoảng 49.000 dòng, và cửa sổ Trung tâm cập nhật từng đứng hơn 15 phút. Giờ chừng đó dòng hiện ra trong chưa tới một giây.',
        'Khung nhật ký luôn cuộn tới dòng mới nhất, còn trang kết quả vẫn có đủ nhật ký.',
        'Lần cập nhật lên 1.3.6 vẫn chạy trong cửa sổ của bản đang dùng. Máy có driver NVIDIA cài dở nên chạy sudo dpkg --configure -a trước khi cập nhật; nếu cửa sổ đứng thì cứ để nó chạy xong, đừng tắt máy.',
      ]],
      ['1.3.5', 'Cài driver NVIDIA bằng Kiểm tra driver chạy được trở lại', [
        'Từ 1.3.0, Kiểm tra driver làm lần cài driver NVIDIA dừng giữa chừng, nên sau khi khởi động lại máy không có driver đồ hoạ và màn hình chỉ còn 1024×768. Bản 1.3.5 sửa lỗi này.',
        'Máy đã bị như vậy: mở Terminal chạy sudo dpkg --configure -a rồi khởi động lại. Bản cập nhật 1.3.5 cũng tự sửa lỗi này.',
        'Kiểm tra driver xem ổ đĩa còn đủ chỗ trước khi cài, và nói rõ cần dọn bao nhiêu, ở đâu. Driver NVIDIA có thể kéo theo nhân Linux mới, khi đó phải tải về tới khoảng 1 GB.',
      ]],
      ['1.3.4', 'Bộ gõ giữ cài đặt, Start Menu nhanh hơn, cập nhật không bị chặn', [
        'Cài đặt bộ gõ Lotus bạn chọn (Telex hay VNI, chế độ, kiểm tra chính tả, phím tắt) không còn bị đặt lại mỗi lần đăng nhập, và mỗi phiên bắt đầu ở tiếng Việt (V); bấm Ctrl+Shift để chuyển sang tiếng Anh.',
        'Start Menu ra kết quả ngay khi đang gõ tiếng Việt, và không còn làm đơ máy khi tìm tệp, kể cả trên ổ cứng HDD hay khi có Google Drive gắn trong thư mục Home.',
        'Trung tâm cập nhật không còn bị chặn bởi một nguồn phần mềm hỏng do chương trình khác thêm vào, hay một gói cài dở như Lotus 3.5.6 lỗi hoặc driver NVIDIA 470.',
        'Kiểm tra driver đề xuất driver NVIDIA 580 thay cho 470 (không chạy được trên nhân Linux 6.14 trở lên), và nói rõ khi driver đồ hoạ bị tắt bởi nomodeset hay blacklist.',
        'App Center 0.2.3 cài được ứng dụng khi máy còn gói cài dở, chờ trình cài CaramOS khi chạy thử từ USB, và tải tiếp WPS Office khi máy chủ ngắt giữa chừng.',
      ]],
      ['1.3.3', 'Gõ được tiếng Việt ngay khi đăng nhập', [
        'Trên một số máy mới cài CaramOS 1.3 và khi chạy thử từ USB, bộ gõ Lotus không tự chạy nên gõ chỉ ra chữ không dấu. Giờ bộ gõ tự chạy mỗi lần đăng nhập.',
        'Máy đang bị lỗi chỉ cần bấm Cập nhật ngay trong Trung tâm cập nhật là gõ được liền, không cần đăng nhập lại.',
      ]],
      ['1.3.2', 'Cài được Zalo trở lại, thanh tác vụ gọn lại, báo lỗi kèm nhật ký', [
        'Zalo cho Linux bản mới chạy thẳng trên Linux, không cần Wine nên mở nhanh hơn. App Center 0.2.2 cài bản này; máy đã có Zalo được Trung tâm cập nhật đổi sang, tải ngầm và tự thử lại mỗi ngày nếu mạng chập chờn.',
        'Biểu tượng giữa thanh tác vụ nằm gọn trong khung sau bản cập nhật Cinnamon 6.6.9; từ nay CaramOS tự sửa lại mỗi khi Cinnamon được cập nhật.',
        'Kiểm tra driver không còn làm đứng máy cũ khi chạy thử từ USB, và nói rõ vì sao loa, micro, camera chưa chạy trên máy tính bảng chip Intel Atom như Lenovo Yoga Book.',
        'App Center hay Trung tâm cập nhật cài không được thì nút Nhờ giúp đỡ gửi yêu cầu kèm nhật ký lỗi; chỉ đội VNLF xem được nhật ký, thông tin cá nhân đã được xoá trước khi gửi.',
        'Trình cài đặt không còn dừng ngay khi mở, và không còn khoá việc cài phần mềm khác trong phiên chạy thử.',
      ]],
      ['1.3.1', 'Start Menu và Trung tâm cập nhật toàn tiếng Việt', [
        'Start Menu hiện “Tất cả ứng dụng”, “Biểu tượng cảm xúc” thay cho chữ tiếng Anh; applet thời tiết và các tiện ích mở rộng đi kèm cũng theo ngôn ngữ của máy.',
        'Trung tâm cập nhật: dòng dung lượng của bản cập nhật không còn lẫn chữ tiếng Anh.',
        'App Center 0.2.1: Zalo cho Linux hiện nhãn “Gói cộng đồng”, vì do cộng đồng đóng gói chứ không phải của Zalo.',
      ]],
      ['1.3.0', 'Bản phát hành chính thức đầu tiên: App Center, Kiểm tra driver, Góp ý & hỗ trợ', [
        'App Center: lần đăng nhập đầu tiên chọn bộ văn phòng, trình duyệt, ứng dụng liên lạc và tiện ích, CaramOS tải và cài giúp; gỡ ứng dụng ngay trên thẻ của nó.',
        'Kiểm tra driver: kiểm tra Wi-Fi, mạng dây, đồ họa, âm thanh, Bluetooth, webcam, vân tay, máy in Canon LBP2900; cài driver NVIDIA, Wi-Fi Broadcom và máy in Canon LBP2900 bằng một nút; tự mở ở lần đăng nhập đầu tiên và khi chạy thử từ USB, báo ngay khi cắm máy in cần driver.',
        'Góp ý & hỗ trợ: dấu hỏi trên thanh tác vụ để nhờ giúp đỡ, báo lỗi, góp ý kèm ảnh hoặc video tới cộng đồng VNLF; theo dõi tình trạng và nhận thông báo khi có câu trả lời.',
        'Trung tâm cập nhật thiết kế lại theo màu VNLF, nút Cập nhật ngay luôn ở đáy cửa sổ.',
        'Nhẹ hơn Linux Mint 22.3 gốc: ít dịch vụ nền và ít RAM hơn; earlyoom đóng ứng dụng tốn RAM nhất thay vì để máy đơ; ISO còn 2,8 GB.',
        'WPS Office, Chrome và Zalo không còn cài sẵn mà chọn trong App Center; CopyQ không còn tự chạy; dọn 14 màu biểu tượng thừa (khoảng 1,1 GB).',
      ]],
      ['1.0.20', 'Ngôn ngữ theo đúng lựa chọn, giao diện song ngữ', [
        'Bỏ LC_ALL=vi_VN ép cứng trong /etc/locale.conf: ngôn ngữ chọn trong Cài đặt > Ngôn ngữ được áp dụng, máy cài tiếng Anh không còn bị chèn tiếng Việt (#65).',
        'Control Center, Trung tâm cập nhật và công cụ Audit được dịch bằng gettext; tiêu đề và mô tả cập nhật theo ngôn ngữ của phiên đăng nhập.',
        'Sửa dịch vụ bật bộ gõ Lotus làm treo quá trình khởi động.',
      ]],
      ['1.0.19', 'Menu GRUB mang giao diện CaramOS', [
        'Thay menu GRUB chữ xanh trên nền xanh bằng theme CaramOS, hiện khi máy cài nhiều hệ điều hành hoặc khi giữ Shift/Esc lúc khởi động.',
        'GRUB_THEME người dùng đã tự đặt được giữ nguyên.',
      ]],
      ['1.0.18', 'Chế độ tối, Chế độ nguồn và Zalo mới', ['Thêm ô Chế độ tối vào Control Center: chuyển cả hệ thống sang giao diện tối Cinnamon-Delight-Dark cùng tông màu CaramOS; hình nền mặc định tự đổi giữa Sage Mist và Indigo Night.', 'Thay TLP bằng power-profiles-daemon và thêm ô Chế độ nguồn với ba mức Hiệu năng, Cân bằng và Tiết kiệm pin.', 'Cập nhật Zalo lên 26.10.10 từ kho VN-Linux-Family/zalo-for-linux; máy đã cài được thay Zalo qua OTA, giữ nguyên dữ liệu người dùng.', 'Trả quyền root cho các file hệ thống trong /etc và /usr bị gán cho tài khoản người dùng, và sửa thông báo mời nâng cấp Linux Mint sai trong Báo cáo hệ thống.']],
      ['1.0.16', 'Ghim ứng dụng và dọn Desktop CaramOS', ['Ghim Zalo và Trình quản lý phần mềm vào taskbar Cinnamon khi ứng dụng đã được cài.', 'Giữ WPS Office trên taskbar.', 'Gỡ shortcut mặc định của WPS Office, Zalo và Trình quản lý phần mềm khỏi Desktop nhưng giữ file đã được người dùng tùy chỉnh.']],
      ['1.0.15', 'Bộ hình nền CaramOS mới', ['Cài năm hình nền CaramOS độ phân giải 2048×1152.', 'Buộc Sage Mist làm hình nền cho mọi desktop user và màn hình đăng nhập qua đường dẫn ổn định default.png.', 'Thay bộ sưu tập Linux Mint trong Cinnamon Backgrounds bằng bộ sưu tập CaramOS.']],
      ['1.0.14', 'Taskbar ba dock cho CaramOS', ['Tách taskbar dưới màn hình thành ba dock trái, giữa và phải với khoảng cách đồng đều.', 'Đưa Start Menu CaramOS sang dock trái, ứng dụng ghim/đang chạy sang dock giữa và applet trạng thái sang dock phải.', 'Hiển thị chấm màu dưới icon của ứng dụng đang chạy.']],
      ['1.0.13', 'Thêm Trung tâm điều khiển CaramOS', ['Thêm applet caramos-control-center@caramos cho Cinnamon panel.', 'Bật applet Control Center trên panel cho các user desktop đang có phiên đăng nhập.', 'Bỏ các applet mạng, âm thanh và pin mặc định đã được Control Center thay thế; giữ nguyên mọi applet khác và vị trí hiện có.']],
      ['1.0.12', 'Sửa lỗi hỏi mật khẩu khi đăng nhập', ['Gỡ lệnh enable system service khỏi helper autostart của desktop user để tránh prompt systemd/polkit khi login.', 'Chuyển bước bật fcitx5-lotus-server@USER.service sang root oneshot service.', 'Giữ cấu hình Fcitx5 Lotus, Telex và Preedit trong helper đăng nhập ở mức user.']],
      ['1.0.11', 'Sửa OTA cho user tuỳ chỉnh', ['Phát hành lại OTA để máy đang ở 1.0.10 nhận bản cập nhật mới.', 'Sửa các migration cũ để tự nhận diện user desktop thật thay vì hardcode user caram hoặc mint.', 'Dùng home directory thật khi áp dụng cấu hình Cinnamon, launcher Desktop, Fcitx5 và kích thước icon panel.']],
      ['1.0.10', 'Cập nhật kích thước icon panel Cinnamon', ['Áp dụng thay đổi kích thước icon panel từ PR #62.', 'Đặt icon bên phải panel Cinnamon về 18px trong dconf defaults.', 'Đồng bộ caramos-theme-apply và giữ lại tùy chỉnh kích thước icon của người dùng khi migration.']],
      ['1.0.9', 'Ổn định bộ gõ tiếng Việt Fcitx5 Lotus', ['Thêm cấu hình mặc định ổn định cho Fcitx5 Lotus.', 'Giữ English và Lotus trong menu Fcitx với Ctrl+Shift để chuyển bộ gõ.', 'Đưa Start menu Cinnamon qua Fcitx và khởi động lại Fcitx sau khi áp dụng defaults.']],
      ['1.0.8', 'Ghim Software Manager', ['Áp dụng cập nhật pin Software Manager từ PR #54.', 'Ghim Software Manager vào grouped-window-list mặc định của Cinnamon.', 'Thêm launcher Software Manager ra Desktop cho default user và live user.']],
      ['1.0.7', 'Cập nhật layout panel Cinnamon', ['Áp dụng cập nhật panel layout từ PR #53.', 'Thêm systray, network và sound applets vào panel bên phải.', 'Bỏ weather/cornerbar mặc định và thêm launcher tìm kiếm cho Trung tâm cập nhật CaramOS.']],
      ['1.0.6', 'Slideshow cài đặt CaramOS', ['Thêm asset slideshow Ubiquity riêng của CaramOS từ PR #52.', 'Bổ sung OTA migration để cài slideshow trên hệ thống đã cài.', 'Giữ metadata build dependency tương thích với Launchpad builders.']],
      ['1.0.5.2', 'Chuỗi migration đến CaramOS 1.0.5', ['Phát hành chuỗi OTA migration qua CaramOS 1.0.5.', 'Thêm migration cho MintWelcome branding, ZRAM mặc định, MintReport branding và metadata codename.', 'Gộp release notes nhiều bước, cập nhật dung lượng trong notifier và sửa codename cho add-apt-repository.']],
      ['1.0.2', 'Gói cập nhật CaramOS OTA đầu tiên', ['Thêm package CaramOS OTA updater ban đầu.', 'CLI hỗ trợ check, upgrade, status, repair, rollback và dry-run.', 'Có systemd timer kiểm tra hằng ngày, notifier GTK3 tiếng Việt, pkexec/polkit, transaction state, rollback best-effort và logrotate.']],
    ],
    galleryTitle: 'Từ menu khởi động đến màn hình chính',
    gallery: [
      [`${shots}/boot-menu-131.webp`, 'Menu khởi động CaramOS', 'Menu khởi động cho chọn chạy thử hay cài CaramOS.'],
      [`${shots}/installer-apps.webp`, 'Trình chiếu lúc cài CaramOS, trang giới thiệu bộ văn phòng, trình duyệt và Zalo trong App Center', 'Trong lúc cài, trình cài đặt giới thiệu những ứng dụng bạn chọn được ở lần đăng nhập đầu tiên.'],
      [`${shots}/start-menu-131.webp`, 'Start Menu CaramOS', 'Start Menu tìm ứng dụng bằng tiếng Việt, gõ không dấu cũng ra.'],
    ],
    downloadTitle: `Tải CaramOS ${VERSION}`,
    downloadLead:
      'Bản Cinnamon (2,9 GB) cho máy từ 4 GB RAM. Bản Xfce (2,7 GB) nhẹ hơn, cho máy 2 GB và phòng máy ở trường. Nút tải lấy tệp từ máy chủ của CaramOS trên Cloudflare; không tải được thì dùng link dự phòng trên SourceForge. Tải xong, bạn kiểm tra mã SHA256, ghi ISO ra USB và chạy thử để Kiểm tra driver báo máy có hợp không. Hợp thì bấm biểu tượng Cài đặt CaramOS trên Desktop.',
    downloadButton: 'Bản Cinnamon (2,9 GB)',
    downloadXfceButton: 'Bản Xfce cho máy 2 GB (2,7 GB)',
    checksumsXfce: 'SHA256 bản Xfce',
    requirements: ['Máy 64-bit, UEFI hoặc BIOS', 'RAM từ 2 GB (bản Xfce), khuyên dùng 4 GB', 'Ổ đĩa trống từ 20 GB', 'USB từ 4 GB'],
    supportTitle: 'Giúp thêm người biết tới CaramOS',
    supportLead:
      'Clap cho CaramOS trên Unikorn để thêm nhiều người Việt biết tới nó.',
    supportAction: 'Clap cho CaramOS',
    supportMeta: 'Mỗi lượt clap và badge xếp hạng giúp CaramOS nổi bật hơn trong cộng đồng mã nguồn mở Việt Nam.',
    footer: 'CaramOS là dự án thuộc hệ sinh thái Vietnam Linux Family.',
    ecosystem: [
      ['website', 'Website', 'Trang chủ, bài viết kỹ thuật và tài nguyên chính thức của VNLF.', 'vietnamlinuxfamily.net', 'Official', links.vnlf],
      ['telegram', 'Telegram', 'Thông báo mới và trao đổi nhanh với cộng đồng.', 't.me/vietnamlinuxfamily', 'Community', links.telegram],
      ['discord', 'Discord', 'Hỏi đáp kỹ thuật và bàn việc làm dự án, chia theo từng kênh.', 'discord.gg/gVAJDUMC2n', 'Community', links.discord],
      ['facebook', 'Facebook', 'Nhóm hỏi đáp, chia sẻ kinh nghiệm và tin mới của cộng đồng.', 'facebook.com/groups/vietnamlinuxcommunity', 'Community', links.facebook],
      ['apps', 'Apps', 'Kho ứng dụng Linux viết bằng tiếng Việt; App Center dẫn tới đây khi bạn cần thêm ứng dụng.', 'apps.vietnamlinuxfamily.net', 'Apps', links.apps],
      ['mirror', 'Mirror', 'Kho mã của các máy chủ mirror, nơi phân phối tệp của VNLF.', 'GitHub: mirror', 'Infra', links.mirror],
    ],
    openSource: [
      ['Giấy phép', 'Mã nguồn theo GNU General Public License v3.0.'],
      ['Hướng dẫn đóng góp', 'CONTRIBUTING.md mô tả kiến trúc, cách dựng ISO, quy ước nhánh và cách gửi thay đổi.'],
      ['Quy tắc ứng xử', 'CODE_OF_CONDUCT.md dựa trên Contributor Covenant 2.1.'],
      ['Theo dõi lỗi', 'Lỗi và yêu cầu tính năng nằm ở GitHub Issues và trong Góp ý & hỗ trợ trên CaramOS.'],
      ['Phát hành', 'GitHub Actions dựng ISO từ tag phát hành, đưa ISO lên Cloudflare R2 (link tải chính) và SourceForge (link dự phòng), kèm tệp SHA256SUMS.'],
      ['Dựng ISO', 'Ba bước giải nén, tùy biến và đóng gói lại nằm ở ba script riêng, nên kiểm tra và sửa được từng bước.'],
    ],
  },
  en: {
    language: 'VI',
    nav: ['Overview', 'Xfce', 'Features', 'Printers', 'Upgrade', 'Release notes', 'Ecosystem', 'Download'],
    heroBadge: `Official release ${VERSION} · Linux Mint 22.3 Cinnamon and Xfce · GPL-3.0`,
    upgradeNotice: `On CaramOS already? Get ${VERSION} without reinstalling`,
    seoTitle: `CaramOS ${VERSION} — a Linux distribution for Vietnamese users`,
    seoDescription: `CaramOS ${VERSION}, the official release based on Linux Mint 22.3 Cinnamon and Ubuntu 24.04 LTS, with a new Xfce edition for 2 GB computers and school labs: Vietnamese and the Lotus input method out of the box, a one-click App Center, Driver Check, Control Center, Feedback & Help and OTA updates.`,
    heroTitle: 'CaramOS — a Linux distribution for Vietnamese users',
    heroLead: `The official ${VERSION} release, built on Linux Mint 22.3 and Ubuntu 24.04 LTS, in two editions: Cinnamon for computers with 4 GB of RAM or more, and the lighter Xfce for 2 GB computers and school labs. Vietnamese and the Lotus input method out of the box, an App Center that installs apps with one click, Driver Check that tells you what the computer is missing, and the Vietnam Linux Family community right on the taskbar.`,
    downloadCinnamon: 'Download Cinnamon',
    downloadCinnamonNote: '2.9 GB, for 4 GB of RAM or more',
    downloadXfce: 'Download Xfce',
    downloadXfceNote: '2.7 GB, for 2 GB computers and school labs',
    mirrorLead: 'Download not working? Use the SourceForge mirror:',
    mirrorCinnamon: 'Cinnamon',
    mirrorXfce: 'Xfce',
    mirrorLink: 'Mirror (SourceForge)',
    featuresCta: 'See the features',
    checksums: 'Cinnamon SHA256',
    releaseDetails: 'Release details',
    heroLightAlt: 'CaramOS at the first login: the App Center and Driver Check',
    heroDarkAlt: 'CaramOS in dark mode, with the Control Center open',
    bannerStackLabel: 'Switch between two CaramOS screenshots',
    otaBadge: 'CaramOS Update Center',
    otaFlowLabel: 'The three steps of an upgrade in the Update Center',
    otaFlow: [
      [`${shots}/update-available-131.webp`, 'The Update Center offers 1.3.1', 'The Update Center tells you when a new release is out.'],
      [`${shots}/update-progress.webp`, 'The Update Center updating CaramOS', 'Click Update and enter your password, and CaramOS does each step.'],
      [`${shots}/update-done.webp`, 'CaramOS updated successfully', 'Then keep working. Your files and apps stay as they were.'],
    ],
    source: 'Source code',
    community: 'Community',
    supportPage: 'Donate',
    statLabels: ['Stars', 'Forks', 'Issues', 'License'],
    contributorsTitle: 'Contributors',
    contributorsLead: 'Loaded straight from the CaramOS repository on GitHub.',
    contributorsFallback: 'The list did not load from GitHub. See the latest one on GitHub.',
    xfce: {
      tag: 'New in 1.4.0',
      title: 'CaramOS Xfce: light enough for 2 GB computers and school labs',
      lead: 'A new edition for computers with 2 GB of RAM, older machines and school computer labs. It is lighter than the Cinnamon edition and keeps everything CaramOS users know.',
      points: [
        'Right after boot, Task Manager shows about 610 MB of RAM on a 2 GB computer; the Cinnamon edition, measured the same way, about 780 MB.',
        'The three-island taskbar, Control Center, App Center, Driver Check, Feedback & Help, Vietnamese typing and the Update Center are all there.',
        'The interface is English by default, with the same words as the Tin học textbooks (New, Folder, Copy, Paste…), so pupils can follow the book. Choosing Vietnamese at install gives a Vietnamese interface; Vietnamese typing works as usual.',
        'Files: right-click and choose New ▸ Folder, with Word, Excel and PowerPoint templates; the left pane is a folder tree like Windows Explorer.',
      ],
      download: 'Download Xfce (2.7 GB)',
      checksums: 'Xfce SHA256',
      stackLabel: 'Switch between the two Xfce screenshots',
      images: [
        [`${shots}/xfce-desktop-140.webp`, 'CaramOS Xfce with the Control Center open at the right of the taskbar'],
        [`${shots}/xfce-files-140.webp`, 'Files on the Xfce edition: right-click New ▸ Folder, with the folder tree on the left'],
      ],
      cards: [
        {
          title: 'Computer Lab: run a class in a few clicks',
          text: 'The Computer Lab tool installs and sets up Veyon (or the lighter Epoptes) so the teacher can watch screens, send messages and control the pupils\' computers. The teacher\'s computer shows a 6-digit code; each pupil\'s computer finds the teacher\'s on the school network, and typing the code is all it takes to join.',
          image: [`${shots}/lab-veyon-140.webp`, 'Veyon Master on the teacher\'s computer showing a pupil\'s screen'],
          overlay: [`${shots}/lab-code-140.webp`, 'The 6-digit pairing code on the teacher\'s computer'],
        },
        {
          title: 'Learning apps in the App Center',
          text: 'The Computer skills for children and Programming, maths, science and lessons steps hold 17 apps, among them GCompris, Tux Paint, Klavaro (typing practice), KTurtle, Thonny (Python), Stellarium, TurboWarp (Scratch 3) and GeoGebra. Nothing is selected in advance, so home computers download only what they need.',
          image: [`${shots}/app-center-edu-150.webp`, 'Learning apps in the App Center (pictured in version 1.5.0)'],
        },
      ],
      note: 'The Computer Lab, the learning apps, New ▸ Folder and the folder tree are in both editions. A computer running the Cinnamon edition does not switch to Xfce by itself; to use Xfce, install it fresh from the Xfce ISO.',
    },
    featuresTitle: 'Is Linux hard to use?',
    featuresLead: 'Not on CaramOS. Installing apps and drivers, changing settings and updating all take a click, with no commands to type. When you are stuck, you ask the community right from the taskbar.',
    features: [
      {
        id: 'app-center', tag: 'New in 1.3.0',
        title: 'Zalo, Chrome and an office suite, one click away',
        lead: 'At the first login, the App Center opens with the usual apps already selected. Click Install once, then keep using the computer while CaramOS downloads and installs them.',
        points: [
          'Office suites: ONLYOFFICE, WPS Office or LibreOffice, each of which opens Word and Excel files. Browsers: Chrome, Cốc Cốc, Edge, Brave, Firefox.',
          'Chat: Zalo, Telegram, Zoom, Teams for Linux and Discord. The first time Zalo opens, scan its QR code with Zalo on your phone to sign in.',
          'Every app lists its strengths, weaknesses, size and source (Flathub, the Ubuntu archive or a downloaded package), so you can pick what suits your computer.',
          'Remove an app with the Remove button next to its name. The App Center opens again from the Desktop or the menu.',
        ],
        media: { type: 'single', main: [`${shots}/app-center-store-150.webp`, 'The App Center: apps by section, Office, Education and more, each with its size and an Install button; the sections are on the left'] },
        link: ['Find more apps in the VNLF app directory', links.apps],
      },
      {
        id: 'driver-check', tag: 'New in 1.3.0',
        title: 'Know whether your computer works, before installing',
        lead: 'Try CaramOS from a USB stick and Driver Check tells you what the computer is missing: Wi-Fi, sound, graphics or a printer. Older computers should go through this step before installing. After installing, Driver Check runs again at the first login, then only speaks up about new problems.',
        points: [
          'Checks Wi-Fi, wired network, graphics, sound, Bluetooth, webcam, fingerprint reader and Canon CAPT printers (LBP2900, LBP6300dn…).',
          'Missing the NVIDIA or Broadcom Wi-Fi driver? One click installs the version Ubuntu recommends for that computer. Canon printers work the same way, network printers included.',
          'Not online yet? Driver Check explains how to use a network cable, share a phone’s connection over USB, or install the driver straight from the CaramOS USB stick.',
          'Still stuck? Click Ask for help, and the VNLF community gets your message with the computer’s hardware details.',
        ],
        media: { type: 'single', main: [`${shots}/driver-check.webp`, 'Driver Check in a live USB session, in Vietnamese, reporting that this computer works well with CaramOS, with the state of Wi-Fi, wired network, graphics, sound, Bluetooth and webcam'] },
      },
      // The Update Center block (automatic updates since 1.5.0) is in whatsNew for now.
      {
        id: 'control-center', tag: 'Desktop',
        title: 'Wi-Fi, volume and dark mode in one place',
        lead: 'Click the right end of the taskbar to open the Control Center. Network, sound, Bluetooth, dark mode and power mode share one panel.',
        points: [
          'Speaker and microphone volume, and whether sound plays through headphones or speakers; scroll over the icon to change the volume.',
          'Wired network, Wi-Fi, VPN and Bluetooth, each with its own quick list.',
          'Dark mode, Night light, Do not disturb and Power mode: Performance, Balanced, Power saver.',
          'Brightness of the laptop screen and of external monitors with DDC/CI, laptop battery, screenshot, Settings, lock and power off.',
        ],
        media: { type: 'pair', main: [`${shots}/control-center-light.webp`, 'Control Center, light'], second: [`${shots}/control-center-dark.webp`, 'Control Center, dark'] },
      },
      {
        id: 'help', tag: 'New in 1.3.0',
        title: 'Stuck? Ask from the taskbar',
        lead: 'Click the Feedback & Help question mark at the right end of the taskbar to ask for help, report a bug or send feedback. Your message goes straight to the Vietnam Linux Family community, and people there answer in Vietnamese.',
        points: [
          'Attach screenshots (private parts can be blurred) or videos of up to a minute, made smaller and without location data.',
          'With your consent, the message carries the hardware details and the Driver Check results, without user names, the computer’s name or IP addresses.',
          'Follow your requests and get notified when someone answers.',
          'VNLF reviews requests before publishing; your contact details stay private.',
        ],
        media: { type: 'stack', main: [`${shots}/help-form.webp`, 'The Feedback & Help window'], overlay: [`${shots}/help-menu.webp`, 'The Feedback & Help menu with the state of each request'] },
      },
      {
        id: 'island-dock', tag: 'Desktop', wide: true,
        title: 'A taskbar that feels like Windows',
        lead: 'The taskbar is split into three rounded islands: the Start Menu on the left, your apps in the middle, the clock and quick settings on the right. Anyone used to Windows knows where to click.',
        points: [
          'Left island: the Start Menu finds apps in Vietnamese, even typed without accents; hold Ctrl and roll the mouse wheel to resize its icons.',
          'Middle island: pinned and running apps, with a small dot under the open ones; in the middle or on the left, as you choose in the Control Center’s Taskbar tile.',
          'Right island: system tray, input method, clock, Control Center and Feedback & Help.',
        ],
        media: { type: 'wide', main: [`${shots}/island-dock-en.webp`, 'The three islands of the CaramOS taskbar'], phone: `${shots}/island-dock-mobile-en.webp` },
      },
      {
        id: 'look', tag: 'Look and feel',
        title: 'Light or dark, one click away',
        lead: 'The boot menu, the desktop and everything between share one look: the Cinnamon Delight theme, Tela Circle icons and the Be Vietnam Pro font.',
        points: [
          'One click in the Control Center switches to dark mode, and the wallpaper follows.',
          'Five wallpapers drawn for CaramOS: Sage Mist in light mode, Indigo Night in dark mode.',
          'Boot menu, splash screen, installer and GRUB menu share the same look.',
          'The Start menu and right-click menus have round corners, like the taskbar islands.',
        ],
        media: { type: 'single', main: [`${shots}/desktop-dark.webp`, 'CaramOS in dark mode'] },
      },
      {
        id: 'vietnamese', tag: 'Vietnamese',
        title: 'Type Vietnamese right after installing',
        lead: 'Once CaramOS is installed, Vietnamese typing works with no extra input method to add. Vietnam’s time zone and date formats are set too.',
        points: [
          'Fcitx5 + Lotus is on, with Telex by default. To type with VNI, pick it in Cài đặt Lotus ▸ Tổng quan ▸ Kiểu gõ (the Lotus settings).',
          'Ctrl+Shift switches between Vietnamese and English. The tray shows a V while you type Vietnamese and a boxed A for English.',
          'Apps installed from Flathub type Vietnamese and use the system fonts as usual.',
          'Pick another language in Settings and the whole system follows.',
        ],
        media: { type: 'single', main: [`${shots}/installer-lotus.webp`, 'The installer slideshow’s page about the Fcitx5 Lotus input method, shown while CaramOS installs'] },
      },
    ],
    printers: {
      tag: 'New in 1.3.9',
      title: 'Got a Canon laser printer? One click installs its driver',
      lead: 'Canon CAPT laser printers such as the LBP2900, LBP3300 and LBP6300dn are notoriously hard to set up on Linux. On CaramOS, Driver Check recognises the printer, installs the right driver and creates the print queue. You type no commands.',
      steps: [
        ['Plug in the printer', 'A “The printer has no driver” notification comes up right away.'],
        ['Click install', 'Click the install button in Driver Check and type your password. Canon\'s driver asks you to accept Canon\'s terms first.'],
        ['Print', 'Pick the new printer when you print. It keeps working after a replug or a restart.'],
      ],
      image: [`${shots}/printer-canon-driver-check.webp`, 'Driver Check reports that the Canon LBP6300 printer has no driver, with an Install Canon\'s driver button'],
      models: 'models',
      usbTitle: 'Over USB',
      usbHow: 'Driver Check recognises the printer as soon as it is plugged in.',
      canonGroup: 'Canon\'s own driver',
      newLabel: 'New',
      captGroup: 'Open-source captdriver',
      captSince: 'since 1.3.7',
      experimental: 'experimental',
      networkTitle: 'On the office network',
      networkHow: 'Open Driver Check, click “Add printer…”, pick the model and type the printer\'s IP address.',
      otherTitle: 'A Canon PIXMA inkjet or another brand?',
      other: 'These printers use drivers that come with CaramOS and are not in the lists above. Open Printers from the menu to add the printer, then pick the make and model, for example Canon PIXMA MG8120 or PIXMA iP8720.',
      note: 'Not supported yet: LBP810, LBP3600, LBP5200. CaramOS downloads Canon\'s driver straight from Canon\'s server and checks it before installing. Canon\'s terms allow it for personal, non-commercial use.',
    },
    statsTitle: 'Lighter than stock Linux Mint, no freeze when RAM runs out',
    statsLead: 'Measured on the same virtual machine (4 cores, 6 GB of RAM) as stock Linux Mint 22.3 Cinnamon; RAM 5 minutes after boot.',
    stats: [
      ['2.9 GB', 'installer ISO', 'Linux Mint 22.3: 3.1 GB'],
      ['865 MiB', 'RAM at idle', 'Linux Mint 22.3: 941 MiB'],
      ['0 freezes', 'when RAM runs out, thanks to earlyoom', 'Linux Mint 22.3 froze for 30+ minutes (slow disk)'],
      ['2029', 'security support', 'Ubuntu 24.04 LTS base'],
    ],
    extrasTitle: 'Also built in',
    extras: [
      ['palette', 'CaramOS wallpapers', 'Five wallpapers drawn for CaramOS, following light and dark mode.', 'Look'],
      ['camera', 'Quick screenshots', 'PrtSc copies the whole screen to the clipboard, ready for Ctrl+V in Zalo or Word. Super+Shift+S opens Flameshot to pick an area, draw, blur and save.', 'Tools'],
      ['shield', 'CaramOS boot menu', 'The boot menu, the splash screen and the GRUB menu of dual-boot computers all carry the CaramOS look.', 'Boot'],
      ['locale', 'Vietnamese language, time and dates', 'The Vietnamese language, the Asia/Ho_Chi_Minh time zone, Vietnamese date formats and fonts, set from the start.', 'Vietnamese'],
    ],
    ecosystemTitle: 'VNLF ecosystem',
    ecosystemLead:
      'Official Vietnam Linux Family channels and resources for community discussion, content distribution, and project development.',
    openSourceTitle: 'Open-source project information',
    openSourceLead:
      'We build CaramOS in the open on GitHub, under the GPL-3.0. The repository documents how to contribute, the code of conduct, how the ISO is built and how updates reach users.',
    buildTitle: 'How the ISO is built',
    buildLead:
      'CaramOS remasters an ISO: it unpacks the stock Linux Mint ISO, adds packages, configuration files and the update steps to the file system, then packs it again with squashfs and xorriso.',
    otaTitle: `Upgrade to CaramOS ${VERSION} without reinstalling`,
    otaLead:
      `Computers on CaramOS 1.0.2 or later have the Update Center. It checks for new versions and tells you when ${VERSION} is out; click Update and you are done. Since 1.5.0, new versions install themselves while you work, unless you turn Automatic updates off. Computers still on 1.0.1 run the Update Center installer once.`,
    otaInstallLabel: 'CaramOS 1.0.1 (no Update Center yet):',
    otaInstallHint: 'Run it once, then open “CaramOS Update Center” from the Start Menu.',
    otaUpgradeLabel: 'Upgrade right away, without waiting for the notification:',
    otaUpgradeHint: 'No hurry? Skip this. The Update Center checks every day and tells you when a new version is out.',
    otaCopy: 'Copy command',
    otaCopyInstallLabel: 'Copy Update Center installer command',
    otaCopyUpgradeLabel: 'Copy immediate upgrade command',
    otaCopied: 'Copied',
    otaSteps: [
      ['1.0.2 or later', 'Wait for the Update Center notification and click Update.'],
      ['On 1.0.1', 'Run the Update Center installer command once.'],
      ['Need it now', 'Run sudo caramos-ota --upgrade --yes in a terminal.'],
    ],
    releaseNotesTitle: 'Release notes',
    releaseNotesLead:
      (latest) => `${latest} is the latest release. CaramOS has had official releases since 1.3.0; the 1.0.x releases before it were Open Beta. Scroll the list for the notable changes of each release.`,
    releaseListLabel: 'Releases, scroll for more',
    releaseCurrent: 'Latest',
    releaseScrollHint: 'Scroll for earlier releases ↓',
    initialRelease: ['1.0.1', 'First release', ['The first CaramOS Open Beta for Vietnamese users.', 'Provided a Linux Mint 22.3 Cinnamon base with Vietnamese defaults, CaramOS branding, and essential applications.']],
    releaseNotes: [
      ['1.5.2.3', 'The computer checks for updates after each start', [
        'Besides the check at midnight, the computer checks for updates about 15 minutes after each start. Office and school computers that are off before midnight now get fixes on the day they are used, instead of at their next start.',
        'The new schedule applies from the first start after the update.',
      ]],
      ['1.5.2.2', 'The Xfce sound level looks right after an automatic update', [
        'Xfce edition: when the computer updated itself while you worked, the sound level showed in a tall box instead of the slim bar with the percentage, until the next login. It now looks right at once, without logging out.',
        'An update that changes the Control Center starts it again as soon as it is installed: the clock and the Control Center button on the taskbar go away for a few seconds, then come back.',
      ]],
      ['1.5.2.1', 'Older computers update themselves; Cinnamon no longer lists an Xfce update', [
        'Computers on CaramOS 1.3.3 or older (the 1.0.x releases and 1.3.0 to 1.3.3) almost never updated by themselves, because their older updates only install when nobody is logged in. They now install that update at the next start, before the login screen, with “Updating CaramOS” and the steps done on the start-up screen; it usually takes a few minutes.',
        'This happens only once on each older computer. After it, updates install in the background while you work, as on the newer versions.',
        'Cinnamon computers no longer list “Notifications at the bottom right”, which is only for the Xfce edition.',
      ]],
      ['1.5.2', 'One-button installs from the apps website, a steady Computer Lab, Zalo and Lark stay signed in', [
        'On apps.vietnamlinuxfamily.net, Install on CaramOS opens the App Center on that app, with no command to type. App Center 0.4.0 adds a Computer skills for children step (Tux Typing, KTouch, KolourPaint, Klickety and ad-free mouse practice websites), a Programming, maths, science and lessons step (eXeLearning, LeoCAD, Polypad) and a Video, music, photos and design step (VLC, Spotify, OBS, Kdenlive, GIMP, Inkscape), plus Obsidian, RustDesk, AnyDesk and OpenConnect for company VPNs.',
        'Computer Lab: students’ computers no longer lock, blank or sleep during the lesson; Veyon starts again when it stops, so Veyon Master no longer shows orange tiles. Lock and the full-screen Demo show on the students’ computers. A computer that left the lab no longer starts Veyon.',
        'Computers that log in by themselves, without a password: Zalo, Lark and browsers stay signed in, and no longer ask to “Choose password for new keyring” or for a keyring’s password. An older keyring with a password is moved to a folder of its own; nothing is deleted.',
        'The screen still goes dark after 15 minutes without use, but locks only after about half an hour: no password again after a coffee break.',
        'Automatic updates install while you use the computer too: what changes on your taskbar or desktop waits for your next login, so nothing moves on the screen while you work.',
        'Adding a Google or Microsoft account in Online Accounts no longer stops halfway in Firefox. Feedback & Help sends the computer’s details along (model, parts, drivers, printers, how it locks and sleeps), so the team can answer without asking again. Windows Data Transfer says when BitLocker locks a disk and how to turn it off. The lock and login screens use Be Vietnam Pro.',
        'Once a day the computer tells the CaramOS site that it is in use, with its version, its edition and an id that changes every day, so no computer can be traced; nothing else is sent. To turn it off, run `sudo caramos-ota --stats off`.',
      ]],
      ['1.5.1', 'More reliable updates; the Trash, Show desktop and PrtSc as on Windows', [
        'Opening the Update Center now asks the update server right away, with no password, before it says anything. When it cannot check, it says why (no network, a company network blocking it) instead of “up to date”. A failed daily check tries again an hour later. Computers stuck on an old version by a question during an update now update again.',
        'As on Windows, in both editions: click the right edge of the taskbar to show the desktop; PrtSc copies the whole screen to the clipboard, ready for Ctrl+V in Zalo or Word (Super+Shift+S still picks a part); the Trash is on the desktop. The Xfce edition also gets Super+D to show the desktop and Super+E to open Files.',
        'With Vietnamese typing on, passwords no longer show while you type them (Cinnamon edition). The names under desktop icons have a soft shadow and read well on light wallpapers. Tray icons change colour as soon as Dark mode is turned on or off, and keep their places.',
        'Cinnamon edition: the input method’s V shows as soon as you log in. The tray used to show an A until a text box was clicked, although Vietnamese typing was on, and clicking that A turned it off.',
        'Desktop shortcuts for folders in Google Drive, shared network folders and phones too.',
        'Xfce edition: copying files on the desktop and pasting them in Files works; Files’ Open in Terminal works; the Control Center button shows a plugged-in USB drive with Safely remove; event sounds can be turned on in Appearance.',
        'Type fastfetch in the Terminal to see the CaramOS logo with your computer’s details. New installs name the system partition CaramOS.',
        'CaramOS Business 0.3.1 (free): staff see the notice before the company’s settings apply; locking, messages and remote help reach staff computers within seconds; update results read in Vietnamese; cloned disks keep each user’s own desktop.',
      ]],
      ['1.5.0', 'Automatic updates, an easier move from Windows, lunar dates on the clock', [
        'Automatic updates are on by default: new CaramOS versions install while you work, and a notification says when they are done. To update by hand as before, turn off Automatic updates in the Update Center (needs an administrator password), or run `sudo caramos-ota --auto-update off`.',
        'Windows Data Transfer copies Desktop, Documents, Pictures, Downloads, Music, Videos, the files received in Zalo, Chrome, Edge and Cốc Cốc bookmarks, Outlook mail (.pst) and fonts from the Windows disk, the old computer’s disk or a shared folder on the network. Nothing on the Windows side is changed, and no file is overwritten.',
        'Old documents typed in .VnTime or VNI-Times: right-click the file and choose Convert to Unicode; the new file has “(Unicode)” in its name and the old one stays as it was. The Carlito font has the same width for every letter as Calibri, so Word and Excel files from Windows no longer reflow onto another page.',
        'Right-click ▸ New ▸ Vietnamese Official Documents: an official letter, a decision, a submission, a report, a notice, an invitation, minutes and an asset handover record, laid out as Decree 30/2020/ND-CP sets out. The Vietnamese Word template uses Times New Roman 13 pt; templates already in your Templates folder stay as they are.',
        'Lunar dates in the taskbar calendar, on both editions: click the clock, and every day shows its lunar day, the 1st and the 15th in red, with today’s lunar date at the top.',
        'Super+V opens the clipboard history, Super+L locks the screen, Ctrl+Alt+Delete opens the log out dialog, and pressing Super then typing searches. On the Xfce edition, Super key combinations no longer open the Start menu too.',
        'The Control Center has a Taskbar tile that puts your apps in the middle or on the left, a Do not disturb tile, and a brightness slider for external monitors with DDC/CI; scroll over its icon to change the volume, by 2, 5 or 10% a step. The Start menu and right-click menus have round corners.',
        'The Update Center and the App Center have a new look; the App Center has a “For your company” step with CaramOS Business (free) and Remmina. With 4 GB of RAM or less, or without a graphics driver, the App Center, Driver Check, Feedback & Help and Computer Lab each use 52–79 MB less RAM. Driver Check has a Save report button.',
      ]],
      ['1.4.0', 'An Xfce edition for 2 GB computers and school computer labs', [
        'A new, lighter Xfce edition for 2 GB computers and school labs: right after boot, Task Manager shows about 610 MB of RAM on a 2 GB computer. It keeps the three-island taskbar, the Control Center, the App Center, Driver Check and Vietnamese typing. Its interface is English by default, to match the Tin học textbooks; choosing Vietnamese at install gives Vietnamese.',
        'Files: right-click and choose New ▸ Folder (Mới ▸ Thư mục on the Cinnamon edition), as in Windows and the textbooks, with Word, Excel and PowerPoint templates. New installs show a folder tree in the left pane, like Windows Explorer.',
        'Computer Lab: installs and sets up Veyon or Epoptes, so the teacher can watch and control the students\' computers. The teacher\'s computer shows a 6-digit code; a student\'s computer finds it on the school network, and entering the code is all it takes.',
        'The App Center has an Education category: GCompris, Tux Paint, Klavaro, KTurtle, Thonny, Stellarium, TurboWarp (Scratch 3) and GeoGebra 6.',
        'Opening a Word, Excel or PowerPoint file without an office suite now offers ONLYOFFICE, WPS Office or LibreOffice from the App Center, instead of only showing the file\'s folder. .zip files open in the archive manager.',
        'The Control Center\'s sliders are longer, and their track shows in dark mode.',
      ]],
      ['1.3.11', 'A photo of Vietnam a day, an accent colour for the Control Center', [
        'A photo of Vietnam a day: open System Settings > Backgrounds, click the Việt Nam mỗi ngày folder and pick a photo. From then on, the wallpaper is a new photo of Vietnam\'s nature, landscapes and buildings every day (45 photos from Wikimedia Commons, with credits). Picking another wallpaper turns it off.',
        'The Control Center has an Accent colour tile: 8 presets, the theme\'s colour, or any colour you pick (Other colour…). A computer updated to 1.3.11 shows the tile from the next login.',
        'After a start that never reached the desktop (a black screen, a hang), the boot menu shows for 30 seconds at the next start, with Advanced options for the recovery mode.',
        'Files: the right-click menu now has Copy path to clipboard and Create a desktop shortcut, and picture thumbnails show on phones, network shares and Google Drive too.',
        'Install USB: the boot menu counts down 10 seconds, with larger text and Vietnamese key help (computers with Secure Boot keep the small default font). sudo apt update no longer prints the Lotus input method\'s i386 notice.',
      ]],
      ['1.3.10', 'The Update Center says why nothing was updated, fewer false alarms in Driver Check', [
        'Closing the password window during an update no longer ends on "Update failed": the Update Center says "Not updated yet" and offers Try again.',
        'Starting an update while the computer is already updating, or while another Update Center window is open, shows "Another update is running": wait for it to finish, then click Try again.',
        'A Canon printer plugged in over USB that the computer cannot talk to (a loose cable, a bad USB port, a hub) is reported as "The printer is not connected properly", with advice to try another port or cable, instead of offering a driver that then fails to install.',
        'Laptops with Intel GM45 (Mobile 4 Series) graphics no longer get a false "no driver" warning for their graphics card.',
      ]],
      ['1.3.9', 'Canon\'s own printer driver for the LBP6300dn and other CAPT printers, PrtSc takes screenshots', [
        'Driver Check installs Canon\'s own driver for the Canon CAPT printers captdriver cannot drive yet, such as the LBP6300dn, LBP3300, LBP5000, LBP6200 and LBP7200C. Over USB: plug it in, click Install Canon\'s driver, agree to Canon\'s terms, and about a minute later the printer is ready (22 models).',
        'Network printers (the 13 models with a network port): in Driver Check click Add printer…, pick the model and type its IP address.',
        'The driver comes straight from Canon\'s server and is checked before it is installed; CaramOS sets up the print queue, a print service that starts at boot, printing again after a replug, and keeps other computers on the network away from that service. Canon\'s terms allow it for personal, non-commercial use.',
        'Press PrtSc or Win+Shift+S to take a screenshot (both keys did nothing before): drag over an area, Ctrl+C to copy it into Zalo or Messenger, Ctrl+S to save it in the Pictures folder.',
      ]],
      ['1.3.8', 'Resize the Start Menu icons with Ctrl + mouse wheel', [
        'As on Windows: open the Start Menu, hold Ctrl and roll the mouse wheel over the apps. Up makes the icons grow, down makes them shrink, a little with every notch.',
        'Smaller icons fit more apps in a row (up to 7), bigger ones fewer. The default size looks as before.',
        'The Start Menu stays open on the category or search it shows, and keeps the size for next time.',
      ]],
      ['1.3.7', 'Canon LBP2900 printers install with one click', [
        'Plug the printer in and a "The printer has no driver" notification comes up. Click View details, then Install the printer driver, and the printer sets itself up. Before, the system gave Canon\'s CAPT printers an unsuitable PostScript driver: jobs were reported as printed while nothing came out.',
        'The driver is the open-source captdriver. According to captdriver, the LBP2900/LBP2900B and LBP3010/LBP3018/LBP3050 work, and the LBP3000, LBP3100 and LBP6000 are experimental. Other CAPT printers only work with Canon\'s driver.',
        'When a driver install fails, the error page has an Ask for help button, and the request carries the install log. On a computer with a printer, every help request carries a printer log, without serial numbers or document names.',
        'Unplugging a printer or a USB Wi-Fi adapter no longer shows "Hardware problem solved".',
      ]],
      ['1.3.6', 'The Update Center no longer freezes on a long update', [
        'The update that finishes an NVIDIA driver left half installed prints about 49,000 lines, and the Update Center window used to stop responding for more than 15 minutes. Those lines now show up in less than a second.',
        'The log always scrolls to its latest line, and the result page still has the whole log.',
        'The update to 1.3.6 still runs in the window of the version you have. On a computer with an NVIDIA driver left half installed, run sudo dpkg --configure -a before updating; if the window freezes, let it finish and do not turn the computer off.',
      ]],
      ['1.3.5', 'Installing the NVIDIA driver from Driver Check works again', [
        'Since 1.3.0, Driver Check stopped NVIDIA driver installs halfway, so after a restart the computer had no graphics driver and a 1024×768 screen. 1.3.5 fixes this.',
        'On a computer left like this, open a Terminal, run sudo dpkg --configure -a and restart. The update to 1.3.5 repairs it too.',
        'Driver Check checks the free disk space before installing, and says how much to free and where. The NVIDIA driver can bring a newer Linux kernel with it, and then the download is up to about 1 GB.',
      ]],
      ['1.3.4', 'The input method keeps your settings, a faster Start Menu, updates that get through', [
        'The Lotus settings you choose (Telex or VNI, the mode, spell checking, shortcuts) are no longer reset at every login, and every session starts typing Vietnamese (V); press Ctrl+Shift to switch to English.',
        'The Start Menu shows results while you type Vietnamese, and no longer freezes the computer while searching files, also on a hard disk or with Google Drive mounted in the home folder.',
        'The Update Center is no longer blocked by a broken software source another program added, or by a package left half installed, such as the faulty Lotus 3.5.6 or an NVIDIA 470 driver.',
        'Driver Check offers the NVIDIA 580 driver instead of 470, which does not work on Linux 6.14 and later, and says so when the graphics driver is turned off by nomodeset or a blacklist.',
        'App Center 0.2.3 installs apps while another package is half installed, waits for the CaramOS installer in the live session from USB, and resumes WPS Office downloads the server cuts off.',
      ]],
      ['1.3.3', 'Vietnamese typing works at every login', [
        'On some new installs of CaramOS 1.3, and in the live session from USB, the Lotus input method did not start, so typing gave letters without accents. It now starts at every login.',
        'On an affected computer, clicking Update now in the Update Center makes typing work right away, without logging in again.',
      ]],
      ['1.3.2', 'Zalo installs again, a tidy taskbar, error reports with logs', [
        'The new Zalo for Linux runs natively, without Wine, so it opens faster. App Center 0.2.2 installs it; the Update Center moves an installed Zalo to it, downloading in the background and trying again every day on a flaky connection.',
        'Taskbar icons fit their dock again after the Cinnamon 6.6.9 update; CaramOS now puts its changes back after every Cinnamon update.',
        'Driver Check no longer freezes old computers in the live session, and explains why speakers, microphone and cameras do not work yet on Intel Atom tablets such as the Lenovo Yoga Book.',
        'When the App Center or the Update Center fails, Ask for help sends a request with the error log; only the VNLF team sees the logs, and personal data is taken out before sending.',
        'The installer no longer stops right after opening or blocks installing other software in the live session.',
      ]],
      ['1.3.1', 'A Start Menu and Update Center in one language', [
        'In Vietnamese the Start Menu shows “Tất cả ứng dụng” and “Biểu tượng cảm xúc” instead of English words; the weather applet and the bundled extensions follow the system language too.',
        'Update Center: the size line of an update no longer mixes in English.',
        'App Center 0.2.1: Zalo for Linux is labelled “Community package”, since the community packages it, not Zalo.',
      ]],
      ['1.3.0', 'The first official release: App Center, Driver Check, Feedback & Help', [
        'App Center: at the first login pick an office suite, browsers, chat apps and everyday tools, and CaramOS installs them; remove an app right from its card.',
        'Driver Check: checks Wi-Fi, wired network, graphics, sound, Bluetooth, webcam, fingerprint reader and Canon LBP2900 printers; installs NVIDIA and Broadcom Wi-Fi drivers and Canon LBP2900 printers with one click; opens at the first login and in the live USB session, and speaks up when a printer that needs a driver is plugged in.',
        'Feedback & Help: a question mark on the taskbar to ask for help, report a bug or send feedback with pictures or videos to the VNLF community; follow requests and get notified of answers.',
        'The Update Center is redesigned in the VNLF colours, with Update now always at the bottom of the window.',
        'Lighter than stock Linux Mint 22.3: fewer background services and less RAM; earlyoom closes the hungriest app instead of letting the machine freeze; a 2.8 GB ISO.',
        'WPS Office, Chrome and Zalo are no longer preinstalled but picked in the App Center; CopyQ no longer starts at login; 14 unused icon colours (about 1.1 GB) are removed.',
      ]],
      ['1.0.20', 'Your language, a bilingual interface', [
        'Removed the forced LC_ALL=vi_VN in /etc/locale.conf: the language chosen in Settings > Languages applies, and English installs no longer get Vietnamese mixed in (#65).',
        'The Control Center, Update Center and Audit tool are translated with gettext; update titles and summaries follow the session language.',
        'Fixed the Lotus enable service that could hang the boot.',
      ]],
      ['1.0.19', 'A CaramOS GRUB menu', [
        'Replaced the blue-on-blue GRUB menu with a CaramOS theme, shown on dual-boot machines or when holding Shift/Esc at boot.',
        'A GRUB_THEME the user set is kept.',
      ]],
      ['1.0.18', 'Dark mode, power mode, and a new Zalo', ['Add a Dark mode tile to Control Center: switch the whole system to the Cinnamon-Delight-Dark theme in CaramOS colours; the default wallpaper follows between Sage Mist and Indigo Night.', 'Replace TLP with power-profiles-daemon and add a Power mode tile with Performance, Balanced, and Power saver.', 'Update Zalo to 26.10.10 from the VN-Linux-Family/zalo-for-linux repository; installed systems get the new Zalo through OTA with user data kept.', 'Return system files in /etc and /usr that were owned by a user account to root, and stop System Reports from offering a wrong Linux Mint upgrade.']],
      ['1.0.16', 'Taskbar pins and desktop cleanup', ['Pin Zalo and Software Manager to the Cinnamon taskbar when installed.', 'Keep WPS Office pinned to the taskbar.', 'Remove stock WPS Office, Zalo, and Software Manager shortcuts from the desktop while preserving user-modified files.']],
      ['1.0.15', 'New CaramOS wallpapers', ['Install five 2048×1152 CaramOS wallpapers.', 'Force Sage Mist as the wallpaper for every desktop user and the login screen through the stable default.png path.', 'Replace the Linux Mint collection in Cinnamon Backgrounds with the CaramOS collection.']],
      ['1.0.14', 'Three-dock taskbar for CaramOS', ['Split the bottom Cinnamon taskbar into evenly spaced left, center, and right docks.', 'Place the CaramOS Start Menu on the left, pinned/running apps in the center, and status applets on the right.', 'Show a small dot below running application icons.']],
      ['1.0.13', 'Add CaramOS Control Center', ['Add the caramos-control-center@caramos applet to the Cinnamon panel.', 'Enable Control Center for desktop users with an active session.', 'Remove stock network, sound, and power applets replaced by Control Center while preserving every other applet and its existing position.']],
      ['1.0.12', 'Login password prompt fix', ['Removed system service enablement from the desktop user autostart helper to avoid systemd/polkit prompts at login.', 'Moved fcitx5-lotus-server@USER.service enablement into a root oneshot service.', 'Kept Fcitx5 Lotus, Telex, and Preedit configuration in the user-level login helper.']],
      ['1.0.11', 'OTA fix for custom usernames', ['Published a new OTA target so systems already on 1.0.10 can receive the fix.', 'Updated earlier migrations to discover real desktop users instead of hardcoding caram or mint.', 'Used each user’s real home directory when applying Cinnamon, Desktop launcher, Fcitx5, and panel icon-size settings.']],
      ['1.0.10', 'Cinnamon panel icon size update', ['Applied the panel icon size update from PR #62.', 'Set right-side Cinnamon panel icons to 18px in dconf defaults.', 'Aligned caramos-theme-apply and preserved user-customized panel icon sizes during migration.']],
      ['1.0.9', 'Stable Vietnamese input defaults', ['Added stable Fcitx5 Lotus defaults for Vietnamese input.', 'Kept English and Lotus in the Fcitx menu with Ctrl+Shift switching.', 'Routed Cinnamon Start menu search through Fcitx and restarted Fcitx after applying defaults.']],
      ['1.0.8', 'Software Manager pinning', ['Applied the Software Manager pinning update from PR #54.', 'Pinned Software Manager to Cinnamon grouped-window-list defaults.', 'Added a Software Manager launcher to the default and live user Desktop.']],
      ['1.0.7', 'Cinnamon panel layout update', ['Applied the panel layout update from PR #53.', 'Added systray, network, and sound applets to right panel defaults.', 'Removed weather/cornerbar defaults and added a searchable launcher for CaramOS Update Center.']],
      ['1.0.6', 'CaramOS installer slideshow', ['Added custom CaramOS Ubiquity slideshow assets from PR #52.', 'Added OTA migration to install slideshow files on existing systems.', 'Kept build dependency metadata compatible with Launchpad builders.']],
      ['1.0.5.2', 'Migration chain through 1.0.5', ['Released the OTA migration chain through CaramOS 1.0.5.', 'Added migrations for MintWelcome branding, default ZRAM, MintReport branding, and codename metadata.', 'Aggregated multi-step release notes, updated notifier size, and fixed codename compatibility for add-apt-repository.']],
      ['1.0.2', 'Initial OTA updater package', ['Introduced the first CaramOS OTA updater package.', 'Added CLI commands for check, upgrade, status, repair, rollback, and dry-run.', 'Included daily systemd checks, GTK3 Vietnamese notifier, pkexec/polkit, transaction state, best-effort rollback, and logrotate.']],
    ],
    galleryTitle: 'From the boot menu to the desktop',
    gallery: [
      [`${shots}/boot-menu-131.webp`, 'The CaramOS boot menu', 'The boot menu lets you try CaramOS or install it.'],
      [`${shots}/installer-apps.webp`, 'The installer slideshow while CaramOS installs, on its page about office suites, browsers and Zalo in the App Center', 'While it installs, the installer shows the apps you can pick at the first login.'],
      [`${shots}/start-menu-131.webp`, 'The CaramOS Start Menu', 'The Start Menu finds apps in Vietnamese, even typed without accents.'],
    ],
    downloadTitle: `Download CaramOS ${VERSION}`,
    downloadLead:
      'The Cinnamon edition (2.9 GB) is for computers with 4 GB of RAM or more. The lighter Xfce edition (2.7 GB) is for 2 GB computers and school labs. The buttons download from CaramOS’s server on Cloudflare; if that fails, use the SourceForge mirror. After downloading, check the SHA256, write the ISO to a USB stick and try it, so Driver Check can tell whether the computer suits CaramOS. Then click the Install CaramOS icon on the Desktop.',
    downloadButton: 'Cinnamon edition (2.9 GB)',
    downloadXfceButton: 'Xfce edition for 2 GB (2.7 GB)',
    checksumsXfce: 'Xfce SHA256',
    requirements: ['64-bit computer, UEFI or BIOS', '2 GB of RAM (Xfce edition), 4 GB recommended', '20 GB of free disk space', 'A USB stick of 4 GB or more'],
    supportTitle: 'Help more people find CaramOS',
    supportLead:
      'Clap for CaramOS on Unikorn so more people in Vietnam hear about it.',
    supportAction: 'Clap for CaramOS',
    supportMeta: 'Every clap and ranking badge helps CaramOS stand out in the Vietnamese open-source community.',
    footer: 'CaramOS is part of the Vietnam Linux Family ecosystem.',
    ecosystem: [
      ['website', 'Website', 'Official VNLF homepage, technical articles, and project resources.', 'vietnamlinuxfamily.net', 'Official', links.vnlf],
      ['telegram', 'Telegram', 'Announcements and quick chat with the community.', 't.me/vietnamlinuxfamily', 'Community', links.telegram],
      ['discord', 'Discord', 'Technical questions and project work, in separate channels.', 'discord.gg/gVAJDUMC2n', 'Community', links.discord],
      ['facebook', 'Facebook', 'A group for questions, tips and community news.', 'facebook.com/groups/vietnamlinuxcommunity', 'Community', links.facebook],
      ['apps', 'Apps', 'A Vietnamese-language Linux app directory; the App Center links here when you need more apps.', 'apps.vietnamlinuxfamily.net', 'Apps', links.apps],
      ['mirror', 'Mirror', 'The repository behind the mirror servers that distribute VNLF’s files.', 'GitHub: mirror', 'Infra', links.mirror],
    ],
    openSource: [
      ['License', 'The source code is under the GNU General Public License v3.0.'],
      ['Contribution guide', 'CONTRIBUTING.md describes the architecture, how the ISO is built, branch conventions and how to send changes.'],
      ['Code of conduct', 'CODE_OF_CONDUCT.md is based on Contributor Covenant 2.1.'],
      ['Issue tracking', 'GitHub Issues and Feedback & Help on CaramOS track bugs and feature requests.'],
      ['Release workflow', 'GitHub Actions builds the ISO from release tags, uploads it to Cloudflare R2 (the main download) and SourceForge (the mirror), and publishes SHA256SUMS.'],
      ['Build process', 'The unpack, customize and repack stages are separate scripts, so each one can be checked and fixed on its own.'],
    ],
  },
};



export const SITE = 'https://caramos.vietnamlinuxfamily.net';
// The day VERSION is released: the JSON-LD's datePublished, llms.txt and the hero's last fact.
export const RELEASE_DATE = '2026-11-25';
const [releaseYear, releaseMonth, releaseDay] = RELEASE_DATE.split('-').map(Number);
const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December'];
const releasedVi = `${releaseDay}/${releaseMonth}/${releaseYear}`;
const releasedEn = `${releaseDay} ${monthsEn[releaseMonth - 1]} ${releaseYear}`;
export const photos = '/assets/photos';

// The photo shown for "Việt Nam mỗi ngày": one of the 45 daily wallpapers (public/wallpapers/photos.json).
export const dailyPhoto = {
  src: `${photos}/ruong-bac-thang-ha-giang-1440w.webp`,
  srcSmall: `${photos}/ruong-bac-thang-ha-giang-760w.webp`,
  width: 1440,
  height: 600,
  author: 'minhphuc_99kdd',
  license: 'Public domain',
  source: 'https://commons.wikimedia.org/wiki/File:Rice_terraces_in_Ha_Giang,_Vietnam_-_2012_-_121_(10062070653).jpg',
};

// What Lotus does while someone types Telex: [key, text on screen after that key].
const telexVi = [['n', 'n'], ['g', 'ng'], ['u', 'ngu'], ['o', 'nguo'], ['w', 'ngươ'], ['i', 'ngươi'], ['f', 'người'], [' ', 'người '],
  ['V', 'người V'], ['i', 'người Vi'], ['e', 'người Vie'], ['e', 'người Viê'], ['t', 'người Viêt'], ['j', 'người Việt']];
const telexEn = [['t', 't'], ['i', 'ti'], ['e', 'tie'], ['e', 'tiê'], ['s', 'tiế'], ['n', 'tiến'], ['g', 'tiếng'], [' ', 'tiếng '],
  ['V', 'tiếng V'], ['i', 'tiếng Vi'], ['e', 'tiếng Vie'], ['e', 'tiếng Viê'], ['t', 'tiếng Viêt'], ['j', 'tiếng Việt']];

Object.assign(copy.vi, {
  seo: {
    title: `Linux cho người Việt: CaramOS ${VERSION}, hệ điều hành miễn phí`,
    description: 'CaramOS là Linux cho người Việt, miễn phí và dựa trên Linux Mint. Cài xong là gõ tiếng Việt được, Zalo cài bằng một nút. Bản Xfce chạy cả trên máy cũ 2 GB RAM.',
    // The link preview (scripts/prerender.mjs ogImage) of every page.
    ogAlt: 'Ảnh giới thiệu CaramOS 1.5.2, Linux cho người Việt: máy tự cập nhật, có âm lịch, chuyển từ Windows sang dễ hơn. Bên cạnh là cửa sổ Chọn ứng dụng cho máy ở lần đăng nhập đầu tiên.',
  },
  skip: 'Bỏ qua, tới nội dung chính',
  // Anchors (#…) are sections of the home page; paths are pages of their own.
  menu: [['Chọn bản cài', '#editions'], ['Tính năng', '#features'], ['Giáo dục', '/giao-duc/'], ['Doanh nghiệp', '/doanh-nghiep/'], ['Máy in', '#printers'], ['Nâng cấp', '#ota'], ['Có gì mới', '#release-notes'], ['Hỏi đáp', '#faq']],
  navLabel: 'Mục chính',
  menuLabel: 'Menu',
  menuDownload: 'Tải về',
  heroDonate: 'Donate cho CaramOS',
  heroSource: 'Mã nguồn trên GitHub',
  githubLabel: 'Mã nguồn CaramOS trên GitHub',
  projectRepoLink: 'Mở CaramOS trên GitHub',
  backing: {
    donateLine: 'Muốn góp tiền duy trì dự án, bạn donate qua MoMo (nhận chuyển khoản từ mọi ngân hàng Việt Nam), PayPal, Ko-fi, Buy Me a Coffee hoặc USDT.',
    badges: ['CaramOS trên Unikorn.vn', 'Xếp hạng ngày của CaramOS trên Unikorn', 'Xếp hạng tuần của CaramOS trên Unikorn', 'Xếp hạng tháng của CaramOS trên Unikorn'],
  },
  otherLanguage: ['English', '/en/', 'en', 'EN'],
  heroLine: 'Linux cho',
  heroTyped: 'người Việt',
  telex: telexVi,
  telexNote: 'Bộ gõ Lotus bật sẵn kiểu Telex. Cài xong là gõ được tiếng Việt.',
  heroIntro: 'CaramOS là hệ điều hành miễn phí dựa trên Linux Mint, làm cho máy tính ở nhà, ở văn phòng và trong phòng máy trường học. Bật máy lên là có tiếng Việt và bộ gõ. Zalo, Chrome, bộ văn phòng hay driver đều cài bằng một nút bấm. Bản CaramOS mới thì máy tự cài.',
  heroUpgrade: `Đang dùng CaramOS? Nâng cấp lên ${VERSION} không cần cài lại`,
  heroShotAlt: 'Lần đăng nhập đầu tiên trên CaramOS: cửa sổ Chọn ứng dụng cho máy với ONLYOFFICE, WPS Office, LibreOffice, Chrome và Cốc Cốc; bấm Cài 5 ứng dụng là CaramOS tự cài',
  heroFacts: [['Miễn phí, mã nguồn mở', 'giấy phép GPL-3.0, mã nguồn trên GitHub'], ['Dựa trên Linux Mint 22.3', 'Ubuntu 24.04 LTS, cập nhật bảo mật đến 2029'], [`Bản ${VERSION}`, `phát hành ngày ${releasedVi}`]],
  editions: {
    title: 'Máy bạn hợp bản nào?',
    lead: 'Máy từ 4 GB RAM dùng bản Cinnamon, bản chính, giao diện tiếng Việt. Máy cũ 2 GB và phòng máy ở trường dùng bản Xfce, nhẹ hơn khoảng 170 MB RAM. Bản nào cũng có bộ gõ tiếng Việt, App Center, Kiểm tra driver và Trung tâm cập nhật.',
    cinnamon: { name: 'Bản Cinnamon', note: 'Bản chính', image: [`${shots}/cinnamon-desktop-140.webp`, 'CaramOS Cinnamon với hình nền Việt Nam mỗi ngày và Control Center mở ở góc phải'] },
    xfce: { name: 'Bản Xfce', note: 'Nhẹ hơn, cho máy 2 GB', image: [`${shots}/xfce-desktop-150.webp`, 'CaramOS Xfce với Control Center mở ở góc phải thanh tác vụ'] },
    rows: [
      ['Dành cho', 'Máy từ 4 GB RAM', 'Máy 2 GB RAM, máy cũ, phòng máy ở trường'],
      ['RAM khi vừa bật máy*', 'Khoảng 780 MB', 'Khoảng 610 MB'],
      ['Giao diện', 'Tiếng Việt', 'Tiếng Anh, đúng chữ trong sách Tin học (New, Folder, Copy, Paste…). Chọn tiếng Việt lúc cài thì có giao diện tiếng Việt. Bộ gõ tiếng Việt chạy như bình thường.'],
      ['Dung lượng ISO', '2,9 GB', '2,7 GB'],
    ],
    download: ['Tải bản Cinnamon', 'Tải bản Xfce'],
    checksum: 'Mã SHA256',
    mirror: 'Link dự phòng',
    footnote: '* Số Task Manager báo khi vừa bật máy, đo cùng cách trên cùng một máy 2 GB. Muốn đổi một máy đang chạy bản Cinnamon sang Xfce thì cài mới từ ISO Xfce.',
  },
  // The home page's section for schools and companies, each with a link to its own page.
  orgs: {
    title: 'Bạn lo cả phòng\u00a0máy hay cả văn\u00a0phòng?',
    lead: 'Trường học có công cụ Phòng máy để quản lý lớp học, và bản Xfce chạy trên máy 2 GB. Công ty có CaramOS Doanh nghiệp để quản lý máy nhân viên từ một máy. Cả hai đều miễn phí.',
    education: {
      title: 'Phòng máy Tin học ở trường',
      who: 'Cho giáo viên Tin học và người lo phòng máy, kể cả phòng toàn máy cũ RAM 2 GB.',
      points: [
        'Giáo viên xem màn hình, khóa máy và điều khiển máy học sinh. Học sinh vào lớp bằng mã 6 số.',
        'Bản Xfce chạy trên máy 2 GB RAM, dùng khoảng 610 MB khi vừa bật.',
        'Giao diện tiếng Anh đúng chữ trong sách Tin học, chuột phải có New ▸ Folder.',
        'App Center có 17 phần mềm học tập, như GCompris, Scratch 3, Thonny và GeoGebra, cài bằng một nút.',
      ],
      link: 'Xem trang Linux cho trường học',
      image: [`${shots}/lab-veyon-140.webp`, 'Veyon Master trên máy giáo viên thấy màn hình của máy học sinh', 1072, 670],
      overlay: [`${shots}/lab-code-140.webp`, 'Mã ghép nối 6 số trên máy giáo viên', 620, 433],
    },
    business: {
      title: 'Máy tính văn phòng ở công ty',
      who: 'Cho công ty muốn quản lý máy nhân viên chạy CaramOS từ một máy, ngay trong mạng LAN của mình.',
      status: 'Miễn phí, cài từ App Center ở bước Dùng cho công ty.',
      points: [
        'Hình nền, trình duyệt, máy in, Wi-Fi và USB đặt cho cả công ty hoặc từng phòng ban.',
        'Máy tự kiểm kê; người quản trị xuất danh sách tài sản ra Excel.',
        'Nhân viên bấm Nhờ IT hỗ trợ; IT giúp từ xa khi nhân viên đồng ý.',
        'Công ty đặt luật cho máy nhưng không xem được màn hình, phím gõ hay lịch sử web của nhân viên.',
      ],
      link: 'Xem trang Linux cho doanh nghiệp',
      image: [`${shots}/business-overview-030.webp`, 'Trang Tổng quan của CaramOS Doanh nghiệp trên máy quản lý: máy nhân viên đang bật, máy chờ duyệt, nhân viên nhờ hỗ trợ'],
    },
  },
  daily: {
    title: 'Mỗi ngày một ảnh Việt Nam làm hình nền',
    text: 'Mở Cài đặt hệ thống > Hình nền, bấm thư mục Việt Nam mỗi ngày rồi chọn một ảnh. Từ đó, mỗi ngày hình nền là một ảnh mới về thiên nhiên, cảnh đẹp hay công trình của Việt Nam, lấy từ 45 ảnh trên Wikimedia Commons có ghi tác giả. Chọn hình nền khác là thôi đổi.',
    link: 'Xem cả 45 ảnh và tác giả',
    alt: 'Ruộng bậc thang mùa lúa chín ở Hà Giang',
    credit: (author, license) => `Ruộng bậc thang mùa lúa chín, Hà Giang. Ảnh: ${author}, ${license.toLowerCase() === 'public domain' ? 'thuộc phạm vi công cộng' : license}, Wikimedia Commons.`,
  },
  compare: {
    title: 'CaramOS khác Linux Mint gốc ở đâu?',
    lead: 'CaramOS dựa trên Linux Mint 22.3. Bọn mình đo bản Cinnamon của cả hai trên cùng một máy ảo (4 nhân, 6 GB RAM), RAM đo 5 phút sau khi khởi động.',
    head: ['', 'CaramOS', 'Linux Mint 22.3'],
    rows: [
      ['ISO cài đặt', '2,9 GB', '3,1 GB'],
      ['RAM khi máy rảnh', '865 MiB', '941 MiB'],
      ['Khi RAM cạn', 'Không đơ: earlyoom đóng ứng dụng tốn RAM nhất', 'Đơ hơn 30 phút (ổ cứng chậm)'],
      ['Cập nhật bảo mật', 'Đến 2029, nền Ubuntu 24.04 LTS', 'Đến 2029, nền Ubuntu 24.04 LTS'],
    ],
  },
  extrasLead: '',
  faq: {
    title: 'Câu hỏi thường gặp về CaramOS',
    items: [
      ['CaramOS là gì?', 'CaramOS là Linux cho người Việt, một hệ điều hành miễn phí và mã nguồn mở (GPL-3.0) do cộng đồng Vietnam Linux Family làm. CaramOS dựa trên Linux Mint 22.3 và Ubuntu 24.04 LTS. Cài xong là có tiếng Việt, bộ gõ Lotus, App Center cài ứng dụng bằng một nút, Kiểm tra driver và Trung tâm cập nhật.'],
      ['CaramOS có mất phí không?', 'Không. CaramOS miễn phí và mã nguồn mở theo giấy phép GPL-3.0, dù bạn dùng ở nhà, ở trường hay ở công ty. Tải ISO, cài và cập nhật đều không mất đồng nào. Mã nguồn công khai trên GitHub.'],
      ['Máy yếu, máy cũ RAM 2 GB thì dùng bản nào?', 'Dùng bản Xfce. Vừa bật máy, Task Manager báo khoảng 610 MB RAM trên máy 2 GB, ít hơn bản Cinnamon khoảng 170 MB. Máy từ 4 GB RAM dùng bản Cinnamon. Với máy cũ, bạn chạy thử từ USB trước để Kiểm tra driver báo máy còn thiếu driver gì.'],
      ['Máy cần cấu hình thế nào?', 'Máy 64-bit, khởi động bằng UEFI hoặc BIOS. RAM từ 2 GB với bản Xfce, khuyên dùng 4 GB. Ổ đĩa trống từ 20 GB, và một USB từ 4 GB để cài.'],
      ['Linux có tiếng Việt và gõ tiếng Việt được không?', 'Trên CaramOS thì có ngay sau khi cài. Bản Cinnamon có giao diện tiếng Việt, bản Xfce thì chọn tiếng Việt lúc cài. Bộ gõ Lotus bật sẵn kiểu Telex; Ctrl+Shift chuyển giữa tiếng Việt và tiếng Anh, khay hệ thống hiện chữ V khi gõ tiếng Việt và chữ A trong ô vuông khi gõ tiếng Anh. Kiểu VNI chọn trong Cài đặt Lotus ▸ Tổng quan ▸ Kiểu gõ.'],
      ['Linux có cài được Zalo không?', 'Trên CaramOS thì có. App Center cài Zalo cho Linux bằng một nút. Mở Zalo lần đầu, bạn quét mã QR bằng Zalo trên điện thoại để đăng nhập. Bản Zalo này do cộng đồng đóng gói, không phải bản chính thức của Zalo, và App Center có ghi rõ điều đó.'],
      ['Từ Windows chuyển sang có mang theo dữ liệu được không?', 'Được. Mở menu, tìm Chuyển dữ liệu từ Windows. Ứng dụng này chép tài liệu, ảnh, tệp nhận qua Zalo, dấu trang trình duyệt, thư Outlook và phông chữ từ ổ Windows, ổ cứng của máy cũ hay thư mục chia sẻ trên mạng, và không sửa gì trên máy Windows. Văn bản cũ gõ bằng phông TCVN3 hay VNI thì bấm chuột phải vào tệp, chọn Chuyển mã sang Unicode.'],
      ['Có thử trước khi cài được không?', 'Được. Ghi ISO ra USB rồi khởi động máy từ USB để chạy thử; chạy thử không đụng tới ổ cứng. Kiểm tra driver cho biết máy có hợp với CaramOS không. Muốn cài thì bấm biểu tượng Cài đặt CaramOS trên Desktop.'],
      ['CaramOS có tự cập nhật không?', 'Có, từ bản 1.5.0. Mỗi ngày máy kiểm tra bản CaramOS mới, có thì tự cài trong lúc bạn làm việc rồi báo khi xong. Máy hoãn khi đang dùng mạng tính dung lượng, pin dưới 50% mà chưa cắm sạc, ổ đĩa sắp đầy hoặc đang cài phần mềm khác. Muốn tự bấm cập nhật thì tắt Tự động cập nhật trong Trung tâm cập nhật (cần mật khẩu quản trị). Bản vá của Ubuntu và Linux Mint vẫn cài qua Trình quản lý cập nhật như trước.'],
      ['Đang dùng CaramOS bản cũ thì nâng cấp thế nào?', 'Máy từ CaramOS 1.0.2 trở lên có Trung tâm cập nhật. Khi có bản mới, bạn bấm Cập nhật; máy không phải cài lại và dữ liệu vẫn nguyên. Từ bản 1.5.0, các bản sau tự cài. Máy còn ở bản 1.0.1 thì chạy lệnh cài Trung tâm cập nhật một lần, lệnh có ở mục Nâng cấp trên trang này.'],
      ['Máy in Canon có in được không?', 'Máy in laser Canon dùng CAPT như LBP2900, LBP3300, LBP6300dn cắm vào là Kiểm tra driver nhận ra và cài driver bằng một nút. Máy in phun Canon PIXMA và máy in hãng khác dùng driver có sẵn trong CaramOS, thêm trong mục Máy in.'],
      ['CaramOS thay được Windows không?', 'Được, với việc hằng ngày như dùng Zalo, lướt web, soạn văn bản và bảng tính, họp trực tuyến hay xem phim. Thanh tác vụ, Start Menu và các phím tắt như Super+L, PrtSc dùng như trên Windows. Phần mềm chỉ có bản Windows, như Photoshop, AutoCAD hay game có chống gian lận, thì không chạy trên CaramOS.'],
      ['Windows 10 hết hỗ trợ thì chuyển sang CaramOS được không?', 'Được. Windows 10 hết hỗ trợ từ 14/10/2025, và gói cập nhật bảo mật mở rộng cho máy cá nhân cũng dừng ngày 13/10/2026. Nhiều máy cũ lại không lên được Windows 11 vì thiếu TPM 2.0 hay CPU đời mới. CaramOS miễn phí, chạy được trên máy 2 GB RAM và có cập nhật bảo mật đến 2029.'],
      ['Linux có dùng được Word, Excel không?', 'Có. Trên CaramOS, tệp Word, Excel và PowerPoint mở bằng ONLYOFFICE, WPS Office hoặc LibreOffice, cài từ App Center bằng một nút. Mở một tệp Word khi máy chưa có bộ văn phòng thì CaramOS gợi ý cài. Phông Carlito có cùng độ rộng chữ với Calibri, nên tài liệu từ Windows không xô dòng.'],
      ['Cài Linux có mất dữ liệu không?', 'Chạy thử từ USB thì không, vì chạy thử không đụng tới ổ cứng. Khi cài, chọn xóa ổ đĩa thì mọi thứ trên ổ đó bị xóa; trình cài đặt còn có những cách cài khác. Dù chọn cách nào, bạn cũng nên chép dữ liệu quan trọng ra USB hay ổ khác trước khi cài.'],
    ],
  },
  communityTitle: 'Làm cùng cộng đồng',
  communityLead: 'Bạn hỏi đáp, góp ý và báo lỗi ở các kênh của Vietnam Linux Family, hoặc bấm dấu ? ở góc phải thanh tác vụ. Mã nguồn công khai trên GitHub, ai cũng gửi đóng góp được.',
  projectTitle: 'Mã nguồn',
  contributorsCount: (n) => `${n} commit`,
  starsLabel: 'sao trên GitHub',
  forksLabel: 'fork',
  issuesLabel: 'issue đang mở',
  downloadAll: 'Tất cả tệp của bản phát hành',
  copyCommand: 'Chép lệnh',
  copiedCommand: 'Đã chép',
  footerNote: 'CaramOS, Linux cho người Việt, là dự án của Vietnam Linux Family. Mã nguồn theo giấy phép GPL-3.0.',
  footerLinks: [['Linux cho trường học', '/giao-duc/'], ['Linux cho doanh nghiệp', '/doanh-nghiep/'], ['GitHub', links.repo], ['Báo lỗi', links.issues], ['Ảnh hình nền', '/wallpapers/'], ['Ủng hộ', '/support/']],
  releaseScrollHint: 'Cuộn trong khung để xem các bản trước.',
});

Object.assign(copy.en, {
  seo: {
    title: `Linux for Vietnamese users: CaramOS ${VERSION}, a free OS`,
    description: 'CaramOS is Linux for Vietnamese users: free, based on Linux Mint, with Vietnamese typing ready after install and Zalo one click away. Xfce runs on old 2 GB PCs.',
    ogAlt: 'Banner for CaramOS 1.5.2, Linux for Vietnamese users: it updates itself, shows lunar dates and makes moving from Windows easier. Beside it, the App Center’s app picker at the first login, in Vietnamese.',
  },
  skip: 'Skip to the main content',
  menu: [['Which edition', '#editions'], ['Features', '#features'], ['Education', '/en/education/'], ['Business', '/en/business/'], ['Printers', '#printers'], ['Upgrade', '#ota'], ['What’s new', '#release-notes'], ['FAQ', '#faq']],
  navLabel: 'Main',
  menuLabel: 'Menu',
  menuDownload: 'Download',
  heroDonate: 'Donate to CaramOS',
  heroSource: 'Source code on GitHub',
  githubLabel: 'CaramOS source code on GitHub',
  projectRepoLink: 'Open CaramOS on GitHub',
  backing: {
    donateLine: 'To help pay for the project, donate through MoMo (transfers from any Vietnamese bank), PayPal, Ko-fi, Buy Me a Coffee or USDT.',
    badges: ['CaramOS on Unikorn.vn', 'CaramOS in the Unikorn daily ranking', 'CaramOS in the Unikorn weekly ranking', 'CaramOS in the Unikorn monthly ranking'],
  },
  otherLanguage: ['Tiếng Việt', '/', 'vi', 'VI'],
  heroLine: 'Linux that speaks',
  heroTyped: 'tiếng Việt',
  telex: telexEn,
  telexNote: 'The Lotus input method types Telex by default, so Vietnamese works right after installing.',
  heroIntro: 'CaramOS is free Linux for Vietnamese users, based on Linux Mint and made for computers at home, at the office and in school labs. It starts up with Vietnamese and its input method ready. Zalo, Chrome, an office suite and drivers each install with one click, and new CaramOS versions install themselves.',
  heroUpgrade: `Already on CaramOS? Upgrade to ${VERSION} without reinstalling`,
  heroShotAlt: 'CaramOS at the first login: the App Center asks which office suite and browsers you want, then installs them',
  heroFacts: [['Free and open source', 'GPL-3.0, source code on GitHub'], ['Based on Linux Mint 22.3', 'Ubuntu 24.04 LTS, security updates until 2029'], [`Version ${VERSION}`, `released ${releasedEn}`]],
  editions: {
    title: 'Which edition suits your computer?',
    lead: 'Computers with 4 GB of RAM or more take Cinnamon, the main edition, with a Vietnamese interface. Older 2 GB computers and school labs take Xfce, which uses about 170 MB less RAM. Both have Vietnamese typing, the App Center, Driver Check and the Update Center.',
    cinnamon: { name: 'Cinnamon edition', note: 'The main edition', image: [`${shots}/cinnamon-desktop-140.webp`, 'CaramOS Cinnamon with a Việt Nam mỗi ngày wallpaper and the Control Center open'] },
    xfce: { name: 'Xfce edition', note: 'Lighter, for 2 GB computers', image: [`${shots}/xfce-desktop-150.webp`, 'CaramOS Xfce with the Control Center open at the right of the taskbar'] },
    rows: [
      ['For', 'Computers with 4 GB of RAM or more', '2 GB computers, older machines, school computer labs'],
      ['RAM right after boot*', 'About 780 MB', 'About 610 MB'],
      ['Interface', 'Vietnamese', 'English, with the same words as the Tin học textbooks (New, Folder, Copy, Paste…). Choosing Vietnamese at install gives a Vietnamese interface. Vietnamese typing works either way.'],
      ['ISO size', '2.9 GB', '2.7 GB'],
    ],
    download: ['Download Cinnamon', 'Download Xfce'],
    checksum: 'SHA256',
    mirror: 'Mirror',
    footnote: '* What Task Manager shows right after boot, measured the same way on the same 2 GB computer. To move a computer from Cinnamon to Xfce, install Xfce fresh from its ISO.',
  },
  orgs: {
    title: 'Do you look after a whole lab, or a whole office?',
    lead: 'School computer labs get the Computer Lab tool and an Xfce edition that runs on 2 GB computers. Companies get CaramOS Business to manage staff computers from one computer. Both are free.',
    education: {
      title: 'School computer labs',
      who: 'For computing teachers and whoever runs the lab, even a lab full of old 2 GB computers.',
      points: [
        'The teacher watches, locks and controls the pupils\' computers. Pupils join with a 6-digit code.',
        'The Xfce edition runs on 2 GB of RAM, using about 610 MB right after boot.',
        'An English interface with the words of the Tin học textbooks, and New ▸ Folder on right-click.',
        '17 learning apps in the App Center, such as GCompris, Scratch 3, Thonny and GeoGebra, one click to install.',
      ],
      link: 'See Linux for schools',
      image: [`${shots}/lab-veyon-140.webp`, 'Veyon Master on the teacher\'s computer showing a pupil\'s screen', 1072, 670],
      overlay: [`${shots}/lab-code-140.webp`, 'The 6-digit pairing code on the teacher\'s computer', 620, 433],
    },
    business: {
      title: 'Office computers at a company',
      who: 'For companies that want to manage staff computers running CaramOS from one computer, on their own network.',
      status: 'Free, installed from the App Center’s “For your company” step.',
      points: [
        'Wallpaper, browsers, printers, Wi-Fi and USB, set for the whole company or one department.',
        'Computers take their own inventory; the asset list exports to Excel.',
        'Staff click Ask IT for help, and IT helps remotely once they accept.',
        'The company sets rules for its computers but cannot see staff screens, keystrokes or browsing history.',
      ],
      link: 'See Linux for businesses',
      image: [`${shots}/business-overview-030.webp`, 'The Overview page of CaramOS Business on the admin computer, in Vietnamese: staff computers that are on, computers waiting for approval, employees asking for help'],
    },
  },
  daily: {
    title: 'A photo of Vietnam as your wallpaper, every day',
    text: 'Open System Settings > Backgrounds, click the Việt Nam mỗi ngày folder and pick a photo. From then on, the wallpaper is a new photo of Vietnam\'s nature, landscapes or landmarks every day, from 45 credited photos on Wikimedia Commons. Picking another wallpaper turns it off.',
    link: 'See all 45 photos and their authors',
    alt: 'Rice terraces at harvest time in Hà Giang',
    credit: (author, license) => `Rice terraces at harvest time, Hà Giang. Photo: ${author}, ${license.toLowerCase() === 'public domain' ? 'public domain' : license}, Wikimedia Commons.`,
  },
  compare: {
    title: 'How is CaramOS different from stock Linux Mint?',
    lead: 'CaramOS is based on Linux Mint 22.3. We measured the Cinnamon edition of both on the same virtual machine (4 cores, 6 GB of RAM), RAM 5 minutes after boot.',
    head: ['', 'CaramOS', 'Linux Mint 22.3'],
    rows: [
      ['Installer ISO', '2.9 GB', '3.1 GB'],
      ['RAM when idle', '865 MiB', '941 MiB'],
      ['When RAM runs out', 'No freeze: earlyoom closes the hungriest app', 'Froze for over 30 minutes (slow disk)'],
      ['Security updates', 'Until 2029, on Ubuntu 24.04 LTS', 'Until 2029, on Ubuntu 24.04 LTS'],
    ],
  },
  extrasLead: '',
  faq: {
    title: 'Common questions about CaramOS',
    items: [
      ['What is CaramOS?', 'CaramOS is Linux for Vietnamese users, a free and open-source (GPL-3.0) operating system made by the Vietnam Linux Family community. It is based on Linux Mint 22.3 and Ubuntu 24.04 LTS. Once installed, it has Vietnamese, the Lotus input method, an App Center that installs apps with one click, Driver Check and an Update Center.'],
      ['Does CaramOS cost anything?', 'No. CaramOS is free and open source under the GPL-3.0, at home, at school or at a company. Downloading, installing and updating cost nothing. The source code is public on GitHub.'],
      ['Which edition for a slow or old computer with 2 GB of RAM?', 'The Xfce edition. Right after boot, Task Manager shows about 610 MB of RAM on a 2 GB computer, about 170 MB less than the Cinnamon edition. Computers with 4 GB of RAM or more take Cinnamon. On an old computer, try CaramOS from a USB stick first, so Driver Check can tell you which drivers are missing.'],
      ['What does the computer need?', 'A 64-bit computer that boots with UEFI or BIOS. 2 GB of RAM for the Xfce edition, 4 GB recommended. 20 GB of free disk space, and a USB stick of 4 GB or more to install from.'],
      ['Can Linux show and type Vietnamese?', 'On CaramOS, yes, right after installing. The Cinnamon edition has a Vietnamese interface; on Xfce, choose Vietnamese at install. The Lotus input method is on with Telex. Ctrl+Shift switches between Vietnamese and English, and the tray shows a V for Vietnamese and a boxed A for English. VNI is picked in Cài đặt Lotus ▸ Tổng quan ▸ Kiểu gõ.'],
      ['Can Linux run Zalo?', 'On CaramOS, yes. The App Center installs Zalo for Linux with one click. The first time it opens, you sign in by scanning its QR code with Zalo on your phone. This Zalo is packaged by the community, not released by Zalo, and the App Center says so.'],
      ['Can I bring my files over from Windows?', 'Yes. Open the menu and look for Windows Data Transfer. It copies documents, pictures, the files received in Zalo, browser bookmarks, Outlook mail and fonts from the Windows disk, the old computer’s disk or a shared folder on the network, and changes nothing on the Windows side. For old documents typed in TCVN3 or VNI fonts, right-click the file and choose Convert to Unicode.'],
      ['Can I try it before installing?', 'Yes. Write the ISO to a USB stick and start the computer from it; trying CaramOS does not touch the hard disk. Driver Check tells you whether the computer suits CaramOS. To install, click the Install CaramOS icon on the Desktop.'],
      ['Does CaramOS update itself?', 'Yes, since 1.5.0. The computer checks for a new CaramOS version every day, installs it while you work and tells you when it is done. It waits on a metered connection, on battery under 50% without the charger, when the disk is almost full, or while another program installs software. To update by hand, turn off Automatic updates in the Update Center (needs an administrator password). Ubuntu and Linux Mint fixes still install from the Update Manager as before.'],
      ['How do I upgrade an older CaramOS?', 'Computers on CaramOS 1.0.2 or later have the Update Center. When a new version is out, click Update; nothing is reinstalled and your data stays. From 1.5.0 on, new versions install themselves. Computers still on 1.0.1 run the Update Center installer once; the command is in the Upgrade section of this page.'],
      ['Do Canon printers work?', 'Plug in a Canon CAPT laser printer such as the LBP2900, LBP3300 or LBP6300dn, and Driver Check recognizes it and installs the driver with one click. Canon PIXMA inkjets and other brands use the drivers already in CaramOS, added from Printers.'],
      ['Can CaramOS replace Windows?', 'Yes, for everyday work such as Zalo, the web, documents and spreadsheets, online meetings and films. The taskbar, the Start Menu and shortcuts such as Super+L and PrtSc work as on Windows. Windows-only software, such as Photoshop, AutoCAD or games with anti-cheat, does not run on CaramOS.'],
      ['Windows 10 support has ended. Can I move to CaramOS?', 'Yes. Windows 10 support ended on 14 October 2025, and Extended Security Updates for home computers ended on 13 October 2026. Many older computers cannot move to Windows 11, which needs TPM 2.0 and a recent CPU. CaramOS is free, runs on 2 GB of RAM and gets security updates until 2029.'],
      ['Can Linux open Word and Excel files?', 'Yes. On CaramOS, Word, Excel and PowerPoint files open in ONLYOFFICE, WPS Office or LibreOffice, each installed from the App Center with one click. Opening a Word file before an office suite is installed offers to install one. The Carlito font matches Calibri letter for letter in width, so documents from Windows keep their layout.'],
      ['Does installing Linux erase my data?', 'Trying it from a USB stick does not, because the live session leaves the hard disk alone. When installing, choosing to erase the disk deletes everything on it; the installer also offers other ways to install. Whichever you choose, copy your important files to a USB stick or another disk first.'],
    ],
  },
  communityTitle: 'Built with the community',
  communityLead: 'Ask questions, send feedback and report bugs on the Vietnam Linux Family channels, or click the ? at the right of the taskbar. The source code is public on GitHub, and anyone can contribute.',
  projectTitle: 'Source code',
  contributorsCount: (n) => `${n} commits`,
  starsLabel: 'stars on GitHub',
  forksLabel: 'forks',
  issuesLabel: 'open issues',
  downloadAll: 'All files of this release',
  copyCommand: 'Copy',
  copiedCommand: 'Copied',
  footerNote: 'CaramOS, Linux for Vietnamese users, is a Vietnam Linux Family project, licensed under the GPL-3.0.',
  footerLinks: [['Linux for schools', '/en/education/'], ['Linux for businesses', '/en/business/'], ['GitHub', links.repo], ['Report a bug', links.issues], ['Wallpaper photos', '/wallpapers/'], ['Support us', '/support/']],
  releaseScrollHint: 'Scroll inside the list for earlier releases.',
});

// What 1.5.0 brought, right under the Unikorn band of the home page (#whats-new), and a line about it in the hero.
// The blocks are features, as in `features`; `more` lists the smaller changes ([title, text, optional link]).
// Sources: the release notes of the 1.5.0 migrations (packages/caramos-ota, migrations 2026112*), the App Center
// catalog and the Control Center. The texts say 1.5.0, not VERSION, so that the next version cannot relabel them;
// when it replaces this section, move the blocks that still describe CaramOS into `features`.
Object.assign(copy.vi, {
  heroNew: 'Mới từ bản 1.5: máy tự cập nhật, chuyển dữ liệu từ Windows, âm lịch',
  whatsNew: {
    title: 'Có gì mới từ bản 1.5',
    lead: `Máy tự cài bản mới trong lúc bạn làm việc. Chuyển từ Windows sang, bạn mang theo được dữ liệu và văn bản cũ. Lịch trên đồng hồ có ngày âm. Bản mới nhất là ${VERSION}, phát hành ngày ${releasedVi}; máy đang chạy CaramOS lên bản này không cần cài lại.`,
    blocks: [
      {
        id: 'auto-update',
        title: 'Bản mới tự cài, bạn cứ làm việc',
        lead: 'Từ bản 1.5.0, Trung tâm cập nhật tự cài bản CaramOS mới trong lúc bạn làm việc. Cài xong, máy báo “CaramOS đã cập nhật lên …”. Dữ liệu và ứng dụng của bạn vẫn nguyên, không phải cài lại máy.',
        points: [
          'Máy kiểm tra bản mới lúc nửa đêm và khoảng 15 phút sau mỗi lần mở máy. Có bản mới thì máy tự cài mà không hỏi mật khẩu, và ứng dụng bạn đang mở vẫn để nguyên. Bấm Xem có gì mới để đọc từng thay đổi.',
          'Thay đổi trên thanh tác vụ hay màn hình nền hiện từ lần đăng nhập sau. Bản nào cần khởi động lại thì thông báo ghi “Khởi động lại để hoàn tất”, và máy chờ bạn tự khởi động lại.',
          'Máy hoãn cập nhật khi đang dùng mạng tính dung lượng (phát từ điện thoại), pin dưới 50% mà chưa cắm sạc, ổ đĩa sắp đầy hoặc đang cài phần mềm khác.',
          'Hình nền, màu biểu tượng bạn đã chọn và các applet bạn đã gỡ vẫn giữ nguyên.',
          'Muốn tự bấm cập nhật như trước thì mở Trung tâm cập nhật và tắt Tự động cập nhật (cần mật khẩu quản trị).',
        ],
        media: { type: 'single', main: [`${shots}/update-center-auto-150.webp`, 'Trung tâm cập nhật liệt kê các thay đổi của bản mới; bên dưới là nút gạt Tự động cập nhật đang bật'] },
        link: ['Cách nâng cấp máy đang chạy bản cũ', '#ota'],
      },
      {
        id: 'windows-transfer',
        title: 'Chuyển từ Windows sang, mang theo cả dữ liệu cũ',
        lead: 'Ứng dụng Chuyển dữ liệu từ Windows chép tài liệu, ảnh, dấu trang, thư Outlook và phông chữ từ máy cũ sang máy này. Ứng dụng chỉ chép, không sửa hay xóa gì trên máy Windows.',
        points: [
          'Lấy từ ổ Windows ngay trên máy này, ổ cứng của máy cũ cắm qua USB, hay thư mục chia sẻ của máy cũ trên mạng.',
          'Màn hình nền, Tài liệu, Ảnh, Tải về, Nhạc, Video và tệp nhận qua Zalo vào đúng thư mục. Tệp trùng tên có thêm “(2)” trong tên, nên không tệp nào bị ghi đè.',
          'Dấu trang Chrome, Edge, Cốc Cốc gom vào một tệp để nhập vào Firefox. Thư Outlook (.pst) mở bằng Thunderbird. Phông chữ bạn tự cài trên Windows được cài lại. Bước cuối, bạn chọn kiểu gõ quen dùng: Telex hay VNI.',
          'Phần mềm chỉ có bản Windows, như MISA SME hay HTKK, thì dùng qua Remmina: cài trong App Center ở bước Dùng cho công ty, rồi mở máy Windows Pro hay Windows Server của công ty ngay trên máy CaramOS.',
          'Muốn biết máy văn phòng có chạy được CaramOS không? Chạy thử từ USB rồi bấm Lưu báo cáo trong Kiểm tra driver, kết quả lưu thành một trang web.',
        ],
        media: { type: 'single', main: [`${shots}/windows-transfer-150.webp`, 'Chuyển dữ liệu từ Windows: chọn Màn hình nền, Tài liệu, Ảnh, Tải về, Nhạc, Video, tệp nhận qua Zalo và dấu trang trình duyệt để chép sang'] },
      },
      {
        id: 'windows-documents',
        title: 'Văn bản từ Windows vẫn đúng chữ, đúng trang',
        lead: 'CaramOS cài sẵn phông Carlito thay cho Calibri, lệnh Chuyển mã sang Unicode trong Tệp, và tám mẫu văn bản hành chính theo Nghị định 30.',
        points: [
          'Carlito có cùng độ rộng từng chữ với Calibri, phông mặc định của Word, Excel và PowerPoint, và đủ chữ tiếng Việt: tài liệu không xô dòng, mẫu một trang không tràn sang trang hai.',
          'Văn bản cũ gõ bằng phông .VnTime hay VNI-Times hiện toàn ký tự lạ: bấm chuột phải vào tệp, chọn Chuyển mã sang Unicode. Tệp mới có “(Unicode)” trong tên nằm ngay bên cạnh, dùng phông Times New Roman; tệp cũ giữ nguyên.',
          'Bấm chuột phải vào chỗ trống, chọn Mới ▸ Văn bản hành chính: công văn, quyết định, tờ trình, báo cáo, thông báo, giấy mời, biên bản và biên bản bàn giao tài sản, trình bày sẵn theo Nghị định 30/2020/NĐ-CP.',
          'Mẫu Văn bản Word trong menu Mới dùng Times New Roman cỡ 13. Muốn in đúng Times New Roman, Arial thì cài Microsoft Core Fonts trong App Center.',
        ],
        media: { type: 'stack', overlaySize: 'large', main: [`${shots}/unicode-convert-150.webp`, 'Chuyển mã sang Unicode xong: tệp “Công văn năm 2005 (Unicode).docx” nằm cạnh tệp cũ trong Tệp'], overlay: [`${shots}/nd30-menu-150.webp`, 'Menu chuột phải trong Tệp: Mới ▸ Văn bản hành chính với tám loại văn bản'] },
      },
      {
        id: 'lunar',
        title: 'Xem ngày âm ngay trên đồng hồ',
        lead: 'Bấm vào đồng hồ ở đảo bên phải thanh tác vụ: lịch hiện cả ngày âm, trên cả bản Cinnamon lẫn bản Xfce.',
        points: [
          'Dưới mỗi ngày có ngày âm, chữ nhỏ và nhạt hơn. Ngày mùng 1 ghi cả tháng, ví dụ 1/10; mùng 1 và rằm tô đỏ.',
          'Đầu lịch ghi ngày âm hôm nay, ví dụ “Âm lịch: 12 tháng 10 năm Bính Ngọ”; rê chuột lên đồng hồ cũng thấy.',
          'Tính theo giờ Việt Nam, không cần mạng, đúng cả tháng nhuận.',
        ],
        media: {
          type: 'duo',
          items: [
            [`${shots}/lunar-cinnamon-150.webp`, 'Lịch của bản Cinnamon ngày 20 tháng 11 năm 2026, âm lịch 12 tháng 10 năm Bính Ngọ, dưới mỗi ngày có ngày âm', 'Bản Cinnamon'],
            [`${shots}/lunar-xfce-150.webp`, 'Lịch của bản Xfce với ngày âm dưới mỗi ngày, hôm nay tô màu cam', 'Bản Xfce'],
          ],
        },
      },
    ],
    moreTitle: 'Cũng mới từ bản 1.5',
    more: [
      ['Super+V mở lại những gì đã sao chép', 'Như Win+V trên Windows: bấm Super+V, gõ chữ để tìm, bấm Enter để dán. Lịch sử bắt đầu ghi từ lần bấm đầu tiên.'],
      ['Thanh tác vụ ở giữa hoặc bên trái', 'Ô Thanh tác vụ trong Control Center đặt ứng dụng ở giữa màn hình như Windows 11, hay sát nút menu như Windows 10.'],
      ['Phím tắt như trên Windows', 'Super+L khóa máy, Ctrl+Alt+Delete mở hộp đăng xuất, bấm Super rồi gõ ngay là tìm được ứng dụng, tệp hay cài đặt.'],
      ['Độ sáng màn hình rời', 'Control Center có thanh độ sáng cho mỗi màn hình rời hỗ trợ DDC/CI, khỏi phải bấm nút trên màn hình.'],
      ['Không làm phiền, chỉnh âm lượng bằng con lăn', 'Ô Không làm phiền ẩn thông báo. Lăn chuột trên biểu tượng Control Center để chỉnh âm lượng, mỗi nấc 2, 5 hay 10% tùy bạn chọn.'],
      ['Menu bo tròn góc', 'Menu Start và menu chuột phải bo tròn góc, theo góp ý của các bạn trong nhóm Việt Nam Linux Family.'],
      ['Trung tâm cập nhật và App Center có giao diện mới', 'Hai ứng dụng này giờ cùng kiểu với các ứng dụng khác trong máy. App Center tìm ra ứng dụng cả khi gõ không dấu.'],
      ['Ứng dụng nhẹ hơn trên máy yếu', 'Máy từ 4 GB RAM trở xuống hoặc chưa có driver card đồ họa: App Center, Kiểm tra driver, Góp ý & hỗ trợ và Phòng máy mỗi cái dùng ít hơn 52–79 MB RAM.'],
      ['App Center có bước Dùng cho công ty', 'Bước này có CaramOS Doanh nghiệp, miễn phí, để quản lý máy nhân viên trong mạng công ty, và Remmina để dùng máy Windows từ xa.', '/doanh-nghiep/'],
      ['Hiện màn hình nền, PrtSc và Thùng rác như Windows', 'Bấm mép phải thanh tác vụ để hiện màn hình nền. PrtSc chụp cả màn hình vào bộ nhớ tạm để dán vào Zalo hay Word. Thùng rác nằm sẵn trên màn hình nền. Có từ bản 1.5.1.'],
      ['Cài ứng dụng từ trang web bằng một nút', 'Trên apps.vietnamlinuxfamily.net, bấm Cài trên CaramOS là App Center mở đúng ứng dụng đó để cài. Có từ bản 1.5.2.'],
    ],
    moreLink: 'Xem trang Linux cho doanh nghiệp',
    allNotes: 'Xem thay đổi của từng bản',
  },
});

Object.assign(copy.en, {
  heroNew: 'New since 1.5: automatic updates, moving from Windows, lunar dates',
  whatsNew: {
    title: 'What’s new since 1.5',
    lead: `New versions install themselves while you work. Moving from Windows brings your files and paperwork along. The clock’s calendar shows lunar dates. The latest version is ${VERSION}, released on ${releasedEn}; computers on CaramOS get it without reinstalling.`,
    blocks: [
      {
        id: 'auto-update',
        title: 'New versions install themselves while you work',
        lead: 'Since 1.5.0, the Update Center installs new CaramOS versions while you work, then tells you “CaramOS updated to …”. Your files and apps stay, with nothing to reinstall.',
        points: [
          'The computer checks for a new version at midnight and about 15 minutes after each start. When there is one, it installs it with no password to type, and the apps you have open stay open. Click See what’s new to read every change.',
          'Changes to the taskbar or the desktop show from the next login. When a restart is needed, the notification says “Restart to finish”, and the computer waits for you to restart it.',
          'It waits while you are on a metered connection (a phone’s hotspot), on battery under 50% without the charger, when the disk is almost full, or while another program installs software.',
          'Your wallpaper, your icon colour and the applets you removed stay as you set them.',
          'To update by hand as before, open the Update Center and turn off Automatic updates (needs an administrator password).',
        ],
        media: { type: 'single', main: [`${shots}/update-center-auto-150.webp`, 'The Update Center listing the changes of a new version, with the Automatic updates switch turned on below'] },
        link: ['How to upgrade an older CaramOS', '#ota'],
      },
      {
        id: 'windows-transfer',
        title: 'Coming from Windows? Bring your files along',
        lead: 'The Windows Data Transfer app copies documents, pictures, bookmarks, Outlook mail and fonts from the old computer to this one. It only copies, and changes nothing on the Windows side.',
        points: [
          'From the Windows disk of this computer, the old computer’s disk on a USB adapter, or a shared folder of the old computer on the network.',
          'Desktop, Documents, Pictures, Downloads, Music, Videos and the files received in Zalo go into the matching folders. A file whose name is taken gets “(2)” in its name, so nothing is overwritten.',
          'Chrome, Edge and Cốc Cốc bookmarks come together in one file to import into Firefox. Outlook mail (.pst) opens in Thunderbird. Fonts you installed on Windows are installed again. Last, you pick the typing method you know: Telex or VNI.',
          'Windows-only software, such as MISA SME or HTKK, works through Remmina: install it from the App Center’s “For your company” step, then open the company’s Windows Pro or Windows Server computer right on CaramOS.',
          'Not sure an office computer runs CaramOS? Try it from the USB stick and click Save report in Driver Check to keep the results as a web page.',
        ],
        media: { type: 'single', main: [`${shots}/windows-transfer-150.webp`, 'Windows Data Transfer: picking Desktop, Documents, Pictures, Downloads, Music, Videos, the Zalo files and the browser bookmarks to copy'] },
      },
      {
        id: 'windows-documents',
        title: 'Documents from Windows keep their letters and pages',
        lead: 'CaramOS comes with the Carlito font in place of Calibri, Convert to Unicode in Files, and eight official document templates laid out as Decree 30 sets out.',
        points: [
          'Carlito has the same width for every letter as Calibri, the default font of Word, Excel and PowerPoint, and every Vietnamese letter: lines do not reflow, and a one-page form stays on one page.',
          'Old documents typed in .VnTime or VNI-Times show strange characters: right-click the file and choose Convert to Unicode. A new file with “(Unicode)” in its name appears next to it, in Times New Roman; the old file stays as it was.',
          'Right-click an empty area and choose New ▸ Vietnamese Official Documents: an official letter, a decision, a submission, a report, a notice, an invitation, minutes and an asset handover record, laid out as Decree 30/2020/ND-CP sets out.',
          'In Vietnamese, the Word document in the New menu uses Times New Roman 13 pt. To print in Times New Roman or Arial, install Microsoft Core Fonts from the App Center.',
        ],
        media: { type: 'stack', overlaySize: 'large', main: [`${shots}/unicode-convert-150.webp`, 'Convert to Unicode done: “Công văn năm 2005 (Unicode).docx” sits next to the old file in Files'], overlay: [`${shots}/nd30-menu-150.webp`, 'The right-click menu in Files, in Vietnamese: Mới ▸ Văn bản hành chính, with the eight kinds of documents'] },
      },
      {
        id: 'lunar',
        title: 'Lunar dates right on the clock',
        lead: 'Click the clock in the right island of the taskbar: the calendar shows lunar dates too, on both the Cinnamon and the Xfce edition.',
        points: [
          'Under every day is its lunar day, smaller and lighter. The 1st of a lunar month shows its month, such as 1/10; the 1st and the 15th are in red.',
          'Today’s full lunar date is at the top, such as “Lunar calendar: day 12 of month 10, Bính Ngọ year”; the clock’s tooltip shows it too.',
          'Computed for Vietnam’s time zone, offline, leap months included.',
        ],
        media: {
          type: 'duo',
          items: [
            [`${shots}/lunar-cinnamon-150.webp`, 'The Cinnamon edition’s calendar on 20 November 2026, day 12 of lunar month 10, with the lunar day under every day', 'Cinnamon edition'],
            [`${shots}/lunar-xfce-150.webp`, 'The Xfce edition’s calendar with the lunar day under every day, today in orange', 'Xfce edition'],
          ],
        },
      },
    ],
    moreTitle: 'Also new since 1.5',
    more: [
      ['Super+V brings back what you copied', 'As Win+V on Windows: press Super+V, type to search, press Enter to paste. The history starts with your first press.'],
      ['Taskbar apps in the middle or on the left', 'The Taskbar tile in the Control Center puts your apps in the middle, as on Windows 11, or next to the menu button, as on Windows 10.'],
      ['Shortcuts as on Windows', 'Super+L locks the screen, Ctrl+Alt+Delete opens the log out dialog, and pressing Super then typing finds apps, files or settings.'],
      ['Brightness for external monitors', 'The Control Center has a brightness slider for each external monitor with DDC/CI, so you can skip the monitor’s buttons.'],
      ['Do not disturb, volume on the mouse wheel', 'The Do not disturb tile hides notifications. Scroll over the Control Center icon to change the volume, by 2, 5 or 10% a step, as you choose.'],
      ['Round menus', 'The Start menu and right-click menus have round corners, as members of the Việt Nam Linux Family group suggested.'],
      ['A new look for the Update Center and the App Center', 'Both apps now match the look of the rest of the system. The App Center finds apps even when you type without accents.'],
      ['Lighter apps on modest computers', 'With 4 GB of RAM or less, or without a graphics driver, the App Center, Driver Check, Feedback & Help and Computer Lab each use 52–79 MB less RAM.'],
      ['A “For your company” step in the App Center', 'It has CaramOS Business, free, to manage staff computers on the office network, and Remmina to use a Windows computer remotely.', '/en/business/'],
      ['Show desktop, PrtSc and the Trash as on Windows', 'Click the right edge of the taskbar to show the desktop. PrtSc copies the whole screen to the clipboard, ready to paste into Zalo or Word. The Trash sits on the desktop. Since 1.5.1.'],
      ['One-click installs from the apps website', 'On apps.vietnamlinuxfamily.net, Install on CaramOS opens the App Center on that app, ready to install. Since 1.5.2.'],
    ],
    moreLink: 'See Linux for businesses',
    allNotes: 'Changes in every release',
  },
});

// The Education and Business pages (/giao-duc/, /doanh-nghiep/, /en/education/, /en/business/). Their diagrams are
// in diagrams.js. Education states only what CaramOS has shipped (1.4.0, and automatic updates since 1.5.0); Business
// installs from the App Center; its contact form takes feedback and feature requests (owner, 2026-11-23).
Object.assign(copy.vi, {
  anchors: { map: 'so-do', start: 'bat-dau', faq: 'hoi-dap', contact: 'lien-he' },
  // Read before each arrow in the diagrams' outline (phones, screen readers): "→ Máy học sinh" is "tới Máy học sinh".
  diagramWords: { to: 'tới', both: 'hai chiều với' },
  education: {
    seo: {
      title: 'Linux cho trường học: phòng máy Tin học miễn phí | CaramOS',
      description: 'CaramOS là Linux cho giáo dục, miễn phí cho mọi máy, kể cả phần mềm quản lý phòng máy Veyon. Bản Xfce chạy trên máy 2 GB RAM, phần mềm học tập cài một nút.',
      ogAlt: 'Phòng máy CaramOS: máy giáo viên thấy màn hình học sinh và mã ghép nối 6 số',
    },
    hero: {
      title: 'Linux cho trường học, chạy tốt cả trên máy 2 GB',
      lead: 'CaramOS miễn phí cho mọi máy trong phòng máy Tin học, kể cả phần mềm quản lý phòng máy. Giáo viên xem và điều khiển máy học sinh ngay trên máy của mình, qua mạng LAN của trường. Phần mềm học tập cài bằng một nút, và giao diện dùng đúng chữ trong sách Tin học.',
      download: 'Tải bản Xfce cho phòng máy',
      downloadNote: '2,7 GB, chạy trên máy 2 GB RAM',
      contact: 'Góp ý hoặc liên hệ',
      image: [`${shots}/lab-veyon-140.webp`, 'Veyon Master trên máy giáo viên thấy màn hình của một máy học sinh', 1072, 670],
      overlay: [`${shots}/lab-code-140.webp`, 'Công cụ Phòng máy hiện mã ghép nối 6 số trên máy giáo viên', 620, 433],
      facts: [
        ['Miễn phí cho mọi máy', 'mã nguồn mở, giấy phép GPL-3.0'],
        ['Chạy trên máy 2 GB RAM', 'bản Xfce dùng khoảng 610 MB khi vừa bật'],
        ['Cập nhật bảo mật đến 2029', `CaramOS ${VERSION}, nền Ubuntu 24.04 LTS`],
      ],
    },
    map: {
      title: 'Phòng máy Tin học chạy Linux gồm những gì',
      lead: 'Máy giáo viên và máy học sinh nối với nhau qua mạng LAN của trường. Phần mềm và bản cập nhật tải từ Internet, còn câu hỏi gửi tới cộng đồng.',
    },
    lab: {
      title: 'Quản lý phòng máy miễn phí, ngay trên máy giáo viên',
      lead: 'Công cụ Phòng máy tự cài và thiết lập Veyon hoặc Epoptes, hai phần mềm quản lý phòng máy miễn phí, mã nguồn mở. Bạn không phải gõ lệnh nào. Máy giáo viên hiện một mã 6 số; máy học sinh tự tìm máy giáo viên trong mạng LAN của trường, nhập mã là vào lớp.',
      pointsTitle: 'Từ máy giáo viên, với Veyon',
      points: [
        'Xem màn hình của mọi học sinh cùng lúc.',
        'Chiếu màn hình của mình cho cả lớp.',
        'Khóa màn hình học sinh khi cần cả lớp chú ý.',
        'Gửi tin nhắn, gửi tệp bài tập.',
        'Điều khiển một máy để chỉ cho học sinh.',
        'Tắt máy cả phòng khi hết giờ.',
      ],
      choiceTitle: 'Chọn phần mềm khi thiết lập máy giáo viên',
      choices: [
        ['Veyon', 'khuyên dùng', 'Làm được mọi việc trong danh sách trên. Dùng chung được với Veyon trên máy Windows.'],
        ['Epoptes', 'nhẹ hơn', 'Cho phòng máy 2 GB RAM. Máy học sinh tự kết nối về máy giáo viên.'],
      ],
      note: 'Các máy chỉ cần cùng mạng LAN của trường, mạng dây hay Wi-Fi đều được; trong giờ học không cần Internet. Phòng máy có trên cả bản Cinnamon và bản Xfce.',
    },
    oldPcs: {
      title: 'Máy tính cũ 2 GB RAM vẫn dạy được',
      lead: 'Vừa bật máy, bản Xfce dùng khoảng 610 MB RAM trên máy 2 GB, ít hơn bản Cinnamon khoảng 170 MB. Bản này vẫn có App Center, Kiểm tra driver, bộ gõ tiếng Việt và Trung tâm cập nhật như bản Cinnamon.',
      points: [
        'Chạy thử từ USB trước khi cài. Kiểm tra driver báo máy còn thiếu gì (Wi-Fi, âm thanh, đồ họa), để bạn biết máy nào trong phòng chạy được.',
        'Thanh tác vụ ba đảo, Control Center và nút Góp ý & hỗ trợ dùng như trên bản Cinnamon.',
        'Phòng toàn máy 2 GB thì chọn Epoptes khi thiết lập máy giáo viên, vì Epoptes nhẹ hơn Veyon.',
        'Cần máy 64-bit, khởi động bằng UEFI hoặc BIOS, ổ đĩa trống từ 20 GB. Máy từ 4 GB RAM dùng bản Cinnamon.',
      ],
      image: [`${shots}/xfce-desktop-150.webp`, 'CaramOS Xfce với Control Center mở ở góc phải thanh tác vụ'],
    },
    textbook: {
      title: 'Học sinh nhìn sách là làm theo được',
      lead: 'Bản Xfce mặc định dùng giao diện tiếng Anh, đúng những chữ trong sách Tin học: New, Folder, Copy, Paste. Chọn tiếng Việt lúc cài thì có giao diện tiếng Việt. Bộ gõ tiếng Việt chạy như nhau ở cả hai.',
      points: [
        'Chuột phải chọn New ▸ Folder (bản Cinnamon: Mới ▸ Thư mục), có sẵn mẫu Word, Excel, PowerPoint.',
        'Khung bên trái là cây thư mục mở từng tầng như Windows Explorer, đúng cho bài học về cây thư mục.',
        'Bộ gõ Lotus bật sẵn kiểu Telex, Ctrl+Shift chuyển giữa tiếng Việt và tiếng Anh. Kiểu VNI chọn trong Cài đặt Lotus ▸ Tổng quan ▸ Kiểu gõ.',
        'Mở tệp Word, Excel khi máy chưa có bộ văn phòng thì CaramOS gợi ý cài ONLYOFFICE, WPS Office hoặc LibreOffice.',
      ],
      image: [`${shots}/xfce-files-150.webp`, 'Tệp trên bản Xfce: chuột phải chọn New ▸ Folder, khung trái là cây thư mục'],
    },
    apps: {
      title: 'Phần mềm học tập miễn phí cho từng\u00a0môn',
      lead: 'Mở App Center, đánh dấu phần mềm cần dùng rồi bấm Cài. Không có gì chọn sẵn, nên máy nào cần gì thì cài nấy. Bước Tin học cho các em có 10 phần mềm tập dùng chuột, gõ phím 10 ngón, vẽ và xếp hình, như GCompris, Tux Typing, KTouch, KolourPaint và Polypad. Bước Lập trình, Toán, Khoa học và soạn bài giảng có Scratch 3, Thonny, GeoGebra, Stellarium, LeoCAD và eXeLearning để thầy cô soạn bài.',
      groups: [
        ['Làm quen với máy tính', [
          ['GCompris', 'Hơn 180 trò chơi học tập cho bé từ 2 đến 10 tuổi: tập dùng chuột, bàn phím, toán, đọc'],
          ['Tux Paint', 'Vẽ tranh cho trẻ em, dễ hơn Paint, giao diện tiếng Việt'],
          ['Klavaro', 'Luyện gõ bàn phím 10 ngón, có bài luyện bằng chữ tiếng Việt'],
        ]],
        ['Lập trình', [
          ['KTurtle', 'Lập trình đầu tiên: ra lệnh cho chú rùa vẽ hình'],
          ['Scratch 3 (TurboWarp)', 'Lập trình kéo thả, chạy không cần mạng, mở được tệp .sb3'],
          ['Thonny', 'Viết Python cho người mới học, hợp Tin học THCS, THPT'],
        ]],
        ['Toán và khoa học', [
          ['GeoGebra', 'Hình học, đồ thị hàm số; miễn phí cho học tập nhưng không phải mã nguồn mở'],
          ['Stellarium', 'Bầu trời sao 3D cho Khoa học tự nhiên, Địa lý; cần card đồ họa khá'],
        ]],
      ],
      image: [`${shots}/app-center-edu-150.webp`, 'App Center ở bản 1.5.0: đã chọn GCompris, Tux Paint và Klavaro, khoảng 378 MB, nút Cài 3 ứng dụng; bên dưới là Scratch 3 và KTurtle'],
    },
    care: {
      title: 'Cả phòng máy tự cập nhật, có người giúp khi cần',
      items: [
        ['Tự cập nhật qua mạng', 'Mỗi máy kiểm tra bản mới lúc nửa đêm và khoảng 15 phút sau mỗi lần mở máy, rồi tự cài trong lúc vẫn dùng bình thường. Máy tắt trước nửa đêm vẫn nhận bản sửa ngay trong ngày học. Muốn tự bấm cập nhật thì tắt Tự động cập nhật trong Trung tâm cập nhật (cần mật khẩu quản trị).'],
        ['Góp ý & hỗ trợ', 'Bấm dấu hỏi ở góc phải thanh tác vụ để hỏi hay báo lỗi, kèm ảnh chụp màn hình hoặc video ngắn. Cộng đồng Vietnam Linux Family trả lời bằng tiếng Việt.'],
        ['Cập nhật bảo mật đến 2029', 'CaramOS dựa trên Linux Mint 22.3 và Ubuntu 24.04 LTS. Ubuntu 24.04 LTS có bản vá bảo mật tới năm 2029.'],
      ],
    },
    steps: {
      title: 'Cài cho cả phòng máy trong sáu bước',
      lead: 'Làm trên một máy trước, rồi cài các máy còn lại.',
      items: [
        ['Tải ISO và ghi ra USB', 'Bản Xfce cho máy 2 GB, bản Cinnamon cho máy từ 4 GB RAM. Ghi ISO ra một USB từ 4 GB.'],
        ['Chạy thử trên một máy của phòng', 'Khởi động máy từ USB. Kiểm tra driver báo máy chạy được không và còn thiếu driver gì.'],
        ['Cài lên máy giáo viên và từng máy học sinh', 'Bấm biểu tượng Cài đặt CaramOS trên Desktop rồi làm theo các bước.'],
        ['Thiết lập máy giáo viên', 'Mở Phòng máy, chọn Máy giáo viên, đặt tên phòng, chọn Veyon hoặc Epoptes. Màn hình hiện mã 6 số; để trang đó mở trong lúc ghép.'],
        ['Cho từng máy học sinh vào lớp', 'Trên mỗi máy học sinh mở Phòng máy, chọn Máy học sinh, chọn phòng và nhập mã 6 số.'],
        ['Cài phần mềm học tập', 'Mở App Center, ở bước Tin học cho các em và bước Lập trình, Toán, Khoa học và soạn bài giảng, chọn phần mềm cho môn học rồi bấm Cài, trên những máy cần.'],
      ],
      downloads: ['Tải bản Xfce (2,7 GB)', 'Tải bản Cinnamon (2,9 GB)'],
    },
    faq: {
      title: 'Hỏi đáp về Linux cho trường học',
      items: [
        ['Trường dùng CaramOS có mất phí không?', 'Không, dù trường có bao nhiêu máy. CaramOS miễn phí và mã nguồn mở theo giấy phép GPL-3.0. Veyon, Epoptes và phần mềm học tập trong App Center cũng miễn phí; riêng GeoGebra miễn phí cho học tập nhưng không phải mã nguồn mở.'],
        ['Phòng máy toàn máy yếu, RAM 2 GB thì dùng bản nào?', 'Bản Xfce. Vừa bật máy, Task Manager báo khoảng 610 MB RAM trên máy 2 GB. Khi thiết lập máy giáo viên, chọn Epoptes cho nhẹ.'],
        ['Giao diện tiếng Anh thì học sinh có gõ tiếng Việt được không?', 'Được. Bộ gõ Lotus bật sẵn trên cả hai bản, mặc định kiểu Telex; Ctrl+Shift chuyển giữa tiếng Việt và tiếng Anh. Kiểu VNI chọn trong Cài đặt Lotus ▸ Tổng quan ▸ Kiểu gõ. Muốn giao diện tiếng Việt thì chọn tiếng Việt lúc cài.'],
        ['Phòng máy còn vài máy Windows thì sao?', 'Veyon trên CaramOS dùng chung được với Veyon trên Windows. Bạn tự cài Veyon trên máy Windows, vì công cụ Phòng máy chỉ thiết lập máy CaramOS.'],
        ['Có cần Internet không?', 'Cần lúc cài Veyon hoặc Epoptes, phần mềm học tập và bản cập nhật. Trong giờ học, máy giáo viên và máy học sinh chỉ cần cùng mạng dây hoặc Wi-Fi của trường.'],
        ['Cập nhật cả phòng thế nào?', 'Từ bản 1.5.0, mỗi máy tự cài bản mới, không cần ai bấm. Máy kiểm tra lúc nửa đêm và khoảng 15 phút sau mỗi lần mở máy, nên máy tắt trước nửa đêm vẫn nhận bản sửa trong ngày. Máy còn ở bản cũ hơn 1.5.0 thì bấm Cập nhật ngay một lần. Muốn cập nhật ngay thì chạy sudo caramos-ota --upgrade --yes trong Terminal.'],
        ['Máy đang chạy bản Cinnamon có chuyển sang Xfce được không?', 'Máy không tự chuyển. Muốn dùng bản Xfce thì cài mới từ ISO Xfce. Phòng máy, phần mềm học tập và New ▸ Folder có trên cả hai bản.'],
        ['Trường học có nên dùng Linux cho phòng máy Tin học không?', 'Nên, nếu phòng máy dạy theo sách Tin học, soạn văn bản, lập trình Scratch, Python và dùng web. Bản Xfce của CaramOS chạy trên máy 2 GB RAM, giao diện dùng đúng chữ trong sách. CaramOS, Veyon, Epoptes và phần mềm học tập trong App Center đều miễn phí. Bài nào cần phần mềm chỉ có bản Windows thì giữ vài máy Windows có bản quyền.'],
        ['Có phần mềm quản lý phòng máy miễn phí trên Linux không?', 'Có. Veyon và Epoptes miễn phí, mã nguồn mở, chạy qua mạng LAN của trường. Trên CaramOS, công cụ Phòng máy tự cài và thiết lập một trong hai: máy giáo viên hiện mã 6 số, máy học sinh nhập mã là vào lớp. Với Veyon, giáo viên xem màn hình cả lớp, chiếu màn hình của mình, khóa màn hình học sinh và điều khiển từng máy.'],
        ['Dùng CaramOS, trường có phải mua bản quyền phần mềm không?', 'Không. CaramOS, ONLYOFFICE, LibreOffice và phần mềm học tập trong App Center đều miễn phí cho trường. Phần mềm trả phí thì vẫn cần giấy phép, kể cả khi chạy trên Linux. Năm 2026, trong vụ án hình sự đầu tiên về Windows và Office lậu, công an kiểm tra thêm một cơ sở giáo dục và thấy 350 máy có dấu hiệu dùng Windows, Office kích hoạt trái phép (Tuổi Trẻ, 11/6/2026).'],
      ],
    },
    contact: {
      title: 'Góp ý và đề xuất tính năng',
      lead: 'Phòng máy của trường cần CaramOS làm thêm gì, hay chỗ nào chưa ổn? Viết cho bọn mình, bọn mình đọc mọi thư.',
      subject: 'CaramOS Giáo dục',
      orgLabel: 'Trường',
      messagePlaceholder: 'Ví dụ: muốn thu bài của cả lớp về máy giáo viên sau giờ thực hành.',
    },
  },
  business: {
    seo: {
      title: 'Linux cho doanh nghiệp: CaramOS miễn phí, quản lý từ một máy',
      description: 'Linux cho doanh nghiệp, miễn phí và hợp pháp. CaramOS Doanh nghiệp quản lý máy văn phòng từ một máy: thiết lập theo phòng ban, kiểm kê ra Excel, hỗ trợ từ xa.',
      ogAlt: 'CaramOS Doanh nghiệp: một máy quản lý cho cả văn phòng',
    },
    cta: 'Góp ý',
    hero: {
      title: 'Linux cho doanh nghiệp, quản lý từ một\u00a0máy',
      lead: 'CaramOS và CaramOS Doanh nghiệp miễn phí cho mọi máy trong công ty. Từ một máy quản lý, bạn đặt hình nền, trình duyệt, máy in, Wi-Fi và USB cho từng phòng ban, kiểm kê tài sản và giúp nhân viên từ xa khi họ đồng ý. Mọi thứ chạy trong mạng LAN của công ty, không qua đám mây.',
      status: ['Miễn phí.', 'Cài từ App Center, bước Dùng cho công ty, trên máy quản lý và từng máy nhân viên.'],
      cta: 'Xem cách bắt đầu',
      mapLink: 'Xem sơ đồ',
      facts: [
        ['Tắt cho đến khi bạn bật', 'người quản trị bật từng tính năng, cho cả công ty hoặc một phòng ban'],
        ['Trong mạng của công ty', 'máy quản lý là một máy CaramOS ở văn phòng, không qua đám mây'],
        ['Miễn phí', 'cho máy chạy CaramOS, bản Cinnamon hoặc Xfce'],
      ],
      // Screenshots of CaramOS Doanh nghiệp 0.3.0 on CaramOS 1.5.0 VMs with a demo company: machine names, logins and
      // people are made up; the IPs are the test network's.
      image: [`${shots}/business-overview-030.webp`, 'Trang Tổng quan của CaramOS Doanh nghiệp trên máy quản lý: 2 máy nhân viên đang bật, 1 máy xin vào công ty chờ duyệt, và một nhân viên nhờ hỗ trợ vì máy chạy chậm'],
      caption: 'Trang Tổng quan trên máy quản lý: máy nào đang bật, máy nào chờ duyệt, nhân viên nào đang nhờ hỗ trợ, máy nào cần xem.',
    },
    map: {
      title: 'Các máy trong văn phòng nối với nhau thế nào',
      lead: 'Người quản trị bật thiết lập trên máy quản lý. Máy nhân viên chỉ làm theo thiết lập có chữ ký của máy đó, báo lại tình trạng và lưu tệp lên máy chủ của công ty.',
    },
    settings: {
      title: 'Thiết lập cho cả công ty, hoặc riêng từng phòng',
      lead: 'Mỗi nhóm thiết lập bật riêng, và nhóm nào cũng tắt cho tới khi bạn bật. Ví dụ phòng Kế toán chặn USB, còn phòng Kinh doanh vẫn vào được Facebook. Một máy cũng có thiết lập riêng được, và thiết lập riêng đó được ưu tiên hơn thiết lập của phòng ban.',
      head: ['Nhóm thiết lập', 'Người quản trị đặt được'],
      rows: [
        ['Hình nền', 'Một ảnh cho ngày thường, ảnh riêng cho từng dịp như Tết, 30/4, ngày thành lập công ty. Khóa được để nhân viên không tự đổi.'],
        ['Trình duyệt', 'Trang chủ, dấu trang của công ty, tìm kiếm an toàn, chặn trang web luôn luôn hoặc chỉ trong giờ làm (sẵn khung 8:00–12:00 và 13:30–17:30). Có sẵn danh sách mạng xã hội, video, trò chơi, mua sắm; Zalo không bao giờ nằm trong đó. Áp cho Firefox, Chrome, Cốc Cốc, Edge và Brave.'],
        ['Máy in', 'Cài máy in mạng cho mọi máy, chọn máy in mặc định.'],
        ['Wi-Fi', 'Mạng Wi-Fi của công ty cho laptop; mật khẩu được mã hóa riêng cho từng máy.'],
        ['USB lưu trữ', 'Cho dùng, chỉ đọc, hoặc chặn; mở tạm thời cho một máy khi cần. Bàn phím, chuột, máy in và token ký số vẫn dùng được.'],
        ['Lịch bật/tắt máy', 'Tắt máy cuối ngày, báo trước và cho hoãn vài lần; bật lại buổi sáng bằng hẹn giờ trong máy và Wake-on-LAN.'],
        ['Ứng dụng', 'Ứng dụng bắt buộc cài và ứng dụng không được cài, chọn trong danh mục của App Center.'],
        ['Khóa màn hình', 'Tự khóa sau một số phút không dùng, và khi máy ngủ.'],
        ['Tường lửa', 'Bật tường lửa: máy khác trong mạng không kết nối vào máy nhân viên được.'],
        ['Ổ dùng chung', 'Thư mục chung của công ty, của từng phòng, có sẵn trong trình quản lý tệp của nhân viên.'],
        ['Thư mục trên máy chủ', 'Desktop và Tài liệu của mỗi nhân viên nằm trên máy chủ hoặc NAS của công ty.'],
      ],
    },
    inventory: {
      title: 'Biết công ty có\u00a0máy\u00a0gì, máy nào sắp hỏng',
      lead: 'Bật kiểm kê tự động là mỗi máy tự gửi cấu hình về máy quản lý. Bạn ghi thêm mã tài sản, ngày mua, hạn bảo hành, rồi xuất danh sách ra Excel theo kiểu biên bản kiểm kê.',
      figures: [
        [`${shots}/business-machines-030.webp`, 'Trang Máy nhân viên: máy le-tan-01 xin vào công ty chờ duyệt, Kiểm kê tự động đang bật, danh sách 2 máy ke-toan-01 (phòng Kế toán) và kinh-doanh-01 (phòng Kinh doanh) đang bật, nút Xuất danh sách tài sản', 'Máy nhân viên: tình trạng từng máy, máy mới chờ duyệt, và nút xuất danh sách tài sản.'],
        [`${shots}/business-licences-030.webp`, 'Trang Bản quyền phần mềm: phần mềm tự do trên từng máy, kèm giấy phép GPL; WPS Office Business mua cho 1 máy nhưng đang có trên 2 máy, thiếu 1 bản quyền; nút Xuất Excel, Xuất PDF', 'Bản quyền phần mềm: ứng dụng nào nằm trên máy nào, theo loại giấy phép, so với số bản quyền công ty đã mua; xuất được ra Excel, PDF.'],
      ],
      columns: [
        ['Máy tự gửi', ['Hãng, mẫu máy, số serial', 'CPU, RAM, ổ đĩa và sức khỏe ổ đĩa', 'Pin, màn hình, card mạng', 'Phiên bản CaramOS, ứng dụng đã cài']],
        ['Người quản trị ghi', ['Mã tài sản, ngày mua, giá', 'Hạn bảo hành', 'Người dùng, vị trí đặt máy']],
        ['Máy quản lý báo khi', ['Ổ đĩa còn dưới 10% hoặc sắp hỏng', 'Pin chai dưới 60%', 'Bản vá bảo mật chờ quá 7 ngày', 'Đồng hồ máy lệch hơn 2 phút', 'Máy 3 ngày không thấy bật']],
      ],
    },
    actions: {
      title: 'Việc gấp tới máy trong vài giây',
      lead: 'Gửi cho một máy, một phòng ban hoặc cả công ty. Máy luôn báo trước cho người đang dùng.',
      items: [
        'Khóa máy.',
        'Gửi tin nhắn, có nút Đã đọc để biết ai đã xem.',
        'Đăng xuất, khởi động lại, tắt máy, có đồng hồ đếm ngược.',
        'Cập nhật CaramOS và bản vá bảo mật ngay.',
        'Kiểm kê lại.',
        'Mở USB tạm thời cho một máy.',
      ],
      image: [`${shots}/business-actions-030.webp`, 'Trang của máy ke-toan-01 trên máy quản lý: CaramOS 1.5.0 Cinnamon, phòng Kế toán, lan đang dùng; mục Thao tác: Khóa máy, Gửi tin nhắn, Hỗ trợ từ xa, Khởi động lại, Tắt máy, Cập nhật, Mở USB tạm thời, Kiểm kê lại', 'Trang của một máy trên máy quản lý: mỗi nút là một việc gửi tới máy đó.'],
      helpImage: [`${shots}/business-consent-030.webp`, 'Cửa sổ trên máy nhân viên: Quang (bộ phận IT) muốn hỗ trợ bạn trên máy này, với ba nút Từ chối, Chỉ cho xem và Cho phép; không ai bấm thì tự từ chối sau một phút', 'Máy nhân viên hỏi trước khi IT hỗ trợ từ xa. Không ai bấm thì sau một phút máy tự từ chối.'],
      helpTitle: 'Hỗ trợ từ xa khi nhân viên cần IT',
      help: [
        ['Nhân viên bấm Nhờ IT hỗ trợ', 'Ghi vài chữ về việc đang gặp.'],
        ['Máy quản lý hiện lời nhắn', 'Kèm tên máy và tên đăng nhập của nhân viên.'],
        ['IT bấm Hỗ trợ từ xa', 'Nhân viên chọn cho xem hay cho điều khiển màn hình, hoặc từ chối.'],
        ['Trong lúc hỗ trợ', 'Máy nhân viên luôn hiện một cửa sổ nhỏ có nút Dừng. Đường truyền được mã hóa.'],
      ],
    },
    files: {
      title: 'Tệp của nhân viên nằm trên máy chủ công ty',
      lead: 'Desktop và Tài liệu của mỗi nhân viên trỏ vào thư mục riêng của họ trên máy chủ hoặc NAS: Windows Server, Synology, TrueNAS hay Samba. Lưu ra Desktop là đã lên máy chủ.',
      points: [
        'Mất mạng hay NAS tắt thì tệp tạm lưu trên máy và nhân viên được báo. Có mạng lại, tệp tự chuyển lên.',
        'Dọn máy: tệp còn nằm trên máy được chuyển vào thư mục Chưa sắp xếp trên máy chủ, theo ngày. Không tệp nào bị xóa.',
        'Ổ dùng chung của công ty, của từng phòng hiện sẵn trong trình quản lý tệp.',
      ],
    },
    privacy: {
      title: 'Quản lý máy mà không theo dõi nhân viên',
      lead: 'CaramOS Doanh nghiệp đặt luật cho máy tính của công ty. Công ty không xem được nhân viên làm gì trên máy, trừ khi nhân viên đồng ý cho hỗ trợ từ xa.',
      neverTitle: 'CaramOS Doanh nghiệp không có',
      never: ['Chụp hay quay màn hình lén', 'Ghi lại phím đã gõ', 'Lưu lịch sử web', 'Định vị máy', 'Đọc tin nhắn', 'Chạy lệnh tùy ý hay xóa máy từ xa'],
      alwaysTitle: 'Nhân viên luôn biết',
      always: [
        'Trang Máy này do công ty quản lý liệt kê đúng những gì công ty đã bật trên máy đó.',
        'Hỗ trợ từ xa chỉ bắt đầu khi nhân viên đồng ý, và nhân viên dừng được bất cứ lúc nào.',
        'Khởi động lại, tắt máy hay đăng xuất từ xa đều có đồng hồ đếm ngược trên màn hình.',
      ],
      law: 'Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15, có hiệu lực từ 1/1/2026, yêu cầu người lao động được biết rõ các biện pháp kỹ thuật công ty dùng trên máy của họ.',
      image: [`${shots}/business-notice-030.webp`, 'Cửa sổ Máy này do công ty quản lý trên máy nhân viên: công ty quản lý máy từ máy quan-ly và đang bật khóa màn hình sau 10 phút, kiểm kê tự động; công ty không xem được màn hình, những gì bạn gõ, các trang web bạn vào, tin nhắn, tệp ngoài thư mục của công ty', 'Sau khi ghép, máy nhân viên hiện cửa sổ này: công ty đã bật những gì, không xem được những gì. Trong CaramOS Doanh nghiệp, nhân viên xem lại được bất cứ lúc nào.'],
    },
    security: {
      title: 'Máy lạ trong\u00a0mạng không giả được máy quản lý',
      items: [
        ['Ghép bằng mã 6 số', 'Máy nhân viên nhớ khóa của máy quản lý lúc ghép, rồi chỉ làm theo thiết lập có chữ ký đúng.'],
        ['Mỗi máy một khóa riêng', 'Mọi yêu cầu giữa hai bên đều có mã xác thực; không mật khẩu nào gửi đi dạng chữ rõ.'],
        ['Không có lệnh tùy ý', 'Máy quản lý chỉ gửi được các thao tác kể trên, không chạy được lệnh bất kỳ trên máy nhân viên.'],
        ['Nhật ký và bản sao lưu', 'Mọi thay đổi được ghi vào nhật ký. Máy quản lý hỏng thì khôi phục từ bản sao lưu sang máy khác; các máy nhân viên tự tìm lại, không phải ghép lại.'],
      ],
    },
    steps: {
      title: 'Bắt đầu trong năm bước',
      lead: 'Bắt đầu với vài máy, rồi mở rộng ra cả công ty.',
      items: [
        ['Cài CaramOS Doanh nghiệp', 'Mở App Center, ở bước Dùng cho công ty chọn CaramOS Doanh nghiệp rồi bấm Cài, trên máy quản lý và trên từng máy nhân viên.'],
        ['Chọn máy quản lý', 'Một máy CaramOS luôn bật trong giờ làm việc. Máy nhân viên lấy thiết lập từ máy này.'],
        ['Ghép máy nhân viên', 'Máy quản lý hiện mã 6 số trong 10 phút; trên mỗi máy nhân viên chọn máy quản lý và nhập mã.'],
        ['Bật từng tính năng', 'Bật cho cả công ty hoặc từng phòng ban, rồi xem máy nhân viên đã nhận chưa.'],
        ['Báo cho nhân viên', 'Báo bằng văn bản những gì công ty quản lý trên máy, ví dụ trong nội quy lao động.'],
      ],
      note: 'Máy quản lý và máy nhân viên cần chạy CaramOS, bản Cinnamon hoặc Xfce, và cùng mạng nội bộ của công ty.',
      image: [`${shots}/business-pairing-030.webp`, 'Trang Thêm máy trên máy quản lý: mã ghép máy 251 222, còn dùng được 10 phút, nút Dừng thêm máy, và Duyệt từng máy mới đang bật', 'Bước 3 trên máy quản lý: mã 6 số để gõ trên từng máy nhân viên.'],
    },
    faq: {
      title: 'Hỏi đáp về Linux cho doanh nghiệp',
      items: [
        ['Cài CaramOS Doanh nghiệp ở đâu?', 'Trong App Center của CaramOS, ở bước Dùng cho công ty. Cài xong, mở CaramOS Doanh nghiệp và chọn máy này là máy quản lý hay máy nhân viên.'],
        ['CaramOS Doanh nghiệp có mất phí không?', 'Không. CaramOS Doanh nghiệp miễn phí, như chính CaramOS. Bọn mình duy trì dự án bằng tiền Đồng hành của người dùng. Công ty thấy CaramOS có ích thì góp qua nút Đồng hành ở góc dưới bên phải trang.'],
        ['Có cần Internet hay dịch vụ đám mây không?', 'Không cần đám mây. Máy quản lý là một máy CaramOS trong văn phòng; thiết lập, kiểm kê và hỗ trợ từ xa đi trong mạng LAN của công ty. Internet chỉ cần để tải phần mềm và bản cập nhật.'],
        ['Công ty có xem được nhân viên làm gì không?', 'Không. CaramOS Doanh nghiệp không có tính năng chụp màn hình, ghi phím, lưu lịch sử web hay định vị máy. IT chỉ thấy màn hình của nhân viên khi nhân viên đồng ý cho hỗ trợ từ xa, và nhân viên bấm Dừng được bất cứ lúc nào.'],
        ['Có quản lý được máy Windows không?', 'Không. CaramOS Doanh nghiệp chỉ quản lý máy chạy CaramOS, bản Cinnamon hoặc Xfce.'],
        ['Dùng MISA, hóa đơn điện tử, chữ ký số được không?', 'Dịch vụ chạy trên trình duyệt, như MISA AMIS hay meInvoice, thì mở bằng trình duyệt trên CaramOS. MISA SME cài trên Windows thì không chạy trên CaramOS; bạn mở máy Windows có MISA từ xa bằng Remmina. Với chữ ký số, ký số từ xa (MISA eSign, VNPT SmartCA) là cách ít phải cài nhất. Khi công ty chặn USB lưu trữ, token ký số vẫn dùng được.'],
        ['Máy quản lý hỏng thì sao?', 'Khôi phục từ bản sao lưu sang một máy khác. Bản sao lưu có mật khẩu riêng; các máy nhân viên tự tìm lại máy quản lý mới, không phải ghép lại từng máy.'],
        ['Doanh nghiệp có nên dùng Linux không?', 'Nên, với máy văn phòng chủ yếu soạn văn bản, làm bảng tính, dùng web, Zalo và máy in. Những máy đó chạy CaramOS miễn phí, không tốn tiền bản quyền hệ điều hành. Máy cần phần mềm chỉ có bản Windows thì giữ Windows có bản quyền. Chạy thử từ USB và bấm Lưu báo cáo trong Kiểm tra driver để biết từng máy có hợp không.'],
        ['Linux có cần mua bản quyền không?', 'CaramOS thì không. CaramOS là phần mềm tự do theo giấy phép GPL-3.0, công ty cài bao nhiêu máy cũng được và không trả phí bản quyền. ONLYOFFICE Desktop Editors và LibreOffice cũng miễn phí, công ty dùng được. Phần mềm trả phí thì vẫn cần giấy phép, kể cả khi chạy trên Linux.'],
        ['Dùng Windows lậu bị phạt bao nhiêu?', 'Theo Nghị định 341/2025/NĐ-CP, sao chép phần mềm trái phép bị phạt hành chính từ 5 triệu đồng, công ty bị phạt gấp đôi. Năm 2026, Việt Nam có vụ án hình sự đầu tiên về dùng Windows và Office lậu (Tuổi Trẻ, 11/6/2026; Bộ Công an, 14/7/2026). Máy chạy CaramOS với ONLYOFFICE hay LibreOffice thì không phải mua giấy phép cho hệ điều hành và bộ văn phòng.'],
        ['CaramOS Doanh nghiệp quản lý máy tính công ty được những gì?', 'Từ một máy quản lý trong mạng LAN, bạn đặt hình nền, trình duyệt, máy in, Wi-Fi, USB, lịch tắt máy và tường lửa cho cả công ty hoặc từng phòng ban. Máy tự kiểm kê và xuất danh sách tài sản ra Excel. Nhân viên bấm Nhờ IT hỗ trợ, IT giúp từ xa khi nhân viên đồng ý. Phần mềm này miễn phí.'],
      ],
    },
    contact: {
      title: 'Góp ý và đề xuất tính năng',
      lead: 'Công ty bạn cần CaramOS Doanh nghiệp làm thêm gì, hay chỗ nào chưa ổn? Viết cho bọn mình, bọn mình đọc mọi thư.',
      subject: 'CaramOS Doanh nghiệp',
      orgLabel: 'Công ty',
      messagePlaceholder: 'Ví dụ: muốn xem dung lượng ổ đĩa còn trống của từng máy theo tháng.',
    },
  },
  contactForm: {
    kind: 'Bạn muốn gửi',
    kinds: ['Góp ý', 'Yêu cầu tính năng'],
    name: 'Tên của bạn',
    message: 'Nội dung',
    required: 'bắt buộc',
    messageError: 'Viết vài dòng để bọn mình hiểu bạn cần gì.',
    submit: 'Gửi qua email',
    privacy: 'Thư đi từ ứng dụng email của bạn tới bọn mình. Trang này không lưu lại gì.',
    opened: 'Ứng dụng email của bạn đã mở một thư viết sẵn: bấm gửi là xong. Không thấy thư? Chép nội dung rồi gửi tới',
    copy: 'Chép nội dung thư',
    copied: 'Đã chép',
    channelsTitle: 'Liên hệ',
    channels: [
      ['mail', 'Email', links.contactEmail, `mailto:${links.contactEmail}`],
      ['facebook', 'Facebook', 'facebook.com/mrd.900s', links.contactFacebook],
    ],
    mail: { kind: 'Loại', name: 'Tên', message: 'Nội dung', from: 'Gửi từ' },
  },
});

Object.assign(copy.en, {
  anchors: { map: 'map', start: 'get-started', faq: 'questions', contact: 'contact' },
  diagramWords: { to: 'to', both: 'both ways with' },
  education: {
    seo: {
      title: 'Linux for schools: free computer labs on 2 GB PCs | CaramOS',
      description: 'CaramOS is free Linux for schools, lab management included: Veyon or Epoptes over the school network, one-click learning apps, and an Xfce edition for 2 GB PCs.',
      ogAlt: 'CaramOS Computer Lab: the teacher’s computer shows a pupil’s screen and the 6-digit pairing code',
    },
    hero: {
      title: 'Linux for schools, even on 2 GB computers',
      lead: 'CaramOS is free on every computer in a school computer lab, lab management software included. The teacher watches and controls the pupils’ computers from their own, over the school network. Learning apps install with one click, and the interface uses the words of the Tin học textbooks.',
      download: 'Download Xfce for your lab',
      downloadNote: '2.7 GB, runs on 2 GB of RAM',
      contact: 'Send feedback or get in touch',
      image: [`${shots}/lab-veyon-140.webp`, 'Veyon Master on the teacher’s computer showing a pupil’s screen', 1072, 670],
      overlay: [`${shots}/lab-code-140.webp`, 'The Computer Lab tool showing the 6-digit pairing code on the teacher’s computer', 620, 433],
      facts: [
        ['Free on every computer', 'open source, GPL-3.0'],
        ['Runs on 2 GB of RAM', 'the Xfce edition uses about 610 MB right after boot'],
        ['Security updates until 2029', `CaramOS ${VERSION}, on Ubuntu 24.04 LTS`],
      ],
    },
    map: {
      title: 'What a Linux computer lab is made of',
      lead: 'The teacher’s and the pupils’ computers talk over the school network. Apps and updates come in from the internet, and questions go out to the community.',
    },
    lab: {
      title: 'Free computer lab management, right on the teacher’s computer',
      lead: 'The Computer Lab tool installs and sets up Veyon or Epoptes, two free and open-source lab management programs, with no commands to type. The teacher’s computer shows a 6-digit code. Each pupil’s computer finds the teacher’s on the school network, and typing the code joins the class.',
      pointsTitle: 'From the teacher’s computer, with Veyon',
      points: [
        'Watch every pupil’s screen at once.',
        'Show your own screen to the whole class.',
        'Lock the pupils’ screens when you need everyone’s attention.',
        'Send messages and exercise files.',
        'Take control of one computer to show a pupil how.',
        'Turn the whole lab off at the end of the lesson.',
      ],
      choiceTitle: 'Pick the software when you set up the teacher’s computer',
      choices: [
        ['Veyon', 'recommended', 'Does everything in the list above. Works with Veyon on Windows computers too.'],
        ['Epoptes', 'lighter', 'For labs of 2 GB computers. The pupils’ computers connect to the teacher’s by themselves.'],
      ],
      note: 'The computers only need the same school network, cable or Wi-Fi; lessons need no internet. Computer Lab is in both the Cinnamon and the Xfce editions.',
    },
    oldPcs: {
      title: 'Old 2 GB computers can still teach',
      lead: 'Right after boot, the Xfce edition uses about 610 MB of RAM on a 2 GB computer, about 170 MB less than Cinnamon. It keeps the App Center, Driver Check, Vietnamese typing and the Update Center.',
      points: [
        'Try it from the USB stick before installing. Driver Check tells you what is missing (Wi-Fi, sound, graphics), so you know which computers in the lab will work.',
        'The three-island taskbar, the Control Center and the Feedback & Help button work as on the Cinnamon edition.',
        'For a lab of 2 GB computers, pick Epoptes when you set up the teacher’s computer, because it is lighter than Veyon.',
        'It needs a 64-bit computer that boots with UEFI or BIOS and 20 GB of free disk space. Computers with 4 GB of RAM or more take the Cinnamon edition.',
      ],
      image: [`${shots}/xfce-desktop-150.webp`, 'CaramOS Xfce with the Control Center open at the right of the taskbar'],
    },
    textbook: {
      title: 'Pupils can follow the textbook on screen',
      lead: 'The Xfce edition uses an English interface by default, with the same words as the Tin học textbooks: New, Folder, Copy, Paste. Choosing Vietnamese at install gives a Vietnamese interface. Vietnamese typing works the same in both.',
      points: [
        'Right-click and choose New ▸ Folder (Mới ▸ Thư mục on the Cinnamon edition), with Word, Excel and PowerPoint templates.',
        'The left pane is a folder tree that opens level by level like Windows Explorer, ready for the lessons on folder trees.',
        'The Lotus input method is on with Telex, and Ctrl+Shift switches between Vietnamese and English. VNI is picked in Cài đặt Lotus ▸ Tổng quan ▸ Kiểu gõ.',
        'Opening a Word or Excel file before an office suite is installed offers ONLYOFFICE, WPS Office or LibreOffice.',
      ],
      image: [`${shots}/xfce-files-150.webp`, 'Files on the Xfce edition: right-click New ▸ Folder, with the folder tree on the left'],
    },
    apps: {
      title: 'Free learning apps for every subject',
      lead: 'Open the App Center, tick the apps you need and click Install. Nothing is selected in advance, so each computer gets only what it needs. The Computer skills for children step has 10 apps for mouse practice, touch typing, drawing and puzzles, such as GCompris, Tux Typing, KTouch, KolourPaint and Polypad. The Programming, maths, science and lessons step has Scratch 3, Thonny, GeoGebra, Stellarium, LeoCAD and eXeLearning for teachers to build lessons.',
      groups: [
        ['First steps with a computer', [
          ['GCompris', 'Over 180 learning games for ages 2 to 10: mouse and keyboard practice, maths, reading'],
          ['Tux Paint', 'Drawing for children, easier than Paint, with a Vietnamese interface'],
          ['Klavaro', 'Touch typing, with exercises in Vietnamese text'],
        ]],
        ['Programming', [
          ['KTurtle', 'First programming: give orders to a turtle that draws'],
          ['Scratch 3 (TurboWarp)', 'Block programming that works offline and opens .sb3 projects'],
          ['Thonny', 'Python for beginners, for secondary school computing'],
        ]],
        ['Maths and science', [
          ['GeoGebra', 'Geometry and graphs; free for learning but not open source'],
          ['Stellarium', 'A 3D planetarium for science and geography; needs decent graphics'],
        ]],
      ],
      image: [`${shots}/app-center-edu-150.webp`, 'The App Center in version 1.5.0, in Vietnamese: GCompris, Tux Paint and Klavaro ticked, about 378 MB, and an Install 3 apps button; Scratch 3 and KTurtle below'],
    },
    care: {
      title: 'The whole lab updates itself, with help when you need it',
      items: [
        ['Updates on their own', 'Each computer checks for a new version at midnight and about 15 minutes after each start, then installs it while in use. Lab computers switched off before midnight still get fixes on the day of the lesson. To update by hand, turn off Automatic updates in the Update Center (needs an administrator password).'],
        ['Feedback & Help', 'Click the question mark at the right of the taskbar to ask a question or report a bug, with a screenshot or a short video. The Vietnam Linux Family community answers, in Vietnamese.'],
        ['Security updates until 2029', 'CaramOS is based on Linux Mint 22.3 and Ubuntu 24.04 LTS, which gets security fixes until 2029.'],
      ],
    },
    steps: {
      title: 'Set up the whole lab in six steps',
      lead: 'Do it on one computer first, then install the rest.',
      items: [
        ['Download the ISO and write it to a USB stick', 'Xfce for 2 GB computers, Cinnamon for 4 GB or more. Use a USB stick of 4 GB or more.'],
        ['Try it on one computer of the lab', 'Start the computer from the USB stick. Driver Check says whether it works and which drivers are missing.'],
        ['Install it on the teacher’s computer and on each pupil’s', 'Click the Install CaramOS icon on the Desktop and follow the steps.'],
        ['Set up the teacher’s computer', 'Open Computer Lab, choose Teacher’s computer, name the room, pick Veyon or Epoptes. The screen shows a 6-digit code; keep that page open while you pair.'],
        ['Bring each pupil’s computer into the class', 'On each pupil’s computer open Computer Lab, choose Student’s computer, pick the room and type the 6-digit code.'],
        ['Install the learning apps', 'Open the App Center, tick the apps each subject needs at the Computer skills for children and Programming, maths, science and lessons steps, and click Install, on the computers that need them.'],
      ],
      downloads: ['Download Xfce (2.7 GB)', 'Download Cinnamon (2.9 GB)'],
    },
    faq: {
      title: 'Questions schools ask about Linux',
      items: [
        ['Does the school pay anything for CaramOS?', 'No, however many computers the school has. CaramOS is free and open source under the GPL-3.0. Veyon, Epoptes and the learning apps in the App Center are free too; GeoGebra is free for learning but not open source.'],
        ['Which edition for a lab of slow 2 GB computers?', 'The Xfce edition. Right after boot, Task Manager shows about 610 MB of RAM on a 2 GB computer. When you set up the teacher’s computer, pick Epoptes to keep it light.'],
        ['With an English interface, can pupils type Vietnamese?', 'Yes. The Lotus input method is on in both editions, with Telex by default; Ctrl+Shift switches between Vietnamese and English. VNI is picked in Cài đặt Lotus ▸ Tổng quan ▸ Kiểu gõ. For a Vietnamese interface, choose Vietnamese at install.'],
        ['What if the lab still has a few Windows computers?', 'Veyon on CaramOS works with Veyon on Windows. Install Veyon on the Windows computers yourself, because the Computer Lab tool only sets up CaramOS computers.'],
        ['Does it need the internet?', 'Only to install Veyon or Epoptes, the learning apps and updates. During lessons, the teacher’s and the pupils’ computers only need the same school cable or Wi-Fi network.'],
        ['How do we update the whole lab?', 'Since 1.5.0, each computer installs new versions by itself; nobody has to click. It checks at midnight and about 15 minutes after each start, so computers switched off before midnight still get fixes that day. A computer older than 1.5.0 needs Update now once. To update right away, run sudo caramos-ota --upgrade --yes in a terminal.'],
        ['Can a computer on the Cinnamon edition switch to Xfce?', 'Not by itself. To use Xfce, install it fresh from the Xfce ISO. Computer Lab, the learning apps and New ▸ Folder are in both editions.'],
        ['Should a school run its computer lab on Linux?', 'Yes, if the lab teaches from the Tin học textbooks, word processing, Scratch, Python and the web. The Xfce edition of CaramOS runs on 2 GB of RAM and uses the textbooks’ words. CaramOS, Veyon, Epoptes and the learning apps in the App Center are all free. For lessons that need Windows-only software, keep a few licensed Windows computers.'],
        ['Is there free computer lab management software for Linux?', 'Yes. Veyon and Epoptes are free and open source, and run over the school network. On CaramOS, the Computer Lab tool installs and sets up either one: the teacher’s computer shows a 6-digit code, and pupils type it to join. With Veyon, the teacher watches every screen, shows their own screen, locks the pupils’ screens and takes control of one computer.'],
        ['With CaramOS, does the school need to buy software licences?', 'No. CaramOS, ONLYOFFICE, LibreOffice and the learning apps in the App Center are free for schools. Paid software still needs a licence, even on Linux. In 2026, in Vietnam’s first criminal case over pirated Windows and Office, police also checked an educational institution and found 350 computers with signs of illegally activated Windows and Office (Tuổi Trẻ, 11 June 2026).'],
      ],
    },
    contact: {
      title: 'Feedback and feature requests',
      lead: 'What else should CaramOS do for your school’s lab, or what isn’t working well? Write to us; we read every message.',
      subject: 'CaramOS Education',
      orgLabel: 'School',
      messagePlaceholder: 'For example: collect the whole class’s work on the teacher’s computer after a practical lesson.',
    },
  },
  business: {
    seo: {
      title: 'Linux for businesses in Vietnam: CaramOS Business, free',
      description: 'Free, legal Linux for businesses in Vietnam. CaramOS Business runs office PCs from one computer: settings by department, an asset list in Excel, remote help.',
      ogAlt: 'CaramOS Business: one admin computer for the whole office',
    },
    cta: 'Feedback',
    hero: {
      title: 'Linux for business, managed from one\u00a0PC',
      lead: 'CaramOS and CaramOS Business are free on every computer in the company. From one admin computer, you set the wallpaper, browsers, printers, Wi-Fi and USB rules of each department, take the asset inventory and help staff remotely once they accept. It all runs on the company’s own network, with no cloud.',
      status: ['Free.', 'Install it from the App Center’s “For your company” step, on the admin computer and on each staff computer.'],
      cta: 'See how to start',
      mapLink: 'See the diagram',
      facts: [
        ['Off until you turn it on', 'the admin turns each feature on, for the whole company or one department'],
        ['On your own network', 'the admin computer is a CaramOS computer in your office, no cloud'],
        ['Free', 'for computers running CaramOS, Cinnamon or Xfce'],
      ],
      image: [`${shots}/business-overview-030.webp`, 'The Overview page of CaramOS Business on the admin computer, in Vietnamese: 2 staff computers on, 1 new computer waiting for approval, and an employee asking for help because the computer is slow'],
      caption: 'The Overview on the admin computer, in Vietnamese: which computers are on, which wait for approval, who is asking for help, which need a look.',
    },
    map: {
      title: 'How the office computers connect',
      lead: 'The admin turns settings on at the admin computer. Staff computers follow only settings signed by that computer, report back how they are, and keep files on the company’s server.',
    },
    settings: {
      title: 'Settings for the whole company, or one department',
      lead: 'Each settings group turns on separately, and every group stays off until you turn it on. Accounting can block USB drives while Sales keeps Facebook. A single computer can also have its own settings, which win over its department’s.',
      head: ['Settings group', 'What the admin can set'],
      rows: [
        ['Wallpaper', 'A picture for ordinary days and others for occasions such as Tết, 30 April or the company’s anniversary. It can be locked so staff do not change it.'],
        ['Browser', 'Home page, company bookmarks, safe search, and websites blocked all the time or only during working hours (8:00–12:00 and 13:30–17:30 ready to use). Ready lists for social networks, video, games and shopping; Zalo is never in them. For Firefox, Chrome, Cốc Cốc, Edge and Brave.'],
        ['Printers', 'Network printers set up on every computer, with a default printer.'],
        ['Wi-Fi', 'The company’s Wi-Fi for laptops; the password is encrypted separately for each computer.'],
        ['USB storage', 'Allowed, read-only or blocked, with a temporary unlock for one computer. Keyboards, mice, printers and signing tokens keep working.'],
        ['Power schedule', 'Shut computers down at the end of the day, with a warning and a few postponements; turn them on in the morning with the computer’s own timer and Wake-on-LAN.'],
        ['Apps', 'Apps that must be installed and apps that may not be, from the App Center’s catalogue.'],
        ['Screen lock', 'Lock after some minutes without use, and when the computer goes to sleep.'],
        ['Firewall', 'Turn the firewall on: other computers on the network cannot connect to a staff computer.'],
        ['Shared drives', 'Company and department folders, ready in every employee’s file manager.'],
        ['Folders on the server', 'Each employee’s Desktop and Documents live on the company’s server or NAS.'],
      ],
    },
    inventory: {
      title: 'Know what computers you have, and which will fail',
      lead: 'Turn on the automatic inventory and each computer reports its configuration to the admin computer. You add the asset code, purchase date and warranty, then export the list to Excel, laid out like an asset count record.',
      figures: [
        [`${shots}/business-machines-030.webp`, 'The Employee machines page, in Vietnamese: le-tan-01 asks to join and waits for approval, Automatic inventory is on, and 2 computers, ke-toan-01 (Accounting) and kinh-doanh-01 (Sales), are listed as On, with an Export the asset list button', 'Employee machines: the state of each computer, new ones waiting for approval, and the asset list export.'],
        [`${shots}/business-licences-030.webp`, 'The Software licences page, in Vietnamese: free software on each computer with its GPL licence; WPS Office Business bought for 1 computer but found on 2, 1 licence short; Export to Excel and PDF buttons', 'Software licences: which app is on which computer, by licence type, against the licences the company bought; exports to Excel and PDF.'],
      ],
      columns: [
        ['Each computer sends', ['Make, model, serial number', 'CPU, RAM, disks and disk health', 'Battery, monitors, network cards', 'CaramOS version, installed apps']],
        ['The admin adds', ['Asset code, purchase date, price', 'Warranty end', 'User, location']],
        ['The admin computer warns when', ['A disk has under 10% free or is failing', 'A battery is below 60% of its capacity', 'Security updates have waited over 7 days', 'A clock is more than 2 minutes off', 'A computer has not been seen for 3 days']],
      ],
    },
    actions: {
      title: 'Urgent actions reach a computer in seconds',
      lead: 'Send them to one computer, a department or the whole company. Whoever is at the computer is always told first.',
      items: [
        'Lock the computer.',
        'Send a message, with an I have read it button that shows who saw it.',
        'Log out, restart or shut down, with a countdown.',
        'Update CaramOS and security patches now.',
        'Take inventory again.',
        'Unlock USB storage for one computer for a while.',
      ],
      image: [`${shots}/business-actions-030.webp`, 'The page of the computer ke-toan-01 on the admin computer, in Vietnamese: CaramOS 1.5.0 Cinnamon, Accounting, used by lan; its Actions: Lock, Send a message, Remote help, Restart, Shut down, Update, Allow USB for a while, Take inventory again', 'One computer’s page on the admin computer: each button sends one action to it.'],
      helpImage: [`${shots}/business-consent-030.webp`, 'A window on the employee’s computer, in Vietnamese: Quang from IT wants to help you on this computer, with three buttons, Refuse, Let them only see and Allow; with no answer it refuses by itself after a minute', 'The employee’s computer asks before IT can help remotely. With no answer, it refuses by itself after a minute.'],
      helpTitle: 'Remote help when an employee needs IT',
      help: [
        ['The employee clicks Ask IT for help', 'They write a few words about the problem.'],
        ['The admin computer shows the message', 'With the computer’s name and the employee’s login name.'],
        ['IT clicks Remote help', 'The employee chooses to let IT watch or control the screen, or refuses.'],
        ['While IT helps', 'A small window with a Stop button stays on the employee’s screen. The connection is encrypted.'],
      ],
    },
    files: {
      title: 'Staff files live on the company’s server',
      lead: 'Each employee’s Desktop and Documents point to their own folder on the company’s server or NAS: Windows Server, Synology, TrueNAS or Samba. Saving to the Desktop saves to the server.',
      points: [
        'If the network is down or the NAS is off, files stay on the computer for now and the employee is told. Once the server is back, they move up by themselves.',
        'Tidy-up: files left on the computer move into a dated Unsorted folder on the server. No file is ever deleted.',
        'The company’s and each department’s shared drives are ready in the file manager.',
      ],
    },
    privacy: {
      title: 'Manage computers without watching staff',
      lead: 'CaramOS Business sets rules for the company’s computers. The company cannot see what staff do on them, except when an employee accepts remote help.',
      neverTitle: 'Not in CaramOS Business',
      never: ['Secret screenshots or screen recording', 'Keystroke logging', 'Browsing history', 'Location tracking', 'Reading messages', 'Arbitrary commands or remote wipes'],
      alwaysTitle: 'Staff always know',
      always: [
        'The “This machine is managed by the company” page lists exactly what the company turned on for that computer.',
        'Remote help starts only when the employee accepts, and they can stop it at any time.',
        'A remote restart, shutdown or logout always shows a countdown on screen.',
      ],
      law: 'Vietnam’s Personal Data Protection Law 91/2025/QH15, in force since 1 January 2026, requires employees to be clearly told about the technical measures used on their computers.',
      image: [`${shots}/business-notice-030.webp`, 'The “This machine is managed by the company” window on an employee’s computer, in Vietnamese: the company manages it from the computer quan-ly and has the screen lock after 10 minutes and the automatic inventory on; the company cannot see the screen, what you type, the websites you visit, your messages or your files outside the company’s folders', 'After pairing, each staff computer shows this window: what the company turned on, and what it cannot see. Staff can read it again at any time in CaramOS Business.'],
    },
    security: {
      title: 'A stranger on the network cannot pose as the admin computer',
      items: [
        ['Paired with a 6-digit code', 'A staff computer remembers the admin computer’s key when it pairs, then follows only settings with the right signature.'],
        ['A key for each computer', 'Every request between the two carries an authentication code; no password ever travels in plain text.'],
        ['No arbitrary commands', 'The admin computer can send only the actions listed above. It cannot run just any command on a staff computer.'],
        ['Activity log and backup', 'Every change goes into a log. If the admin computer fails, restore its backup on another computer; staff computers find it again without pairing anew.'],
      ],
    },
    steps: {
      title: 'Get started in five steps',
      lead: 'Start with a few computers, then roll it out to the whole company.',
      items: [
        ['Install CaramOS Business', 'Open the App Center, tick CaramOS Business at the “For your company” step and click Install, on the admin computer and on each staff computer.'],
        ['Pick the admin computer', 'A CaramOS computer that stays on during office hours. Staff computers take their settings from it.'],
        ['Pair the staff computers', 'The admin computer shows a 6-digit code for 10 minutes; on each staff computer pick the admin computer and type the code.'],
        ['Turn features on one by one', 'For the whole company or for a department, then check that the staff computers got them.'],
        ['Tell your staff', 'Tell staff in writing what the company manages on their computers, for example in the internal labour rules.'],
      ],
      note: 'The admin and staff computers need to run CaramOS, Cinnamon or Xfce, on the same company network.',
      image: [`${shots}/business-pairing-030.webp`, 'The Add machines page on the admin computer, in Vietnamese: the pairing code 251 222, valid for 10 more minutes, a Stop adding button, and Approve each new machine turned on', 'Step 3 on the admin computer: the 6-digit code to type on each staff computer.'],
    },
    faq: {
      title: 'Questions companies ask about Linux',
      items: [
        ['Where do I install CaramOS Business?', 'From the CaramOS App Center, at its “For your company” step. Once installed, open CaramOS Business and choose whether this is the admin computer or a staff computer.'],
        ['Does CaramOS Business cost anything?', 'No. CaramOS Business is free, like CaramOS itself. We keep the project going with donations from its users. If CaramOS helps your company, you can chip in with the Support button at the bottom right of the page.'],
        ['Does it need the internet or a cloud service?', 'No cloud. The admin computer is a CaramOS computer in your office; settings, inventory and remote help travel on the company network. The internet is needed only for downloading software and updates.'],
        ['Can the company see what staff do?', 'No. CaramOS Business has no screenshot, keystroke logging, browsing history or location feature. IT sees an employee’s screen only when the employee accepts remote help, and the employee can stop it at any time.'],
        ['Can it manage Windows computers?', 'No. CaramOS Business manages computers running CaramOS, Cinnamon or Xfce, only.'],
        ['Do MISA, e-invoices and digital signatures work?', 'Services that run in a browser, such as MISA AMIS or meInvoice, open in a browser on CaramOS. MISA SME, which installs on Windows, does not run on CaramOS; open the Windows computer that has it remotely with Remmina. For digital signatures, remote signing (MISA eSign, VNPT SmartCA) needs the least installing. When the company blocks USB storage, signing tokens still work.'],
        ['What if the admin computer fails?', 'Restore its backup on another computer. The backup has its own passphrase, and staff computers find the new admin computer by themselves, with no re-pairing.'],
        ['Should a company use Linux?', 'Yes, for office computers that mostly handle documents, spreadsheets, the web, Zalo and printing. Those computers run CaramOS for free, with no operating system licence to buy. A computer that needs Windows-only software keeps a licensed Windows. Try each computer from a USB stick and click Save report in Driver Check to see whether it fits.'],
        ['Does Linux need a licence?', 'Not CaramOS. CaramOS is free software under the GPL-3.0: a company can install it on as many computers as it likes, with no licence fee. ONLYOFFICE Desktop Editors and LibreOffice are free for companies too. Paid software still needs a licence, even on Linux.'],
        ['What is the fine for pirated Windows?', 'Under Decree 341/2025/ND-CP, unlicensed copying of software carries administrative fines from 5 million đồng, double for companies. In 2026 Vietnam saw its first criminal case over pirated Windows and Office (Tuổi Trẻ, 11 June 2026; Ministry of Public Security, 14 July 2026). A computer running CaramOS with ONLYOFFICE or LibreOffice needs no licence for its operating system or office suite.'],
        ['What can CaramOS Business manage on company computers?', 'From one admin computer on the office network, you set the wallpaper, browsers, printers, Wi-Fi, USB storage, power schedule and firewall for the whole company or one department. Computers take their own inventory, and the asset list exports to Excel. Staff click Ask IT for help, and IT helps remotely once they accept. It is free.'],
      ],
    },
    contact: {
      title: 'Feedback and feature requests',
      lead: 'What else should CaramOS Business do for your company, or what isn’t working well? Write to us; we read every message.',
      subject: 'CaramOS Business',
      orgLabel: 'Company',
      messagePlaceholder: 'For example: a monthly report of the free disk space on each computer.',
    },
  },
  contactForm: {
    kind: 'Type',
    kinds: ['Feedback', 'Feature request'],
    name: 'Your name',
    message: 'Message',
    required: 'required',
    messageError: 'Write a few lines so we understand what you need.',
    submit: 'Send by email',
    privacy: 'The message goes from your email app to us. This page keeps nothing.',
    opened: 'Your email app has opened a ready-made message: send it and you are done. No message? Copy the text and send it to',
    copy: 'Copy the message',
    copied: 'Copied',
    channelsTitle: 'Contact',
    channels: [
      ['mail', 'Email', links.contactEmail, `mailto:${links.contactEmail}`],
      ['facebook', 'Facebook', 'facebook.com/mrd.900s', links.contactFacebook],
    ],
    mail: { kind: 'Type', name: 'Name', message: 'Message', from: 'Sent from' },
  },
});

// Pixel sizes of the screenshots, so every <img> reserves its space before it loads (no layout shift).
const imageSizes = {
  'app-center-edu-140.webp': [1080, 675], 'app-center-remove.webp': [330, 310], 'app-center.webp': [1160, 832],
  'boot-menu-131.webp': [800, 600], 'cinnamon-desktop-140.webp': [1280, 800], 'cinnamon-files-140.webp': [1280, 800],
  'control-center-dark.webp': [440, 480], 'control-center-light.webp': [440, 480], 'desktop-dark.webp': [1600, 1000],
  'driver-check.webp': [1080, 860], 'first-login.webp': [1600, 1000], 'help-form.webp': [1000, 880],
  'help-menu.webp': [420, 560], 'installer-apps.webp': [752, 555], 'installer-lotus.webp': [752, 555],
  'island-dock-en.webp': [900, 190], 'island-dock.webp': [900, 190], 'lab-code-140.webp': [620, 433],
  'lab-veyon-140.webp': [1072, 670], 'printer-canon-driver-check.webp': [1000, 540], 'start-menu-131.webp': [866, 640],
  'update-available-131.webp': [720, 301], 'update-center-131.webp': [800, 815], 'update-done.webp': [720, 219],
  'update-progress.webp': [720, 271], 'xfce-desktop-140.webp': [1280, 800], 'xfce-files-140.webp': [1280, 800],
  'xfce-desktop-150.webp': [1280, 800], 'xfce-files-150.webp': [1280, 800],
  // 1.5.0
  'first-login-150.webp': [1280, 800], 'app-center-store-150.webp': [1280, 800],
  'update-center-auto-150.webp': [600, 727], 'windows-transfer-150.webp': [700, 680],
  'unicode-convert-150.webp': [1002, 594], 'nd30-menu-150.webp': [442, 314], 'lunar-cinnamon-150.webp': [518, 948],
  'lunar-xfce-150.webp': [582, 920],
  // App Center 0.3.0, as shipped with 1.5.0; CaramOS Doanh nghiệp 0.3.0 on CaramOS 1.5.0 (demo company, demo names)
  'app-center-edu-150.webp': [800, 575],
  'business-overview-030.webp': [1280, 752], 'business-machines-030.webp': [768, 652],
  'business-licences-030.webp': [768, 752], 'business-actions-030.webp': [768, 270],
  'business-consent-030.webp': [440, 265], 'business-notice-030.webp': [520, 656], 'business-pairing-030.webp': [768, 352],
};

export function sizeOf(src) {
  const size = imageSizes[src.split('/').pop()];
  return size ? { width: size[0], height: size[1] } : {};
}

// Screenshots with a smaller copy for phones, named <name>-<width>w.webp.
export const smallCopies = { 'first-login.webp': 800, 'first-login-150.webp': 800, 'cinnamon-desktop-140.webp': 640, 'xfce-desktop-140.webp': 640,
  'xfce-desktop-150.webp': 640 };

export function srcSetOf(src) {
  const name = src.split('/').pop();
  const small = smallCopies[name];
  if (!small) return undefined;
  return `${src.replace(/\.webp$/, `-${small}w.webp`)} ${small}w, ${src} ${imageSizes[name][0]}w`;
}

// Typography for every visible string: curly quotes instead of straight ones, a no-break space between a number and
// its unit so "2,7 GB" never splits across two lines, and word joiners around the dash of a range so "52–79 MB" or
// "8:00–12:00" stays whole; the ▸ of a menu path stays with the word before it ("Mới ▸ Thư mục").
export function typeset(value) {
  if (typeof value === 'string') {
    return value.replace(/"([^"]*)"/g, '“$1”').replace(/(\d) (GB|MB|MiB|KB|GHz|giây|phút)(?![\p{L}])/gu, '$1 $2')
      .replace(/(\d)–(\d)/g, '$1\u2060–\u2060$2').replace(/ ▸/g, '\u00a0▸');
  }
  if (Array.isArray(value)) return value.map(typeset);
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = typeset(value[key]);
  }
  return value;
}
typeset(copy.vi);
typeset(copy.en);

// Đồng hành (src/DongHanh.jsx): the monthly support of CaramOS and VNLF, paid by bank transfer with the code in the QR.
const moneyVi = (n) => `${new Intl.NumberFormat('vi-VN').format(n)}đ`;
const moneyEn = (n) => `${new Intl.NumberFormat('en-US').format(n)} VND`;
export const dongHanhCopy = {
  vi: {
    button: 'Đồng hành',
    title: 'Đồng hành cùng CaramOS',
    lead: 'Mỗi tháng CaramOS và VNLF cần khoảng 5 triệu đồng để duy trì hạ tầng và làm tiếp CaramOS. Quét mã QR bằng ứng dụng ngân hàng, bao nhiêu cũng quý.',
    month: (month) => `Tháng ${Number(String(month).slice(5))}`,
    money: moneyVi,
    of: (goal) => `trên ${goal}`,
    percent: (p) => `${p}%`,
    progressLabel: (p) => `Đã đạt ${p}% mục tiêu tháng này`,
    count: (n) => (n ? `${n} lượt đồng hành` : 'Chưa có lượt đồng hành nào'),
    reached: 'Tháng này đã đủ mục tiêu, cảm ơn mọi người! Phần thêm giúp dự án có đà cho tháng sau.',
    full: 'Tháng này CaramOS và VNLF đã đủ. Cảm ơn mọi người rất nhiều!',
    fullShort: 'Đã đủ',
    fullNext: 'Đầu tháng sau, mã QR sẽ hiện lại.',
    qrAlt: 'Mã QR chuyển khoản để đồng hành cùng CaramOS',
    scan: 'Quét bằng ứng dụng ngân hàng',
    bank: 'Ngân hàng',
    account: 'Số tài khoản',
    holder: 'Chủ tài khoản',
    content: 'Nội dung',
    copy: 'Chép',
    copied: 'Đã chép',
    copyLabel: (what) => `Chép ${what.toLowerCase()}`,
    contentLong: 'Nội dung chuyển khoản',
    cardNote: 'Ghi thêm tên sau nội dung nếu muốn hiện tên.',
    nameHint: (code) => `Nội dung phải có chữ ${code} thì khoản chuyển mới được tính. Muốn hiện tên, ghi thêm phía sau, ví dụ: ${code} Nguyen Van A. Tên hiện ra đã được che bớt.`,
    noAccount: 'Chưa có thông tin tài khoản nhận.',
    recentTitle: 'Vừa đồng hành',
    anonymous: 'Một người đồng hành',
    other: 'Cách ủng hộ khác: MoMo, PayPal, Ko-fi',
    loading: 'Đang tải số liệu tháng này…',
    failed: 'Chưa tải được số liệu tháng này. Bạn thử lại sau nhé.',
    close: 'Đóng',
  },
  en: {
    button: 'Support',
    title: 'Support CaramOS',
    lead: 'Each month CaramOS and VNLF need about 5 million VND to keep the servers running and CaramOS moving. Scan the QR with your banking app; any amount helps.',
    month: (month) => new Date(`${month}-01T00:00:00Z`).toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }),
    money: moneyEn,
    of: (goal) => `of ${goal}`,
    percent: (p) => `${p}%`,
    progressLabel: (p) => `${p}% of this month's goal`,
    count: (n) => (n ? `${n} ${n === 1 ? 'gift' : 'gifts'}` : 'No gifts yet'),
    reached: "This month's goal is reached, thank you! More helps the project into next month.",
    full: 'CaramOS and VNLF have what they need this month. Thank you all so much!',
    fullShort: 'Covered',
    fullNext: 'The QR comes back at the start of next month.',
    qrAlt: 'Bank transfer QR to support CaramOS',
    scan: 'Scan with your banking app',
    bank: 'Bank',
    account: 'Account number',
    holder: 'Account holder',
    content: 'Transfer note',
    copy: 'Copy',
    copied: 'Copied',
    copyLabel: (what) => `Copy ${what.toLowerCase()}`,
    contentLong: 'Transfer note',
    cardNote: 'Add your name after the note to show it.',
    nameHint: (code) => `The transfer counts when its note has ${code}. To show your name, add it after the code, for example ${code} Nguyen Van A. Names show partly hidden.`,
    noAccount: 'The receiving account is not set yet.',
    recentTitle: 'Recent supporters',
    anonymous: 'A supporter',
    other: 'Other ways: MoMo, PayPal, Ko-fi',
    loading: "Loading this month's numbers…",
    failed: "This month's numbers did not load. Please try again later.",
    close: 'Close',
  },
};
