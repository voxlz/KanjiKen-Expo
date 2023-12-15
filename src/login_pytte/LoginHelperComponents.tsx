import { FC } from "react"

export type Form = {
  name: string
  email: string
  password: string
}

export const BorderBox: FC<{ className?: string; error?: boolean }> = ({
  children,
  error,
  className,
}) => (
  <div
    className={
      (error ? "ring-2 ring-red-200 focus-within:ring-red-400" : "") +
      " border border-lineColor px-3 rounded-xl w-full flex h-11 items-center focus-within:ring-2  group-focus:ring-2  select-none bg-background dark:bg-black " +
      className
    }
  >
    {children}
  </div>
)

export const BorderBoxBtn: FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={
      " border border-lineColor px-3 rounded-xl w-full flex h-11 items-center focus-within:ring-2  group-focus:ring-2  select-none bg-white dark:bg-black shadow-sm hover:bg-background " +
      className
    }
  >
    {children}
  </div>
)

export const LineBreak: FC<{ text: string }> = ({ text }) => (
  <div className='h-5 my-2 flex w-full'>
    <div className='border-b flex-grow mb-1 w-1 border-lineColor'></div>
    <p className='mx-2 font-bold text-xs text-weakColor self-end'>{text}</p>
    <div className='border-b flex-grow mb-1 border-lineColo'></div>
  </div>
)
