'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { classNames } from '../../lib/classNames'

export type SelectOption = {
  value: string
  label: string
  suffix?: string
  disabled?: boolean
}

export type SelectProps = {
  value?: string
  onChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
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

export default function Select({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled,
  className,
  triggerClassName,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  const selected = useMemo(
    () => (value ? options.find((o) => o.value === value) : undefined),
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
    const selectedIndex = value ? enabledOptions.findIndex((o) => o.value === value) : -1
    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0
    setActiveIndex(nextIndex)
    requestAnimationFrame(() => {
      optionRefs.current[nextIndex]?.focus()
    })
  }, [enabledOptions, open, value])

  useEffect(() => {
    if (!open) return
    optionRefs.current[activeIndex]?.focus()
  }, [activeIndex, open])

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
      if (next) {
        onChange?.(next.value)
        setOpen(false)
        triggerRef.current?.focus()
      }
      return
    }
  }

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
          'w-full h-11 shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-left flex items-center justify-between gap-3 shadow-sm transition',
          'outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20',
          disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'hover:bg-white hover:border-slate-300',
          triggerClassName,
        )}
      >
        <span className={classNames('truncate', selected ? 'text-slate-800 font-medium' : 'text-slate-500')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={classNames(
            'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
            open && 'rotate-180 text-blue-600',
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="absolute z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_25px_-8px_rgba(15,23,42,0.12),0_4px_10px_-4px_rgba(15,23,42,0.08)]"
        >
          <div className="max-h-72 overflow-auto p-1">
            {enabledOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">暂无选项</div>
            ) : null}
            {enabledOptions.map((o, i) => {
              const selectedNow = o.value === value
              const activeNow = i === activeIndex
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={selectedNow}
                  ref={(el) => {
                    optionRefs.current[i] = el
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    onChange?.(o.value)
                    setOpen(false)
                    triggerRef.current?.focus()
                  }}
                  className={classNames(
                    'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors',
                    activeNow ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50',
                    selectedNow && 'font-semibold',
                  )}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate">{o.label}</span>
                    {o.suffix ? (
                      <span className="shrink-0 text-[11px] font-medium text-slate-400">{o.suffix}</span>
                    ) : null}
                  </span>
                  {selectedNow ? (
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
