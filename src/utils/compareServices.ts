import { AWSEndpointData, AWSService } from '../types';

export interface ServiceComparisonResult {
  availableInAllServices: string[]; // Regions available in all selected services
  partiallyAvailableRegions: {
    region: string;
    supportedServices: AWSService[];
    unsupportedServices: AWSService[];
  }[];
  unavailableInAllServices: string[]; // Regions not available in any selected service
}

/**
 * Compare multiple AWS services to determine regional availability
 * @param data The AWS endpoint data
 * @param serviceCodes Array of service codes to compare
 * @returns Comparison results showing regions available in all services, partially available, or unavailable
 */
export const compareServices = (
  data: AWSEndpointData,
  serviceCodes: string[]
): ServiceComparisonResult => {
  if (!data.prices || data.prices.length === 0 || serviceCodes.length === 0) {
    return {
      availableInAllServices: [],
      partiallyAvailableRegions: [],
      unavailableInAllServices: []
    };
  }

  // Get all services
  const selectedServices = getSelectedServices(data, serviceCodes);
  
  // Get all regions from the data
  const allRegions = getAllRegions(data);
  
  // Initialize result categories
  const availableInAllServices: string[] = [];
  const partiallyAvailableRegions: ServiceComparisonResult['partiallyAvailableRegions'] = [];
  const unavailableInAllServices: string[] = [];

  // Check each region against the selected services
  allRegions.forEach(regionId => {
    // Check if region is supported in all selected services
    const isFullyAvailable = selectedServices.every(service => 
      service.regions.includes(regionId)
    );
    
    // Check if region is not supported in any selected service
    const isUnavailable = selectedServices.every(service => 
      !service.regions.includes(regionId)
    );
    
    // Region is partially available if it's available in some but not all services
    const isPartiallyAvailable = !isFullyAvailable && !isUnavailable;
    
    if (isFullyAvailable) {
      availableInAllServices.push(regionId);
    } else if (isPartiallyAvailable) {
      // Determine which services support and don't support this region
      const supportedServices = selectedServices.filter(service => 
        service.regions.includes(regionId)
      );
      
      const unsupportedServices = selectedServices.filter(service => 
        !service.regions.includes(regionId)
      );
      
      partiallyAvailableRegions.push({
        region: regionId,
        supportedServices,
        unsupportedServices
      });
    } else if (isUnavailable) {
      unavailableInAllServices.push(regionId);
    }
  });

  // Sort results alphabetically by region ID
  availableInAllServices.sort();
  partiallyAvailableRegions.sort((a, b) => a.region.localeCompare(b.region));
  unavailableInAllServices.sort();

  return {
    availableInAllServices,
    partiallyAvailableRegions,
    unavailableInAllServices
  };
};

/**
 * Get selected AWS services from the endpoint data
 */
const getSelectedServices = (data: AWSEndpointData, serviceCodes: string[]): AWSService[] => {
  // Group prices by service name
  const serviceMap = new Map<string, Set<string>>();
  
  data.prices.forEach(price => {
    const region = price.attributes['aws:region'];
    const serviceCode = price.id.split(':')[0]; // Extract service code from id
    
    if (serviceCodes.includes(serviceCode)) {
      if (!serviceMap.has(serviceCode)) {
        serviceMap.set(serviceCode, new Set<string>());
      }
      
      serviceMap.get(serviceCode)?.add(region);
    }
  });
  
  // Convert to AWSService objects
  return Array.from(serviceMap.entries()).map(([serviceCode, regions]) => {
    // Find a price entry for this service to get the full name
    const priceEntry = data.prices.find(price => price.id.startsWith(serviceCode + ':'));
    const serviceName = priceEntry ? priceEntry.attributes['aws:serviceName'] : formatServiceName(serviceCode);
    
    return {
      id: serviceCode,
      name: serviceName,
      serviceCode,
      regions: Array.from(regions),
    };
  });
};

/**
 * Get all regions from the AWS endpoint data
 */
const getAllRegions = (data: AWSEndpointData): string[] => {
  const regions = new Set<string>();
  
  data.prices.forEach(price => {
    const region = price.attributes['aws:region'];
    regions.add(region);
  });
  
  return Array.from(regions);
};

/**
 * Format service code into a readable name
 */
const formatServiceName = (serviceCode: string): string => {
  // Convert service codes like "dynamodb" to "DynamoDB" or "api-gateway" to "API Gateway"
  return serviceCode
    .split('-')
    .map(part => {
      // Special case for acronyms like "api", "ec2", etc.
      if (isAcronym(part)) {
        return part.toUpperCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
};

/**
 * Check if a string is a common AWS acronym
 */
const isAcronym = (str: string): boolean => {
  const acronyms = ['api', 'ec2', 'ecs', 'eks', 'iam', 's3', 'rds', 'sns', 'sqs', 'vpc'];
  return acronyms.includes(str.toLowerCase());
}; 