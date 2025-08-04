"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | undefined>(undefined)

const useSheet = () => {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet")
  }
  return context
}

interface SheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Sheet = ({ children, open: controlledOpen, onOpenChange }: SheetProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return <SheetContext.Provider value={{ open, onOpenChange: setOpen }}>{children}</SheetContext.Provider>
}

interface SheetTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

const SheetTrigger = ({ children, asChild, className }: SheetTriggerProps) => {
  const { onOpenChange } = useSheet()

  const handleClick = () => {
    onOpenChange(true)
  }

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any
    return React.cloneElement(children, {
      ...childProps,
      onClick: (e: React.MouseEvent) => {
        if (childProps.onClick) {
          childProps.onClick(e)
        }
        handleClick()
      },
      className: cn(className, childProps.className),
    })
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}

interface SheetContentProps {
  children: React.ReactNode
  className?: string
  side?: "left" | "right" | "top" | "bottom"
}

const SheetContent = ({ children, className, side = "right" }: SheetContentProps) => {
  const { open, onOpenChange } = useSheet()

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onOpenChange])

  if (!open) return null

  const sideClasses = {
    left: "left-0 top-0 h-full w-3/4 max-w-sm translate-x-0",
    right: "right-0 top-0 h-full w-3/4 max-w-sm translate-x-0",
    top: "top-0 left-0 w-full h-3/4 max-h-sm translate-y-0",
    bottom: "bottom-0 left-0 w-full h-3/4 max-h-sm translate-y-0",
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div
        className={cn(
          "fixed bg-white shadow-lg transition-transform duration-300 ease-in-out",
          sideClasses[side],
          className,
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export { Sheet, SheetTrigger, SheetContent }
