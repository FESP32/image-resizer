## Image Resizer

![App Thumbnail](./thumbnail.png)

For a live preview of the application, visit the demo by following this link:

[View Demo Application](http://44.223.78.165:3000/)

# Terraform Infrastructure Setup Guide

This guide walks you through the steps to create an AWS infrastructure using Terraform and setup a development environment, starting with the creation of a Terraform agent within your AWS account

## Prerequisites

- AWS Account
- IAM user with sufficient permissions to create resources
- [Terraform](https://www.terraform.io/downloads.html) installed locally (version 1.0 or later)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed and configured

## Step 1: Configure AWS Credentials

To configure AWS credentials, follow these steps to set up your environment so that Terraform can access and manage your AWS resources:

1. **Install and Configure AWS CLI**:
   Ensure that the AWS CLI is installed on your local machine. You can verify the installation by running:

   ```bash
   aws --version
   ```

2. **Configure AWS CLI with Your Credentials**:
   Configure AWS CLI with Your Credentials: Run the following command to set up your AWS access keys:

   ```bash
   aws configure
   ```

   You will be prompted to enter your AWS credentials:

   ```bash
   AWS Access Key ID: Your IAM user's access key ID.
   AWS Secret Access Key: Your IAM user's secret access key.
   ```

## Step 2: Run Terraform Steps

Follow these steps to initialize, plan, and apply your Terraform configuration:

1. **Navigate to Your Terraform Configuration Directory**:
   Change to the terraform directory or other Terraform configuration files are located:
   ```bash
   cd /.iac/terraform
   ```
2. **Initialize Terraform**:
   Run the following command to initialize Terraform. This step downloads the required provider plugins and sets up the working directory:
   ```bash
   terraform init
   ```
3. **Plan the Infrastructure Changes**:
   Generate and review an execution plan to see the changes that Terraform will make:

   ```bash
   terraform plan
   ```

4. **Apply the Changes**:
   Apply the planned changes to create or update your infrastructure:

   ```bash
   terraform apply
   ```

## Step 3: Create and Manage Workspaces and Environments

Terraform workspaces allow you to maintain multiple states for the same configuration. This is useful for environments such as staging and production.

1. **Create the Staging Workspace**:
   Run the following command to create a workspace for the staging environment:

   ```bash
   terraform workspace new staging

   ```

2. **Create the Production Workspace**:
   Run the following command to create a workspace for the staging environment:

   ```bash
   terraform workspace new production
   ```

3. **Switch Between Workspaces**:
   To switch to a specific workspace, use the following command:

   ```bash
   terraform workspace select staging
   ```

   or

   ```bash
   terraform workspace select production
   ```

4. **Apply Changes Using .tfvars Files**:
   When you have environment-specific variable files (e.g., stg.tfvars and prd.tfvars)

   Plan and Apply with a .tfvars File: Run the plan command with the -var-file flag to preview the changes:

   ```bash
   terraform plan -var-file="env.tfvars"
   ```

   and

   ```bash
   terraform apply -var-file="env.tfvars"
   ```

## Step 4: Development Environment Setup

Once Terraform has been applied and an IAM user with access keys has been created, you can set up a development environment.

1. **Duplicate the `.env.template` file to store environment variable placeholders**:
   Populate the .env File: Fill in the .env.local file with the IAM access keys and other environment variables created by Terraform:

   ```bash
      AWS_ACCESS_KEY_ID=
      AWS_SECRET_ACCESS_KEY=
      AWS_REGION=
      S3_BUCKET_NAME=
   ```

2. **Build and Run**:
   Use the following command to build and start your local development:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. **Build and Run with Docker Compose**:
   Use the following command to build and start your Docker container:

   ```bash
   docker-compose --env-file .env.local up --build

   ```

## Design choices and Lnown limitations

Next.js was chosen for this project due to its powerful features that make it ideal for building a robust image resizer application using React and API routes. Below are the key reasons for selecting Next.js:

### 1. **Full-Stack Capabilities**

Next.js supports both frontend and backend logic within a single codebase through its API routes. This means that the image processing logic using the AWS SDK can be seamlessly handled on the server side, while the React-based user interface provides an intuitive experience on the client side. This eliminates the need for separate backend services, simplifying project management and deployment.

### 3. **API Routes Integration**

The built-in API routes feature in Next.js allows you to create backend endpoints effortlessly. This is perfect for creating and managing image processing operations through the AWS SDK, providing a streamlined way to handle server-side image manipulation and S3 interactions without setting up an entirely separate server.

### 4. **Single Codebase for Frontend and Backend**

By using Next.js, the development team can maintain a single codebase that includes both frontend components and backend logic. This unified approach improves collaboration, simplifies code management, and accelerates development speed. It also ensures consistency across the application, as both frontend and backend logic are built using TypeScript.

### 6. **Ease of Deployment**

Next.js can be deployed easily using platforms any cloud service that supports Node.js, making it straightforward to deploy the application and integrate with AWS for further scalability.

### Conclusion

Next.js was selected for this image resizer project to leverage its combination of React-based development, integrated API routes, and seamless AWS SDK integration, all within a single, maintainable codebase. This choice ensures rapid development, performance, and scalability without sacrificing code quality or maintainability.

## Final Considerations and Next Steps

While this guide has covered the essential steps to set up a Terraform-managed infrastructure, create workspaces, and set up a development environment with Docker Compose, there are a few important areas that can be further developed

### 1. CI/CD Pipeline with GitHub Actions

Implementing a CI/CD pipeline ensures that your application is automatically tested and deployed as changes are made. You can set up a GitHub Actions workflow to build, test, and deploy your project seamlessly.

**Steps to Create a GitHub Actions CI/CD Pipeline**:

- **Create a `.github/workflows` directory**.
- **Define the workflow**:
  - **Trigger** on `push` or `pull_request` events.
  - **Jobs** to build, test, and deploy the application.

### 2. Unit Testing

Adding unit tests to ensure that the code is reliable and meets the expected behavior.
