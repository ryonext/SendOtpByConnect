require 'json'
require 'aws-sdk-connect'
require 'yaml'

def lambda_handler(event:, context:)
  yaml = YAML.load_file("./connect_info.yaml")
  source_number = yaml["source_number"] 
  dest_number = yaml["destination_number"] 
  instance_id = yaml["instance_id"]
  cf_id = yaml["contact_flow_id"]

  otp = rand(100000..999999).to_s

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
