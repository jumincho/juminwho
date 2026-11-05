import { h } from './dom'

export interface Option<T extends string> {
  value: T
  label: string
}

/**
 * A segmented control: one pressed button among several, with a thumb that
 * slides under the pressed one. Arrow keys move between options.
 */
export function segmented<T extends string>(
  label: string,
  options: Option<T>[],
  initial: T,
  onChange: (value: T) => void,
): { el: HTMLElement; set: (value: T) => void } {
  const thumb = h('span', { class: 'segmented-thumb', 'aria-hidden': 'true' })
  const buttons = options.map((option) =>
    h('button', { type: 'button', 'data-value': option.value, 'aria-pressed': option.value === initial }, option.label),
  )
  const el = h('div', { class: 'segmented', role: 'group', 'aria-label': label }, thumb, ...buttons)
  let current = initial

  let placed = false
  const place = () => {
    const pressed = buttons.find((button) => button.dataset.value === current)
    if (!pressed || !pressed.offsetWidth) return
    // The first placement jumps. Only later changes slide.
    if (!placed) thumb.style.transition = 'none'
    thumb.style.width = `${pressed.offsetWidth}px`
    thumb.style.transform = `translateX(${pressed.offsetLeft}px)`
    if (!placed) {
      void thumb.offsetWidth
      thumb.style.transition = ''
      placed = true
    }
    // On a narrow screen the control scrolls sideways: keep the pressed option in view.
    if (el.scrollWidth > el.clientWidth) {
      const left = pressed.offsetLeft - 4
      const right = pressed.offsetLeft + pressed.offsetWidth + 4
      if (left < el.scrollLeft) el.scrollLeft = left
      else if (right > el.scrollLeft + el.clientWidth) el.scrollLeft = right - el.clientWidth
    }
  }

  const set = (value: T) => {
    current = value
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.value === value))
    place()
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const value = button.dataset.value as T
      if (value === current) return
      set(value)
      onChange(value)
    })
    button.addEventListener('keydown', (event) => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
      if (!step) return
      event.preventDefault()
      const next = buttons[(index + step + buttons.length) % buttons.length]
      next.focus()
      next.click()
    })
  })

  // The thumb needs real sizes: place it once fonts and layout settle, and whenever the control resizes.
  requestAnimationFrame(place)
  document.fonts?.ready.then(place)
  if ('ResizeObserver' in window) new ResizeObserver(place).observe(el)
  return { el, set }
}

/** An on/off switch with a visible label. */
export function toggle(label: string, initial: boolean, onChange: (on: boolean) => void): HTMLElement {
  const button = h(
    'button',
    { type: 'button', class: 'switch', role: 'switch', 'aria-checked': initial },
    h('span', { class: 'switch-track', 'aria-hidden': 'true' }, h('span', { class: 'switch-knob' })),
    h('span', { class: 'switch-label' }, label),
  )
  button.addEventListener('click', () => {
    const on = button.getAttribute('aria-checked') !== 'true'
    button.setAttribute('aria-checked', String(on))
    onChange(on)
  })
  return button
}
