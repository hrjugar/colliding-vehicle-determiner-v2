import { forwardRef } from "react";
import { cn } from "../../utils/style";

export const AddModalSection = forwardRef<
  HTMLElement,
  React.ComponentPropsWithRef<"section">
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "flex flex-col justify-start items-stretch gap-4 px-6 py-4 bg-white border-cool-gray-300",
      className
    )}
    {...props}
  />
));

export const AddModalHeader = forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithRef<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm font-medium text-cool-gray-900",
      className
    )}
    {...props}
  />
));

export const AddModalField = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<"div">
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col justify-start items-stretch gap-2",
        className
      )}
      {...props}
    />
  ));

export const AddModalFieldLabel = forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithRef<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm text-cool-gray-500",
      className
    )}
    {...props}
  />
));

export const AddModalFieldInputWrapper = forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithRef<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "w-full flex flex-row justify-start items-center gap-2.5 px-4 py-2 rounded-lg bg-cool-gray-100 text-sm text-cool-gray-500 overflow-hidden",
      className
    )}
    {...props}
  />
));