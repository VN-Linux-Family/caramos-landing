import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const VERSION = '1.3.1';

const links = {
  download: `https://sourceforge.net/projects/caramos/files/v${VERSION}/CaramOS-${VERSION}-cinnamon-amd64.iso/download`,
  release: `https://github.com/VN-Linux-Family/CaramOS/releases/tag/v${VERSION}`,
  checksums: `https://github.com/VN-Linux-Family/CaramOS/releases/download/v${VERSION}/SHA256SUMS`,
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
};

const installCommand = 'curl -fsSL https://caramos.vietnamlinuxfamily.net/install-caramos-ota.sh | sudo bash';
const upgradeCommand = 'sudo caramos-ota --upgrade --yes';
const shots = '/assets/screenshots';

const banners = [
  [`${shots}/first-login.webp`, 'heroLightAlt'],
  [`${shots}/desktop-dark.webp`, 'heroDarkAlt'],
];

const githubApi = {
  repo: 'https://api.github.com/repos/VN-Linux-Family/CaramOS',
  contributors: 'https://api.github.com/repos/VN-Linux-Family/CaramOS/contributors?per_page=12',
};

const fallbackRepo = {
  stargazers_count: '—',
  forks_count: '—',
  open_issues_count: '—',
  license: { spdx_id: 'GPL-3.0' },
};

function compactNumber(value) {
  if (typeof value !== 'number') return value;
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

const navTargets = ['#overview', '#features', '#ota', '#release-notes', '#ecosystem', '#download'];

const copy = {
  vi: {
    language: 'EN',
    nav: ['Tổng quan', 'Tính năng', 'Nâng cấp', 'Release note', 'Hệ sinh thái', 'Tải ISO'],
    heroBadge: `Bản chính thức ${VERSION} · Linux Mint 22.3 Cinnamon · GPL-3.0`,
    upgradeNotice: `Đang dùng CaramOS? Lên ${VERSION} không cần cài lại`,
    seoTitle: `CaramOS ${VERSION} — hệ điều hành Linux cho người Việt`,
    seoDescription: `CaramOS ${VERSION}, bản phát hành chính thức dựa trên Linux Mint 22.3 Cinnamon: tiếng Việt và bộ gõ Lotus có sẵn, App Center cài ứng dụng bằng một nút, Kiểm tra driver, Control Center, Góp ý & hỗ trợ và cập nhật OTA.`,
    heroTitle: 'CaramOS — bản phân phối Linux cho người dùng Việt Nam',
    heroLead: `Bản phát hành chính thức ${VERSION} trên nền Linux Mint 22.3 Cinnamon và Ubuntu 24.04 LTS: tiếng Việt và bộ gõ Lotus có sẵn, App Center cài ứng dụng bằng một nút, Kiểm tra driver báo ngay máy còn thiếu gì, và cộng đồng Vietnam Linux Family ở ngay trên thanh tác vụ.`,
    download: `Tải ISO ${VERSION}`,
    featuresCta: 'Xem tính năng',
    checksums: 'Kiểm tra SHA256',
    releaseDetails: 'Chi tiết phát hành',
    heroLightAlt: 'CaramOS ở lần đăng nhập đầu tiên: App Center và Kiểm tra driver',
    heroDarkAlt: 'CaramOS ở chế độ tối, mở Control Center',
    bannerStackLabel: 'Đổi giữa hai ảnh chụp CaramOS',
    otaBadge: 'Trung tâm cập nhật CaramOS',
    otaFlowLabel: 'Ba bước nâng cấp trong Trung tâm cập nhật',
    otaFlow: [
      [`${shots}/update-available.webp`, 'Trung tâm cập nhật báo có bản 1.3.0', 'Trung tâm cập nhật tự báo khi có bản mới.'],
      [`${shots}/update-progress.webp`, 'Trung tâm cập nhật đang cập nhật CaramOS', 'Bấm Cập nhật ngay, nhập mật khẩu: CaramOS tự làm từng bước.'],
      [`${shots}/update-done.webp`, 'Cập nhật CaramOS thành công', 'Xong là dùng tiếp: không cài lại, không mất dữ liệu.'],
    ],
    source: 'Mã nguồn',
    community: 'Cộng đồng',
    supportPage: 'Donate',
    statLabels: ['Stars', 'Forks', 'Issues', 'License'],
    contributorsTitle: 'Contributors',
    contributorsLead: 'Danh sách contributors được lấy trực tiếp từ GitHub repository của CaramOS.',
    contributorsFallback: 'Không tải được dữ liệu contributors từ GitHub. Vui lòng xem danh sách mới nhất trên GitHub.',
    featuresTitle: 'Tính năng nổi bật',
    featuresLead: 'Những việc người mới dùng Linux hay phải tra cứu đều có sẵn trên màn hình: cài ứng dụng, cài driver, đổi thiết lập, cập nhật máy và hỏi cộng đồng, không cần mở Terminal.',
    features: [
      {
        id: 'app-center', tag: 'Mới trong 1.3.0',
        title: 'App Center — chọn ứng dụng, CaramOS cài giúp',
        lead: 'Lần đăng nhập đầu tiên, App Center mở ra với bộ ứng dụng đề xuất đã chọn sẵn. Bấm Cài một lần rồi dùng máy bình thường trong lúc CaramOS tải và cài.',
        points: [
          'Bộ văn phòng ONLYOFFICE, WPS Office, LibreOffice; trình duyệt Chrome, Cốc Cốc, Edge, Brave, Firefox.',
          'Zalo gọi thoại, gọi video được, cùng Telegram, Zoom, Teams for Linux, Discord và các tiện ích thường dùng.',
          'Mỗi ứng dụng ghi rõ ưu, nhược điểm, dung lượng và nguồn cài: Flathub, kho Ubuntu hay gói tải về.',
          'Gỡ ứng dụng ngay trên thẻ của nó; mở lại App Center bất cứ lúc nào từ Desktop hoặc menu.',
        ],
        media: { type: 'stack', main: [`${shots}/app-center.webp`, 'App Center CaramOS với bộ ứng dụng văn phòng đề xuất'], overlay: [`${shots}/app-center-remove.webp`, 'Nút Gỡ cài đặt trên thẻ WPS Office đã cài'] },
        link: ['Kho ứng dụng VNLF', links.apps],
      },
      {
        id: 'driver-check', tag: 'Mới trong 1.3.0',
        title: 'Kiểm tra driver — biết ngay máy còn thiếu gì',
        lead: 'Chạy thử CaramOS từ USB là biết máy có hợp không, trước cả khi cài. Sau khi cài, Kiểm tra driver chạy lại ở lần đăng nhập đầu tiên rồi chỉ lên tiếng khi có vấn đề mới.',
        points: [
          'Kiểm tra Wi-Fi, mạng dây, đồ họa, âm thanh, Bluetooth, webcam và đầu đọc vân tay.',
          'Cài driver NVIDIA và Wi-Fi Broadcom bằng một nút, đúng bản Ubuntu khuyên dùng cho máy.',
          'Thiếu driver mạng? Chỉ cách vào mạng bằng dây LAN, điện thoại qua USB, hoặc cài thẳng từ USB CaramOS.',
          'Nút Nhờ giúp đỡ gửi lời nhắn kèm hồ sơ phần cứng tới cộng đồng VNLF.',
        ],
        media: { type: 'single', main: [`${shots}/driver-check.webp`, 'Kiểm tra driver: máy này chạy tốt với CaramOS'] },
      },
      {
        id: 'update-center', tag: 'Cập nhật OTA',
        title: 'Trung tâm cập nhật — nâng cấp không cần cài lại',
        lead: 'Máy cài từ bản nào cũng lên được bản mới nhất, không phải cài lại, không mất dữ liệu.',
        points: [
          'Kiểm tra mỗi ngày, báo phiên bản mới và từng thay đổi sẽ được áp dụng.',
          'Không có gì tự cài khi bạn chưa đồng ý: Cập nhật ngay, hoặc Để sau.',
          'Thứ bạn đã tự chỉnh được giữ nguyên: hình nền bạn chọn, bộ màu biểu tượng, applet bạn đã gỡ.',
        ],
        media: { type: 'single', main: [`${shots}/update-center.webp`, 'Trung tâm cập nhật CaramOS: từ 1.0.20 lên 1.3.0'] },
        link: ['Hướng dẫn nâng cấp', '#ota'],
      },
      {
        id: 'control-center', tag: 'Desktop',
        title: 'Control Center — mọi thiết lập nhanh trong một chạm',
        lead: 'Bấm góc phải thanh tác vụ là có đủ âm thanh, mạng, Bluetooth, chế độ tối và chế độ nguồn, thay cho các applet rời rạc.',
        points: [
          'Âm lượng loa và micro, chọn thiết bị phát và thu.',
          'Mạng dây, Wi-Fi, VPN, Bluetooth, mỗi ô có danh sách để chọn nhanh.',
          'Chế độ tối, Ánh sáng đêm và Chế độ nguồn: Hiệu năng, Cân bằng, Tiết kiệm pin.',
          'Độ sáng và pin laptop, chụp màn hình, mở Cài đặt, khoá máy, tắt máy.',
        ],
        media: { type: 'pair', main: [`${shots}/control-center-light.webp`, 'Control Center giao diện sáng'], second: [`${shots}/control-center-dark.webp`, 'Control Center giao diện tối'] },
      },
      {
        id: 'help', tag: 'Mới trong 1.3.0',
        title: 'Góp ý & hỗ trợ — cộng đồng VNLF ngay trên thanh tác vụ',
        lead: 'Dấu hỏi ở góc phải thanh tác vụ: nhờ giúp đỡ, báo lỗi hay góp ý cho CaramOS, gửi thẳng tới cộng đồng Vietnam Linux Family.',
        points: [
          'Kèm ảnh chụp màn hình (làm mờ được chỗ riêng tư) hoặc video tối đa 1 phút, đã nén nhỏ và bỏ thông tin vị trí.',
          'Kèm hồ sơ phần cứng (không có tên người dùng, tên máy, địa chỉ IP) và kết quả Kiểm tra driver nếu bạn đồng ý.',
          'Theo dõi tình trạng yêu cầu, nhận thông báo khi VNLF hoặc cộng đồng trả lời.',
          'VNLF duyệt trước khi đăng; thông tin liên hệ không công khai.',
        ],
        media: { type: 'stack', main: [`${shots}/help-form.webp`, 'Cửa sổ Góp ý & hỗ trợ'], overlay: [`${shots}/help-menu.webp`, 'Menu Góp ý & hỗ trợ với tình trạng các yêu cầu'] },
      },
      {
        id: 'island-dock', tag: 'Desktop', wide: true,
        title: 'Island Dock — thanh tác vụ ba đảo',
        lead: 'Thanh tác vụ tách thành ba đảo nổi bo tròn: gọn mắt, mà vẫn quen tay như trên Windows.',
        points: [
          'Đảo trái: Start Menu, tìm ứng dụng bằng tiếng Việt, gõ không dấu vẫn ra.',
          'Đảo giữa: ứng dụng ghim và đang chạy, có chấm nhỏ dưới ứng dụng đang mở.',
          'Đảo phải: khay hệ thống, bộ gõ, đồng hồ, Control Center và Góp ý & hỗ trợ.',
        ],
        media: { type: 'wide', main: [`${shots}/island-dock.webp`, 'Ba đảo của thanh tác vụ CaramOS'], phone: `${shots}/island-dock-mobile.webp` },
      },
      {
        id: 'look', tag: 'Giao diện',
        title: 'Sáng hay tối, đẹp từ lúc bật máy',
        lead: 'Theme Cinnamon Delight, biểu tượng Tela Circle và font Be Vietnam Pro, đồng bộ từ menu khởi động tới màn hình chính.',
        points: [
          'Chế độ tối một chạm trong Control Center, hình nền tự đổi theo.',
          'Năm hình nền CaramOS 2048×1152: Sage Mist khi sáng, Indigo Night khi tối.',
          'Menu khởi động, màn hình chờ, trình cài đặt và menu GRUB cùng một giao diện.',
        ],
        media: { type: 'single', main: [`${shots}/desktop-dark.webp`, 'CaramOS ở chế độ tối'] },
      },
      {
        id: 'vietnamese', tag: 'Tiếng Việt',
        title: 'Tiếng Việt từ phút đầu tiên',
        lead: 'Giao diện, múi giờ, định dạng ngày giờ và bộ gõ tiếng Việt có sẵn ngay sau khi cài, không phải cấu hình thêm.',
        points: [
          'Fcitx5 + Lotus bật sẵn: mặc định Telex, có VNI và các kiểu gõ phổ biến khác.',
          'Ctrl+Shift chuyển Anh/Việt, phím ` (dưới Esc) mở menu đổi kiểu gõ.',
          'Ứng dụng cài từ Flathub vẫn gõ tiếng Việt và dùng font hệ thống bình thường.',
          'Chọn ngôn ngữ khác trong Cài đặt thì cả hệ thống theo.',
        ],
        media: { type: 'single', main: [`${shots}/installer-lotus.webp`, 'Bộ gõ Fcitx5 Lotus trong trình cài đặt CaramOS'] },
      },
    ],
    statsTitle: 'Nhẹ hơn Linux Mint gốc, không đơ khi hết RAM',
    statsLead: 'Đo trên cùng một máy ảo (4 nhân, 6 GB RAM) với Linux Mint 22.3 Cinnamon gốc; RAM đo 5 phút sau khi khởi động.',
    stats: [
      ['2,8 GB', 'ISO cài đặt', 'Linux Mint 22.3: 3,1 GB'],
      ['865 MiB', 'RAM khi máy rảnh', 'Linux Mint 22.3: 941 MiB'],
      ['0 lần', 'đơ máy khi RAM cạn, nhờ earlyoom', 'Linux Mint 22.3 đơ hơn 30 phút (ổ cứng chậm)'],
      ['2029', 'hỗ trợ bảo mật', 'nền Ubuntu 24.04 LTS'],
    ],
    extrasTitle: 'Còn nữa',
    extras: [
      ['palette', 'Bộ hình nền CaramOS', 'Năm hình nền vẽ riêng cho CaramOS, đổi theo chế độ sáng và tối.', 'Giao diện'],
      ['camera', 'Chụp màn hình nhanh', 'Flameshot với phím Print hoặc Super+Shift+S: chọn vùng, vẽ, làm mờ rồi lưu hoặc dán ngay.', 'Tiện ích'],
      ['shield', 'Menu khởi động CaramOS', 'Menu khởi động, màn hình chờ và cả menu GRUB khi máy cài nhiều hệ điều hành.', 'Khởi động'],
      ['locale', 'Bản địa hoá đầy đủ', 'Ngôn ngữ, múi giờ Asia/Ho_Chi_Minh, định dạng ngày giờ và font tiếng Việt mặc định.', 'Tiếng Việt'],
    ],
    ecosystemTitle: 'Hệ sinh thái VNLF',
    ecosystemLead:
      'Các kênh và tài nguyên chính thức của Vietnam Linux Family phục vụ trao đổi cộng đồng, phân phối nội dung và phát triển dự án.',
    openSourceTitle: 'Thông tin dự án mã nguồn mở',
    openSourceLead:
      'CaramOS được phát triển công khai trên GitHub với giấy phép GPL-3.0, tài liệu đóng góp, quy tắc ứng xử và quy trình build/OTA được mô tả rõ ràng.',
    buildTitle: 'Quy trình build ISO',
    buildLead:
      'Build flow sử dụng phương pháp ISO remaster: giải nén ISO gốc, tùy biến root filesystem bằng packages, overlay và chuỗi OTA migration, sau đó đóng gói lại bằng squashfs và xorriso.',
    otaTitle: `Nâng cấp lên CaramOS ${VERSION} không cần cài lại`,
    otaLead:
      `Máy đang chạy CaramOS 1.0.2 trở lên đã có Trung tâm cập nhật: nó tự kiểm tra mỗi ngày và báo bản ${VERSION}, bạn chỉ cần bấm Cập nhật ngay. Máy còn ở bản 1.0.1 thì chạy lệnh cài Trung tâm cập nhật một lần.`,
    otaInstallLabel: 'Máy CaramOS 1.0.1 (chưa có Trung tâm cập nhật):',
    otaInstallHint: 'Chạy một lần, rồi mở “Trung tâm cập nhật CaramOS” từ Start Menu.',
    otaUpgradeLabel: 'Muốn nâng cấp ngay, không chờ thông báo:',
    otaUpgradeHint: 'Không vội thì bỏ qua bước này: Trung tâm cập nhật sẽ tự báo trong ngày.',
    otaCopy: 'Copy lệnh',
    otaCopyInstallLabel: 'Copy lệnh cài Trung tâm cập nhật',
    otaCopyUpgradeLabel: 'Copy lệnh nâng cấp ngay',
    otaCopied: 'Đã copy',
    otaSteps: [
      ['Máy 1.0.2 trở lên', 'Chờ thông báo của Trung tâm cập nhật rồi bấm Cập nhật ngay.'],
      ['Máy 1.0.1', 'Chạy lệnh cài Trung tâm cập nhật một lần duy nhất.'],
      ['Cần nâng cấp ngay', 'Chạy sudo caramos-ota --upgrade --yes trong Terminal.'],
    ],
    releaseNotesTitle: 'Release note',
    releaseNotesLead:
      `${VERSION} là bản mới nhất. 1.3.0 là bản phát hành chính thức đầu tiên của CaramOS; các bản 1.0.x trước đó là Open Beta. Cuộn danh sách để xem những thay đổi đáng chú ý của từng bản.`,
    releaseListLabel: 'Danh sách các bản phát hành, cuộn để xem thêm',
    releaseCurrent: 'Mới nhất',
    releaseScrollHint: 'Cuộn để xem các bản trước ↓',
    initialRelease: ['1.0.1', 'Phát hành đầu tiên', ['Bản Open Beta đầu tiên của CaramOS dành cho người dùng Việt Nam.', 'Cung cấp nền tảng Linux Mint 22.3 Cinnamon với cấu hình tiếng Việt, branding CaramOS và bộ ứng dụng cơ bản.']],
    releaseNotes: [
      [VERSION, 'Start Menu và Trung tâm cập nhật toàn tiếng Việt', [
        'Start Menu hiện “Tất cả ứng dụng”, “Biểu tượng cảm xúc” thay cho chữ tiếng Anh; applet thời tiết và các tiện ích mở rộng đi kèm cũng theo ngôn ngữ của máy.',
        'Trung tâm cập nhật: dòng dung lượng của bản cập nhật không còn lẫn chữ tiếng Anh.',
        'App Center 0.2.1: Zalo cho Linux hiện nhãn “Gói cộng đồng”, vì do cộng đồng đóng gói chứ không phải của Zalo.',
      ]],
      ['1.3.0', 'Bản phát hành chính thức đầu tiên: App Center, Kiểm tra driver, Góp ý & hỗ trợ', [
        'App Center: lần đăng nhập đầu tiên chọn bộ văn phòng, trình duyệt, ứng dụng liên lạc và tiện ích, CaramOS tải và cài giúp; gỡ ứng dụng ngay trên thẻ của nó.',
        'Kiểm tra driver: kiểm tra Wi-Fi, mạng dây, đồ họa, âm thanh, Bluetooth, webcam, vân tay; cài driver NVIDIA và Wi-Fi Broadcom bằng một nút; tự mở ở lần đăng nhập đầu tiên và khi chạy thử từ USB.',
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
      [`${shots}/boot-menu.webp`, 'Menu khởi động CaramOS', 'Menu khởi động: chạy thử hoặc cài CaramOS.'],
      [`${shots}/installer-apps.webp`, 'Trình cài đặt CaramOS', 'Trình cài đặt giới thiệu App Center, bộ gõ và cộng đồng.'],
      [`${shots}/start-menu.webp`, 'Start Menu CaramOS', 'Start Menu: tìm ứng dụng bằng tiếng Việt, gõ không dấu cũng ra.'],
    ],
    downloadTitle: `Tải CaramOS ${VERSION}`,
    downloadLead:
      'ISO 2,8 GB được lưu trên SourceForge vì GitHub giới hạn dung lượng mỗi tệp. Kiểm tra SHA256 sau khi tải, chạy thử từ USB để Kiểm tra driver xem máy có hợp không, rồi cài từ biểu tượng Cài đặt CaramOS trên Desktop.',
    downloadButton: 'Tải ISO (2,8 GB)',
    requirements: ['Máy 64-bit, UEFI hoặc BIOS', 'RAM từ 2 GB, khuyên dùng 4 GB', 'Ổ đĩa trống từ 20 GB', 'USB từ 4 GB'],
    supportTitle: 'CaramOS trên Unikorn',
    supportLead:
      'Nếu bạn thấy CaramOS hữu ích, hãy clap trên Unikorn để tiếp thêm động lực cho team và giúp dự án tiếp cận nhiều người dùng Việt Nam hơn.',
    supportAction: 'Clap cho CaramOS',
    supportMeta: 'Mỗi lượt clap và badge xếp hạng giúp CaramOS nổi bật hơn trong cộng đồng mã nguồn mở Việt Nam.',
    footer: 'CaramOS là dự án thuộc hệ sinh thái Vietnam Linux Family.',
    ecosystem: [
      ['website', 'Website', 'Trang chủ, bài viết kỹ thuật và tài nguyên chính thức của VNLF.', 'vietnamlinuxfamily.net', 'Official', links.vnlf],
      ['telegram', 'Telegram', 'Kênh trao đổi nhanh cho thông báo và thảo luận cộng đồng.', 't.me/vietnamlinuxfamily', 'Community', links.telegram],
      ['discord', 'Discord', 'Không gian thảo luận theo kênh, phù hợp cho hỗ trợ kỹ thuật và phối hợp dự án.', 'discord.gg/gVAJDUMC2n', 'Community', links.discord],
      ['facebook', 'Facebook', 'Nhóm cộng đồng dành cho hỏi đáp, chia sẻ kinh nghiệm và cập nhật hoạt động.', 'facebook.com/groups/vietnamlinuxcommunity', 'Community', links.facebook],
      ['apps', 'Apps', 'Kho ứng dụng Linux trình bày bằng tiếng Việt; App Center dẫn tới đây khi bạn cần thêm ứng dụng.', 'apps.vietnamlinuxfamily.net', 'Apps', links.apps],
      ['mirror', 'Mirror', 'Repository hạ tầng cho mirror và phân phối tài nguyên của hệ sinh thái VNLF.', 'GitHub: mirror', 'Infra', links.mirror],
    ],
    openSource: [
      ['License', 'Dự án sử dụng GNU General Public License v3.0.'],
      ['Contribution guide', 'CONTRIBUTING.md mô tả kiến trúc, workflow build, quy ước nhánh và cách gửi thay đổi.'],
      ['Code of conduct', 'CODE_OF_CONDUCT.md dựa trên Contributor Covenant 2.1.'],
      ['Issue tracking', 'GitHub Issues và Góp ý & hỗ trợ trên CaramOS dùng để theo dõi lỗi và yêu cầu tính năng.'],
      ['Release workflow', 'GitHub Actions build ISO từ tag phát hành, đưa ISO lên SourceForge và xuất SHA256SUMS.'],
      ['Build process', 'Quy trình extract, customize và repack được tách thành script để kiểm tra và bảo trì độc lập.'],
    ],
  },
  en: {
    language: 'VI',
    nav: ['Overview', 'Features', 'Upgrade', 'Release notes', 'Ecosystem', 'Download'],
    heroBadge: `Official release ${VERSION} · Linux Mint 22.3 Cinnamon · GPL-3.0`,
    upgradeNotice: `On CaramOS already? Get ${VERSION} without reinstalling`,
    seoTitle: `CaramOS ${VERSION} — a Linux distribution for Vietnamese users`,
    seoDescription: `CaramOS ${VERSION}, the official release based on Linux Mint 22.3 Cinnamon: Vietnamese and the Lotus input method out of the box, a one-click App Center, Driver Check, Control Center, Feedback & Help and OTA updates.`,
    heroTitle: 'CaramOS — a Linux distribution for Vietnamese users',
    heroLead: `The official ${VERSION} release, built on Linux Mint 22.3 Cinnamon and Ubuntu 24.04 LTS: Vietnamese and the Lotus input method out of the box, an App Center that installs apps with one click, Driver Check that tells you what the computer is missing, and the Vietnam Linux Family community right on the taskbar.`,
    download: `Download ISO ${VERSION}`,
    featuresCta: 'See the features',
    checksums: 'Verify SHA256',
    releaseDetails: 'Release details',
    heroLightAlt: 'CaramOS at the first login: the App Center and Driver Check',
    heroDarkAlt: 'CaramOS in dark mode, with the Control Center open',
    bannerStackLabel: 'Switch between two CaramOS screenshots',
    otaBadge: 'CaramOS Update Center',
    otaFlowLabel: 'The three steps of an upgrade in the Update Center',
    otaFlow: [
      [`${shots}/update-available.webp`, 'The Update Center offers 1.3.0', 'The Update Center tells you when a new release is out.'],
      [`${shots}/update-progress.webp`, 'The Update Center updating CaramOS', 'Click Update now and enter your password: CaramOS does each step.'],
      [`${shots}/update-done.webp`, 'CaramOS updated successfully', 'Done, keep working: no reinstall, no lost data.'],
    ],
    source: 'Source code',
    community: 'Community',
    supportPage: 'Donate',
    statLabels: ['Stars', 'Forks', 'Issues', 'License'],
    contributorsTitle: 'Contributors',
    contributorsLead: 'The contributor list is loaded directly from the CaramOS GitHub repository.',
    contributorsFallback: 'Could not load contributor data from GitHub. Please view the latest list on GitHub.',
    featuresTitle: 'Highlights',
    featuresLead: 'What newcomers to Linux usually have to look up is right on the screen: installing apps and drivers, changing settings, updating and asking the community, without opening a terminal.',
    features: [
      {
        id: 'app-center', tag: 'New in 1.3.0',
        title: 'App Center — pick your apps, CaramOS installs them',
        lead: 'At the first login the App Center opens with a recommended set already selected. Click Install once and keep using the computer while CaramOS downloads and installs.',
        points: [
          'ONLYOFFICE, WPS Office, LibreOffice; Chrome, Cốc Cốc, Edge, Brave and Firefox.',
          'Zalo with voice and video calls, plus Telegram, Zoom, Teams for Linux, Discord and everyday tools.',
          'Every app lists its strengths, weaknesses, size and source: Flathub, the Ubuntu archive or a downloaded package.',
          'Remove an app right from its card; open the App Center any time from the Desktop or the menu.',
        ],
        media: { type: 'stack', main: [`${shots}/app-center.webp`, 'The CaramOS App Center with the recommended office suite'], overlay: [`${shots}/app-center-remove.webp`, 'The Remove button on the installed WPS Office card'] },
        link: ['VNLF app directory', links.apps],
      },
      {
        id: 'driver-check', tag: 'New in 1.3.0',
        title: 'Driver Check — know what your computer is missing',
        lead: 'Try CaramOS from the USB stick and you know whether the computer works well with it, before installing. Afterwards it runs again at the first login, then only speaks up about new problems.',
        points: [
          'Checks Wi-Fi, wired network, graphics, sound, Bluetooth, webcam and fingerprint reader.',
          'Installs the NVIDIA and Broadcom Wi-Fi drivers Ubuntu recommends, with one click.',
          'No network driver? It explains how to get online with a cable or a phone over USB, or installs from the CaramOS USB stick.',
          'Ask for help sends a message with the hardware profile to the VNLF community.',
        ],
        media: { type: 'single', main: [`${shots}/driver-check.webp`, 'Driver Check: this computer works well with CaramOS'] },
      },
      {
        id: 'update-center', tag: 'OTA updates',
        title: 'Update Center — upgrade without reinstalling',
        lead: 'A machine installed from any release reaches the latest one, without reinstalling or losing data.',
        points: [
          'Checks every day and shows the new version and every change it will apply.',
          'Nothing is installed until you agree: Update now, or Later.',
          'What you changed yourself stays: the wallpaper you picked, your icon colour, applets you removed.',
        ],
        media: { type: 'single', main: [`${shots}/update-center.webp`, 'CaramOS Update Center: from 1.0.20 to 1.3.0'] },
        link: ['How to upgrade', '#ota'],
      },
      {
        id: 'control-center', tag: 'Desktop',
        title: 'Control Center — quick settings in one place',
        lead: 'Click the right end of the taskbar for sound, network, Bluetooth, dark mode and power mode, instead of separate applets.',
        points: [
          'Speaker and microphone volume, with the output and input device.',
          'Wired network, Wi-Fi, VPN and Bluetooth, each with its own quick list.',
          'Dark mode, Night light and Power mode: Performance, Balanced, Power saver.',
          'Laptop brightness and battery, screenshot, Settings, lock and power off.',
        ],
        media: { type: 'pair', main: [`${shots}/control-center-light.webp`, 'Control Center, light'], second: [`${shots}/control-center-dark.webp`, 'Control Center, dark'] },
      },
      {
        id: 'help', tag: 'New in 1.3.0',
        title: 'Feedback & Help — the VNLF community on your taskbar',
        lead: 'The question mark at the right end of the taskbar: ask for help, report a bug or send feedback straight to the Vietnam Linux Family community.',
        points: [
          'Attach screenshots (private parts can be blurred) or videos of up to a minute, made smaller and without location data.',
          'Attach the hardware profile (no user names, computer name or IP addresses) and the Driver Check results if you agree.',
          'Follow your requests and get notified when VNLF or the community answers.',
          'VNLF reviews requests before publishing; your contact details are not made public.',
        ],
        media: { type: 'stack', main: [`${shots}/help-form.webp`, 'The Feedback & Help window'], overlay: [`${shots}/help-menu.webp`, 'The Feedback & Help menu with the state of each request'] },
      },
      {
        id: 'island-dock', tag: 'Desktop', wide: true,
        title: 'Island Dock — a taskbar of three islands',
        lead: 'The taskbar is split into three rounded, floating islands: clean to look at, and as familiar as Windows.',
        points: [
          'Left island: the Start Menu, which finds apps in Vietnamese even typed without accents.',
          'Center island: pinned and running apps, with a small dot under the open ones.',
          'Right island: system tray, input method, clock, Control Center and Feedback & Help.',
        ],
        media: { type: 'wide', main: [`${shots}/island-dock-en.webp`, 'The three islands of the CaramOS taskbar'], phone: `${shots}/island-dock-mobile-en.webp` },
      },
      {
        id: 'look', tag: 'Look and feel',
        title: 'Light or dark, beautiful from power-on',
        lead: 'The Cinnamon Delight theme, Tela Circle icons and the Be Vietnam Pro font, consistent from the boot menu to the desktop.',
        points: [
          'One-click dark mode in the Control Center; the wallpaper follows.',
          'Five CaramOS wallpapers at 2048×1152: Sage Mist in light mode, Indigo Night in dark mode.',
          'Boot menu, splash screen, installer and GRUB menu share the same look.',
        ],
        media: { type: 'single', main: [`${shots}/desktop-dark.webp`, 'CaramOS in dark mode'] },
      },
      {
        id: 'vietnamese', tag: 'Vietnamese',
        title: 'Vietnamese from the first minute',
        lead: 'Interface, time zone, date formats and Vietnamese typing are ready right after installing, with nothing to configure.',
        points: [
          'Fcitx5 + Lotus is on: Telex by default, with VNI and other common methods.',
          'Ctrl+Shift switches between English and Vietnamese; the ` key (below Esc) opens the method menu.',
          'Apps installed from Flathub type Vietnamese and use the system fonts as usual.',
          'Pick another language in Settings and the whole system follows.',
        ],
        media: { type: 'single', main: [`${shots}/installer-lotus.webp`, 'The Fcitx5 Lotus input method in the CaramOS installer'] },
      },
    ],
    statsTitle: 'Lighter than stock Linux Mint, no freeze when RAM runs out',
    statsLead: 'Measured on the same virtual machine (4 cores, 6 GB of RAM) as stock Linux Mint 22.3 Cinnamon; RAM 5 minutes after boot.',
    stats: [
      ['2.8 GB', 'installer ISO', 'Linux Mint 22.3: 3.1 GB'],
      ['865 MiB', 'RAM at idle', 'Linux Mint 22.3: 941 MiB'],
      ['0 freezes', 'when RAM runs out, thanks to earlyoom', 'Linux Mint 22.3 froze for 30+ minutes (slow disk)'],
      ['2029', 'security support', 'Ubuntu 24.04 LTS base'],
    ],
    extrasTitle: 'And more',
    extras: [
      ['palette', 'CaramOS wallpapers', 'Five wallpapers drawn for CaramOS, following light and dark mode.', 'Look'],
      ['camera', 'Quick screenshots', 'Flameshot on Print or Super+Shift+S: pick an area, draw, blur, then save or paste.', 'Tools'],
      ['shield', 'CaramOS boot menu', 'The boot menu, splash screen and even the GRUB menu on dual-boot machines.', 'Boot'],
      ['locale', 'Fully localized', 'Language, Asia/Ho_Chi_Minh time zone, date formats and Vietnamese fonts by default.', 'Vietnamese'],
    ],
    ecosystemTitle: 'VNLF ecosystem',
    ecosystemLead:
      'Official Vietnam Linux Family channels and resources for community discussion, content distribution, and project development.',
    openSourceTitle: 'Open-source project information',
    openSourceLead:
      'CaramOS is developed publicly on GitHub with GPL-3.0 licensing, contribution documentation, a code of conduct, and documented build/OTA workflows.',
    buildTitle: 'ISO build process',
    buildLead:
      'The build flow uses an ISO remaster method: extract the upstream ISO, customize the root filesystem with packages, overlays, and the OTA migration chain, then repack it with squashfs and xorriso.',
    otaTitle: `Upgrade to CaramOS ${VERSION} without reinstalling`,
    otaLead:
      `Machines on CaramOS 1.0.2 or later already have the Update Center: it checks every day and offers ${VERSION}; just click Update now. Machines still on 1.0.1 run the Update Center installer once.`,
    otaInstallLabel: 'CaramOS 1.0.1 (no Update Center yet):',
    otaInstallHint: 'Run it once, then open “CaramOS Update Center” from the Start Menu.',
    otaUpgradeLabel: 'Upgrade right away, without waiting for the notification:',
    otaUpgradeHint: 'No hurry? Skip this: the Update Center will offer the update within a day.',
    otaCopy: 'Copy command',
    otaCopyInstallLabel: 'Copy Update Center installer command',
    otaCopyUpgradeLabel: 'Copy immediate upgrade command',
    otaCopied: 'Copied',
    otaSteps: [
      ['1.0.2 or later', 'Wait for the Update Center notification and click Update now.'],
      ['On 1.0.1', 'Run the Update Center installer command once.'],
      ['Need it now', 'Run sudo caramos-ota --upgrade --yes in a terminal.'],
    ],
    releaseNotesTitle: 'Release notes',
    releaseNotesLead:
      `${VERSION} is the latest release. 1.3.0 was the first official CaramOS release; the 1.0.x releases before it were Open Beta. Scroll the list for the notable changes of each release.`,
    releaseListLabel: 'Releases, scroll for more',
    releaseCurrent: 'Latest',
    releaseScrollHint: 'Scroll for earlier releases ↓',
    initialRelease: ['1.0.1', 'First release', ['The first CaramOS Open Beta for Vietnamese users.', 'Provided a Linux Mint 22.3 Cinnamon base with Vietnamese defaults, CaramOS branding, and essential applications.']],
    releaseNotes: [
      [VERSION, 'A Start Menu and Update Center in one language', [
        'In Vietnamese the Start Menu shows “Tất cả ứng dụng” and “Biểu tượng cảm xúc” instead of English words; the weather applet and the bundled extensions follow the system language too.',
        'Update Center: the size line of an update no longer mixes in English.',
        'App Center 0.2.1: Zalo for Linux is labelled “Community package”, since the community packages it, not Zalo.',
      ]],
      ['1.3.0', 'The first official release: App Center, Driver Check, Feedback & Help', [
        'App Center: at the first login pick an office suite, browsers, chat apps and everyday tools, and CaramOS installs them; remove an app right from its card.',
        'Driver Check: checks Wi-Fi, wired network, graphics, sound, Bluetooth, webcam and fingerprint reader; installs NVIDIA and Broadcom Wi-Fi drivers with one click; opens at the first login and in the live USB session.',
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
      [`${shots}/boot-menu.webp`, 'The CaramOS boot menu', 'Boot menu: try CaramOS or install it.'],
      [`${shots}/installer-apps.webp`, 'The CaramOS installer', 'The installer introduces the App Center, typing and the community.'],
      [`${shots}/start-menu.webp`, 'The CaramOS Start Menu', 'Start Menu: finds apps in Vietnamese, even typed without accents.'],
    ],
    downloadTitle: `Download CaramOS ${VERSION}`,
    downloadLead:
      'The 2.8 GB ISO is hosted on SourceForge because GitHub limits the size of each release file. Verify the SHA256 after downloading, try it from a USB stick so Driver Check can tell whether the computer suits CaramOS, then install from the Install CaramOS icon on the Desktop.',
    downloadButton: 'Download ISO (2.8 GB)',
    requirements: ['64-bit computer, UEFI or BIOS', '2 GB of RAM, 4 GB recommended', '20 GB of free disk space', 'A USB stick of 4 GB or more'],
    supportTitle: 'CaramOS on Unikorn',
    supportLead:
      'If CaramOS is useful to you, clap for the project on Unikorn to encourage the team and help it reach more Vietnamese Linux users.',
    supportAction: 'Clap for CaramOS',
    supportMeta: 'Every clap and ranking badge helps CaramOS stand out in the Vietnamese open-source community.',
    footer: 'CaramOS is part of the Vietnam Linux Family ecosystem.',
    ecosystem: [
      ['website', 'Website', 'Official VNLF homepage, technical articles, and project resources.', 'vietnamlinuxfamily.net', 'Official', links.vnlf],
      ['telegram', 'Telegram', 'Realtime channel for announcements and community discussion.', 't.me/vietnamlinuxfamily', 'Community', links.telegram],
      ['discord', 'Discord', 'Channel-based discussion space for technical support and project coordination.', 'discord.gg/gVAJDUMC2n', 'Community', links.discord],
      ['facebook', 'Facebook', 'Community group for Q&A, experience sharing, and activity updates.', 'facebook.com/groups/vietnamlinuxcommunity', 'Community', links.facebook],
      ['apps', 'Apps', 'A Vietnamese-language Linux app directory; the App Center links here when you need more apps.', 'apps.vietnamlinuxfamily.net', 'Apps', links.apps],
      ['mirror', 'Mirror', 'Infrastructure repository for mirror and resource distribution in the VNLF ecosystem.', 'GitHub: mirror', 'Infra', links.mirror],
    ],
    openSource: [
      ['License', 'The project uses the GNU General Public License v3.0.'],
      ['Contribution guide', 'CONTRIBUTING.md documents architecture, build workflow, branch conventions, and change submission.'],
      ['Code of conduct', 'CODE_OF_CONDUCT.md is based on Contributor Covenant 2.1.'],
      ['Issue tracking', 'GitHub Issues and Feedback & Help on CaramOS track bugs and feature requests.'],
      ['Release workflow', 'GitHub Actions builds the ISO from release tags, uploads it to SourceForge and publishes SHA256SUMS.'],
      ['Build process', 'The extract, customize, and repack stages are split into scripts for independent validation and maintenance.'],
    ],
  },
};



function App() {
  const isSupportPage = window.location.pathname.replace(/\/$/, '') === '/support';
  const [lang, setLang] = useState(() => {
    const asked = new URLSearchParams(window.location.search).get('lang');
    if (asked === 'en' || asked === 'vi') return asked;
    try {
      return localStorage.getItem('caramos-language') || 'vi';
    } catch {
      return 'vi';
    }
  });
  const [repo, setRepo] = useState(fallbackRepo);
  const [contributors, setContributors] = useState([]);
  const [githubError, setGithubError] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const t = useMemo(() => copy[lang], [lang]);
  const liveStats = useMemo(() => [
    `${compactNumber(repo.stargazers_count)} stars`,
    `${compactNumber(repo.forks_count)} forks`,
    lang === 'vi' ? `${compactNumber(repo.open_issues_count)} issues mở` : `${compactNumber(repo.open_issues_count)} open issues`,
    repo.license?.spdx_id || 'GPL-3.0',
  ], [lang, repo]);

  useEffect(() => {
    const canonicalUrl = lang === 'vi' ? 'https://caramos.vietnamlinuxfamily.net/' : 'https://caramos.vietnamlinuxfamily.net/?lang=en';

    document.documentElement.lang = lang === 'vi' ? 'vi' : 'en';
    document.title = t.seoTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.seoDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.seoTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.seoDescription);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'vi' ? 'vi_VN' : 'en_US');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', t.seoTitle);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', t.seoDescription);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    try {
      localStorage.setItem('caramos-language', lang);
    } catch {
      // Private windows may refuse storage; the page works without it.
    }
  }, [lang, t]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGithubData() {
      try {
        const [repoResponse, contributorsResponse] = await Promise.all([
          fetch(githubApi.repo, { signal: controller.signal }),
          fetch(githubApi.contributors, { signal: controller.signal }),
        ]);

        if (!repoResponse.ok || !contributorsResponse.ok) {
          throw new Error('GitHub API request failed');
        }

        setRepo(await repoResponse.json());
        setContributors(await contributorsResponse.json());
        setGithubError(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setGithubError(true);
        }
      }
    }

    loadGithubData();
    return () => controller.abort();
  }, []);

  const copyText = async (value) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      // Fall back to a hidden textarea below.
    }
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const didCopy = document.execCommand('copy');
    document.body.removeChild(textarea);
    return didCopy;
  };

  const handleCopyCommand = async (command) => {
    if (await copyText(command)) {
      setCopiedCommand(true);
      window.setTimeout(() => setCopiedCommand(false), 1800);
    }
  };

  const handleCopyWallet = async (value) => {
    if (await copyText(value)) {
      setCopiedWallet(true);
      window.setTimeout(() => setCopiedWallet(false), 1800);
    }
  };

  if (isSupportPage) {
    return <SupportPage onCopyWallet={handleCopyWallet} copiedWallet={copiedWallet} />;
  }

  return (
    <>
      <Header t={t} onToggle={() => setLang(lang === 'vi' ? 'en' : 'vi')} />
      <main>
        <section className="hero" id="overview">
          <div className="hero-inner">
            <a className="upgrade-notice" href="#ota">{t.upgradeNotice} →</a>
            <p className="badge">{t.heroBadge}</p>
            <h1>{t.heroTitle}</h1>
            <p className="hero-lead">{t.heroLead}</p>
            <div className="actions">
              <a className="button primary" href={links.download} target="_blank" rel="noopener noreferrer">{t.download}</a>
              <a className="button" href="#features">{t.featuresCta}</a>
              <a className="button" href={links.repo}>{t.source}</a>
              <a className="button" href={links.facebook}>{t.community}</a>
              <a className="button support-button" href="/support">{t.supportPage}</a>
            </div>
            <div className="stats">{liveStats.map((value, i) => <div key={t.statLabels[i]}><strong>{value}</strong><span>{t.statLabels[i]}</span></div>)}</div>
          </div>
          <BannerStack t={t} variant="hero" />
        </section>

        <FeatureSection t={t} />

        <StatsSection t={t} />

        <CardSection title={t.extrasTitle} items={t.extras} />

        <section className="support-section" id="support">
          <div className="support-copy">
            <p className="badge">Unikorn · clap support</p>
            <h2>{t.supportTitle}</h2>
            <p>{t.supportLead}</p>
            <a className="button primary" href={links.unikorn} target="_blank" rel="noopener noreferrer">{t.supportAction}</a>
          </div>
          <div className="unikorn-badges" aria-label="CaramOS Unikorn badges">
            <a href={links.unikorn} target="_blank" rel="noopener noreferrer">
              <img src="https://unikorn.vn/api/widgets/badge/caramos?theme=light" alt="CaramOS trên Unikorn.vn" width="256" height="64" loading="lazy" />
            </a>
            <a href={links.unikorn} target="_blank" rel="noopener noreferrer">
              <img src="https://unikorn.vn/api/widgets/badge/caramos/rank?theme=light&type=daily" alt="CaramOS - Hàng ngày" width="250" height="64" loading="lazy" />
            </a>
            <a href={links.unikorn} target="_blank" rel="noopener noreferrer">
              <img src="https://unikorn.vn/api/widgets/badge/caramos/rank?theme=light&type=weekly" alt="CaramOS - Hàng tuần" width="250" height="64" loading="lazy" />
            </a>
            <a href={links.unikorn} target="_blank" rel="noopener noreferrer">
              <img src="https://unikorn.vn/api/widgets/badge/caramos/rank?theme=light&type=monthly" alt="CaramOS - Hàng tháng" width="250" height="64" loading="lazy" />
            </a>
            <span>{t.supportMeta}</span>
          </div>
        </section>

        <section className="ota-section" id="ota">
          <ol className="ota-visual-stack" aria-label={t.otaFlowLabel}>
            {t.otaFlow.map(([src, alt, caption]) => <li className="ota-visual" key={src}>
              <p>{caption}</p>
              <img src={src} alt={alt} width="720" loading="lazy" decoding="async" />
            </li>)}
          </ol>
          <div className="ota-copy">
            <p className="badge">{t.otaBadge}</p>
            <h2>{t.otaTitle}</h2>
            <p>{t.otaLead}</p>
            <div className="ota-command-grid">
              <div className="install-command-card">
                <strong>{t.otaInstallLabel}</strong>
                <div className="command-row">
                  <code>{installCommand}</code>
                  <button type="button" onClick={() => handleCopyCommand(installCommand)} aria-label={t.otaCopyInstallLabel}>{t.otaCopy}</button>
                </div>
                <small>{t.otaInstallHint}</small>
              </div>
              <div className="install-command-card upgrade-command-card">
                <strong>{t.otaUpgradeLabel}</strong>
                <div className="command-row">
                  <code>{upgradeCommand}</code>
                  <button type="button" onClick={() => handleCopyCommand(upgradeCommand)} aria-label={t.otaCopyUpgradeLabel}>{t.otaCopy}</button>
                </div>
                <small>{t.otaUpgradeHint}</small>
              </div>
            </div>
            <div className="ota-steps">
              {t.otaSteps.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><p>{text}</p></article>)}
            </div>

          </div>
        </section>

        {copiedCommand && <div className="copy-toast" role="status" aria-live="polite">✓ {t.otaCopied}</div>}

        <ReleaseNotesSection t={t} />

        <section className="wide-section" id="ecosystem">
          <div className="section-title"><h2>{t.ecosystemTitle}</h2><p>{t.ecosystemLead}</p></div>
          <div className="ecosystem-grid">
            {t.ecosystem.map(([icon, name, desc, meta, status, url]) => <EcosystemCard key={name} icon={icon} name={name} desc={desc} meta={meta} status={status} url={url} />)}
          </div>
        </section>

        <section className="wide-section open-source" id="opensource">
          <div className="section-title"><h2>{t.openSourceTitle}</h2><p>{t.openSourceLead}</p></div>
          <div className="info-grid">{t.openSource.map(([title, text]) => <InfoCard key={title} title={title} text={text} />)}</div>
        </section>

        <section className="wide-section contributors-section" id="contributors">
          <div className="section-title"><h2>{t.contributorsTitle}</h2><p>{t.contributorsLead}</p></div>
          {githubError && <p className="github-warning">{t.contributorsFallback}</p>}
          <div className="contributors-grid">
            {contributors.map((person) => <ContributorCard key={person.id} person={person} />)}
          </div>
        </section>

        <section className="build-section">
          <div><p className="badge">extract → customize → OTA bootstrap → repack</p><h2>{t.buildTitle}</h2><p>{t.buildLead}</p></div>
          <pre>{`make build                      # dev ISO, lz4\nmake release VERSION=x.y.z      # release ISO, xz\nmake docker-build               # containerized build\nmake debug-iso                  # boot branding diagnostics`}</pre>
        </section>

        <section className="gallery">
          <div className="section-title"><h2>{t.galleryTitle}</h2></div>
          <div className="gallery-grid">
            {t.gallery.map(([src, alt, caption]) => <figure key={src}><img src={src} alt={alt} loading="lazy" decoding="async" /><figcaption>{caption}</figcaption></figure>)}
          </div>
        </section>

        <section className="download" id="download">
          <BannerStack t={t} variant="download" />
          <div>
            <h2>{t.downloadTitle}</h2>
            <p>{t.downloadLead}</p>
            <ul className="requirements">{t.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="actions download-actions">
              <a className="button primary" href={links.download} target="_blank" rel="noopener noreferrer">{t.downloadButton}</a>
              <a className="button" href={links.checksums} target="_blank" rel="noopener noreferrer">{t.checksums}</a>
              <a className="button" href={links.release} target="_blank" rel="noopener noreferrer">{t.releaseDetails}</a>
            </div>
          </div>
        </section>
      </main>
      <footer><div><img src="/assets/CaramOS_logo.png" alt="" /><strong>CaramOS</strong></div><p>{t.footer}</p><a href={links.vnlf}>vietnamlinuxfamily.net</a></footer>
    </>
  );
}

function BannerStack({ t, variant }) {
  const [reversed, setReversed] = useState(false);

  return <button
    type="button"
    className={`banner-stack banner-stack-${variant}${reversed ? ' is-reversed' : ''}`}
    onClick={() => setReversed((current) => !current)}
    aria-label={t.bannerStackLabel}
    aria-pressed={reversed}
  >
    {banners.map(([src, altKey], index) => <img
      key={src}
      className={`banner-image banner-image-${index + 1}`}
      src={src}
      alt={t[altKey]}
      width="1600"
      height="1000"
      loading={variant === 'hero' && index === 0 ? 'eager' : 'lazy'}
      decoding="async"
    />)}
  </button>;
}

function SupportPage({ onCopyWallet, copiedWallet }) {
  const usdtWallet = 'TCUujuiz26P26oAbuECvqpHUnd2sWudv2G';

  useEffect(() => {
    document.documentElement.lang = 'vi';
    document.title = 'Donate cho CaramOS — Vietnam Linux Family';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Donate cho CaramOS qua MoMo, PayPal, Ko-fi, Buy Me a Coffee hoặc USDT TRC20.');
  }, []);

  const donationCards = [
    ['paypal', 'PayPal', '', 'paypal.me/mrd900', 'Donate via PayPal', 'https://paypal.me/mrd900'],
    ['kofi', 'Ko-fi', '0% fee', 'ko-fi.com/mrd900', 'Support on Ko-fi', 'https://ko-fi.com/mrd900'],
    ['coffee', 'Buy Me a Coffee', '', 'buymeacoffee.com/mrd900', 'Buy a Coffee', 'https://buymeacoffee.com/mrd900'],
  ];

  return <div className="support-page">
    <header className="support-page-nav">
      <a className="brand" href="/"><img src="/assets/CaramOS_logo.png" alt="CaramOS" /><span>CaramOS</span></a>
      <a className="button" href="/">Về trang chủ</a>
    </header>
    <main className="support-page-main">
      <section className="support-page-hero">
        <span className="badge">Donate</span>
        <h1>Fund the Future of CaramOS</h1>
        <p>CaramOS miễn phí và luôn hướng đến cộng đồng. Sự ủng hộ của bạn giúp chúng tôi duy trì hạ tầng, thử nghiệm ISO, cải thiện tính năng, viết tài liệu và giữ dự án sống lâu dài. Dù nhỏ hay lớn, mọi đóng góp đều rất đáng quý!</p>
      </section>

      <section className="featured-donation momo-donation">
        <div className="featured-info">
          <div className="donation-icon-row">
            <DonationIcon name="momo" />
            <div><h2>MoMo</h2><p>Accepts transfers from <strong>all Vietnamese banks</strong></p></div>
          </div>
          <p className="featured-recipient">Recipient: <strong>Lê Viết Dũng</strong></p>
          <a className="donation-card-btn" href="https://nhantien.momo.vn/0947287893" target="_blank" rel="noopener noreferrer">♥ Donate via MoMo</a>
        </div>
        <div className="donation-qr-box">
          <img src="/assets/support/momo-vietqr.png" alt="MoMo VietQR Code" width="180" height="191" loading="lazy" />
          <span>Scan with MoMo or any banking app</span>
        </div>
      </section>

      <section className="donation-grid" aria-label="Online donation methods">
        {donationCards.map(([icon, title, fee, address, action, url]) => <article className="donation-card" key={title}>
          <div className="donation-icon-row">
            <DonationIcon name={icon} />
            <div><h2>{title}</h2>{fee && <p>{fee}</p>}</div>
          </div>
          <p className="donation-link"><code>{address}</code></p>
          <a className="donation-card-btn" href={url} target="_blank" rel="noopener noreferrer">{action}</a>
        </article>)}
      </section>

      <section className="featured-donation">
        <div className="featured-info">
          <div className="donation-icon-row">
            <DonationIcon name="usdt" />
            <div><h2>USDT (TRC20)</h2><p>Network: Tron TRC20</p></div>
          </div>
          <div className="crypto-address"><code>{usdtWallet}</code><button type="button" onClick={() => onCopyWallet(usdtWallet)}>{copiedWallet ? 'Copied' : 'Copy'}</button></div>
        </div>
        <div className="donation-qr-box">
          <img src="/assets/support/usdt-trc20-qr.png" alt="USDT TRC20 Wallet QR Code" width="180" height="180" loading="lazy" />
          <span>Scan with your crypto wallet</span>
        </div>
      </section>

      <section className="support-thanks">
        <h2>Cảm ơn bạn đã ủng hộ!</h2>
        <p>Dù bạn donate, chia sẻ dự án hay tham gia hỗ trợ người dùng mới, sự đồng hành của bạn đều giúp CaramOS và cộng đồng VNLF phát triển tốt hơn.</p>
        <a className="button primary" href={links.discord} target="_blank" rel="noopener noreferrer">Tham gia Discord Community</a>
      </section>
    </main>
  </div>;
}

function DonationIcon({ name }) {
  const icons = {
    paypal: <><rect width="36" height="36" rx="8" fill="#003087" /><path d="M14 10H20C22.5 10 24 11.5 24 14C24 16.5 22.5 18 20 18H17L16 26H12L14 10Z" fill="#fff" /><path d="M16 12H21C23 12 24.5 13.2 24.5 15.5C24.5 17.8 23 19 21 19H18.5L17.5 26" stroke="#009cde" strokeWidth="1.5" fill="none" /></>,
    kofi: <><rect width="36" height="36" rx="8" fill="#72B3EB" /><rect x="7" y="12" width="17" height="14" rx="4" fill="white" stroke="#1A1A1A" strokeWidth="2" /><path d="M24 15H26C27.7 15 29 16.3 29 18C29 19.7 27.7 21 26 21H24" stroke="#1A1A1A" strokeWidth="2" fill="white" /><path d="M18.5 16.3C18.1 15.7 17.4 15.3 16.6 15.3C15.3 15.3 14.2 16.4 14.2 17.7C14.2 20.3 15.5 21 15.5 21L18.5 23.5L21.5 21C21.5 21 22.8 20.3 22.8 17.7C22.8 16.4 21.7 15.3 20.4 15.3C19.6 15.3 18.9 15.7 18.5 16.3Z" fill="#EF5A29" /></>,
    coffee: <><rect width="36" height="36" rx="8" fill="#FFDD00" /><ellipse cx="18" cy="10" rx="6" ry="2" stroke="#0D1117" strokeWidth="2.2" fill="none" /><path d="M14 10C14 8 16 7 18 8C20 9 22 8 22 10" stroke="#0D1117" strokeWidth="2.2" strokeLinecap="round" fill="none" /><path d="M12 13L13.5 28H22.5L24 13" stroke="#0D1117" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M14 19L14.5 27H21.5L22 19C20 18 16 18 14 19Z" fill="white" /></>,
    usdt: <><rect width="36" height="36" rx="8" fill="#26A17B" /><path d="M11 12H25" stroke="white" strokeWidth="2.5" strokeLinecap="round" /><path d="M18 12V27" stroke="white" strokeWidth="2.5" strokeLinecap="round" /><ellipse cx="18" cy="18" rx="6" ry="2" stroke="white" strokeWidth="1.5" fill="none" /></>,
    momo: <><rect width="36" height="36" rx="8" fill="#A50064" /><path d="M5 17V12C5 9.5 6.5 8 8.2 8C9.9 8 10.5 9.5 10.5 11V17" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><path d="M10.5 17V12C10.5 9.5 12 8 13.7 8C15.4 8 16 9.5 16 11V17" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><circle cx="24" cy="12.5" r="4.5" stroke="white" strokeWidth="2.2" fill="none" /><path d="M5 29V24C5 21.5 6.5 20 8.2 20C9.9 20 10.5 21.5 10.5 23V29" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><path d="M10.5 29V24C10.5 21.5 12 8 13.7 20C15.4 20 16 21.5 16 23V29" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" /><circle cx="24" cy="24.5" r="4.5" stroke="white" strokeWidth="2.2" fill="none" /></>,
  };

  return <svg className="donation-icon" viewBox="0 0 36 36" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">{icons[name]}</svg>;
}

function Header({ t, onToggle }) {
  return <header className="topbar"><a className="brand" href="#overview"><img src="/assets/CaramOS_logo.png" alt="CaramOS" /><span>CaramOS</span></a><nav>{t.nav.map((item, i) => <a key={item} href={navTargets[i]}>{item}</a>)}<a className="nav-support" href="/support">{t.supportPage}</a></nav><button onClick={onToggle}>{t.language}</button></header>;
}

function FeatureSection({ t }) {
  return <section className="features" id="features">
    <div className="section-title"><h2>{t.featuresTitle}</h2><p>{t.featuresLead}</p></div>
    <div className="feature-list">
      {t.features.map((feature, index) => <FeatureRow key={feature.id} feature={feature} reverse={index % 2 === 1} />)}
    </div>
  </section>;
}

function FeatureRow({ feature, reverse }) {
  const { id, tag, title, lead, points, media, link, wide } = feature;
  const layout = wide ? ' is-wide' : reverse ? ' is-reverse' : '';
  return <article className={`feature-row${layout}`} id={`feature-${id}`}>
    <FeatureMedia media={media} />
    <div className="feature-copy">
      <div>
        <p className="feature-tag">{tag}</p>
        <h3>{title}</h3>
        <p>{lead}</p>
        {link && <a className="feature-link" href={link[1]} {...(link[1].startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{link[0]} →</a>}
      </div>
      <ul className="feature-points">{points.map((point) => <li key={point}>{point}</li>)}</ul>
    </div>
  </article>;
}

function FeatureMedia({ media }) {
  const [src, alt] = media.main;
  if (media.type === 'pair') {
    return <div className="feature-media is-pair">
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      <img src={media.second[0]} alt={media.second[1]} loading="lazy" decoding="async" />
    </div>;
  }
  const main = <img className="media-main" src={src} alt={alt} loading="lazy" decoding="async" />;
  return <div className={`feature-media is-${media.type}`}>
    {media.phone ? <picture><source media="(max-width: 620px)" srcSet={media.phone} />{main}</picture> : main}
    {media.overlay && <img className="media-overlay" src={media.overlay[0]} alt={media.overlay[1]} loading="lazy" decoding="async" />}
  </div>;
}

function StatsSection({ t }) {
  return <section className="stats-section" aria-labelledby="stats-title">
    <div className="section-title"><h2 id="stats-title">{t.statsTitle}</h2><p>{t.statsLead}</p></div>
    <div className="stat-strip">
      {t.stats.map(([value, label, compare]) => <article className="stat-card" key={label}><strong>{value}</strong><span>{label}</span><small>{compare}</small></article>)}
    </div>
  </section>;
}

function ReleaseNotesSection({ t }) {
  const entries = [...t.releaseNotes, t.initialRelease];

  return <section className="release-notes" id="release-notes">
    <div className="section-title"><h2>{t.releaseNotesTitle}</h2><p>{t.releaseNotesLead}</p></div>
    <div className="release-scroll">
      <div className="release-list" role="region" aria-label={t.releaseListLabel} tabIndex={0}>
        {entries.map(([version, title, items], index) => <article key={version} className={`release-entry${index === 0 ? ' is-current' : ''}`}>
          <div className="release-version">{version}{index === 0 && <span className="release-badge">{t.releaseCurrent}</span>}</div>
          <div className="release-content"><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </article>)}
      </div>
    </div>
    <p className="release-hint">{t.releaseScrollHint}</p>
  </section>;
}

function CardSection({ title, lead, items }) {
  return <section className="wide-section extras-section"><div className="section-title"><h2>{title}</h2>{lead && <p>{lead}</p>}</div><div className="app-grid">{items.map(([icon, titleText, text, status]) => <AppCard key={titleText} icon={icon} title={titleText} text={text} status={status} />)}</div></section>;
}

function AppCard({ icon, title, text, status }) {
  return <article className="app-card"><div className="app-head"><span className="app-icon"><SvgIcon name={icon} /></span><div><h3>{title}</h3></div></div><p>{text}</p><div className="card-meta"><span>{status}</span></div></article>;
}

function EcosystemCard({ icon, name, desc, meta, status, url }) {
  return <a className="ecosystem-card" href={url}>
    <div className="ecosystem-icon"><SvgIcon name={icon} /></div>
    <div className="ecosystem-content"><h3>{name}</h3><p>{desc}</p><div><span>{meta}</span><strong>{status}</strong></div></div>
  </a>;
}

function SvgIcon({ name }) {
  const paths = {
    locale: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    keyboard: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M10 10h.01M13 10h.01M16 10h.01M7 14h10" /></>,
    browser: <><rect x="4" y="5" width="16" height="14" rx="3" /><path d="M4 9h16M8 13h3M8 16h7" /></>,
    document: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
    chat: <><path d="M5 6h14v9H9l-4 4z" /><path d="M8 10h8M8 13h5" /></>,
    palette: <><path d="M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 1.2-3.1 1.7 1.7 0 0 1 1.1-2.9H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z" /><path d="M7.5 10h.01M10 7h.01M14 7h.01M16.5 10h.01" /></>,
    camera: <><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
    control: <><rect x="4" y="5" width="16" height="14" rx="3" /><path d="M8 9h8M8 15h8M11 7v4M15 13v4" /></>,
    dock: <><rect x="3" y="7" width="18" height="10" rx="3" /><path d="M8 11h.01M12 11h.01M16 11h.01M10 15h4" /></>,
    cleanup: <><path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" /><path d="M10 11v5M14 11v5" /></>,
    terminal: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="m8 10 3 2-3 2M13 15h4" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-5" /></>,
    website: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    telegram: <><path d="M21 4 3 11l7 2 2 7z" /><path d="m10 13 4 3 7-12" /></>,
    discord: <><path d="M7 8c3-2 7-2 10 0l1 8c-4 3-8 3-12 0z" /><path d="M9 15c2 1 4 1 6 0M9.5 12h.01M14.5 12h.01" /></>,
    facebook: <><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1z" /></>,
    apps: <><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></>,
    mirror: <><path d="M8 5h8v14H8z" /><path d="M5 8h3M16 8h3M5 16h3M16 16h3" /></>,
    github: <><path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.46.08.63-.2.63-.44v-1.55c-2.56.56-3.1-1.1-3.1-1.1-.42-1.06-1.02-1.34-1.02-1.34-.84-.57.06-.56.06-.56.93.07 1.42.96 1.42.96.82 1.4 2.15 1 2.68.76.08-.6.32-1 .58-1.23-2.04-.23-4.18-1.02-4.18-4.53 0-1 .36-1.82.95-2.46-.1-.23-.41-1.17.09-2.43 0 0 .78-.25 2.53.94A8.7 8.7 0 0 1 12 6.46c.78 0 1.56.1 2.29.31 1.75-1.19 2.52-.94 2.52-.94.5 1.26.19 2.2.1 2.43.59.64.94 1.46.94 2.46 0 3.52-2.15 4.3-4.2 4.52.33.28.62.84.62 1.7v2.52c0 .24.17.52.64.43A9.2 9.2 0 0 0 12 2.8z" /></>,
  };

  return <svg className="svg-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function InfoCard({ title, text }) {
  return <article className="info-card"><h3>{title}</h3><p>{text}</p></article>;
}

function ContributorCard({ person }) {
  return <a className="contributor-card" href={person.html_url} aria-label={`View ${person.login} on GitHub`}>
    <img src={person.avatar_url} alt={person.login} loading="lazy" />
    <div><strong>{person.login}</strong><span>{person.contributions} commits</span></div>
  </a>;
}

createRoot(document.getElementById('root')).render(<App />);
