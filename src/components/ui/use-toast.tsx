// Simplified version - you may want to install the full shadcn/ui toast component
import { useState, useEffect } from 'react'

type ToastProps = {
  title: string
  description?: string
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)
  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [toast])
  
  return { 
    toast: setToast,
    Toaster: () => toast ? (
      <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-md shadow-lg p-4 animate-in fade-in slide-in-from-bottom-5">
        <div className="font-medium">{toast.title}</div>
        {toast.description && <div className="text-sm text-muted-foreground">{toast.description}</div>}
      </div>
    ) : null
  }
}
