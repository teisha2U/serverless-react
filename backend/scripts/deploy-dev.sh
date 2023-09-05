set -e

PROFILE=eds-sandbox  # profile for sandbox instance
REGION=us-east-1

# Must be created manually
BUCKET="sam-deploy-useast1"

# General parameters
APPLICATION="serverless"
PROJECT="tdb-app"
ENVIRONMENT="dev"
STACK_NAME="$APPLICATION-$PROJECT-$ENVIRONMENT"
TEMPLATE="template.yaml"
DEPLOY_CUSTOM_HANDLER="false"
# Build 
echo "Building Serverless React Demo project with SAM"

# # Build lambdas
# echo "Building Sam Discovery Lambdas"
# cd src
npm install 
npm run build
# cd ..

pwd

sam build --template $TEMPLATE \
&& sam deploy \
  --template $TEMPLATE \
  --stack-name $STACK_NAME \
  --s3-bucket $BUCKET \
  --s3-prefix $STACK_NAME \
  --tags \
    "Client"=$APPLICATION \
    "Project"=$PROJECT \
    "Environment"=$ENVIRONMENT \
  --parameter-overrides \
    ParameterKey=Application,ParameterValue=$APPLICATION \
    ParameterKey=ProjectName,ParameterValue=$STACK_NAME \
    ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION \
  --profile $PROFILE

# cd src && \
# sam build && \
# sam package --output-template-file packaged-template.yaml --s3-bucket ${S3_BUCKET} --region ${REGION} --profile ${PROFILE} && \
# sam deploy --template-file packaged-template.yaml --region ${REGION} --capabilities CAPABILITY_IAM --stack-name ${STACK_NAME} \
#   --parameter-overrides ProjectName=${STACK_NAME} Environment=${ENVIRONMENT} \
#   FrontEndUrl=${APP_URL} --profile ${PROFILE}

echo "./scripts/deploy-react.sh $PROFILE $REGION $STACK_NAME"
./scripts/deploy-react.sh $PROFILE $REGION $STACK_NAME

echo "completed"