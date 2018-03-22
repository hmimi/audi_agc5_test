/**
 * Middleware Pre-authentication
 * son role est de recuperer a partir de chaque requête le cookie
 * contenant le token JWT et d'injecter a le requete le header Authorization
 * avec ce token
 */ 

var jwtInjectorMiddleware = new TykJS.TykMiddleware.NewMiddleware({});

jwtInjectorMiddleware.NewProcessRequest(function(request, session) {
    var cookies = request.Headers.Cookie;

    if (Array.isArray(cookies) && cookies.length) {
        cookies = cookies[0].split("; ");

        var jwtTokenCookie = '';
        for (var i = 0; i < cookies.length; i++) {
        		if (cookies[i].indexOf("access_token_jwt=") != -1) {
          		  jwtTokenCookie = cookies[i];
          		  break;
        		}
	      }
	  
        if (jwtTokenCookie.indexOf("access_token_jwt=") != -1) {
            jwtTokenCookie = jwtTokenCookie.split("=");
            if (jwtTokenCookie.length == 2) {
                jwtTokenCookie = jwtTokenCookie[1];
                request.SetHeaders["Authorization"] = "Bearer " + jwtTokenCookie;
            }
        }
    }

    return jwtInjectorMiddleware.ReturnData(request, session.meta_data);
});

// Message de log affiche quand le middleware est charge par tyk-gateway
log("JWT Injector middleware initialised...");
