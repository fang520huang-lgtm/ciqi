import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
function SheetContent({ className, children, side = "right", ...props }: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: "right" | "left" }) {
  return <SheetPrimitive.Portal><SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" /><SheetPrimitive.Content className={cn("fixed inset-y-0 z-50 h-full w-3/4 max-w-sm bg-background p-6 shadow-xl", side === "right" ? "right-0 border-l" : "left-0 border-r", className)} {...props}>{children}<SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"><XIcon className="size-5"/><span className="sr-only">关闭</span></SheetPrimitive.Close></SheetPrimitive.Content></SheetPrimitive.Portal>
}
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) { return <div className={cn("flex flex-col gap-1.5", className)} {...props} /> }
function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) { return <SheetPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} /> }

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle }
