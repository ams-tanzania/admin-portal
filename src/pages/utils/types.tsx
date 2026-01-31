export const ShipmentStatus = {
  AVAILABLE: 'available',
  ALMOST_FULL: 'almost_full',
  FULL: 'full',
} as const;

export type ShipmentStatus =
  (typeof ShipmentStatus)[keyof typeof ShipmentStatus];


export const PickupLocationType = {
  AT_OFFICE: 'at_office',
  OTHER_LOCATION: 'other_location',
} as const;

export type PickupLocationType =
  (typeof PickupLocationType)[keyof typeof PickupLocationType];


export const RequestStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
} as const;

export type RequestStatus =
  (typeof RequestStatus)[keyof typeof RequestStatus];


export interface Station {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  contactNumber: string;
  contactEmail: string;
  isActive: boolean;
  createdAt: string;
}

export interface ShippingSchedule {
  id: string;
  cargoName: string;
  startingPoint: string;
  startingDate: string;
  via: string[];
  endingPoint: string;
  estimatedArrivalDate: string;
  status: ShipmentStatus;
  availableCapacity: number;
  totalCapacity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  scheduleId: string;
  pickupLocationType: PickupLocationType;
  pickupLocation: string;
  pickupAddress?: string;
  deliveryLocationType: PickupLocationType;
  deliveryLocation: string;
  deliveryAddress?: string;
  cargoDescription: string;
  cargoWeight: number;
  cargoQuantity: number;
  specialInstructions?: string;
  status: RequestStatus;
  requestDate: string;
  approvedDate?: string;
  rejectionReason?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  roleName: string;
  stationId: string;
  stationName: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
}

export interface DashboardStats {
  totalSchedules: number;
  activeSchedules: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  inTransitShipments: number;
  deliveredShipments: number;
  totalStations: number;
  activeStaff: number;
  revenueThisMonth: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}