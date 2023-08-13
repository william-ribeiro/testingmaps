import "react-native-get-random-values";
import "./src/libs/dayjs";

import { ThemeProvider } from "styled-components/native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { AppProvider, UserProvider } from "@realm/react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WifiSlash } from "phosphor-react-native";
import { useNetInfo } from "@react-native-community/netinfo";

import { REALM_APP_ID } from "@env";

import theme from "./src/theme";

import { SignIn } from "./src/screens/SignIn";
import { Loading } from "./src/components/Loading";
import { Routes } from "./src/routes";
import { RealmProvider, syncConfig } from "./src/libs/realm";
import { TopMessage } from "./src/components/TopMessage";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const netInfo = useNetInfo();

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: theme.COLORS.GRAY_800 }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />

          {!netInfo.isConnected && (
            <TopMessage title="Você está off-line" icon={WifiSlash} />
          )}

          <UserProvider fallback={SignIn}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
