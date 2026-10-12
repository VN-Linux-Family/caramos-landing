import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const links = {
  download: 'https://github.com/VN-Linux-Family/CaramOS/releases',
  release: 'https://github.com/VN-Linux-Family/CaramOS/releases/tag/v1.0.18',
  checksums: 'https://github.com/VN-Linux-Family/CaramOS/releases/download/v1.0.18/SHA256SUMS',
  repo: 'https://github.com/VN-Linux-Family/CaramOS',
  org: 'https://github.com/VN-Linux-Family',
  vnlf: 'https://vietnamlinuxfamily.net',
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

const banners = [
  ['/assets/banner-1.jpg', 'bannerOneAlt'],
  ['/assets/banner-2.jpg', 'bannerTwoAlt'],
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

const copy = {
  vi: {
    language: 'EN',
    nav: ['Tổng quan', 'Nâng cấp CaramOS', 'Release note', 'Hệ sinh thái', 'Open source', 'Tải ISO'],
    heroBadge: 'Open Beta 1.0.18 · Linux Mint 22.3 Cinnamon · GPL-3.0',
    upgradeNotice: 'Nâng cấp CaramOS lên 1.0.18',
    seoTitle: 'CaramOS — bản phân phối Linux cho người dùng Việt Nam',
    seoDescription: 'CaramOS là bản phân phối Linux dựa trên Linux Mint 22.3 Cinnamon và Ubuntu 24.04 LTS, có mặc định tiếng Việt, Fcitx5/Lotus, cập nhật OTA và quy trình build ISO mã nguồn mở.',
    heroTitle: 'CaramOS — bản phân phối Linux cho người dùng Việt Nam',
    heroLead:
      'CaramOS dựa trên Linux Mint 22.3 Cinnamon và Ubuntu 24.04 LTS, được tinh chỉnh cho người dùng Việt với mặc định tiếng Việt, bộ gõ Fcitx5/Lotus, cập nhật OTA và quy trình build ISO công khai.',
    download: 'Tải ISO',
    checksums: 'Kiểm tra SHA256',
    releaseDetails: 'Chi tiết phát hành',
    bannerOneAlt: 'Desktop CaramOS với ứng dụng Hình nền và Control Center',
    bannerTwoAlt: 'Desktop CaramOS với Terminal hiển thị thông tin hệ thống',
    bannerStackLabel: 'Đổi giữa hai ảnh chụp desktop CaramOS',
    otaBadge: 'Trung tâm cập nhật CaramOS',
    otaVisualAlt: 'Giao diện Trung tâm cập nhật CaramOS',
    otaMenuVisualAlt: 'Tìm Trung tâm cập nhật CaramOS từ Start Menu',
    otaMenuVisualHint: 'Tìm “Trung tâm cập nhật CaramOS” từ Start Menu sau khi cài.',
    source: 'Mã nguồn',
    community: 'Cộng đồng',
    supportPage: 'Donate',
    statLabels: ['Stars', 'Forks', 'Issues', 'License'],
    contributorsTitle: 'Contributors',
    contributorsLead: 'Danh sách contributors được lấy trực tiếp từ GitHub repository của CaramOS.',
    contributorsFallback: 'Không tải được dữ liệu contributors từ GitHub. Vui lòng xem danh sách mới nhất trên GitHub.',
    sectionOverview: 'Trải nghiệm chính',
    overviewLead: 'CaramOS tập trung vào trải nghiệm Linux thân thiện cho người Việt: nền tảng Mint/Cinnamon ổn định, bản địa hóa tiếng Việt, bộ gõ sẵn sàng, cập nhật OTA và phát triển mã nguồn mở.',
    ecosystemTitle: 'Hệ sinh thái VNLF',
    ecosystemLead:
      'Các kênh và tài nguyên chính thức của Vietnam Linux Family phục vụ trao đổi cộng đồng, phân phối nội dung và phát triển dự án.',
    openSourceTitle: 'Thông tin dự án mã nguồn mở',
    openSourceLead:
      'CaramOS được phát triển công khai trên GitHub với giấy phép GPL-3.0, tài liệu đóng góp, quy tắc ứng xử và quy trình build/OTA được mô tả rõ ràng.',
    buildTitle: 'Quy trình build ISO',
    buildLead:
      'Build flow sử dụng phương pháp ISO remaster: giải nén ISO gốc, tùy biến root filesystem bằng packages, overlay và hooks, sau đó đóng gói lại bằng squashfs và xorriso.',
    otaTitle: 'Nâng cấp CaramOS không cần cài lại ISO',
    otaLead:
      'Máy đang ở CaramOS 1.0.1 cần chạy installer một lần để cài Trung tâm cập nhật và nguồn OTA. Máy đã cài Trung tâm cập nhật có thể chờ tác vụ hằng ngày chạy vào ngày hôm sau, hoặc dùng lệnh bên dưới để nâng cấp ngay.',
    otaInstallLabel: 'Máy CaramOS 1.0.1 hoặc chưa có Trung tâm cập nhật:',
    otaInstallHint: 'Chạy installer một lần. Sau đó bạn có thể mở “Trung tâm cập nhật CaramOS” từ Start Menu.',
    otaUpgradeLabel: 'Máy đã cài Trung tâm cập nhật và muốn nâng cấp ngay:',
    otaUpgradeHint: 'Nếu không cần cập nhật ngay, hãy chờ tác vụ hằng ngày chạy vào ngày hôm sau.',
    otaCopy: 'Copy lệnh',
    otaCopyInstallLabel: 'Copy lệnh cài Trung tâm cập nhật',
    otaCopyUpgradeLabel: 'Copy lệnh nâng cấp ngay',
    otaCopied: 'Đã copy',
    otaSteps: [
      ['Máy 1.0.1 chạy installer', 'Cài Trung tâm cập nhật và nguồn OTA bằng lệnh installer một lần duy nhất.'],
      ['Máy đã cài có thể chờ', 'Tác vụ hằng ngày sẽ kiểm tra bản mới vào ngày hôm sau.'],
      ['Nâng cấp ngay nếu cần', 'Chạy sudo caramos-ota --upgrade --yes trong Terminal để cập nhật ngay.'],
    ],
    releaseNotesTitle: 'Release note CaramOS Open Beta',
    releaseNotesLead:
      'Beta 1.0.1 là bản phát hành đầu tiên của CaramOS. Các mốc sau đây ghi lại những thay đổi đáng chú ý trong chuỗi cập nhật đến 1.0.18.',
    initialRelease: ['1.0.1', 'Phát hành đầu tiên', ['Bản Open Beta đầu tiên của CaramOS dành cho người dùng Việt Nam.', 'Cung cấp nền tảng Linux Mint 22.3 Cinnamon với cấu hình tiếng Việt, branding CaramOS và bộ ứng dụng cơ bản.']],
    releaseNotes: [
      ['1.0.18', 'Chế độ tối, Chế độ nguồn và Zalo mới', ['Thêm ô Chế độ tối vào Control Center: chuyển cả hệ thống sang giao diện tối Cinnamon-Delight-Dark cùng tông màu CaramOS; hình nền mặc định tự đổi giữa Sage Mist và Indigo Night.', 'Thay TLP bằng power-profiles-daemon và thêm ô Chế độ nguồn với ba mức Hiệu năng, Cân bằng và Tiết kiệm pin.', 'Cập nhật Zalo lên 26.10.10 từ kho VN-Linux-Family/zalo-for-linux; máy đã cài được thay Zalo qua OTA, giữ nguyên dữ liệu người dùng.', 'Trả quyền root cho các file hệ thống trong /etc và /usr bị gán cho tài khoản người dùng, và sửa thông báo mời nâng cấp Linux Mint sai trong Báo cáo hệ thống.']],
      ['1.0.16', 'Ghim ứng dụng và dọn Desktop CaramOS', ['Ghim Zalo và Trình quản lý phần mềm vào taskbar Cinnamon khi ứng dụng đã được cài.', 'Giữ WPS Office trên taskbar.', 'Gỡ shortcut mặc định của WPS Office, Zalo và Trình quản lý phần mềm khỏi Desktop nhưng giữ file đã được người dùng tùy chỉnh.']],
      ['1.0.15', 'Bộ hình nền CaramOS mới', ['Cài năm hình nền CaramOS độ phân giải 2048×1152.', 'Buộc Sage Mist làm hình nền cho mọi desktop user và màn hình đăng nhập qua đường dẫn ổn định default.png.', 'Thay bộ sưu tập Linux Mint trong Cinnamon Backgrounds bằng bộ sưu tập CaramOS.']],
      ['1.0.14', 'Taskbar ba dock cho CaramOS', ['Tách taskbar dưới màn hình thành ba dock trái, giữa và phải với khoảng cách đồng đều.', 'Đưa Start Menu CaramOS sang dock trái, ứng dụng ghim/đang chạy sang dock giữa và applet trạng thái sang dock phải.', 'Hiển thị chấm màu CaramOS dưới icon của ứng dụng đang chạy.']],
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
    downloadTitle: 'Tải CaramOS Open Beta 1.0.18',
    downloadLead:
      'ISO 1.0.18 và SHA256SUMS được cung cấp qua GitHub Releases. Hãy kiểm tra checksum và thử live session trong máy ảo hoặc USB trước khi cài lên máy thật; máy đã cài có thể dùng OTA để lên 1.0.18.',
    supportTitle: 'CaramOS trên Unikorn',
    supportLead:
      'Nếu bạn thấy CaramOS hữu ích, hãy clap trên Unikorn để tiếp thêm động lực cho team và giúp dự án tiếp cận nhiều người dùng Việt Nam hơn.',
    supportAction: 'Clap cho CaramOS',
    supportMeta: 'Mỗi lượt clap và badge xếp hạng giúp CaramOS nổi bật hơn trong cộng đồng mã nguồn mở Việt Nam.',
    footer: 'CaramOS là dự án thuộc hệ sinh thái Vietnam Linux Family.',
    features: [
      ['control', 'Control Center', 'Trung tâm thao tác nhanh thay applet mạng, âm thanh và pin mặc định, có thêm Chế độ tối và Chế độ nguồn.', 'Desktop'],
      ['dock', 'Taskbar ba dock', 'Start Menu ở dock trái, ứng dụng ghim/đang chạy ở giữa và applet trạng thái ở dock phải.', 'Desktop'],
      ['palette', 'Bộ hình nền CaramOS', 'Năm hình nền 2048×1152: Sage Mist là mặc định, Indigo Night dùng khi bật Chế độ tối.', 'Branding'],
      ['cleanup', 'Migration an toàn', 'Dọn shortcut mặc định khỏi Desktop nhưng giữ nguyên file đã được người dùng tùy chỉnh.', 'OTA'],
      ['locale', 'Vietnamese locale', 'Thiết lập ngôn ngữ, timezone Asia/Ho_Chi_Minh và font tiếng Việt mặc định.', 'Config'],
      ['keyboard', 'Input method', 'Fcitx5 và Lotus được đưa vào ISO để hỗ trợ nhập liệu tiếng Việt.', 'Package'],
      ['chat', 'Ứng dụng phổ biến', 'Zalo, WPS Office và Trình quản lý phần mềm được ghim vào taskbar khi đã cài.', 'Desktop'],
      ['shield', 'Base system', 'Nền tảng Linux Mint 22.3 Cinnamon trên Ubuntu 24.04 LTS.', 'Base'],
    ],
    ecosystem: [
      ['website', 'Website', 'Trang chủ, bài viết kỹ thuật và tài nguyên chính thức của VNLF.', 'vietnamlinuxfamily.net', 'Official', links.vnlf],
      ['telegram', 'Telegram', 'Kênh trao đổi nhanh cho thông báo và thảo luận cộng đồng.', 't.me/vietnamlinuxfamily', 'Community', links.telegram],
      ['discord', 'Discord', 'Không gian thảo luận theo kênh, phù hợp cho hỗ trợ kỹ thuật và phối hợp dự án.', 'discord.gg/gVAJDUMC2n', 'Community', links.discord],
      ['facebook', 'Facebook', 'Nhóm cộng đồng dành cho hỏi đáp, chia sẻ kinh nghiệm và cập nhật hoạt động.', 'facebook.com/groups/vietnamlinuxcommunity', 'Community', links.facebook],
      ['apps', 'Apps', 'VNLF App Explorer, danh mục ứng dụng Linux được trình bày bằng tiếng Việt.', 'GitHub: apps-vietnamlinuxfamily', 'Apps', links.appExplorer],
      ['mirror', 'Mirror', 'Repository hạ tầng cho mirror và phân phối tài nguyên của hệ sinh thái VNLF.', 'GitHub: mirror', 'Infra', links.mirror],
    ],
    openSource: [
      ['License', 'Dự án sử dụng GNU General Public License v3.0.'],
      ['Contribution guide', 'CONTRIBUTING.md mô tả kiến trúc, workflow build, quy ước nhánh và cách gửi thay đổi.'],
      ['Code of conduct', 'CODE_OF_CONDUCT.md dựa trên Contributor Covenant 2.1.'],
      ['Issue tracking', 'GitHub Issues được dùng để theo dõi lỗi, yêu cầu tính năng và công việc cần xử lý.'],
      ['Release workflow', 'GitHub Actions build ISO từ tag phát hành và xuất checksum cho artifact.'],
      ['Build process', 'Quy trình extract, customize và repack được tách thành script để kiểm tra và bảo trì độc lập.'],
    ],
  },
  en: {
    language: 'VI',
    nav: ['Overview', 'Upgrade CaramOS', 'Release notes', 'Ecosystem', 'Open source', 'Download'],
    heroBadge: 'Open Beta 1.0.18 · Linux Mint 22.3 Cinnamon · GPL-3.0',
    upgradeNotice: 'Upgrade CaramOS to 1.0.18',
    seoTitle: 'CaramOS — Linux distribution for Vietnamese users',
    seoDescription: 'CaramOS is a Linux distribution based on Linux Mint 22.3 Cinnamon and Ubuntu 24.04 LTS, with Vietnamese defaults, Fcitx5/Lotus input, OTA updates, and an open-source ISO build workflow.',
    heroTitle: 'CaramOS — a Linux distribution for Vietnamese users',
    heroLead:
      'CaramOS is based on Linux Mint 22.3 Cinnamon and Ubuntu 24.04 LTS, tuned for Vietnamese users with Vietnamese defaults, Fcitx5/Lotus input, OTA updates, and a public ISO build workflow.',
    download: 'Download ISO',
    checksums: 'Verify SHA256',
    releaseDetails: 'Release details',
    bannerOneAlt: 'CaramOS desktop with Wallpapers and Control Center',
    bannerTwoAlt: 'CaramOS desktop with Terminal showing system information',
    bannerStackLabel: 'Switch between two CaramOS desktop screenshots',
    otaBadge: 'CaramOS Update Center',
    otaVisualAlt: 'CaramOS Update Center interface',
    otaMenuVisualAlt: 'Finding CaramOS Update Center from the Start Menu',
    otaMenuVisualHint: 'Find “CaramOS Update Center” from the Start Menu after installation.',
    source: 'Source code',
    community: 'Community',
    supportPage: 'Donate',
    statLabels: ['Stars', 'Forks', 'Issues', 'License'],
    contributorsTitle: 'Contributors',
    contributorsLead: 'The contributor list is loaded directly from the CaramOS GitHub repository.',
    contributorsFallback: 'Could not load contributor data from GitHub. Please view the latest list on GitHub.',
    sectionOverview: 'Core experience',
    overviewLead: 'CaramOS focuses on a practical Linux experience for Vietnamese users: a stable Mint/Cinnamon base, Vietnamese localization, ready-to-use input methods, OTA updates, and open-source development.',
    ecosystemTitle: 'VNLF ecosystem',
    ecosystemLead:
      'Official Vietnam Linux Family channels and resources for community discussion, content distribution, and project development.',
    openSourceTitle: 'Open-source project information',
    openSourceLead:
      'CaramOS is developed publicly on GitHub with GPL-3.0 licensing, contribution documentation, a code of conduct, and documented build/OTA workflows.',
    buildTitle: 'ISO build process',
    buildLead:
      'The build flow uses an ISO remaster method: extract the upstream ISO, customize the root filesystem with packages, overlays, and hooks, then repack it with squashfs and xorriso.',
    otaTitle: 'Upgrade CaramOS without reinstalling the ISO',
    otaLead:
      'Machines on CaramOS 1.0.1 should run the installer once to add CaramOS Update Center and the OTA source. Machines that already have Update Center can wait for the daily task on the next day, or use the command below to upgrade immediately.',
    otaInstallLabel: 'CaramOS 1.0.1 or a machine without Update Center:',
    otaInstallHint: 'Run the installer once. You can then open “CaramOS Update Center” from the Start Menu.',
    otaUpgradeLabel: 'Already has Update Center and wants to upgrade now:',
    otaUpgradeHint: 'If an immediate update is not needed, wait for the daily task to run on the next day.',
    otaCopy: 'Copy command',
    otaCopyInstallLabel: 'Copy Update Center installer command',
    otaCopyUpgradeLabel: 'Copy immediate upgrade command',
    otaCopied: 'Copied',
    otaSteps: [
      ['Run installer on 1.0.1', 'Install CaramOS Update Center and the OTA source once with the installer command.'],
      ['Installed machines can wait', 'The daily task will check for a new release on the next day.'],
      ['Upgrade immediately', 'Run sudo caramos-ota --upgrade --yes in Terminal to update now.'],
    ],
    releaseNotesTitle: 'CaramOS Open Beta release notes',
    releaseNotesLead:
      'Beta 1.0.1 was the first CaramOS release. The milestones below summarize notable changes through 1.0.18.',
    initialRelease: ['1.0.1', 'First release', ['The first CaramOS Open Beta for Vietnamese users.', 'Provided a Linux Mint 22.3 Cinnamon base with Vietnamese defaults, CaramOS branding, and essential applications.']],
    releaseNotes: [
      ['1.0.18', 'Dark mode, power mode, and a new Zalo', ['Add a Dark mode tile to Control Center: switch the whole system to the Cinnamon-Delight-Dark theme in CaramOS colours; the default wallpaper follows between Sage Mist and Indigo Night.', 'Replace TLP with power-profiles-daemon and add a Power mode tile with Performance, Balanced, and Power saver.', 'Update Zalo to 26.10.10 from the VN-Linux-Family/zalo-for-linux repository; installed systems get the new Zalo through OTA with user data kept.', 'Return system files in /etc and /usr that were owned by a user account to root, and stop System Reports from offering a wrong Linux Mint upgrade.']],
      ['1.0.16', 'Taskbar pins and desktop cleanup', ['Pin Zalo and Software Manager to the Cinnamon taskbar when installed.', 'Keep WPS Office pinned to the taskbar.', 'Remove stock WPS Office, Zalo, and Software Manager shortcuts from the desktop while preserving user-modified files.']],
      ['1.0.15', 'New CaramOS wallpapers', ['Install five 2048×1152 CaramOS wallpapers.', 'Force Sage Mist as the wallpaper for every desktop user and the login screen through the stable default.png path.', 'Replace the Linux Mint collection in Cinnamon Backgrounds with the CaramOS collection.']],
      ['1.0.14', 'Three-dock taskbar for CaramOS', ['Split the bottom Cinnamon taskbar into evenly spaced left, center, and right docks.', 'Place the CaramOS Start Menu on the left, pinned/running apps in the center, and status applets on the right.', 'Show a CaramOS-colored dot below running application icons.']],
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
    downloadTitle: 'Download CaramOS Open Beta 1.0.18',
    downloadLead:
      'The 1.0.18 ISO and SHA256SUMS are available through GitHub Releases. Verify the checksum and test the live session in a VM or from USB before installing; existing systems can use OTA to reach 1.0.18.',
    supportTitle: 'CaramOS on Unikorn',
    supportLead:
      'If CaramOS is useful to you, clap for the project on Unikorn to encourage the team and help it reach more Vietnamese Linux users.',
    supportAction: 'Clap for CaramOS',
    supportMeta: 'Every clap and ranking badge helps CaramOS stand out in the Vietnamese open-source community.',
    footer: 'CaramOS is part of the Vietnam Linux Family ecosystem.',
    features: [
      ['control', 'Control Center', 'Quick controls replace the stock network, sound, and power applets, with Dark mode and Power mode built in.', 'Desktop'],
      ['dock', 'Three-dock taskbar', 'Start Menu sits on the left, pinned/running apps in the center, and status applets on the right.', 'Desktop'],
      ['palette', 'CaramOS wallpapers', 'Five 2048×1152 wallpapers: Sage Mist by default, Indigo Night in Dark mode.', 'Branding'],
      ['cleanup', 'Safe migration', 'Stock Desktop shortcuts are removed while user-modified files remain untouched.', 'OTA'],
      ['locale', 'Vietnamese locale', 'Default Vietnamese language, Asia/Ho_Chi_Minh timezone, and Vietnamese font configuration.', 'Config'],
      ['keyboard', 'Input method', 'Fcitx5 and Lotus are included in the ISO for Vietnamese text input.', 'Package'],
      ['chat', 'Popular applications', 'Zalo, WPS Office, and Software Manager are pinned to the taskbar when installed.', 'Desktop'],
      ['shield', 'Base system', 'Linux Mint 22.3 Cinnamon based on Ubuntu 24.04 LTS.', 'Base'],
    ],
    ecosystem: [
      ['website', 'Website', 'Official VNLF homepage, technical articles, and project resources.', 'vietnamlinuxfamily.net', 'Official', links.vnlf],
      ['telegram', 'Telegram', 'Realtime channel for announcements and community discussion.', 't.me/vietnamlinuxfamily', 'Community', links.telegram],
      ['discord', 'Discord', 'Channel-based discussion space for technical support and project coordination.', 'discord.gg/gVAJDUMC2n', 'Community', links.discord],
      ['facebook', 'Facebook', 'Community group for Q&A, experience sharing, and activity updates.', 'facebook.com/groups/vietnamlinuxcommunity', 'Community', links.facebook],
      ['apps', 'Apps', 'VNLF App Explorer, a Vietnamese-language Linux application directory.', 'GitHub: apps-vietnamlinuxfamily', 'Apps', links.appExplorer],
      ['mirror', 'Mirror', 'Infrastructure repository for mirror and resource distribution in the VNLF ecosystem.', 'GitHub: mirror', 'Infra', links.mirror],
    ],
    openSource: [
      ['License', 'The project uses the GNU General Public License v3.0.'],
      ['Contribution guide', 'CONTRIBUTING.md documents architecture, build workflow, branch conventions, and change submission.'],
      ['Code of conduct', 'CODE_OF_CONDUCT.md is based on Contributor Covenant 2.1.'],
      ['Issue tracking', 'GitHub Issues is used to track bugs, feature requests, and project work items.'],
      ['Release workflow', 'GitHub Actions builds ISO images from release tags and publishes checksums for artifacts.'],
      ['Build process', 'The extract, customize, and repack stages are split into scripts for independent validation and maintenance.'],
    ],
  },
};



function App() {
  const isSupportPage = window.location.pathname.replace(/\/$/, '') === '/support';
  const [lang, setLang] = useState(() => localStorage.getItem('caramos-language') || 'vi');
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
    localStorage.setItem('caramos-language', lang);
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

  const handleCopyCommand = async (command) => {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      const textarea = document.createElement('textarea');
      textarea.value = command;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.select();
      didCopy = document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    if (didCopy) {
      setCopiedCommand(true);
      window.setTimeout(() => setCopiedCommand(false), 1800);
    }
  };

  const handleCopyWallet = async (value) => {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.select();
      didCopy = document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    if (didCopy) {
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
              <a className="button" href={links.repo}>{t.source}</a>
              <a className="button" href={links.facebook}>{t.community}</a>
              <a className="button support-button" href="/support">{t.supportPage}</a>
            </div>
            <div className="stats">{liveStats.map((value, i) => <div key={t.statLabels[i]}><strong>{value}</strong><span>{t.statLabels[i]}</span></div>)}</div>
          </div>
          <BannerStack t={t} variant="hero" />
        </section>

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
          <div className="ota-visual-stack">
            <div className="ota-visual">
              <img src="/assets/caram-os-ota.png" alt={t.otaVisualAlt} loading="lazy" decoding="async" />
            </div>
            <div className="ota-menu-visual">
              <img src="/assets/caramos-ota-from-start-menu.png" alt={t.otaMenuVisualAlt} loading="lazy" decoding="async" />
              <span>{t.otaMenuVisualHint}</span>
            </div>
          </div>
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

        <CardSection title={t.sectionOverview} lead={t.overviewLead} items={t.features} />

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
          <div><p className="badge">extract → customize → repack</p><h2>{t.buildTitle}</h2><p>{t.buildLead}</p></div>
          <pre>{`make build          # dev ISO, lz4\nmake release        # release ISO, xz\nmake docker-build   # containerized build\nmake debug-iso      # boot branding diagnostics`}</pre>
        </section>

        <section className="screenshots">
          <img src="/assets/screenshots/01-grub-menu.png" alt="GRUB boot menu" />
          <img src="/assets/screenshots/02-startup-loading.png" alt="Startup screen" />
          <BannerStack t={t} variant="gallery" />
        </section>

        <section className="download" id="download">
          <BannerStack t={t} variant="download" />
          <div>
            <h2>{t.downloadTitle}</h2>
            <p>{t.downloadLead}</p>
            <div className="actions download-actions">
              <a className="button primary" href={links.download} target="_blank" rel="noopener noreferrer">{t.download}</a>
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
  return <header className="topbar"><a className="brand" href="#overview"><img src="/assets/CaramOS_logo.png" alt="CaramOS" /><span>CaramOS</span></a><nav>{t.nav.map((item, i) => <a key={item} href={['#overview', '#ota', '#release-notes', '#ecosystem', '#opensource', '#download'][i]}>{item}</a>)}<a className="nav-support" href="/support">{t.supportPage}</a></nav><button onClick={onToggle}>{t.language}</button></header>;
}

function ReleaseNotesSection({ t }) {
  const entries = [...t.releaseNotes, t.initialRelease];

  return <section className="release-notes" id="release-notes">
    <div className="section-title"><h2>{t.releaseNotesTitle}</h2><p>{t.releaseNotesLead}</p></div>
    <div className="release-list">
      {entries.map(([version, title, items]) => <article key={version} className="release-entry">
        <div className="release-version">{version}</div>
        <div className="release-content"><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </article>)}
    </div>
  </section>;
}

function CardSection({ title, lead, items }) {
  return <section className="wide-section"><div className="section-title"><h2>{title}</h2><p>{lead}</p></div><div className="app-grid">{items.map(([icon, titleText, text, status]) => <AppCard key={titleText} icon={icon} title={titleText} text={text} status={status} />)}</div></section>;
}

function AppCard({ icon, title, text, status }) {
  return <article className="app-card"><div className="app-head"><span className="app-icon"><SvgIcon name={icon} /></span><div><h3>{title}</h3><small>CaramOS</small></div></div><p>{text}</p><div className="card-meta"><span>{status}</span><a href={links.repo}>Details</a></div></article>;
}

function RepoCard({ name, desc, langName, license, url }) {
  return <a className="repo-card" href={url}><h3>{name}</h3><p>{desc}</p><div><span>{langName}</span><span>{license}</span></div></a>;
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
