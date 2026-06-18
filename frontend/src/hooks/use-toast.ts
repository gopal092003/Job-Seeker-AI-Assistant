// src/hooks/use-toast.ts

import { toast } from "sonner";

export { toast };

export function successToast(message: string) {
  toast.success(message);
}

export function errorToast(message: string) {
  toast.error(message);
}