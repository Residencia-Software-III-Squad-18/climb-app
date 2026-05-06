import { toast } from "sonner";

export const toastSucesso = (msg: string) => toast.success(msg);
export const toastErro = (msg: string) => toast.error(msg);
export const toastAlerta = (msg: string) => toast.warning(msg);
