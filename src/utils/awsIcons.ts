import { AWSService } from '../types';

// Base URL for AWS icons - using the official AWS Architecture Icons
const baseUrl = "https://d1.awsstatic.com/icons/q1-2023";

// Map of service codes to their icon paths
const iconPaths: Record<string, string> = {
  // Storage
  's3': '/Storage/Amazon-S3-Standard_48.svg',
  'ebs': '/Storage/Amazon-Elastic-Block-Store_48.svg',
  'efs': '/Storage/Amazon-Elastic-File-System_48.svg',
  'glacier': '/Storage/Amazon-S3-Glacier_48.svg',
  's3-glacier': '/Storage/Amazon-S3-Glacier_48.svg',
  
  // Compute
  'ec2': '/Compute/Amazon-EC2_48.svg',
  'lambda': '/Compute/AWS-Lambda_48.svg',
  'ecs': '/Compute/Amazon-Elastic-Container-Service_48.svg',
  'eks': '/Compute/Amazon-Elastic-Kubernetes-Service_48.svg',
  'fargate': '/Compute/AWS-Fargate_48.svg',
  'lightsail': '/Compute/Amazon-Lightsail_48.svg',
  'batch': '/Compute/AWS-Batch_48.svg',
  'elastic-beanstalk': '/Compute/AWS-Elastic-Beanstalk_48.svg',
  
  // Database
  'rds': '/Database/Amazon-RDS_48.svg',
  'dynamodb': '/Database/Amazon-DynamoDB_48.svg',
  'aurora': '/Database/Amazon-Aurora_48.svg',
  'redshift': '/Database/Amazon-Redshift_48.svg',
  'elasticache': '/Database/Amazon-ElastiCache_48.svg',
  'documentdb': '/Database/Amazon-DocumentDB_48.svg',
  'neptune': '/Database/Amazon-Neptune_48.svg',
  'timestream': '/Database/Amazon-Timestream_48.svg',
  'keyspaces': '/Database/Amazon-Keyspaces_48.svg',
  'qldb': '/Database/Amazon-QLDB_48.svg',
  
  // Networking
  'vpc': '/NetworkingContentDelivery/Amazon-Virtual-Private-Cloud_48.svg',
  'route53': '/NetworkingContentDelivery/Amazon-Route-53_48.svg',
  'cloudfront': '/NetworkingContentDelivery/Amazon-CloudFront_48.svg',
  'apigateway': '/NetworkingContentDelivery/Amazon-API-Gateway_48.svg',
  'api-gateway': '/NetworkingContentDelivery/Amazon-API-Gateway_48.svg',
  'elb': '/NetworkingContentDelivery/Elastic-Load-Balancing_48.svg',
  'global-accelerator': '/NetworkingContentDelivery/AWS-Global-Accelerator_48.svg',
  'app-mesh': '/NetworkingContentDelivery/AWS-App-Mesh_48.svg',
  'direct-connect': '/NetworkingContentDelivery/AWS-Direct-Connect_48.svg',
  'transit-gateway': '/NetworkingContentDelivery/AWS-Transit-Gateway_48.svg',
  
  // Analytics
  'athena': '/Analytics/Amazon-Athena_48.svg',
  'emr': '/Analytics/Amazon-EMR_48.svg',
  'kinesis': '/Analytics/Amazon-Kinesis_48.svg',
  'quicksight': '/Analytics/Amazon-QuickSight_48.svg',
  'glue': '/Analytics/AWS-Glue_48.svg',
  'data-pipeline': '/Analytics/AWS-Data-Pipeline_48.svg',
  'lake-formation': '/Analytics/AWS-Lake-Formation_48.svg',
  'opensearch': '/Analytics/Amazon-OpenSearch-Service_48.svg',
  'elasticsearch': '/Analytics/Amazon-OpenSearch-Service_48.svg',
  
  // Security
  'iam': '/SecurityIdentityCompliance/AWS-Identity-and-Access-Management_48.svg',
  'cognito': '/SecurityIdentityCompliance/Amazon-Cognito_48.svg',
  'kms': '/SecurityIdentityCompliance/AWS-Key-Management-Service_48.svg',
  'waf': '/SecurityIdentityCompliance/AWS-WAF_48.svg',
  'shield': '/SecurityIdentityCompliance/AWS-Shield_48.svg',
  'secrets-manager': '/SecurityIdentityCompliance/AWS-Secrets-Manager_48.svg',
  'guardduty': '/SecurityIdentityCompliance/Amazon-GuardDuty_48.svg',
  'inspector': '/SecurityIdentityCompliance/Amazon-Inspector_48.svg',
  'macie': '/SecurityIdentityCompliance/Amazon-Macie_48.svg',
  'certificate-manager': '/SecurityIdentityCompliance/AWS-Certificate-Manager_48.svg',
  
  // AI/ML
  'sagemaker': '/MachineLearning/Amazon-SageMaker_48.svg',
  'comprehend': '/MachineLearning/Amazon-Comprehend_48.svg',
  'rekognition': '/MachineLearning/Amazon-Rekognition_48.svg',
  'translate': '/MachineLearning/Amazon-Translate_48.svg',
  'polly': '/MachineLearning/Amazon-Polly_48.svg',
  'textract': '/MachineLearning/Amazon-Textract_48.svg',
  'forecast': '/MachineLearning/Amazon-Forecast_48.svg',
  'lex': '/MachineLearning/Amazon-Lex_48.svg',
  'personalize': '/MachineLearning/Amazon-Personalize_48.svg',
  
  // Management
  'cloudwatch': '/ManagementGovernance/Amazon-CloudWatch_48.svg',
  'cloudtrail': '/ManagementGovernance/AWS-CloudTrail_48.svg',
  'cloudformation': '/ManagementGovernance/AWS-CloudFormation_48.svg',
  'config': '/ManagementGovernance/AWS-Config_48.svg',
  'organizations': '/ManagementGovernance/AWS-Organizations_48.svg',
  'systems-manager': '/ManagementGovernance/AWS-Systems-Manager_48.svg',
  'control-tower': '/ManagementGovernance/AWS-Control-Tower_48.svg',
  'trusted-advisor': '/ManagementGovernance/AWS-Trusted-Advisor_48.svg',
  'auto-scaling': '/ManagementGovernance/AWS-Auto-Scaling_48.svg',
  
  // Developer Tools
  'codecommit': '/DeveloperTools/AWS-CodeCommit_48.svg',
  'codebuild': '/DeveloperTools/AWS-CodeBuild_48.svg',
  'codedeploy': '/DeveloperTools/AWS-CodeDeploy_48.svg',
  'codepipeline': '/DeveloperTools/AWS-CodePipeline_48.svg',
  'codestar': '/DeveloperTools/AWS-CodeStar_48.svg',
  'cloud9': '/DeveloperTools/AWS-Cloud9_48.svg',
  'x-ray': '/DeveloperTools/AWS-X-Ray_48.svg',
  
  // Application Integration
  'sns': '/ApplicationIntegration/Amazon-Simple-Notification-Service_48.svg',
  'sqs': '/ApplicationIntegration/Amazon-Simple-Queue-Service_48.svg',
  'eventbridge': '/ApplicationIntegration/Amazon-EventBridge_48.svg',
  'stepfunctions': '/ApplicationIntegration/AWS-Step-Functions_48.svg',
  'mq': '/ApplicationIntegration/Amazon-MQ_48.svg',
  'appsync': '/ApplicationIntegration/AWS-AppSync_48.svg',
  
  // Containers
  'ecr': '/Containers/Amazon-Elastic-Container-Registry_48.svg',
  
  // IoT
  'iot-core': '/InternetOfThings/AWS-IoT-Core_48.svg',
  'iot-analytics': '/InternetOfThings/AWS-IoT-Analytics_48.svg',
  'iot-device-management': '/InternetOfThings/AWS-IoT-Device-Management_48.svg',
  'iot-events': '/InternetOfThings/AWS-IoT-Events_48.svg',
  'iot-greengrass': '/InternetOfThings/AWS-IoT-Greengrass_48.svg',
  
  // Serverless
  'amplify': '/MobileServices/AWS-Amplify_48.svg',
  'device-farm': '/MobileServices/AWS-Device-Farm_48.svg'
};

/**
 * Get the URL for an AWS service icon
 * @param service The AWS service
 * @returns URL to the service icon
 */
export const getAwsIconUrl = (service: AWSService): string => {
  const serviceCode = service.serviceCode.toLowerCase();
  
  // Get the icon path for this service
  const iconPath = iconPaths[serviceCode];
  
  if (iconPath) {
    return `${baseUrl}${iconPath}`;
  }
  
  // Try alternative service code formats
  const alternativeServiceCode = service.serviceCode.toLowerCase().replace(/\s+/g, '-');
  if (iconPaths[alternativeServiceCode]) {
    return `${baseUrl}${iconPaths[alternativeServiceCode]}`;
  }
  
  // Default AWS icon
  return `${baseUrl}/General/AWS-Cloud_48.svg`;
};

// AWS brand colors
export const awsColors = {
  orange: '#FF9900',
  navy: '#232F3E',
  blue: '#1A73E8',
  teal: '#00A1C9'
}; 