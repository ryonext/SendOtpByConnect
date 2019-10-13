var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

$("#create-account").on("click", () => {
  var attributeList = [];

  var dataPhoneNumber = {
    Name: 'phone_number',
    Value: phoneNumber,
  };
  var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(
    dataPhoneNumber
  );

  attributeList.push(attributePhoneNumber);

  username = Math.random().toString(32).substring(2);

  userPool.signUp(username, 'password', attributeList, null, function (
    err,
    result
  ) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    var cognitoUser = result.user;
    console.log('user name is ' + cognitoUser.getUsername());
    $("#signup").replaceWith(`
      <form id="OTP">
        <div class="form-item">
          <label for="otp"></label>
          <input type="text" name="otp" required="required" placeholder="Your one time password"></input>
        </div>
        <div class="button-panel">
          <input type="submit" class="button" title="Sign In" value="Send" id="send-otp"></input>
        </div>
      </form>
      `);
  });
});

