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
      alert("Your account is confirmed.");
      location.href="index.html"
    },
    error: (result, textStatus, xhr) => {
      alert("error");
    }
  });
});

$("#sign-in").on("click", (e) => {
  e.preventDefault();
  var authenticationData = {
      Username : $("#username").val(),
      Password : $("#password").val(),
  };
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var userData = {
    Username : authenticationData.Username,
    Pool : userPool
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken();
      
      /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
      var idToken = result.idToken.jwtToken;
      var refreshToken = result.refreshToken.token;
      console.log(result);
      $("#content").replaceWith(`
        <p>ID Token</p>
        <p>${idToken}</p>
        <p>Access Token</p>
        <p>${accessToken}</p>
        <p>Refresh Token</p>
        <p>${refreshToken}</p>
      `);
    },
    onFailure: function(err) {
      console.log(err);
    }
  });
});;
