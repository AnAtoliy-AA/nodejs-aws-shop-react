import * as cdk from 'aws-cdk-lib';
import {
  aws_cloudfront as cloudfront,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
  aws_iam as iam,
} from "aws-cdk-lib";
import { Construct } from 'constructs';

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "cloudfront-OAI",
      {
        comment: 'OriginAccessIdentity for my-first-shop-app'
      }
    );

    const myStoreBucket = new s3.Bucket(this, "myStoreBucket", {
      bucketName: "my-first-shop-app-cdk",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    myStoreBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [myStoreBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "MyCloudfrontDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: myStoreBucket,
              originAccessIdentity: cloudfrontOAI,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "MyBucketDeployment", {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: myStoreBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
