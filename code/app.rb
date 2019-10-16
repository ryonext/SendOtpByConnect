require 'json'
require 'aws-sdk-connect'
require 'aws-sdk-dynamodb'
require 'yaml'

def lambda_handler(event:, context:)
  print(event);
  yaml = YAML.load_file("./connect_info.yaml")
  source_number = yaml["source_number"] 
  dest_number = yaml["destination_number"] 
  instance_id = yaml["instance_id"]
  cf_id = yaml["contact_flow_id"]

  otp = create_otp

  # DDB に OTP を入れる
  table = Aws::DynamoDB::Table.new("CognitoOtpTable")
  table.update_item(
    key: {
      username: event["userName"]
    },
    attribute_updates: {
      otp: {
        value: otp,
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
