/**
 * Runs inside the page (pass it to page.evaluate): walks a laid-out element
 * and returns a flat, paint-ordered list of what to draw, in px relative to
 * the element. scene-to-svg.mjs turns the list into SVG.
 *
 * It understands exactly what the profile cards use, nothing more:
 *   - boxes: solid background, uniform solid/dashed border, border-radius
 *     (per corner, % or px), opacity, `overflow: hidden` clipping
 *   - text: one entry per line box, with the exact baseline
 *   - inline <svg> (icons, flags, the mascot) and <img> (the photo)
 *   - hints: data-shadow="sm|md|lg", data-anim="<class>", data-radial (a
 *     soft radial blob in `color`), data-vline (a dotted vertical line in
 *     `color`), data-age (the digits the daily workflow rewrites)
 * Paint order is DOM order, so decorations must come before content.
 */
export function exportScene(root) {
  const items = []
  const origin = root.getBoundingClientRect()
  const num = (value) => parseFloat(value) || 0
  const clear = (color) => color === 'transparent' || /rgba\(.*,\s*0\)$/.test(color)
  const place = (rect) => ({ x: rect.left - origin.left, y: rect.top - origin.top, w: rect.width, h: rect.height })

  function radii(cs, w, h) {
    const corner = (prop) => {
      const [a, b = a] = cs[prop].split(' ')
      const px = (value, size) => (value.endsWith('%') ? (parseFloat(value) / 100) * size : num(value))
      return [px(a, w), px(b, h)]
    }
    const r = {
      tl: corner('borderTopLeftRadius'),
      tr: corner('borderTopRightRadius'),
      br: corner('borderBottomRightRadius'),
      bl: corner('borderBottomLeftRadius'),
    }
    // CSS shrinks all radii together when neighbours would overlap.
    const f = Math.min(
      1,
      w / (r.tl[0] + r.tr[0] || w),
      w / (r.bl[0] + r.br[0] || w),
      h / (r.tl[1] + r.bl[1] || h),
      h / (r.tr[1] + r.br[1] || h),
    )
    for (const key of Object.keys(r)) r[key] = [r[key][0] * f, r[key][1] * f]
    return r
  }

  function font(cs) {
    return {
      family: cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, ''),
      weight: num(cs.fontWeight),
      size: num(cs.fontSize),
      letterSpacing: cs.letterSpacing === 'normal' ? 0 : num(cs.letterSpacing),
    }
  }

  function text(node, cs, parent) {
    const str = node.textContent
    if (!str.trim()) return
    const range = document.createRange()
    const charRect = (i) => {
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      return range.getClientRects()[0]
    }
    // A zero-size inline-block sits exactly on the baseline.
    const probe = document.createElement('span')
    probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'
    node.parentNode.insertBefore(probe, node)
    const first = [...str].findIndex((c) => !/\s/.test(c))
    const baselineOffset = probe.getBoundingClientRect().bottom - charRect(first).top
    probe.remove()

    const lines = []
    for (let i = 0; i < str.length; i++) {
      if (/\s/.test(str[i])) continue
      const rect = charRect(i)
      if (!rect) continue
      const line = lines.at(-1)
      if (line && Math.abs(line.top - rect.top) < 1) line.end = i + 1
      else lines.push({ start: i, end: i + 1, left: rect.left, top: rect.top })
    }
    for (const line of lines) {
      items.push({
        type: 'text',
        text: str.slice(line.start, line.end).replace(/\s+/g, ' '),
        x: line.left - origin.left,
        y: line.top - origin.top + baselineOffset,
        color: cs.color,
        age: parent.hasAttribute('data-age'),
        ...font(cs),
      })
    }
  }

  function walk(el) {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') return
    const box = place(el.getBoundingClientRect())
    const opacity = num(cs.opacity)
    const group = el.dataset.anim || opacity < 1
    if (group) items.push({ type: 'group-start', anim: el.dataset.anim || '', opacity })

    if (el instanceof SVGSVGElement) {
      const clone = el.cloneNode(true)
      for (const attr of ['class', 'style', 'aria-hidden']) clone.removeAttribute(attr)
      clone.setAttribute('x', box.x)
      clone.setAttribute('y', box.y)
      clone.setAttribute('width', box.w)
      clone.setAttribute('height', box.h)
      clone.setAttribute('color', cs.color)
      items.push({ type: 'svg', markup: new XMLSerializer().serializeToString(clone) })
    } else if (el instanceof HTMLImageElement) {
      items.push({
        type: 'img',
        ...box,
        href: el.currentSrc,
        radius: radii(cs, box.w, box.h),
        border: num(cs.borderTopWidth),
        borderColor: cs.borderTopColor,
        shadow: el.dataset.shadow || null,
      })
    } else if (el.hasAttribute('data-radial')) {
      items.push({ type: 'radial', ...box, color: cs.color })
    } else if (el.hasAttribute('data-vline')) {
      items.push({ type: 'vline', ...box, color: cs.color })
    } else {
      const fill = clear(cs.backgroundColor) ? null : cs.backgroundColor
      const border = num(cs.borderTopWidth)
      if (fill || border) {
        items.push({
          type: 'box',
          ...box,
          fill,
          border,
          borderColor: cs.borderTopColor,
          dashed: cs.borderTopStyle === 'dashed',
          radius: radii(cs, box.w, box.h),
          shadow: el.dataset.shadow || null,
        })
      }
      const clip = cs.overflow === 'hidden'
      if (clip) items.push({ type: 'clip-start', ...box, radius: radii(cs, box.w, box.h) })
      for (const child of [...el.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE) text(child, cs, el)
        else if (child.nodeType === Node.ELEMENT_NODE) walk(child)
      }
      if (clip) items.push({ type: 'clip-end' })
    }

    if (group) items.push({ type: 'group-end' })
  }

  walk(root)
  return { width: origin.width, height: origin.height, items }
}
