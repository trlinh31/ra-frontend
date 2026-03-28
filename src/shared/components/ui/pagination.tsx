import * as React from "react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav role='navigation' aria-label='pagination' data-slot='pagination' className={cn("flex justify-end mx-auto w-full", className)} {...props} />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot='pagination-content' className={cn("flex items-center gap-2", className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot='pagination-item' {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
  return (
    <Button asChild variant={isActive ? "default" : "outline"} size={size} className={cn(className)}>
      <a aria-current={isActive ? "page" : undefined} data-slot='pagination-link' data-active={isActive} {...props} />
    </Button>
  );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink aria-label='Trang trước' size='default' className={cn("pl-1.5!", className)} {...props}>
      <ChevronLeftIcon data-icon='inline-start' />
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink aria-label='Trang tiếp' size='default' className={cn("pr-1.5!", className)} {...props}>
      <ChevronRightIcon data-icon='inline-end' />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn("flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}>
      <MoreHorizontalIcon />
      <span className='sr-only'>More pages</span>
    </span>
  );
}

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };
