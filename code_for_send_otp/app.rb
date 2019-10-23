require 'json'
require 'aws-sdk-connect'
require 'aws-sdk-dynamodb'
require 'yaml'
require 'time'

def lambda_handler(event:, context:)
  p (event)
  yaml = YAML.load_file("./connect_info.yaml")
  source_number = yaml["source_number"] 
  instance_id = yaml["instance_id"]
  cf_id = yaml["contact_flow_id"]
  dest_number = event["request"]["userAttributes"]["phone_number"] 
  p (dest_number)

  otp = create_otp

  # DDB に OTP を入れる
  table = Aws::DynamoDB::Table.new("CognitoOtpTable")
  ttl = (Time.now + 300).to_i
  table.update_item(
    key: {
      username: event["userName"]
    },
    attribute_updates: {
      otp: {
        value: otp,
        action: "PUT"
      },
      ttl: {
        value: ttl,
        action: "PUT"
      }
    }
  )


  connect = Aws::Connect::Client.new
  connect.start_outbound_voice_contact(
    destination_phone_number: dest_number,
    contact_flow_id: cf_id,
    instance_id: instance_id,
    source_phone_number: source_number,
    attributes: {
      OTP: otp
    }
  )

  event[:response] = {
    autoConfirmUser: false,
    autoVerifyPhone: false,
    autoVerifyEmail: false
  }
  event
end

def create_otp
  4.times.map {
    rand(0..9).to_s
  }.join
end
