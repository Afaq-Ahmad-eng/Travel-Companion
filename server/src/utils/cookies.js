function setcookies(response,TokenName, encryptToken, maximumAge){
    response.cookie(TokenName,  encryptToken, {
      httpOnly: true, // protects from XSS
    //   secure: true, // send only over HTTPS
      sameSite: "strict", // prevent CSRF
      maxAge: maximumAge, 
      path: '/',
    });
}

export function setAccessToken (response,token){
    setcookies(response,"accessToken",token, 30 * 60 * 1000)
}

export function setRefreshToken (response, token){
    setcookies(response,"refreshToken",token, 7 * 24 * 60 * 60 * 1000);
}