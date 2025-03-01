import React from 'react';
import { AWSService } from '../types';
import { FaAws } from 'react-icons/fa';
import { awsColors } from '../utils/awsIcons';
import * as AWSIcons from 'aws-react-icons';

interface AWSServiceIconProps {
  service: AWSService;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Define a type for the AWS icon components
type AWSIconComponent = React.ComponentType<{
  size?: number;
  className?: string;
}>;

// Define a type for the AWSIcons module
interface AWSIconsModule {
  [key: string]: AWSIconComponent;
}

/**
 * A reusable component for displaying AWS service icons using aws-react-icons
 */
const AWSServiceIcon: React.FC<AWSServiceIconProps> = ({ 
  service, 
  size = 'md',
  className = '' 
}) => {
  // Determine icon size based on the size prop
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const containerSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizePx = {
    sm: 24,
    md: 32,
    lg: 40
  };

  // Map service code to aws-react-icons component name
  const getIconComponent = (): AWSIconComponent | null => {
    const serviceCode = service.serviceCode.toLowerCase();
    const typedAWSIcons = AWSIcons as AWSIconsModule;
    
    // The aws-react-icons package uses a different naming convention
    // Icons are prefixed with either "ArchitectureService" or "Resource"
    
    // Common mappings for service codes to aws-react-icons component names
    const commonMappings: Record<string, string> = {
      's3': 'ArchitectureServiceAmazonSimpleStorageServiceS3',
      'ec2': 'ArchitectureServiceAmazonEC2',
      'lambda': 'ArchitectureServiceAWSLambda',
      'dynamodb': 'ArchitectureServiceAmazonDynamoDB',
      'rds': 'ArchitectureServiceAmazonRDS',
      'cloudfront': 'ArchitectureServiceAmazonCloudFront',
      'route53': 'ArchitectureServiceAmazonRoute53',
      'api-gateway': 'ArchitectureServiceAmazonAPIGateway',
      'apigateway': 'ArchitectureServiceAmazonAPIGateway',
      'sns': 'ArchitectureServiceAmazonSimpleNotificationServiceSNS',
      'sqs': 'ArchitectureServiceAmazonSimpleQueueServiceSQS',
      'iam': 'ArchitectureServiceAWSIdentityAccessManagement',
      'cloudwatch': 'ArchitectureServiceAmazonCloudWatch',
      'cloudtrail': 'ArchitectureServiceAWSCloudTrail',
      'vpc': 'ArchitectureGroupVirtualprivatecloudVPC',
      'elasticache': 'ArchitectureServiceAmazonElastiCache',
      'elastic-beanstalk': 'ArchitectureServiceAWSElasticBeanstalk',
      'ecs': 'ArchitectureServiceAmazonECS',
      'eks': 'ArchitectureServiceAmazonEKS',
      'aurora': 'ArchitectureServiceAmazonAurora',
      'cognito': 'ArchitectureServiceAmazonCognito',
      'kinesis': 'ArchitectureServiceAmazonKinesis',
      'athena': 'ArchitectureServiceAmazonAthena',
      'glue': 'ArchitectureServiceAWSGlue',
      'step-functions': 'ArchitectureServiceAWSStepFunctions',
      'stepfunctions': 'ArchitectureServiceAWSStepFunctions',
      'fargate': 'ArchitectureServiceAWSFargate',
      'redshift': 'ArchitectureServiceAmazonRedshift',
      'sagemaker': 'ArchitectureServiceAmazonSageMaker',
      'eventbridge': 'ArchitectureServiceAmazonEventBridge',
      'secrets-manager': 'ArchitectureServiceAWSSecretsManager',
      'kms': 'ArchitectureServiceAWSKeyManagementService',
      'waf': 'ArchitectureServiceAWSWAF',
      'cloudformation': 'ArchitectureServiceAWSCloudFormation',
      'appsync': 'ArchitectureServiceAWSAppSync',
      'amplify': 'ArchitectureServiceAWSAmplify',
      'bedrock': 'ArchitectureServiceAmazonBedrock'
    };
    
    // Try to find the icon using the common mappings
    const mappedIconName = commonMappings[serviceCode];
    if (mappedIconName && typedAWSIcons[mappedIconName]) {
      return typedAWSIcons[mappedIconName];
    }
    
    // Try different naming patterns if not found in common mappings
    
    // Try with "ArchitectureServiceAmazon" prefix
    const amazonServiceName = serviceCode
      .split(/[-_\s]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    const amazonIconName = `ArchitectureServiceAmazon${amazonServiceName}`;
    if (typedAWSIcons[amazonIconName]) {
      return typedAWSIcons[amazonIconName];
    }
    
    // Try with "ArchitectureServiceAWS" prefix
    const awsIconName = `ArchitectureServiceAWS${amazonServiceName}`;
    if (typedAWSIcons[awsIconName]) {
      return typedAWSIcons[awsIconName];
    }
    
    // Try with "ResourceAmazon" prefix
    const resourceIconName = `ResourceAmazon${amazonServiceName}`;
    if (typedAWSIcons[resourceIconName]) {
      return typedAWSIcons[resourceIconName];
    }
    
    // Try with "ResourceAWS" prefix
    const resourceAwsIconName = `ResourceAWS${amazonServiceName}`;
    if (typedAWSIcons[resourceAwsIconName]) {
      return typedAWSIcons[resourceAwsIconName];
    }
    
    // If all else fails, return null and we'll use the fallback icon
    return null;
  };
  
  const IconComponent = getIconComponent();

  return (
    <div 
      className={`flex items-center justify-center bg-white rounded-md shadow-sm border border-gray-200 ${containerSizeClasses[size]} ${className}`}
    >
      {IconComponent ? (
        <IconComponent 
          size={iconSizePx[size]} 
          className={sizeClasses[size]} 
        />
      ) : (
        <FaAws 
          className={sizeClasses[size]} 
          style={{ color: awsColors.orange }} 
        />
      )}
    </div>
  );
};

export default AWSServiceIcon; 