const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

$("#create-account").on("click", (e) => {
  e.preventDefault();

  const attributeList = [];
  const username = $("#username").val();
  const password = $("#password").val();

  const dataPhoneNumber = {
    Name: 'phone_number',
    Value: phoneNumber,
  };
  const attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
  attributeList.push(attributePhoneNumber);

  userPool.signUp(username, password, attributeList, null, function (
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
  const authenticationData = {
      Username : $("#username").val(),
      Password : $("#password").val(),
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const userData = {
    Username : authenticationData.Username,
    Pool : userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      const accessToken = result.getAccessToken().getJwtToken();
      
      /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
      const idToken = result.idToken.jwtToken;
      const refreshToken = result.refreshToken.token;
      console.log(result);
      $("#content").replaceWith(`
        <h1>Login succeeded.</h1>
        <h2>ID Token</h2>
        <p>${idToken}</p>
        <h2>Access Token</h2>
        <p>${accessToken}</p>
        <h2>Refresh Token</h2>
        <p>${refreshToken}</p>
      `);
    },
    onFailure: (err) => {
      console.log(err);
    }
  });
});;
