import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const links = {
  release: 'https://github.com/VN-Linux-Family/CaramOS/releases',
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
    heroBadge: 'Open Beta 1.0.10 · Linux Mint 22.3 Cinnamon · GPL-3.0',
    upgradeNotice: 'Nâng cấp CaramOS từ 1.0.1',
    seoTitle: 'CaramOS 1.0.10 Open Beta — bản phân phối Linux cho người dùng Việt Nam',
    seoDescription: 'CaramOS 1.0.10 Open Beta là bản phân phối Linux dựa trên Linux Mint 22.3 Cinnamon, cấu hình tiếng Việt mặc định, bộ gõ Fcitx5 + Lotus, ứng dụng phổ biến tại Việt Nam và quy trình build ISO công khai.',
    heroTitle: 'CaramOS — bản phân phối Linux cho người dùng Việt Nam',
    heroLead:
      'CaramOS là bản phân phối dựa trên Linux Mint 22.3 Cinnamon và Ubuntu 24.04 LTS. Dự án tập trung vào cấu hình tiếng Việt mặc định, bộ gõ, bộ ứng dụng phổ biến tại Việt Nam và quy trình build ISO công khai.',
    download: 'Tải ISO',
    source: 'Mã nguồn',
    community: 'Cộng đồng',
    statLabels: ['Stars', 'Forks', 'Issues', 'License'],
    contributorsTitle: 'Contributors',
    contributorsLead: 'Danh sách contributors được lấy trực tiếp từ GitHub repository của CaramOS.',
    contributorsFallback: 'Không tải được dữ liệu contributors từ GitHub. Vui lòng xem danh sách mới nhất trên GitHub.',
    sectionOverview: 'Thành phần chính',
    overviewLead: 'Các thay đổi tập trung vào trải nghiệm desktop, bản địa hóa, OTA migration và khả năng build lại ISO.',
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
      'Bạn có thể nâng cấp CaramOS lên phiên bản mới nhất mà không cần tải ISO mới hay cài lại máy. Chỉ cần cài Trung tâm cập nhật CaramOS, sau đó mở ứng dụng này để kiểm tra và nâng cấp hệ thống.',
    otaInstallLabel: 'Nếu bạn đang ở CaramOS 1.0.1, hãy chạy lệnh sau trong Terminal:',
    otaCopyHint: 'Sau khi cài xong, bạn có thể tìm “Trung tâm cập nhật CaramOS” từ Start Menu để mở lại bất cứ lúc nào.',
    otaCopy: 'Copy lệnh',
    otaCopied: 'Đã copy',
    otaSteps: [
      ['Cài Trung tâm cập nhật', 'Chạy một lệnh duy nhất để thêm nguồn cập nhật và cài ứng dụng cập nhật của CaramOS.'],
      ['Mở từ Start Menu', 'Tìm “Trung tâm cập nhật CaramOS” trong menu ứng dụng để kiểm tra bản mới.'],
      ['Nâng cấp hệ thống', 'Ứng dụng sẽ hiển thị bản cập nhật mới nhất và hướng dẫn bạn nâng cấp an toàn.'],
    ],
    releaseNotesTitle: 'Release note CaramOS Open Beta',
    releaseNotesLead:
      'Beta 1.0.1 là bản phát hành đầu tiên của CaramOS. Các mốc sau đây ghi lại những thay đổi đã được đưa vào chuỗi cập nhật từ 1.0.2 đến 1.0.10.',
    initialRelease: ['1.0.1', 'Phát hành đầu tiên', ['Bản Open Beta đầu tiên của CaramOS dành cho người dùng Việt Nam.', 'Cung cấp nền tảng Linux Mint 22.3 Cinnamon với cấu hình tiếng Việt, branding CaramOS và bộ ứng dụng cơ bản.']],
    releaseNotes: [
      ['1.0.10', 'Cập nhật kích thước icon panel Cinnamon', ['Áp dụng thay đổi kích thước icon panel từ PR #62.', 'Đặt icon bên phải panel Cinnamon về 18px trong dconf defaults.', 'Đồng bộ caramos-theme-apply và giữ lại tùy chỉnh kích thước icon của người dùng khi migration.']],
      ['1.0.9', 'Ổn định bộ gõ tiếng Việt Fcitx5 Lotus', ['Thêm cấu hình mặc định ổn định cho Fcitx5 Lotus.', 'Giữ English và Lotus trong menu Fcitx với Ctrl+Shift để chuyển bộ gõ.', 'Đưa Start menu Cinnamon qua Fcitx và khởi động lại Fcitx sau khi áp dụng defaults.']],
      ['1.0.8', 'Ghim Software Manager', ['Áp dụng cập nhật pin Software Manager từ PR #54.', 'Ghim Software Manager vào grouped-window-list mặc định của Cinnamon.', 'Thêm launcher Software Manager ra Desktop cho default user và live user.']],
      ['1.0.7', 'Cập nhật layout panel Cinnamon', ['Áp dụng cập nhật panel layout từ PR #53.', 'Thêm systray, network và sound applets vào panel bên phải.', 'Bỏ weather/cornerbar mặc định và thêm launcher tìm kiếm cho Trung tâm cập nhật CaramOS.']],
      ['1.0.6', 'Slideshow cài đặt CaramOS', ['Thêm asset slideshow Ubiquity riêng của CaramOS từ PR #52.', 'Bổ sung OTA migration để cài slideshow trên hệ thống đã cài.', 'Giữ metadata build dependency tương thích với Launchpad builders.']],
      ['1.0.5.2', 'Chuỗi migration đến CaramOS 1.0.5', ['Phát hành chuỗi OTA migration qua CaramOS 1.0.5.', 'Thêm migration cho MintWelcome branding, ZRAM mặc định, MintReport branding và metadata codename.', 'Gộp release notes nhiều bước, cập nhật dung lượng trong notifier và sửa codename cho add-apt-repository.']],
      ['1.0.2', 'Gói cập nhật CaramOS OTA đầu tiên', ['Thêm package CaramOS OTA updater ban đầu.', 'CLI hỗ trợ check, upgrade, status, repair, rollback và dry-run.', 'Có systemd timer kiểm tra hằng ngày, notifier GTK3 tiếng Việt, pkexec/polkit, transaction state, rollback best-effort và logrotate.']],
    ],
    downloadTitle: 'Tải CaramOS Open Beta 1.0.10',
    downloadLead:
      'ISO phát hành trên GitHub Releases. Người dùng nên kiểm tra checksum, thử live session trong máy ảo hoặc USB trước khi cài đặt lên máy thật. Máy đã cài có thể dùng OTA để lên 1.0.10.',
    supportTitle: 'Ủng hộ CaramOS trên Unikorn',
    supportLead:
      'Nếu bạn thấy CaramOS hữu ích, hãy clap trên Unikorn để tiếp thêm động lực cho team và giúp dự án tiếp cận nhiều người dùng Việt Nam hơn.',
    supportAction: 'Clap cho CaramOS',
    supportMeta: 'Mỗi lượt clap và badge xếp hạng giúp CaramOS nổi bật hơn trong cộng đồng mã nguồn mở Việt Nam.',
    footer: 'CaramOS là dự án thuộc hệ sinh thái Vietnam Linux Family.',
    features: [
      ['locale', 'Vietnamese locale', 'Thiết lập ngôn ngữ, timezone Asia/Ho_Chi_Minh và font tiếng Việt mặc định.', 'Config'],
      ['keyboard', 'Input method', 'Fcitx5 và Lotus được đưa vào ISO để hỗ trợ nhập liệu tiếng Việt.', 'Package'],
      ['browser', 'Browser', 'Google Chrome được cài sẵn cho nhu cầu web phổ biến.', 'Package'],
      ['document', 'Office suite', 'WPS Office được bổ sung để hỗ trợ xử lý tài liệu văn phòng.', 'Package'],
      ['chat', 'Local apps', 'Zalo AppImage và shortcut desktop được thêm vào overlay.', 'Overlay'],
      ['palette', 'Branding', 'Boot menu, Plymouth, wallpaper, theme, icon và cursor được tùy biến theo nhận diện CaramOS.', 'Overlay'],
      ['terminal', 'Build tooling', 'Makefile, Bash scripts, Docker builder và GitHub Actions phục vụ build/test ISO.', 'Tooling'],
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
    heroBadge: 'Open Beta 1.0.10 · Linux Mint 22.3 Cinnamon · GPL-3.0',
    upgradeNotice: 'Upgrade CaramOS from 1.0.1',
    seoTitle: 'CaramOS 1.0.10 Open Beta — Linux distribution for Vietnamese users',
    seoDescription: 'CaramOS 1.0.10 Open Beta is a Linux Mint 22.3 Cinnamon based distribution with Vietnamese defaults, Fcitx5 + Lotus input, daily-use applications for Vietnam, and a public ISO remaster workflow.',
    heroTitle: 'CaramOS — a Linux distribution for Vietnamese users',
    heroLead:
      'CaramOS is based on Linux Mint 22.3 Cinnamon and Ubuntu 24.04 LTS. The project focuses on Vietnamese defaults, input methods, practical daily-use applications in Vietnam, and a public ISO build workflow.',
    download: 'Download ISO',
    source: 'Source code',
    community: 'Community',
    statLabels: ['Stars', 'Forks', 'Issues', 'License'],
    contributorsTitle: 'Contributors',
    contributorsLead: 'The contributor list is loaded directly from the CaramOS GitHub repository.',
    contributorsFallback: 'Could not load contributor data from GitHub. Please view the latest list on GitHub.',
    sectionOverview: 'Core components',
    overviewLead: 'Changes are focused on desktop experience, localization, OTA migrations, and reproducible ISO customization.',
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
      'You can upgrade CaramOS to the latest version without downloading a new ISO or reinstalling your machine. Install the CaramOS Update Center, then open it to check and upgrade the system.',
    otaInstallLabel: 'If you are on CaramOS 1.0.1, run this command in Terminal:',
    otaCopyHint: 'After installation, search for “CaramOS Update Center” from the Start Menu to open it again anytime.',
    otaCopy: 'Copy command',
    otaCopied: 'Copied',
    otaSteps: [
      ['Install Update Center', 'Run one command to add the update source and install the CaramOS update application.'],
      ['Open from Start Menu', 'Search for “CaramOS Update Center” in the application menu to check for new versions.'],
      ['Upgrade the system', 'The app shows the latest update and guides you through a safe upgrade.'],
    ],
    releaseNotesTitle: 'CaramOS Open Beta release notes',
    releaseNotesLead:
      'Beta 1.0.1 was the first CaramOS release. The milestones below summarize the update chain from 1.0.2 to 1.0.10.',
    initialRelease: ['1.0.1', 'First release', ['The first CaramOS Open Beta for Vietnamese users.', 'Provided a Linux Mint 22.3 Cinnamon base with Vietnamese defaults, CaramOS branding, and essential applications.']],
    releaseNotes: [
      ['1.0.10', 'Cinnamon panel icon size update', ['Applied the panel icon size update from PR #62.', 'Set right-side Cinnamon panel icons to 18px in dconf defaults.', 'Aligned caramos-theme-apply and preserved user-customized panel icon sizes during migration.']],
      ['1.0.9', 'Stable Vietnamese input defaults', ['Added stable Fcitx5 Lotus defaults for Vietnamese input.', 'Kept English and Lotus in the Fcitx menu with Ctrl+Shift switching.', 'Routed Cinnamon Start menu search through Fcitx and restarted Fcitx after applying defaults.']],
      ['1.0.8', 'Software Manager pinning', ['Applied the Software Manager pinning update from PR #54.', 'Pinned Software Manager to Cinnamon grouped-window-list defaults.', 'Added a Software Manager launcher to the default and live user Desktop.']],
      ['1.0.7', 'Cinnamon panel layout update', ['Applied the panel layout update from PR #53.', 'Added systray, network, and sound applets to right panel defaults.', 'Removed weather/cornerbar defaults and added a searchable launcher for CaramOS Update Center.']],
      ['1.0.6', 'CaramOS installer slideshow', ['Added custom CaramOS Ubiquity slideshow assets from PR #52.', 'Added OTA migration to install slideshow files on existing systems.', 'Kept build dependency metadata compatible with Launchpad builders.']],
      ['1.0.5.2', 'Migration chain through 1.0.5', ['Released the OTA migration chain through CaramOS 1.0.5.', 'Added migrations for MintWelcome branding, default ZRAM, MintReport branding, and codename metadata.', 'Aggregated multi-step release notes, updated notifier size, and fixed codename compatibility for add-apt-repository.']],
      ['1.0.2', 'Initial OTA updater package', ['Introduced the first CaramOS OTA updater package.', 'Added CLI commands for check, upgrade, status, repair, rollback, and dry-run.', 'Included daily systemd checks, GTK3 Vietnamese notifier, pkexec/polkit, transaction state, best-effort rollback, and logrotate.']],
    ],
    downloadTitle: 'Download CaramOS Open Beta 1.0.10',
    downloadLead:
      'ISO images are published on GitHub Releases. Users should verify checksums and test the live session in a VM or USB environment before installing. Existing installs can use OTA to reach 1.0.10.',
    supportTitle: 'Support CaramOS on Unikorn',
    supportLead:
      'If CaramOS is useful to you, clap for the project on Unikorn to encourage the team and help it reach more Vietnamese Linux users.',
    supportAction: 'Clap for CaramOS',
    supportMeta: 'Every clap and ranking badge helps CaramOS stand out in the Vietnamese open-source community.',
    footer: 'CaramOS is part of the Vietnam Linux Family ecosystem.',
    features: [
      ['locale', 'Vietnamese locale', 'Default Vietnamese language, Asia/Ho_Chi_Minh timezone, and Vietnamese font configuration.', 'Config'],
      ['keyboard', 'Input method', 'Fcitx5 and Lotus are included in the ISO for Vietnamese text input.', 'Package'],
      ['browser', 'Browser', 'Google Chrome is included for common web usage requirements.', 'Package'],
      ['document', 'Office suite', 'WPS Office is added for document and office-file workflows.', 'Package'],
      ['chat', 'Local apps', 'Zalo AppImage and desktop shortcuts are provided through the overlay.', 'Overlay'],
      ['palette', 'Branding', 'Boot menu, Plymouth, wallpaper, theme, icons, and cursor are customized for CaramOS identity.', 'Overlay'],
      ['terminal', 'Build tooling', 'Makefile, Bash scripts, Docker builder, and GitHub Actions support ISO build and testing.', 'Tooling'],
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
  const [lang, setLang] = useState(() => localStorage.getItem('caramos-language') || 'vi');
  const [repo, setRepo] = useState(fallbackRepo);
  const [contributors, setContributors] = useState([]);
  const [githubError, setGithubError] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
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

  const handleCopyInstallCommand = async () => {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(installCommand);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      const textarea = document.createElement('textarea');
      textarea.value = installCommand;
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
              <a className="button primary" href={links.release}>{t.download}</a>
              <a className="button" href={links.repo}>{t.source}</a>
              <a className="button" href={links.facebook}>{t.community}</a>
            </div>
            <div className="stats">{liveStats.map((value, i) => <div key={t.statLabels[i]}><strong>{value}</strong><span>{t.statLabels[i]}</span></div>)}</div>
          </div>
          <div className="hero-shot"><img src="/assets/screenshots/03-desktop.png" alt="CaramOS desktop" /></div>
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
              <img src="/assets/caram-os-ota.png" alt="Trung tâm cập nhật CaramOS" loading="lazy" />
            </div>
            <div className="ota-menu-visual">
              <img src="/assets/caramos-ota-from-start-menu.png" alt="Tìm Trung tâm cập nhật CaramOS từ Start Menu" loading="lazy" />
              <span>{t.otaCopyHint}</span>
            </div>
          </div>
          <div className="ota-copy">
            <p className="badge">Trung tâm cập nhật CaramOS</p>
            <h2>{t.otaTitle}</h2>
            <p>{t.otaLead}</p>
            <div className="install-command-card">
              <strong>{t.otaInstallLabel}</strong>
              <div className="command-row">
                <code>{installCommand}</code>
                <button type="button" onClick={handleCopyInstallCommand}>{t.otaCopy}</button>
              </div>
              <small>{t.otaCopyHint}</small>
            </div>
            <div className="ota-steps">
              {t.otaSteps.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><p>{text}</p></article>)}
            </div>

          </div>
        </section>

        {copiedCommand && <div className="copy-toast" role="status">✓ {t.otaCopied}</div>}

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
          <img src="/assets/screenshots/04-neofetch.png" alt="Neofetch" />
        </section>

        <section className="download" id="download">
          <img src="/assets/caramos_vietnam_banner.png" alt="CaramOS banner" />
          <div><h2>{t.downloadTitle}</h2><p>{t.downloadLead}</p><a className="button primary" href={links.release}>{t.download}</a></div>
        </section>
      </main>
      <footer><div><img src="/assets/CaramOS_logo.png" alt="" /><strong>CaramOS</strong></div><p>{t.footer}</p><a href={links.vnlf}>vietnamlinuxfamily.net</a></footer>
    </>
  );
}

function Header({ t, onToggle }) {
  return <header className="topbar"><a className="brand" href="#overview"><img src="/assets/CaramOS_logo.png" alt="CaramOS" /><span>CaramOS</span></a><nav>{t.nav.map((item, i) => <a key={item} href={['#overview', '#ota', '#release-notes', '#ecosystem', '#opensource', '#download'][i]}>{item}</a>)}</nav><button onClick={onToggle}>{t.language}</button></header>;
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
    terminal: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="m8 10 3 2-3 2M13 15h4" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-5" /></>,
    website: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    telegram: <><path d="M21 4 3 11l7 2 2 7z" /><path d="m10 13 4 3 7-12" /></>,
    discord: <><path d="M7 8c3-2 7-2 10 0l1 8c-4 3-8 3-12 0z" /><path d="M9 15c2 1 4 1 6 0M9.5 12h.01M14.5 12h.01" /></>,
    facebook: <><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1z" /></>,
    apps: <><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></>,
    mirror: <><path d="M8 5h8v14H8z" /><path d="M5 8h3M16 8h3M5 16h3M16 16h3" /></>,
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
