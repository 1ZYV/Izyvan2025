import { ServiceStatus } from '../enums/EnumServiceStatus';
import { VehicleType } from '../enums/EnumVehicleTyoe';
import { ITariff } from './ITariff';
import { IRouteEvent } from './IRouteEvent';

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

  rating?: number;

  tariff?: ITariff;
  tourismProviderId?: number;
  transportProviderId?: number;

  routeEvents?: IRouteEvent[];
}
