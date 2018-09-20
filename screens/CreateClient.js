import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
var ImagePicker = require("react-native-image-picker");
import PushNotification from "react-native-push-notification";
import PushController from "./PushController.js";

import { Container, Content, Icon } from "native-base";
import CustomHeader from "../Components/CustomHeader";

const options = {
  title: "my pic app",
  takePhotoFromButtonTitle: "Take Photo With Your Camera",
  chooseFromLibraryButtonTitle: "Choose Photo From Library"
};

class CreateClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      number: "",
      whatsapp: "",
      error: "",
      avatarSource: require("../assets/DrawerIcons/profile.png")
    };
    this.copyToWhatsapp = this.copyToWhatsapp.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.sendNotification = this.sendNotification.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  // This will notify the user in 3 seconds after sending the app to the
  // background (like after pressing the home button or switching apps)
  handleAppStateChange(appState) {
    if (appState === "background") {
      // Schedule a notification
      PushNotification.localNotificationSchedule({
        message: "Scheduled delay notification message", // (required)
        date: new Date(Date.now() + 3 * 1000) // in 3 secs
      });
    }
  }
  sendNotification() {
    PushNotification.localNotification({
      message: "You pushed the notification button!"
    });
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Create Client",
    headerLeft: (
      <Icon
        name="ios-menu"
        style={{ paddingLeft: 10 }}
        onPress={() => navigation.navigate("DrawerOpen")}
      />
    ),
    drawerIcon: (
      <Image
        source={require("../assets/DrawerIcons/settings.png")}
        style={[styles.icon]}
      />
    )
  });
  validate() {
    flag = 0;
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)
    ) {
      flag = 1;
      if (/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/.test(this.state.number)) {
        flag = 2;
        if (/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/.test(this.state.whatsapp)) {
          flag = 3;
        }
      }
    }
    return flag;
  }

  copyToWhatsapp(number) {
    this.setState({
      whatsapp: number
    });
  }

  onPress = () => {
    validated = this.validate();
    switch (validated) {
      case 0:
        this.setState({
          error: "Email Error"
        });
        break;
      case 1:
        this.setState({
          error: "Phone Error"
        });
        break;
      case 2:
        this.setState({
          error: "Whatsapp Error"
        });
        break;
      case 3:
        this.setState({
          error: ""
        });
        AsyncStorage.setItem(
          this.state.email.toString(),
          JSON.stringify(this.state)
        );
        this.sendNotification();

        this.props.navigation.navigate("List");

        break;
      default:
        this.setState({
          error: "Some UnNatural Error"
        });
    }
  };
  takePhoto = () => {
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        console.log(source);

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  };

  render() {
    return (
      <Container style={styles.createClientPage}>
        <CustomHeader
          title="Create Client"
          drawerOpen={() => this.props.navigation.navigate("DrawerOpen")}
        />
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 10
          }}
        >
          <Image
            source={this.state.avatarSource}
            style={{ width: 100, height: 100, borderRadius: 100 }}
          />
          <TouchableOpacity style={styles.button} onPress={this.takePhoto}>
            <Text style={styles.btntext}> TakePhoto </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textinput}
            placeholder="Name"
            onChangeText={name => this.setState({ name })}
            underlineColorAndroid={"transparent"}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            underlineColorAndroid={"transparent"}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Mobile Number"
            // onChangeText={number => this.setState({ number })}
            onChangeText={number => {
              this.setState({ number });
              this.copyToWhatsapp(number);
            }}
            underlineColorAndroid={"transparent"}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Whatsapp Number"
            onChangeText={whatsapp => this.setState({ whatsapp })}
            underlineColorAndroid={"transparent"}
            value={this.state.whatsapp}
          />
          <Text style={styles.textinput}>{this.state.error}</Text>
          <TouchableOpacity style={styles.button} onPress={this.onPress}>
            <Text style={styles.btntext}> Create </Text>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}

export default CreateClient;

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24
  },
  createClientPage: {
    alignSelf: "stretch"
  },
  header: {
    fontSize: 24,
    color: "#fff",
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: "#199187",
    borderBottomWidth: 1
  },
  textinput: {
    alignSelf: "stretch",
    height: 40,
    marginBottom: 10,
    color: "black",
    borderBottomColor: "#f8f8f8",
    borderBottomWidth: 1
  },
  button: {
    alignSelf: "stretch",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#59cbbd",
    marginTop: 30
  },
  btntext: {
    color: "#fff",
    fontWeight: "bold"
  }
});
