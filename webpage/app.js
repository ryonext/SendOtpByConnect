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
    sessionStorage.setItem("userName", result.user.getUsername());
    console.log(result.user.getUsername());
    $("#signup").replaceWith(`
      <form id="OTP">
        <div class="form-item">
          <label for="otp"></label>
          <input type="text" name="otp" required="required" placeholder="Your one time password" id="otp"></input>
        </div>
        <div class="button-panel">
          <input type="button" class="button" title="Sign In" value="Send" id="send-otp"></input>
        </div>
      </form>
      `);
  });
});

$(document).on("click", "#send-otp", () => {
  const data = {
    userName: sessionStorage.getItem("userName"),
    otp: $("#otp").val()
  }
  $.ajax({
    url: endpoint,
    type: "post",
    dataType: "json",
    data: JSON.stringify(data),
    contentType: 'application/json',

    success: (result, textStatus, xhr) => {
      console.log(result);
      console.log(textStatus);
      console.log(xhr);
      alert("success");
    },
    error: (result, textStatus, xhr) => {
      console.log(result);
      console.log(textStatus);
      console.log(xhr);
      alert("error");
    }
  });
});


