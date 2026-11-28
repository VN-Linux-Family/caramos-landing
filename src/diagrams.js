// The diagrams of the Education and Business pages, as data. FeatureDiagram (App.jsx) draws each one as an SVG on
// wide screens and as a list on phones, both from this file. How to edit them: README.md, "Sửa sơ đồ".
//
// Coordinates are in the diagram's own units: `size` is [width, height] and the SVG scales to the page.
//   groups  a tinted area with a label at its top left: { id, x, y, w, h, label: { vi, en } }
//   nodes   a box: { id, x, y, w, title: { vi, en }, lines: { vi: [...], en: [...] }, group, tone, stack, list }
//           Its height follows its text. A title or a line never wraps by itself: one string is one line.
//           tone 'strong' is the deep green box; stack: 2 draws two cards behind it, for "many computers".
//           list: true when each line is an item of its own (the outline then lists them instead of joining them
//           into one sentence).
//   edges   an arrow: { from, to, label: { vi: [...], en: [...] }, both, shift, via, side, dy }
//           from/to are node or group ids. The arrow runs straight when the two boxes face each other.
//           shift moves a straight arrow sideways (two arrows between the same boxes).
//           via lists corner points [x, y] for a bent arrow; the first and last legs meet the boxes straight on.
//           The label sits on the longest leg (leg: 0, 1… picks another): above a horizontal leg (side 'below'
//           to put it under), right of a vertical leg (side 'left'); dy nudges it up or down.
//   outline the order of the boxes and areas (ids) in the phone version; without it, top to bottom.
// `yarn build` prints a warning when a line looks wider than its box, in either language.
import { typeset } from './content.js';

export const diagrams = {
  education: {
    size: [960, 556],
    title: {
      vi: 'Sơ đồ một phòng máy CaramOS',
      en: 'Diagram of a CaramOS computer lab',
    },
    summary: {
      vi: 'Máy giáo viên và máy học sinh cùng mạng LAN của trường, nối với nhau qua công cụ Phòng máy. App Center cài phần mềm học tập lên máy học sinh. Bản cập nhật CaramOS về qua mạng. Bản Xfce chạy trên máy 2 GB. Góp ý & hỗ trợ gửi câu hỏi tới cộng đồng Vietnam Linux Family.',
      en: 'The teacher’s and the pupils’ computers share the school network and connect through the Computer Lab tool. The App Center installs learning apps on the pupils’ computers. CaramOS updates arrive over the network. The Xfce edition runs on 2 GB computers. Feedback & Help sends questions to the Vietnam Linux Family community.',
    },
    groups: [
      {
        id: 'lab', x: 24, y: 180, w: 912, h: 175,
        label: { vi: 'Phòng máy: các máy cùng mạng dây hoặc Wi-Fi của trường', en: 'The computer lab: every computer on the school’s cable or Wi-Fi' },
      },
    ],
    nodes: [
      {
        id: 'updates', x: 24, y: 24, w: 280,
        title: { vi: 'Bản cập nhật CaramOS', en: 'CaramOS updates' },
        lines: { vi: ['Mỗi máy kiểm tra mỗi ngày'], en: ['Each computer checks daily'] },
      },
      {
        id: 'apps', x: 636, y: 24, w: 300,
        title: { vi: ['App Center,', 'bước Học tập và dạy học'], en: ['App Center:', 'Learning and teaching'] },
        lines: {
          vi: ['GCompris, Tux Paint, Klavaro,', 'KTurtle, Thonny, Scratch 3,', 'GeoGebra, Stellarium'],
          en: ['GCompris, Tux Paint, Klavaro,', 'KTurtle, Thonny, Scratch 3,', 'GeoGebra, Stellarium'],
        },
      },
      {
        id: 'teacher', x: 56, y: 224, w: 300, group: 'lab', tone: 'strong',
        title: { vi: 'Máy giáo viên', en: 'Teacher’s computer' },
        lines: {
          vi: ['Phòng máy cài Veyon', 'hoặc Epoptes (nhẹ hơn)', 'và hiện mã ghép nối 6 số'],
          en: ['Computer Lab sets up Veyon', 'or the lighter Epoptes', 'and shows a 6-digit code'],
        },
      },
      {
        id: 'pupils', x: 604, y: 224, w: 300, group: 'lab', stack: 2,
        title: { vi: 'Máy học sinh', en: 'Pupils’ computers' },
        lines: {
          vi: ['Phòng máy ▸ Máy học sinh', 'tự tìm máy giáo viên', 'trong mạng của trường'],
          en: ['Computer Lab ▸ Student’s', 'computer finds the teacher', 'on the school network'],
        },
      },
      {
        id: 'community', x: 24, y: 420, w: 280,
        title: { vi: ['Cộng đồng', 'Vietnam Linux Family'], en: ['Vietnam Linux', 'Family community'] },
        lines: { vi: ['trả lời câu hỏi, nhận góp ý'], en: ['answers questions'] },
      },
      {
        id: 'xfce', x: 636, y: 420, w: 300,
        title: { vi: 'Bản Xfce', en: 'Xfce edition' },
        lines: {
          vi: ['chạy trên máy 2 GB RAM:', 'khoảng 610 MB sau khi bật,', 'giao diện tiếng Anh như sách'],
          en: ['runs on 2 GB of RAM:', 'about 610 MB after boot,', 'English, like the textbooks'],
        },
      },
    ],
    outline: ['lab', 'apps', 'xfce', 'updates', 'community'],
    edges: [
      {
        from: 'teacher', to: 'pupils', shift: -16,
        label: { vi: ['xem màn hình, gửi tin nhắn,', 'khóa máy, điều khiển'], en: ['watch screens, send messages,', 'lock, take control'] },
      },
      {
        from: 'pupils', to: 'teacher', shift: 16, side: 'below',
        label: { vi: ['nhập mã 6 số để vào lớp'], en: ['type the 6-digit code to join'] },
      },
      {
        from: 'apps', to: 'pupils', dy: -14,
        label: { vi: ['cài bằng một nút'], en: ['one-click installs'] },
      },
      {
        from: 'updates', to: 'lab',
        label: { vi: ['cập nhật qua mạng,', 'không cần cài lại'], en: ['updates over the network,', 'no reinstall'] },
      },
      {
        from: 'lab', to: 'community',
        label: { vi: ['Góp ý & hỗ trợ gửi câu hỏi,', 'báo lỗi kèm ảnh chụp'], en: ['Feedback & Help sends questions', 'and bug reports'] },
      },
      {
        from: 'xfce', to: 'lab', side: 'left',
        label: { vi: ['cài trên máy 2 GB'], en: ['installed on 2 GB computers'] },
      },
    ],
  },

  business: {
    size: [960, 732],
    title: {
      vi: 'Sơ đồ CaramOS Doanh nghiệp trong một văn phòng',
      en: 'Diagram of CaramOS Business in an office',
    },
    summary: {
      vi: 'Người quản trị bật các nhóm thiết lập trên máy quản lý. Thiết lập có chữ ký tới máy nhân viên, cho cả công ty hoặc từng phòng ban. Máy quản lý còn gửi lệnh tức thì, và hỗ trợ từ xa khi nhân viên đồng ý. Máy nhân viên gửi lại kiểm kê, tình trạng máy và yêu cầu Nhờ IT hỗ trợ. Desktop, Tài liệu và ổ dùng chung nằm trên máy chủ hoặc NAS của công ty. Máy quản lý xuất danh sách tài sản ra Excel, giữ nhật ký thao tác và bản sao lưu.',
      en: 'The admin turns settings groups on at the admin computer. Signed settings reach the staff computers, for the whole company or one department. The admin computer also sends instant actions, and remote help once the employee accepts. Staff computers send back their inventory, their health and Ask IT for help requests. Desktop, Documents and shared drives live on the company’s server or NAS. The admin computer exports an asset list to Excel and keeps an activity log and a backup.',
    },
    groups: [
      { id: 'staff', x: 684, y: 296, w: 252, h: 283, label: { vi: 'Máy nhân viên', en: 'Staff computers' } },
    ],
    nodes: [
      {
        id: 'settings', x: 330, y: 24, w: 300, list: true,
        title: { vi: 'Nhóm thiết lập', en: 'Settings groups' },
        lines: {
          vi: ['Hình nền', 'Trình duyệt, chặn web theo giờ', 'Máy in', 'Wi-Fi công ty', 'USB lưu trữ', 'Lịch tắt, bật máy', 'Ứng dụng bắt buộc, bị cấm', 'Khóa màn hình', 'Tường lửa'],
          en: ['Wallpaper', 'Browser: sites blocked by hour', 'Printers', 'Company Wi-Fi', 'USB storage', 'Power schedule', 'Required and forbidden apps', 'Screen lock', 'Firewall'],
        },
      },
      {
        id: 'admin', x: 24, y: 308, w: 252, tone: 'strong',
        title: { vi: 'Máy quản lý', en: 'Admin computer' },
        lines: {
          vi: ['Một máy CaramOS', 'luôn bật trong giờ làm,', 'ký mọi thiết lập gửi đi'],
          en: ['A CaramOS computer,', 'on during office hours,', 'signs every setting'],
        },
      },
      {
        id: 'accounting', x: 702, y: 340, w: 216, group: 'staff',
        title: { vi: 'Phòng Kế toán', en: 'Accounting' },
        lines: { vi: ['chặn USB lưu trữ'], en: ['USB storage blocked'] },
      },
      {
        id: 'sales', x: 702, y: 417, w: 216, group: 'staff',
        title: { vi: 'Phòng Kinh doanh', en: 'Sales' },
        lines: { vi: ['được mở Facebook'], en: ['Facebook allowed'] },
      },
      {
        id: 'others', x: 702, y: 494, w: 216, group: 'staff',
        title: { vi: 'Các phòng khác', en: 'Other departments' },
        lines: { vi: ['theo thiết lập chung'], en: ['company-wide settings'] },
      },
      {
        id: 'outputs', x: 24, y: 480, w: 290, list: true,
        title: { vi: 'Báo cáo và bản sao lưu', en: 'Reports and backup' },
        lines: {
          vi: ['Danh sách tài sản (Excel)', 'Nhật ký thao tác', 'Bản sao lưu máy quản lý'],
          en: ['The asset list (Excel)', 'An activity log', 'A backup of the admin'],
        },
      },
      {
        id: 'server', x: 684, y: 640, w: 252,
        title: { vi: 'Máy chủ hoặc NAS', en: 'Server or NAS' },
        lines: { vi: ['của công ty'], en: ['of the company'] },
      },
    ],
    outline: ['admin', 'settings', 'staff', 'server', 'outputs'],
    edges: [
      {
        from: 'admin', to: 'settings', via: [[150, 141]],
        label: { vi: ['bật từng nhóm'], en: ['turns groups on'] },
      },
      {
        from: 'settings', to: 'staff', via: [[820, 141]],
        label: { vi: ['thiết lập đã ký,', 'cho cả công ty', 'hoặc từng phòng ban'], en: ['signed settings,', 'for the company', 'or one department'] },
      },
      {
        from: 'admin', to: 'staff', shift: -16,
        label: {
          vi: ['lệnh tức thì (khóa máy, tin nhắn, tắt máy);', 'hỗ trợ từ xa khi nhân viên đồng ý'],
          en: ['instant actions (lock, message, shut down);', 'remote help once the employee accepts'],
        },
      },
      {
        from: 'staff', to: 'admin', shift: 16, side: 'below',
        label: { vi: ['kiểm kê, tình trạng máy;', 'yêu cầu Nhờ IT hỗ trợ'], en: ['inventory and health;', 'Ask IT for help requests'] },
      },
      {
        from: 'admin', to: 'outputs',
        label: { vi: ['xuất ra'], en: ['exports'] },
      },
      {
        from: 'staff', to: 'server', both: true, side: 'left',
        label: { vi: ['Desktop, Tài liệu,', 'ổ dùng chung'], en: ['Desktop, Documents,', 'shared drives'] },
      },
    ],
  },
};

typeset(diagrams);

// Type sizes in diagram units. FeatureDiagram uses the same numbers.
export const type = { title: 17, line: 15, label: 14, group: 15 };
const TITLE_STEP = 22;
const LINE_STEP = 21;
const LABEL_STEP = 18;
export const PAD_X = 18;
export const STACK_OFFSET = 6;

const asLines = (value) => (Array.isArray(value) ? value : value ? [value] : []);

// A rough width of a line of Be Vietnam Pro: wide enough to warn before text runs out of its box.
export function textWidth(text, size, bold = false) {
  return [...text].length * size * (bold ? 0.61 : 0.57);
}

function nodeBox(node, lang) {
  const titles = asLines(node.title[lang]);
  const lines = asLines(node.lines?.[lang]);
  const h = 30 + TITLE_STEP * (titles.length - 1) + (lines.length ? 23 + LINE_STEP * (lines.length - 1) : 0) + 14;
  return { x: node.x, y: node.y, w: node.w, h };
}

const overlap = (a0, a1, b0, b1) => [Math.max(a0, b0), Math.min(a1, b1)];

// Where an arrow leaves a box toward point p, straight on: through the top or bottom when p is above or below the
// box, through a side when p is beside it.
function attach(box, [px, py]) {
  if (px >= box.x && px <= box.x + box.w) return [px, py < box.y ? box.y : box.y + box.h];
  if (py >= box.y && py <= box.y + box.h) return [px < box.x ? box.x : box.x + box.w, py];
  throw new Error(`diagram: the point ${px},${py} is neither above, below nor beside a box`);
}

function routeOf(a, b, edge) {
  if (edge.via) return [attach(a, edge.via[0]), ...edge.via, attach(b, edge.via[edge.via.length - 1])];
  const shift = edge.shift || 0;
  const [x0, x1] = overlap(a.x, a.x + a.w, b.x, b.x + b.w);
  if (x1 - x0 >= 16) {
    const x = (x0 + x1) / 2 + shift;
    return a.y + a.h <= b.y ? [[x, a.y + a.h], [x, b.y]] : [[x, a.y], [x, b.y + b.h]];
  }
  const [y0, y1] = overlap(a.y, a.y + a.h, b.y, b.y + b.h);
  if (y1 - y0 >= 16) {
    const y = (y0 + y1) / 2 + shift;
    return a.x + a.w <= b.x ? [[a.x + a.w, y], [b.x, y]] : [[a.x, y], [b.x + b.w, y]];
  }
  throw new Error(`diagram: ${edge.from} and ${edge.to} do not face each other; give the edge a via point`);
}

// Everything FeatureDiagram needs to draw a diagram in one language: boxes, arrow paths and label positions.
export function layoutDiagram(diagram, lang) {
  const nodes = diagram.nodes.map((node) => {
    const box = nodeBox(node, lang);
    const stack = node.stack || 0;
    // Arrows meet the outline of the whole stack, not the front card.
    const outer = { x: box.x, y: box.y - stack * STACK_OFFSET, w: box.w + stack * STACK_OFFSET, h: box.h + stack * STACK_OFFSET };
    const titles = asLines(node.title[lang]);
    const lines = asLines(node.lines?.[lang]);
    // Baselines of the title lines, then of the other lines, as nodeBox measured them.
    const titleYs = titles.map((_, i) => box.y + 30 + TITLE_STEP * i);
    const lineYs = lines.map((_, i) => box.y + 30 + TITLE_STEP * (titles.length - 1) + 23 + LINE_STEP * i);
    return { ...node, box, outer, stack, titles, lines, titleYs, lineYs };
  });
  const groups = diagram.groups.map((group) => ({ ...group, box: { x: group.x, y: group.y, w: group.w, h: group.h }, text: group.label[lang] }));
  const boxes = new Map([...groups.map((group) => [group.id, group.box]), ...nodes.map((node) => [node.id, node.outer])]);
  const inGroup = ([px, py]) => groups.some(({ box }) => px >= box.x && px <= box.x + box.w && py >= box.y && py <= box.y + box.h);

  const edges = diagram.edges.map((edge) => {
    const a = boxes.get(edge.from);
    const b = boxes.get(edge.to);
    if (!a || !b) throw new Error(`diagram: no box called ${a ? edge.to : edge.from}`);
    const points = routeOf(a, b, edge);
    // The label goes on the longest leg, unless the edge names one.
    let leg = edge.leg ?? 0;
    if (edge.leg === undefined) {
      let longest = -1;
      for (let i = 0; i < points.length - 1; i += 1) {
        const length = Math.abs(points[i + 1][0] - points[i][0]) + Math.abs(points[i + 1][1] - points[i][1]);
        if (length > longest) { longest = length; leg = i; }
      }
    }
    const [p, q] = [points[leg], points[leg + 1]];
    const horizontal = p[1] === q[1];
    const lines = asLines(edge.label?.[lang]);
    const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + (edge.dy || 0)];
    let label;
    if (horizontal) {
      const below = edge.side === 'below';
      const first = below ? mid[1] + 18 : mid[1] - 8 - LABEL_STEP * (lines.length - 1);
      label = { x: mid[0], anchor: 'middle', ys: lines.map((_, i) => first + LABEL_STEP * i), room: Math.abs(q[0] - p[0]) };
    } else {
      const left = edge.side === 'left';
      const first = mid[1] - (LABEL_STEP * (lines.length - 1)) / 2 + 5;
      label = { x: mid[0] + (left ? -10 : 10), anchor: left ? 'end' : 'start', ys: lines.map((_, i) => first + LABEL_STEP * i) };
    }
    return { ...edge, points, lines, label, onTint: inGroup(mid) };
  });

  return { width: diagram.size[0], height: diagram.size[1], title: diagram.title[lang], summary: diagram.summary[lang], groups, nodes, edges };
}

// The same diagram as an outline, for phones and screen readers: the areas and boxes in reading order, each with
// the arrows that leave it.
export function diagramOutline(diagram, lang) {
  const layout = layoutDiagram(diagram, lang);
  const names = new Map([
    ...layout.groups.map((group) => [group.id, group.text.split(':')[0]]),
    ...layout.nodes.map((node) => [node.id, node.titles.join(' ')]),
  ]);
  const linksOf = (id) => layout.edges.filter((edge) => edge.from === id)
    .map((edge) => ({ to: names.get(edge.to), text: edge.lines.join(' '), both: Boolean(edge.both) }));
  const item = (node) => ({
    id: node.id,
    title: node.titles.join(' '),
    ...(node.list ? { list: node.lines } : { text: node.lines.join(' ') }),
    links: linksOf(node.id),
  });
  const byPosition = (a, b) => (a.box.y - b.box.y) || (a.box.x - b.box.x);
  const blocks = [
    ...layout.groups.map((group) => ({
      id: group.id,
      box: group.box,
      group: { id: group.id, title: group.text, links: linksOf(group.id), items: layout.nodes.filter((node) => node.group === group.id).sort(byPosition).map(item) },
    })),
    ...layout.nodes.filter((node) => !node.group).map((node) => ({ id: node.id, box: node.box, node: item(node) })),
  ];
  const order = diagram.outline || [];
  const rank = (block) => (order.includes(block.id) ? order.indexOf(block.id) : order.length);
  return blocks.sort((a, b) => (rank(a) - rank(b)) || byPosition(a, b)).map(({ group, node }) => group || node);
}

// Lines that look wider than their box, or labels that run off the diagram, in either language.
export function diagramWarnings(name, diagram) {
  const warnings = [];
  for (const lang of ['vi', 'en']) {
    const layout = layoutDiagram(diagram, lang);
    for (const node of layout.nodes) {
      const room = node.w - 2 * PAD_X;
      for (const title of node.titles) {
        if (textWidth(title, type.title, true) > room) warnings.push(`${name}/${lang}: the title "${title}" may be too wide for its box (${node.w})`);
      }
      for (const line of node.lines) {
        if (textWidth(line, type.line) > room) warnings.push(`${name}/${lang}: the line "${line}" may be too wide for its box (${node.w})`);
      }
    }
    for (const edge of layout.edges) {
      for (const line of edge.lines) {
        const width = textWidth(line, type.label);
        const left = edge.label.anchor === 'middle' ? edge.label.x - width / 2 : edge.label.anchor === 'end' ? edge.label.x - width : edge.label.x;
        if (left < 0 || left + width > layout.width) warnings.push(`${name}/${lang}: the label "${line}" runs off the diagram`);
        if (edge.label.room !== undefined && width > edge.label.room - 12) warnings.push(`${name}/${lang}: the label "${line}" is wider than its arrow`);
      }
    }
  }
  return warnings;
}
