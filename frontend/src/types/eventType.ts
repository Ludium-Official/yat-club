export interface ParseEventType {
  event: EventType[][];
  totalEvent: number;
}

export interface EventType {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  location: string;
  image_url: string;
  is_private: boolean;
  max_participants: number;
  point_cost: number;
  price: string;
  token_type: string;
  receive_address: string;
  start_at: string;
  created_at: string;
  updated_at: string;
  reservation_count?: string;
}
