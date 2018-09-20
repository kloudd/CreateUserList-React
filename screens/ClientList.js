import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
  Linking
} from "react-native";
import { List } from "react-native-elements";

//library imports
import { Icon } from "native-base";

let client_data = [];
//custom components imports
import CustomHeader from "../Components/CustomHeader";

class ClientList extends Component {
  constructor() {
    super();
    client_data = [];

    this.state = {
      data: client_data
    };

    this.sendWhatsappMessage = this.sendWhatsappMessage.bind(this);
    this.callOnNumber = this.callOnNumber.bind(this);
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Client List",
    headerLeft: (
      <Icon
        name="ios-menu"
        style={{ paddingLeft: 10 }}
        onPress={() => navigation.navigate("DrawerOpen")}
      />
    ),
    drawerLabel: "Client List",
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require("../assets/DrawerIcons/home.png")}
        style={styles.icon}
      />
    )
  });

  sendWhatsappMessage(number) {
    Linking.openURL(
      "whatsapp://send?text=This_is_a_test_message_IGNORE&phone=+91" + number
    );
  }

  callOnNumber(number) {
    Linking.openURL("tel:+91" + number);
  }

  componentDidMount() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
          let value = JSON.parse(store[i][1]);
          client_data.push(value);
          this.setState({
            data: client_data
          });
        });
      });
    });
  }

  render() {
    if (this.state.data.length != 0) {
      return (
        <View style={{ flex: 1 }}>
          <View>
            <CustomHeader
              title="Client List"
              drawerOpen={() => this.props.navigation.navigate("DrawerOpen")}
            />
          </View>

          <View contentContainerStyle={styles.contentContainerStyle}>
            <List>
              <FlatList
                data={this.state.data}
                keyExtractor={(x, i) => i}
                renderItem={({ item }) => (
                  <View style={styles.clientrow}>
                    <Image
                      style={styles.icon}
                      source={item.avatarSource}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 100,
                        marginLeft: 10
                      }}
                    />
                    <Text style={styles.clientrowtext}>{item.name}</Text>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => this.sendWhatsappMessage(item.whatsapp)}
                    >
                      <Image
                        style={styles.icon}
                        source={require("../assets/DrawerIcons/watsapp.jpeg")}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => this.callOnNumber(item.number)}
                    >
                      <Image
                        style={styles.icon}
                        source={require("../assets/DrawerIcons/calling.png")}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </List>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Create")}
            style={styles.fab}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View>
            <CustomHeader
              title="Client List"
              drawerOpen={() => this.props.navigation.navigate("DrawerOpen")}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Create")}
            style={styles.fab}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

export default ClientList;

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24
  },
  contentContainerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "red"
  },
  btn: {
    flex: 2,
    flexDirection: "row"
  },
  clientrowtext: {
    flex: 6,
    marginLeft: 10,
    marginTop: 5
  },

  clientrow: {
    height: 40,
    flex: 1,
    flexDirection: "row",
    color: "black"
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8
  },
  fabIcon: {
    fontSize: 40,
    color: "white"
  }
});
