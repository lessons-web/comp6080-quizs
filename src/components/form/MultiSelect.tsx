import { useEffect, useMemo, useRef, useState } from 'react'

import { classNames } from '../../lib/classNames'
import type { SelectOption } from './Select'

export type MultiSelectProps = {
  value: string[]
  onChange?: (value: string[]) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  clearable?: boolean
  onClear?: () => void
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 5.75 8 10.25l4.5-4.5"
      />
    </svg>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8.5 6.5 12 13 4.5"
      />
    </svg>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M4 4l8 8M12 4l-8 8"
      />
    </svg>
  )
}

export default function MultiSelect({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled,
  className,
  triggerClassName,
  clearable = true,
  onClear,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  const selectedOptions = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value],
  )
  const enabledOptions = useMemo(
    () => options.filter((o) => !o.disabled),
    [options],
  )

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (wrapperRef.current && !wrapperRef.current.contains(t)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setActiveIndex(0)
    requestAnimationFrame(() => {
      optionRefs.current[0]?.focus()
    })
  }, [open])

  useEffect(() => {
    if (!open) return
    optionRefs.current[activeIndex]?.focus()
  }, [activeIndex, open])

  const toggleValue = (v: string) => {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v]
    onChange?.(next)
  }

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((prev) => !prev)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (enabledOptions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, enabledOptions.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      setActiveIndex(0)
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      setActiveIndex(enabledOptions.length - 1)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const next = enabledOptions[activeIndex]
      if (next) toggleValue(next.value)
      return
    }
  }

  const visibleTags = selectedOptions.slice(0, 2)
  const restCount = Math.max(0, selectedOptions.length - visibleTags.length)

  return (
    <div ref={wrapperRef} className={classNames('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={onTriggerKeyDown}
        className={classNames(
          'w-full min-h-11 shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm text-left flex items-center justify-between gap-2 shadow-sm transition',
          'outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20',
          disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'hover:bg-white hover:border-slate-300',
          triggerClassName,
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selectedOptions.length === 0 ? (
            <span className="px-1 text-slate-500 truncate">{placeholder}</span>
          ) : (
            <>
              {visibleTags.map((s) => (
                <span
                  key={s.value}
                  className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 max-w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="truncate">{s.label}</span>
                  {!disabled ? (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleValue(s.value)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleValue(s.value)
                        }
                      }}
                      className="cursor-pointer rounded-sm text-blue-500 transition hover:bg-blue-100 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  ) : null}
                </span>
              ))}
              {restCount > 0 ? (
                <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  +{restCount}
                </span>
              ) : null}
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {clearable && value.length > 0 && !disabled ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="清除所有选项"
              onClick={(e) => {
                e.stopPropagation()
                onChange?.([])
                onClear?.()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange?.([])
                  onClear?.()
                }
              }}
              className="flex h-5 w-5 items-center justify-center rounded text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-3 w-3" />
            </span>
          ) : null}
          <ChevronDown
            className={classNames(
              'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
              open && 'rotate-180 text-blue-600',
            )}
          />
        </div>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-multiselectable="true"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="absolute z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_25px_-8px_rgba(15,23,42,0.12),0_4px_10px_-4px_rgba(15,23,42,0.08)]"
        >
          <div className="max-h-72 overflow-auto p-1">
            {enabledOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">暂无选项</div>
            ) : null}
            {enabledOptions.map((o, i) => {
              const checked = value.includes(o.value)
              const activeNow = i === activeIndex
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={checked}
                  ref={(el) => {
                    optionRefs.current[i] = el
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => toggleValue(o.value)}
                  className={classNames(
                    'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors',
                    activeNow ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50',
                    checked && 'font-semibold',
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {checked ? (
                    <Check className="h-4 w-4 shrink-0 text-blue-600" />
                  ) : (
                    <span className="h-4 w-4 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
