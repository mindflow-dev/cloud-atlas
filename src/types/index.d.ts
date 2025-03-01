export interface AWSService {
  id: string;
  name: string;
  serviceCode: string;
  regions: string[];
}

export interface AWSRegion {
  id: string;
  name: string;
  description: string;
  isSupported?: boolean;
}

export interface AWSEndpointData {
  metadata: {
    copyright: string;
    disclaimer: string;
    'format:version': string;
    'source:version': string;
  };
  prices: Array<{
    id: string;
    attributes: {
      'aws:region': string;
      'aws:serviceName': string;
      'aws:serviceUrl': string;
    };
  }>;
} 