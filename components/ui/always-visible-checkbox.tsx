"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AlwaysVisibleCheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  className?: string;
}

const AlwaysVisibleCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  AlwaysVisibleCheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-full border border-[#909092] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-[#909092] data-[state=checked]:bg-primary data-[state=checked]:border-primary relative flex items-center justify-center",
      className
    )}
    {...props}
  >
    {/* 항상 체크 아이콘을 표시 */}
    <div className="flex items-center justify-center absolute inset-0">
      <Image
        src="/check.svg"
        alt="check"
        width={8}
        height={6}
        className="object-contain"
      />
    </div>
  </CheckboxPrimitive.Root>
));

AlwaysVisibleCheckbox.displayName = "AlwaysVisibleCheckbox";

export { AlwaysVisibleCheckbox };
