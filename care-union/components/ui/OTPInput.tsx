'use client'
import { useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps { value: string; onChange: (val: string) => void; length?: number; disabled?: boolean; className?: string }

export function OTPInput({ value, onChange, length = 6, disabled, className }: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length }, (_, i) => value[i] || '')
  const focusIndex = (i: number) => inputsRef.current[Math.max(0, Math.min(i, length - 1))]?.focus()

  const handleChange = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return
    const arr = digits.slice(); arr[i] = char
    onChange(arr.join(''))
    if (char && i < length - 1) focusIndex(i + 1)
  }
  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[i]) handleChange(i, '')
      else if (i > 0) { focusIndex(i - 1); handleChange(i - 1, '') }
    } else if (e.key === 'ArrowLeft') focusIndex(i - 1)
    else if (e.key === 'ArrowRight') focusIndex(i + 1)
  }
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(text.padEnd(length, '').slice(0, length))
    focusIndex(Math.min(text.length, length - 1))
  }

  return (
    <div className={cn('flex items-center gap-2 justify-center', className)}>
      {digits.map((digit, i) => (
        <input key={i} ref={el => { inputsRef.current[i] = el }} type="text" inputMode="numeric" maxLength={1} value={digit} disabled={disabled}
          onChange={e => handleChange(i, e.target.value.slice(-1))} onKeyDown={e => handleKeyDown(i, e)} onPaste={handlePaste} onFocus={e => e.target.select()}
          className={cn('w-11 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:border-navy-600 focus:bg-white bg-slate-50 text-navy-900', digit ? 'border-navy-500 bg-white' : 'border-slate-200', disabled && 'opacity-50 cursor-not-allowed')}
          aria-label={`OTP digit ${i + 1}`} autoComplete="one-time-code" />
      ))}
    </div>
  )
}
