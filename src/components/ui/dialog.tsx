"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog@1.1.6";

import { cn } from "./utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 modal-backdrop-light dark:modal-backdrop-dark",
      className,
    )}
    style={{ zIndex: 10190 }}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
  // Always generate a unique ID for this dialog
  const generatedId = React.useId();
  const fallbackDescriptionId = `dialog-description-${generatedId}`;
  
  // Use provided aria-describedby or fall back to our generated one
  const finalAriaDescribedBy = ariaDescribedBy || fallbackDescriptionId;
  
  // Always inject a fallback description, but with conditional rendering for explicit ones
  const needsFallbackDescription = !ariaDescribedBy;
  
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] grid w-full translate-x-[-50%] translate-y-[-50%] duration-200 force-viewport-contained",
          className,
        )}
        style={{
          backgroundColor: 'var(--card)',
          opacity: '1',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
          padding: 'clamp(12px, 4vw, 20px)', // Адаптивные отступы
          gap: '12px',
          width: '100%',
          maxWidth: 'min(400px, calc(100vw - 32px))', // Адаптивная ширина
          minWidth: 'min(280px, calc(100vw - 48px))', // Минимальная ширина
          maxHeight: 'calc(100vh - 64px)', // Адаптивная высота
          overflow: 'hidden',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          zIndex: 10200 // ВЫСОКИЙ ПРИОРИТЕТ для XP модалки
        }}
        // Always ensure aria-describedby is set and not undefined
        aria-describedby={finalAriaDescribedBy || fallbackDescriptionId}
        {...props}
      >
        {/* Always inject a fallback description if no explicit aria-describedby was provided */}
        {needsFallbackDescription && (
          <DialogDescription id={fallbackDescriptionId} className="sr-only">
            Dialog window with interactive content
          </DialogDescription>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
