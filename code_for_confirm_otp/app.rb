require 'json'
require 'aws-sdk-dynamodb'
require 'aws-sdk-cognitoidentityprovider'

def lambda_handler(event:, context:)
  body = JSON.parse(event["body"]);
  p body
  username = body["userName"]
  sent_otp = body["otp"]

  table = Aws::DynamoDB::Table.new("CognitoOtpTable")
  result = table.get_item(
    key: {
      username: username
    }  
  )
  p result
  stored_otp = result.item["otp"]
  # 一致するか確認
  if sent_otp == stored_otp
    # 一致していたら Cognito で Confirm する
    client = Aws::CognitoIdentityProvider::Client.new
    resp = client.admin_confirm_sign_up({
      user_pool_id: ENV["UserPoolId"],
      username: username
    }) 
    status = 200
    result = {
      message: "otp matched"
    }
  else
    status = 400
    result = {
      message: "not matched"
    }
  end
  {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Origin" => "*",
      "Access-Control-Allow-Headers" => "Content-Type",
      "Access-Control-Allow-Methods" => "OPTIONS,POST"
    },
    body: JSON.generate(result)
  }
end
