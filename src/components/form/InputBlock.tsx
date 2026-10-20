type InputBlockProps = {
  label: string
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  type?: string
}

export default function InputBlock({
  label,
  placeholder,
  required,
  value,
  onChange,
  type = 'text',
}: InputBlockProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-slate-700">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[var(--paper-border)] bg-[var(--paper-surface)] px-3 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      />
    </div>
  )
}
