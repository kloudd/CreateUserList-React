import React, { Component } from "react";
import { StyleSheet, Image } from "react-native";

//library imports
import { Container, Content, Header, Body } from "native-base";
import { DrawerNavigator, DrawerItems } from "react-navigation";

//custom files
import CreateClient from "./screens/CreateClient";
import ClientList from "./screens/ClientList";

export default class App extends Component {
  render() {
    return <MyApp />;
  }
}

const CustomDrawerContentComponent = props => (
  <Container>
    <Header style={styles.drawerHeader}>
      <Body>
        <Image
          style={styles.drawerImage}
          source={require("./assets/DrawerIcons/profile.png")}
        />
      </Body>
    </Header>
    <Content>
      <DrawerItems {...props} />
    </Content>
  </Container>
);

const MyApp = DrawerNavigator(
  {
    // For each screen that you can navigate to, create a new entry like this:
    List: {
      screen: ClientList
    },
    Create: {
      screen: CreateClient
    }
  },
  {
    initialRouteName: "List",
    drawerPosition: "left",
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle"
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  drawerHeader: {
    height: 200,
    backgroundColor: "white"
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  }
});
