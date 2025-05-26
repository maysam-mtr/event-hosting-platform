import { useToast } from "../../hooks/use-toast"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md flex items-start justify-between ${
            toast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background border"
          }`}
          style={{ minWidth: "300px", maxWidth: "500px" }}
        >
          <div>
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
          </div>
          <button onClick={() => dismiss(toast.id)} className="ml-4 p-1 rounded-full hover:bg-muted">
          {/* <button onClick={() => dismiss(toast.id)} className="ml-4 p-1 rounded-full hover:bg-muted" title="Dismiss"> */}
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
