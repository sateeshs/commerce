import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

// This is an interface we use to pass the environment as a variable to the construct
interface BucketStackProps extends StackProps {
  
  name: string;
}

export class S3BucketConstruct extends Construct {
  public readonly bucket: s3.Bucket;

  // Every construct needs to implement a constructor
  constructor(scope: Construct, id: string, props: BucketStackProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(scope, 'Bucket-S3', {
      bucketName: props.name + '-logos-bucket',
      versioned: false,
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      encryption: s3.BucketEncryption.S3_MANAGED,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      cors: [{
        allowedHeaders: ['Authorization'],
        allowedMethods: [
          s3.HttpMethods.POST,
          s3.HttpMethods.PUT,
          s3.HttpMethods.GET,
          s3.HttpMethods.HEAD
        ],
        allowedOrigins: ['http://localhost:3000', 'https://amplify-url.com'],
        exposedHeaders: ['Access-Control-Allow-Origin']
      }],
      // When the stack is deleted, the bucket should be destroyed
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.bucket.grantRead(new iam.AccountRootPrincipal());

    const bucketPolicy = new s3.BucketPolicy(this, 'bucket-policy-id-2', {bucket: this.bucket});

    bucketPolicy.document.addStatements(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.AnyPrincipal()],
      actions: ['s3:GET*', 's3:List*'],
      resources: [`${this.bucket.bucketArn}`, `${this.bucket.bucketArn}/*`]
    }));
  }
}