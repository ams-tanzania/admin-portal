export interface ShippingRequest {
  id: string;
  station: string;
  pickupLocation: 'home' | 'office';
  pickupAddress?: string;
  deliveryLocation: 'home' | 'office';
  deliveryAddress?: string;
  cargoName: string;
  cargoDescription: string;
  status: 'Rejected' | 'Accepted';
  shippingStatus: 'Processing' | 'Loaded' | 'In Transit' | 'Arrived' | 'Delivered';
  paymentStatus: 'Not Paid' | 'Paid';
  customerName?: string;
  customerId?: string;
  issuedBy?: string;
  issuedById?: string;
  createdAt: string;
  updatedAt: string;
}