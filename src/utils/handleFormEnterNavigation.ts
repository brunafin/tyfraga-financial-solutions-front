import type { KeyboardEvent } from "react";

const NAVIGATION_SELECTOR = [
  "[data-form-field]:not([disabled])",
  "[data-form-action]:not([disabled])",
  'button[type="submit"]:not([disabled])',
].join(", ");

export function handleFormEnterNavigation(
  event: KeyboardEvent<HTMLFormElement>,
) {
  if (event.key !== "Enter" || event.nativeEvent.isComposing) return;

  const target = event.target as HTMLElement | null;
  if (!target?.matches(NAVIGATION_SELECTOR)) return;

  const form = event.currentTarget;
  const elements = Array.from(
    form.querySelectorAll<HTMLElement>(NAVIGATION_SELECTOR),
  );

  const currentIndex = elements.indexOf(target);
  if (currentIndex === -1 || currentIndex >= elements.length - 1) return;

  event.preventDefault();
  elements[currentIndex + 1].focus();
}
