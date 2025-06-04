import { ServiceStatus } from "../enums/EnumServiceStatus";
import { IServiceRequest } from "./IServicerRequest";
import { ITariff } from "./ITariff";

export interface IService {
    id: number; // Unique identifier for the service
    serviceRequestId: IServiceRequest; // Identifier for the service request
    tariffs: ITariff[]; // Array of tariffs associated with the service
    status: ServiceStatus; // Current status of the service
}