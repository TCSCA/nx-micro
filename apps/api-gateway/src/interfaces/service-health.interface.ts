export interface ServiceHealth {
    status: string;
    service: string;
    timestamp?: string;
    error?: string;
}

export interface AllServicesHealth {
    gateway: ServiceHealth;
    services: ServiceHealth[];
}

export interface ServiceResponse {
    success: boolean;
    data?: any;
    error?: string;
    timestamp: string;
}
