import { AWSEndpointData, AWSService } from '../types';

export interface RegionComparisonResult {
  supportedEverywhere: AWSService[];
  partiallySupportedServices: {
    service: AWSService;
    supportedRegions: string[];
    unsupportedRegions: string[];
  }[];
  unsupportedEverywhere: AWSService[];
}

/**
 * Compare multiple AWS regions to determine service availability
 * @param data The AWS endpoint data
 * @param regionIds Array of region IDs to compare
 * @returns Comparison results showing services supported everywhere, partially supported, or unsupported
 */
export const compareRegions = (
  data: AWSEndpointData,
  regionIds: string[]
): RegionComparisonResult => {
  if (!data.prices || data.prices.length === 0 || regionIds.length === 0) {
    return {
      supportedEverywhere: [],
      partiallySupportedServices: [],
      unsupportedEverywhere: []
    };
  }

  // Get all services
  const allServices = getAllServices(data);
  
  // Initialize result categories
  const supportedEverywhere: AWSService[] = [];
  const partiallySupportedServices: RegionComparisonResult['partiallySupportedServices'] = [];
  const unsupportedEverywhere: AWSService[] = [];

  // Check each service against the selected regions
  allServices.forEach(service => {
    const serviceRegions = service.regions;
    
    // Check if service is supported in all selected regions
    const isFullySupported = regionIds.every(regionId => 
      serviceRegions.includes(regionId)
    );
    
    // Check if service is not supported in any selected region
    const isUnsupported = regionIds.every(regionId => 
      !serviceRegions.includes(regionId)
    );
    
    // Service is partially supported if it's available in some but not all regions
    const isPartiallySupported = !isFullySupported && !isUnsupported;
    
    if (isFullySupported) {
      supportedEverywhere.push(service);
    } else if (isPartiallySupported) {
      // Determine which regions support and don't support this service
      const supportedRegions = regionIds.filter(regionId => 
        serviceRegions.includes(regionId)
      );
      
      const unsupportedRegions = regionIds.filter(regionId => 
        !serviceRegions.includes(regionId)
      );
      
      partiallySupportedServices.push({
        service,
        supportedRegions,
        unsupportedRegions
      });
    } else if (isUnsupported) {
      unsupportedEverywhere.push(service);
    }
  });

  // Sort results alphabetically by service name
  supportedEverywhere.sort((a, b) => a.name.localeCompare(b.name));
  partiallySupportedServices.sort((a, b) => a.service.name.localeCompare(b.service.name));
  unsupportedEverywhere.sort((a, b) => a.name.localeCompare(b.name));

  return {
    supportedEverywhere,
    partiallySupportedServices,
    unsupportedEverywhere
  };
};

/**
 * Get all AWS services from the endpoint data
 */
const getAllServices = (data: AWSEndpointData): AWSService[] => {
  // Group prices by service name
  const serviceMap = new Map<string, Set<string>>();
  
  data.prices.forEach(price => {
    const region = price.attributes['aws:region'];
    const serviceCode = price.id.split(':')[0]; // Extract service code from id
    
    if (!serviceMap.has(serviceCode)) {
      serviceMap.set(serviceCode, new Set<string>());
    }
    
    serviceMap.get(serviceCode)?.add(region);
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