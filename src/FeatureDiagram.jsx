import React from 'react';
import { layoutDiagram, diagramOutline, PAD_X, STACK_OFFSET } from './diagrams.js';

const pathOf = (points) => points.map(([x, y], index) => `${index ? 'L' : 'M'}${x} ${y}`).join(' ');

// One diagram from diagrams.js, drawn twice from the same data: an SVG for wide screens, and an outline that phones
// show instead (styles.css swaps them at 860 px) and screen readers always reach. Both are in the prerendered HTML.
export function FeatureDiagram({ diagram, lang, id, words }) {
  const d = layoutDiagram(diagram, lang);
  const outline = diagramOutline(diagram, lang);
  const arrow = `${id}-arrow`;
  return <figure className="diagram">
    <svg className="diagram-svg" viewBox={`0 0 ${d.width} ${d.height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{d.title}</title>
      <desc id={`${id}-desc`}>{d.summary}</desc>
      <defs>
        <marker id={arrow} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0 0.5 L10 5 L0 9.5 z" />
        </marker>
      </defs>
      {d.groups.map((group) => <g key={group.id} className="dg-group">
        <rect x={group.x} y={group.y} width={group.w} height={group.h} rx="18" />
        <text x={group.x + PAD_X} y={group.y + 28}>{group.text}</text>
      </g>)}
      {d.edges.map((edge) => <g key={`${edge.from}-${edge.to}`} className="dg-edge">
        <path d={pathOf(edge.points)} markerEnd={`url(#${arrow})`} markerStart={edge.both ? `url(#${arrow})` : undefined} />
      </g>)}
      {d.nodes.map((node) => <g key={node.id} className={`dg-node${node.tone ? ` is-${node.tone}` : ''}`}>
        {Array.from({ length: node.stack }, (_, index) => node.stack - index).map((step) => <rect key={step} className="dg-stack"
          x={node.box.x + step * STACK_OFFSET} y={node.box.y - step * STACK_OFFSET} width={node.box.w} height={node.box.h} rx="12" />)}
        <rect x={node.box.x} y={node.box.y} width={node.box.w} height={node.box.h} rx="12" />
        <text className="dg-title">{node.titles.map((line, index) => <tspan key={index} x={node.box.x + PAD_X} y={node.titleYs[index]}>{line}</tspan>)}</text>
        {node.lines.length > 0 && <text className="dg-lines">{node.lines.map((line, index) => <tspan key={index} x={node.box.x + PAD_X} y={node.lineYs[index]}>{line}</tspan>)}</text>}
      </g>)}
      {/* Labels last, so no box or arrow is ever drawn over one. */}
      {d.edges.map((edge) => <text key={`${edge.from}-${edge.to}`} className={`dg-label${edge.onTint ? ' on-tint' : ''}`} textAnchor={edge.label.anchor}>
        {edge.lines.map((line, index) => <tspan key={index} x={edge.label.x} y={edge.label.ys[index]}>{line}</tspan>)}
      </text>)}
    </svg>
    <ul className="dg-outline">
      {outline.map((block) => (block.items
        ? <li key={block.id} className="dg-area">
          <p className="dg-area-name">{block.title}</p>
          <OutlineLinks links={block.links} words={words} />
          <ul>{block.items.map((item) => <OutlineItem key={item.id} item={item} words={words} />)}</ul>
        </li>
        : <OutlineItem key={block.id} item={block} words={words} />))}
    </ul>
  </figure>;
}

function OutlineItem({ item, words }) {
  return <li className="dg-item">
    <p><strong>{item.title}</strong>{item.text && <> <span>{item.text}</span></>}</p>
    {item.list && <ul className="dg-sublist">{item.list.map((line) => <li key={line}>{line}</li>)}</ul>}
    <OutlineLinks links={item.links} words={words} />
  </li>;
}

function OutlineLinks({ links, words }) {
  if (!links.length) return null;
  return <ul className="dg-links">
    {links.map((link) => <li key={`${link.to}-${link.text}`}>
      <span className="dg-arrow" aria-hidden="true">{link.both ? '↔' : '→'}</span>
      <span className="visually-hidden">{link.both ? words.both : words.to} </span>
      <strong>{link.to}</strong>: {link.text}
    </li>)}
  </ul>;
}
