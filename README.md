# CaramOS Landing Page

Vite + React bilingual landing page for CaramOS, ready for Cloudflare Pages.

- Default language: Vietnamese
- Secondary language: English
- Stack: Vite, React, vanilla CSS

## Pages

Every page is rendered to HTML at build time (`scripts/prerender.mjs`) and hydrated in the browser. The list of pages
is `src/routes.js`, which both sides read:

| Path | Page |
|---|---|
| `/`, `/en/` | home page |
| `/giao-duc/`, `/en/education/` | schools (Education) |
| `/doanh-nghiep/`, `/en/business/` | companies (Business, in testing) |
| `/support/` | donations |

- Every word is in `src/content.js` (`copy.vi`, `copy.en`); the components are in `src/App.jsx`.
- The contact forms of Education and Business open an email to `links.contactEmail` in `src/content.js`.
  Nothing is stored and no other service is involved.

## Sửa sơ đồ

Sơ đồ ở trang Giáo dục và Doanh nghiệp vẽ từ dữ liệu trong `src/diagrams.js`, không có ảnh nào. Sửa chữ, thêm ô hay dời
ô đều chỉ sửa tệp này. Cùng dữ liệu đó hiện thành hình SVG trên màn hình rộng, và thành danh sách trên điện thoại (dưới
860 px) và cho trình đọc màn hình.

Mỗi sơ đồ (`education`, `business`) gồm:

- `size: [rộng, cao]`: khung vẽ, tính theo đơn vị của sơ đồ; hình tự co giãn theo trang. Ô đặt ra ngoài khung thì tăng
  số này.
- `groups`: vùng nền xanh nhạt, nhãn ở góc trái trên: `{ id, x, y, w, h, label: { vi, en } }`.
- `nodes`: các ô: `{ id, x, y, w, title: { vi, en }, lines: { vi: [...], en: [...] } }`.
  - Chiều cao tự tính theo số dòng.
  - Chữ không tự xuống dòng: mỗi chuỗi trong `lines` là một dòng. Tiêu đề hai dòng thì viết `title: { vi: ['…', '…'] }`.
  - Thêm nếu cần: `group: 'id-của-vùng'` (ô nằm trong vùng), `tone: 'strong'` (ô xanh đậm), `stack: 2` (hai lớp phía
    sau, nghĩa là nhiều máy), `list: true` (mỗi dòng là một mục riêng; bản danh sách sẽ liệt kê từng mục).
- `edges`: mũi tên: `{ from, to, label: { vi: [...], en: [...] } }`. `from`, `to` là `id` của một ô hay một vùng.
  - Hai ô nằm đối diện nhau (cùng hàng hoặc cùng cột) thì mũi tên tự kẻ thẳng.
  - Thêm nếu cần: `both: true` (hai chiều), `shift: 16` (dời mũi tên sang bên, khi có hai mũi tên giữa cùng hai ô),
    `via: [[x, y]]` (điểm gấp, cho mũi tên đi vòng), `side: 'below'` hay `side: 'left'` (nhãn dưới mũi tên ngang, bên
    trái mũi tên dọc), `leg: 1` (chọn đoạn đặt nhãn), `dy: -10` (nhích nhãn lên xuống).
- `outline`: thứ tự các ô và vùng trong bản danh sách.

Ví dụ:

- **Sửa chữ:** đổi chuỗi trong `title` hay `lines`, cả `vi` lẫn `en`.
- **Dời một ô:** đổi `x`, `y`. Mũi tên nối với ô đó tự đi theo; mũi tên có `via` thì sửa cả điểm gấp.
- **Thêm một ô và một mũi tên** vào sơ đồ Giáo dục, ví dụ một ô Kiểm tra driver bên dưới ô Bản Xfce:

  ```js
  // trong diagrams.education.nodes
  {
    id: 'driver-check', x: 636, y: 580, w: 300,
    title: { vi: 'Kiểm tra driver', en: 'Driver Check' },
    lines: { vi: ['chạy thử từ USB trước khi cài'], en: ['try from USB before installing'] },
  },
  // trong diagrams.education.edges
  { from: 'driver-check', to: 'xfce', side: 'left', label: { vi: ['báo máy chạy được không'], en: ['says whether it works'] } },
  ```

  Ô mới nằm dưới đáy khung cũ, nên tăng `size` thành `[960, 680]`. Nhãn đặt bên trái (`side: 'left'`) vì bên phải mũi
  tên không đủ chỗ trước mép khung; `yarn build` sẽ báo nếu quên.

Sau khi sửa, chạy `yarn build`. Dòng nào có vẻ dài hơn ô, hay nhãn nào tràn khung, bản build in ra `warning: diagram …`
(con số chỉ ước lượng, nên vẫn nhìn lại bằng mắt). Xem bằng `npx vite preview --port 4317 --host 127.0.0.1`, cả màn
hình rộng lẫn màn hình dưới 860 px.

## Local development

```bash
yarn install
yarn dev
```

## Production build

```bash
yarn build
yarn preview
```

## Cloudflare Pages deploy

This project includes `wrangler.json` for Cloudflare Pages.

Recommended Pages settings:

- Framework preset: `Vite`
- Build command: `yarn build`
- Build output directory: `dist`
- Install command: `yarn install --frozen-lockfile`
- Root directory: repository root of this landing project
- Node.js version: `20`

### Deploy from Cloudflare Dashboard

1. Push this landing project to GitHub.
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages**.
3. Connect the GitHub repository.
4. Use the settings above and deploy.

### Deploy from CLI

```bash
yarn build
npx wrangler pages deploy dist --project-name caramos-landing
```
