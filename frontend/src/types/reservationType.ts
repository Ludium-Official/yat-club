export interface ReservationType {
  event_id: number;
  event_image_url: string;
  event_is_private: boolean;
  event_location: string;
  event_start_at: string;
  event_title: string;
  reservation_id: number;
  reservation_status: "confirmed" | "rejected" | "completed";
}
