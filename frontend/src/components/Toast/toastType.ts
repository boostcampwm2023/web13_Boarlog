export interface ToastMessage {
  id: number;
  message: string;
  type: "alert" | "success" | "default";
}
