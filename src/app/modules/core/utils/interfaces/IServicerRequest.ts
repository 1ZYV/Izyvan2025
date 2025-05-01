import { ServiceStatus } from '../enums/EnumServiceStatus';
import { VehicleType } from '../enums/EnumVehicleTyoe';

export interface IServiceRequest {
  id: number;
  nameReference: string;
  status: ServiceStatus;
  pin: string;
  originAddress: string;
  destinationAddress: string;
  numberOfPassengers: number;
  vehicleType: VehicleType;
  date: string;
  price: number;
}
