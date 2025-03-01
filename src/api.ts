import axios from 'axios';
import { AWSEndpointData, AWSRegion, AWSService } from './types';

const AWS_ENDPOINT_URL = 'https://api.regional-table.region-services.aws.a2z.com/index.json';

export const fetchAWSData = async (): Promise<AWSEndpointData> => {
  try {
    console.log('Fetching AWS data from:', AWS_ENDPOINT_URL);
    const response = await axios.get<AWSEndpointData>(AWS_ENDPOINT_URL);
    console.log('AWS data response received');
    return response.data;
  } catch (error) {
    console.error('Error fetching AWS data:', error);
    throw error;
  }
};

export const getRegions = (data: AWSEndpointData): AWSRegion[] => {
  if (!data.prices || data.prices.length === 0) {
    return [];
  }

  // Extract unique regions from the prices array
  const uniqueRegions = new Set<string>();
  data.prices.forEach(price => {
    uniqueRegions.add(price.attributes['aws:region']);
  });
  
  // Convert to AWSRegion objects
  return Array.from(uniqueRegions).map(regionId => ({
    id: regionId,
    name: getRegionName(regionId),
    description: `AWS Region: ${regionId}`,
  }));
};

export const getServices = (data: AWSEndpointData): AWSService[] => {
  if (!data.prices || data.prices.length === 0) {
    return [];
  }

  // Group prices by service name
  const serviceMap = new Map<string, Set<string>>();
  
  data.prices.forEach(price => {
    const region = price.attributes['aws:region'];
    const serviceCode = price.id.split(':')[0]; // Extract service code from id (e.g., "translate:ap-east-1" -> "translate")
    
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

export const getServiceRegions = (data: AWSEndpointData, serviceCode: string): AWSRegion[] => {
  const allRegions = getRegions(data);
  
  // Find all regions where this service is available
  const supportedRegionIds = new Set<string>();
  
  data.prices.forEach(price => {
    if (price.id.startsWith(serviceCode + ':')) {
      supportedRegionIds.add(price.attributes['aws:region']);
    }
  });
  
  // Mark regions as supported or not
  return allRegions.map(region => ({
    ...region,
    isSupported: supportedRegionIds.has(region.id),
  }));
};

// Helper function to format service names
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

// Helper function to check if a string is a common AWS acronym
const isAcronym = (str: string): boolean => {
  const acronyms = ['api', 'ec2', 'ecs', 'eks', 'iam', 's3', 'rds', 'sns', 'sqs', 'vpc'];
  return acronyms.includes(str.toLowerCase());
};

// Helper function to get a friendly region name
export const getRegionName = (regionId: string): string => {
  const regionMap: Record<string, string> = {
    // North America
    'us-east-1': 'N. Virginia',
    'us-east-2': 'Ohio',
    'us-west-1': 'N. California',
    'us-west-2': 'Oregon',
    'ca-central-1': 'Canada Central',
    'ca-west-1': 'Calgary',
    'us-gov-east-1': 'GovCloud (US-East)',
    'us-gov-west-1': 'GovCloud (US-West)',
    'mx-central-1': 'Mexico',
    
    // South America
    'sa-east-1': 'São Paulo',
    
    // Europe
    'eu-central-1': 'Frankfurt',
    'eu-central-2': 'Zurich',
    'eu-west-1': 'Ireland',
    'eu-west-2': 'London',
    'eu-west-3': 'Paris',
    'eu-north-1': 'Stockholm',
    'eu-south-1': 'Milan',
    'eu-south-2': 'Spain',
    
    // Asia Pacific
    'ap-east-1': 'Hong Kong',
    'ap-south-1': 'Mumbai',
    'ap-south-2': 'Hyderabad',
    'ap-south-6': 'Auckland',
    'ap-northeast-1': 'Tokyo',
    'ap-northeast-2': 'Seoul',
    'ap-northeast-3': 'Osaka',
    'ap-southeast-1': 'Singapore',
    'ap-southeast-2': 'Sydney',
    'ap-southeast-3': 'Jakarta',
    'ap-southeast-4': 'Melbourne',
    'ap-southeast-5': 'Malaysia',
    'ap-southeast-6': 'Taiwan',
    'ap-southeast-7': 'Thailand',
    'cn-north-1': 'China (Beijing)',
    'cn-northwest-1': 'China (Ningxia)',
    
    // Middle East
    'me-south-1': 'Bahrain',
    'me-central-1': 'UAE',
    'me-south-2': 'Saudi Arabia',
    'il-central-1': 'Israel',
    
    // Africa
    'af-south-1': 'Cape Town',
  };
  
  return regionMap[regionId] || regionId;
}; 