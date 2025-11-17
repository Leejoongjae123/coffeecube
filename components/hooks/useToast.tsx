import { toast } from "sonner";

export const useToast = () => {
  const success = (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: "top-center",
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      duration: 3000,
      position: "top-center",
    });
  };

  return { success, error };
};
