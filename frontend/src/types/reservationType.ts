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

export interface ReservationForUserType {
  reservation_id: number;
  reservation_status: "confirmed" | "rejected" | "completed";
  user_email: string;
  user_id: number;
  user_name: string;
}
