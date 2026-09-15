import { toast as sonnerToast } from "sonner"

// Thin shim so call sites can use the shadcn-style API
// (toast({ title, description, variant })) while the actual
// rendering is handled by Sonner (already a project dependency)
// via the <Toaster /> mounted in src/components/ui/toaster.jsx.
export function toast({ title, description, variant } = {}) {
  const message = title ?? description
  const options = title && description ? { description } : undefined

  if (variant === "destructive") {
    return sonnerToast.error(message, options)
  }
  return sonnerToast(message, options)
}

export function useToast() {
  return { toast }
}
