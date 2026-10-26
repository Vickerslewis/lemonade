import { select, scaleBand, scaleLinear, scaleTime, axisBottom, timeMonth, timeYear, timeFormat, line, extent, max, type Selection } from 'd3';

type SVG = Selection<SVGSVGElement, unknown, null, undefined>;

const parse = (iso: string) => new Date(iso + 'T00:00:00');
const fmtDay = timeFormat('%-d %b %Y');

// Tooltips use textContent only: labels come from data files.
function tooltip(container: HTMLElement) {
  let tip = container.querySelector<HTMLDivElement>('.tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.setAttribute('role', 'status');
    container.appendChild(tip);
  }
  const el = tip;
  return {
    show(value: string, label: string, x: number, y: number) {
      el.replaceChildren();
      const v = document.createElement('span');
      v.className = 'tt-value';
      v.textContent = value;
      const l = document.createElement('span');
      l.className = 'tt-label';
      l.textContent = label;
      el.append(v, l);
      el.classList.add('show');
      const w = el.offsetWidth;
      const left = Math.min(Math.max(0, x - w / 2), container.clientWidth - w);
      el.style.left = `${left}px`;
      el.style.top = `${Math.max(0, y - el.offsetHeight - 12)}px`;
    },
    hide() {
      el.classList.remove('show');
    },
  };
}

function bindHover(
  hit: Selection<SVGElement, any, any, any>,
  tip: ReturnType<typeof tooltip>,
  content: (d: any) => [string, string],
  anchor: (d: any) => [number, number],
) {
  hit
    .attr('tabindex', 0)
    .attr('role', 'img')
    .attr('aria-label', (d) => content(d).join(': '))
    .on('pointerenter focus', function (_event, d) {
      const [value, label] = content(d);
      const [x, y] = anchor(d);
      tip.show(value, label, x, y);
      select(this.nextSibling as Element).classed('is-hover', true);
    })
    .on('pointerleave blur', function (event: PointerEvent | FocusEvent) {
      // A finger "leaves" as soon as it lifts; keep a tapped tooltip until focus moves elsewhere.
      if (event.type === 'pointerleave' && (event as PointerEvent).pointerType === 'touch') return;
      tip.hide();
      select(this.nextSibling as Element).classed('is-hover', false);
    });
}

// Column with a 4px rounded data-end and a square baseline.
function columnPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

interface Gap {
  from: string;
  to: string;
  days: number;
  label: string;
}

function renderIntervals(container: HTMLElement, gaps: Gap[]) {
  const width = container.clientWidth;
  const margin = { top: 24, right: 4, bottom: 44, left: 34 };
  const plotH = 200;
  const height = plotH + margin.top + margin.bottom;
  const tip = tooltip(container);

  select(container).select('svg').remove();
  const svg: SVG = select(container).insert('svg', ':first-child').attr('viewBox', `0 0 ${width} ${height}`).attr('height', height);

  const x = scaleBand<string>()
    .domain(gaps.map((g) => g.label))
    .range([margin.left, width - margin.right])
    .padding(0.3);
  const y = scaleLinear()
    .domain([0, (max(gaps, (g) => g.days) ?? 1) * 1.12])
    .nice()
    .range([margin.top + plotH, margin.top]);

  svg
    .append('g')
    .selectAll('line')
    .data(y.ticks(4))
    .join('line')
    .attr('class', (d) => (d === 0 ? 'baseline' : 'grid-line'))
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', (d) => y(d))
    .attr('y2', (d) => y(d));

  svg
    .append('g')
    .attr('class', 'tick')
    .selectAll('text')
    .data(y.ticks(4))
    .join('text')
    .attr('x', margin.left - 8)
    .attr('y', (d) => y(d))
    .attr('dy', '0.32em')
    .attr('text-anchor', 'end')
    .text((d) => d);

  const barW = Math.min(24, x.bandwidth());
  const groups = svg.append('g').selectAll('g').data(gaps).join('g');
  const cx = (g: Gap) => (x(g.label) ?? 0) + x.bandwidth() / 2;

  const hits = groups
    .append('rect')
    .attr('class', 'hit')
    .attr('x', (g) => x(g.label) ?? 0)
    .attr('width', x.bandwidth())
    .attr('y', margin.top)
    .attr('height', plotH);

  groups
    .append('path')
    .attr('class', 'mark')
    .style('fill', 'var(--series-1)')
    .attr('d', (g) => columnPath(cx(g) - barW / 2, y(g.days), barW, y(0) - y(g.days)));

  groups
    .append('text')
    .attr('class', 'label')
    .attr('x', cx)
    .attr('y', (g) => y(g.days) - 8)
    .attr('text-anchor', 'middle')
    .text((g) => `${g.days} days`);

  const xLabels = groups
    .append('text')
    .attr('class', 'axis-label')
    .attr('text-anchor', 'middle')
    .attr('y', margin.top + plotH + 18);
  xLabels.append('tspan').attr('x', cx).text((g) => timeFormat('%b %Y')(parse(g.from)));
  xLabels.append('tspan').attr('x', cx).attr('dy', 15).text((g) => '→ ' + timeFormat('%b %Y')(parse(g.to)));

  bindHover(
    hits as any,
    tip,
    (g: Gap) => [`${g.days} days`, `${fmtDay(parse(g.from))} → ${fmtDay(parse(g.to))}`],
    (g: Gap) => [cx(g), y(g.days)],
  );
}

interface LaneEvent {
  lane: 'seizure' | 'prodrome' | 'vet';
  date: string;
  title: string;
  detail: string;
}

const LANES = [
  { key: 'seizure', label: 'Seizures', color: 'var(--series-1)' },
  { key: 'prodrome', label: 'Warning signs', color: 'var(--series-2)' },
  { key: 'vet', label: 'Appointments', color: 'var(--series-3)' },
] as const;

function shapePath(lane: LaneEvent['lane'], cx: number, cy: number) {
  if (lane === 'seizure') {
    const r = 6;
    return `M${cx - r},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`;
  }
  if (lane === 'prodrome') {
    const r = 7.5;
    return `M${cx},${cy - r}L${cx + r},${cy}L${cx},${cy + r}L${cx - r},${cy}Z`;
  }
  const s = 5.5;
  return `M${cx - s},${cy - s}h${s * 2}v${s * 2}h${-s * 2}Z`;
}

function renderLanes(container: HTMLElement, events: LaneEvent[]) {
  const width = container.clientWidth;
  const laneH = 56;
  const margin = { top: 6, right: 12, bottom: 28, left: 12 };
  const height = margin.top + laneH * LANES.length + margin.bottom;
  const tip = tooltip(container);
  const today = new Date();

  select(container).select('svg').remove();
  const svg: SVG = select(container).insert('svg', ':first-child').attr('viewBox', `0 0 ${width} ${height}`).attr('height', height);

  const dates = events.map((e) => parse(e.date));
  const [lo, hi] = extent([...dates, today]) as [Date, Date];
  const pad = (hi.getTime() - lo.getTime()) * 0.04;
  const x = scaleTime()
    .domain([new Date(lo.getTime() - pad), new Date(hi.getTime() + pad)])
    .range([margin.left, width - margin.right]);

  const laneY = (i: number) => margin.top + i * laneH;
  const markY = (i: number) => laneY(i) + 36;

  LANES.forEach((lane, i) => {
    svg
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', markY(i))
      .attr('y2', markY(i));
    svg.append('text').attr('class', 'label-muted').attr('x', margin.left).attr('y', laneY(i) + 14).text(lane.label);
  });

  const months = width < 520 ? timeMonth.every(3) : timeMonth.every(1);
  const axis = axisBottom(x)
    .ticks(months!)
    .tickSize(0)
    .tickPadding(10)
    .tickFormat((d) => (timeYear(d as Date) < (d as Date) ? timeFormat('%b')(d as Date) : timeFormat('%Y')(d as Date)));
  const axisG = svg
    .append('g')
    .attr('transform', `translate(0,${margin.top + laneH * LANES.length})`)
    .call(axis);
  axisG.select('.domain').attr('class', 'baseline').attr('stroke', null);

  const tx = x(today);
  svg
    .append('line')
    .attr('class', 'baseline')
    .attr('x1', tx)
    .attr('x2', tx)
    .attr('y1', margin.top + 18)
    .attr('y2', margin.top + laneH * LANES.length);
  svg
    .append('text')
    .attr('class', 'label-muted')
    .attr('x', tx - 4)
    .attr('y', margin.top + 14)
    .attr('text-anchor', 'end')
    .text('Today');

  // Same-day events in a lane (e.g. a cluster) sit side by side.
  const placed = events.map((e) => {
    const laneIndex = LANES.findIndex((l) => l.key === e.lane);
    const siblings = events.filter((o) => o.lane === e.lane && o.date === e.date);
    const k = siblings.indexOf(e);
    return { ...e, laneIndex, cx: x(parse(e.date)) + (k - (siblings.length - 1) / 2) * 15, cy: markY(laneIndex), group: siblings.length };
  });

  const groups = svg.append('g').selectAll('g').data(placed).join('g');
  const hits = groups
    .append('circle')
    .attr('class', 'hit')
    .attr('cx', (d) => d.cx)
    .attr('cy', (d) => d.cy)
    .attr('r', 12);
  groups
    .append('path')
    .attr('class', 'mark')
    .attr('d', (d) => shapePath(d.lane, d.cx, d.cy))
    .style('fill', (d) => LANES[d.laneIndex].color)
    .style('stroke', 'var(--surface)')
    .style('stroke-width', 2);

  placed
    .filter((d) => d.group > 1 && d === placed.find((o) => o.lane === d.lane && o.date === d.date))
    .forEach((d) => {
      svg
        .append('text')
        .attr('class', 'label')
        .attr('x', d.cx - 12)
        .attr('y', d.cy)
        .attr('dy', '0.32em')
        .attr('text-anchor', 'end')
        .text(`${d.group} in a day`);
    });

  bindHover(
    hits as any,
    tip,
    (d: LaneEvent) => [d.title, `${fmtDay(parse(d.date))} · ${d.detail}`],
    (d: any) => [d.cx, d.cy - 8],
  );
}

function renderWeight(container: HTMLElement, points: { date: string; kg: number }[]) {
  const data = points.map((p) => ({ date: parse(p.date), kg: p.kg })).sort((a, b) => +a.date - +b.date);
  const width = container.clientWidth;
  const margin = { top: 16, right: 40, bottom: 28, left: 34 };
  const plotH = 160;
  const height = plotH + margin.top + margin.bottom;
  const tip = tooltip(container);

  select(container).select('svg').remove();
  const svg: SVG = select(container).insert('svg', ':first-child').attr('viewBox', `0 0 ${width} ${height}`).attr('height', height);

  const x = scaleTime()
    .domain(extent(data, (d) => d.date) as [Date, Date])
    .range([margin.left, width - margin.right]);
  const [kgLo, kgHi] = extent(data, (d) => d.kg) as [number, number];
  const y = scaleLinear()
    .domain([Math.floor(kgLo - 2), Math.ceil(kgHi + 2)])
    .nice()
    .range([margin.top + plotH, margin.top]);

  svg
    .append('g')
    .selectAll('line')
    .data(y.ticks(4))
    .join('line')
    .attr('class', 'grid-line')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', (d) => y(d))
    .attr('y2', (d) => y(d));
  svg
    .append('g')
    .attr('class', 'tick')
    .selectAll('text')
    .data(y.ticks(4))
    .join('text')
    .attr('x', margin.left - 8)
    .attr('y', (d) => y(d))
    .attr('dy', '0.32em')
    .attr('text-anchor', 'end')
    .text((d) => d);
  const axisG = svg
    .append('g')
    .attr('transform', `translate(0,${margin.top + plotH})`)
    .call(axisBottom(x).ticks(width < 520 ? 3 : 6).tickSize(0).tickPadding(10).tickFormat(timeFormat('%b %Y') as any));
  axisG.select('.domain').attr('class', 'baseline').attr('stroke', null);

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .style('stroke', 'var(--series-1)')
    .attr('stroke-width', 2)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line<{ date: Date; kg: number }>().x((d) => x(d.date)).y((d) => y(d.kg)));

  const last = data[data.length - 1];
  svg
    .append('text')
    .attr('class', 'label')
    .attr('x', x(last.date) + 8)
    .attr('y', y(last.kg))
    .attr('dy', '0.32em')
    .text(`${last.kg} kg`);

  const groups = svg.append('g').selectAll('g').data(data).join('g');
  const hits = groups.append('circle').attr('class', 'hit').attr('cx', (d) => x(d.date)).attr('cy', (d) => y(d.kg)).attr('r', 12);
  groups
    .append('circle')
    .attr('class', 'mark')
    .attr('cx', (d) => x(d.date))
    .attr('cy', (d) => y(d.kg))
    .attr('r', 4)
    .style('fill', 'var(--series-1)')
    .style('stroke', 'var(--surface)')
    .style('stroke-width', 2);
  bindHover(hits as any, tip, (d) => [`${d.kg} kg`, fmtDay(d.date)], (d) => [x(d.date), y(d.kg)]);
}

const RENDERERS: Record<string, (el: HTMLElement, data: any) => void> = {
  intervals: renderIntervals,
  lanes: renderLanes,
  weight: renderWeight,
};

document.querySelectorAll<HTMLElement>('[data-chart]').forEach((el) => {
  const render = RENDERERS[el.dataset.chart!];
  const data = JSON.parse(el.dataset.points ?? '[]');
  if (!render || !data.length) return;
  let lastWidth = 0;
  const draw = () => {
    if (el.clientWidth && el.clientWidth !== lastWidth) {
      lastWidth = el.clientWidth;
      render(el, data);
    }
  };
  new ResizeObserver(draw).observe(el);
  draw();
});
