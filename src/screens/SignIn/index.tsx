import { Alert } from "react-native";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Realm, useApp } from "@realm/react";

import { Container, Title, Slogan } from "./styles";

import backgroundImg from "../../assets/background.png";
import { Button } from "../../components/Button";

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const app = useApp();

  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  function handleGoogleSignIn() {
    setIsAuthenticating(true);

    googleSignIn().then((response) => {
      if (response.type !== "success") setIsAuthenticating(false);
    });
  }

  useEffect(() => {
    if (response?.type === "success") {
      if (response.authentication?.idToken) {
        // fetch(
        //   `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.authentication.idToken}`
        // )
        //   .then((response) => response.json())
        //   .then(console.log);

        const credentials = Realm.Credentials.jwt(
          response.authentication.idToken
        );

        app.logIn(credentials).catch((error) => {
          console.log("Error==>", error);
          Alert.alert(
            "Entrar",
            "Não foi possível conectar-se a sua conta Google."
          );
          setIsAuthenticating(false);
        });
      } else {
        Alert.alert(
          "Entrar",
          "Não foi possível conectar-se a sua conta Google."
        );
        setIsAuthenticating(false);
      }
    }
  }, [response]);

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        title="Entrar com Google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      />
    </Container>
  );
}
