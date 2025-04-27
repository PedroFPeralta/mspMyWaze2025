import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import DraftsIcon from '@mui/icons-material/Drafts';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


import {Text, View, TextInput, Image, TouchableOpacity, StyleSheet, Button, Modal} from "react-native";
import { FIREBASE_AUTH } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import {useState} from "react";
import {useSettings} from "../storage/settingsProvider";
import {Box, ListItem, Typography} from "@mui/material";



type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "Register">;

export default function CarListScreen({navigation}: RegisterScreenProps) {
    // Firebase Authentication
    const auth = FIREBASE_AUTH;
    //const {settings,updateSettings}=useSettings();

    //Form variables
    const [plate, setPlate] = useState("");
    const [type, setType] = useState("");
    const [fuel, setFuel] = useState("");


    const [isLoading, setIsLoading] = useState(false); // Loading state, useful for showing a loading indicator or hiding buttons so the user doesn't click multiple times. For now it just replaces the signup button with "Loading...".

    const [openRegister, setOpenRegister] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);



    //Index of the car list Items
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
    };

    //To open Cars List
    const handleClick = () => {
        setOpen(!open);
    };
    const [open, setOpen] = React.useState(true);

    //Modals
    const [isRegisterModalVis, setRegisterModalVis] = useState(false);
    const [isDeleteModalVis, setDeleteModalVis] = useState(false);

    /*
    const handleRegister = async () => {
        // Handle car register logic here
        try {
            setIsLoading(true); // Set loading state to true
            const response = await createCarWithLicensePlate(auth, plate, type, fuel);
            console.log("Car registered  successfully:", response.car); // Navigate to the Login screen after successful sign-up
        } catch (error) {
            console.error("Car register error:", error);
        }
        finally {
            setIsLoading(false); // Set loading state back to false
        }

    }

    const handleDelete = async () => {
        // Handle car register logic here
        try {
            setIsLoading(true); // Set loading state to true
            const response = await deleteCarWithLicensePlate(auth, plate);
            console.log("Car deleted  successfully:", response.car); // Navigate to the Login screen after successful sign-up
        } catch (error) {
            console.error("Car delete error:", error);
        }
        finally {
            setIsLoading(false); // Set loading state back to false
        }

    };
*/
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };




    return(
        <div></div>
        /*<List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Nested List Items
                </ListSubheader>
            }
        >
            <ListItemButton
                selected={selectedIndex === 0}
                onClick={handleOpenRegister}>
                <ListItemIcon>
                    <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Register Car" />

                <Modal
                    visible={openRegister}
                    onClose={handleCloseRegister()}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Text in a modal
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                    </Box>
                </Modal>
            </ListItemButton>
            <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}>
                <ListItemIcon>
                    <RemoveIcon />
                </ListItemIcon>
                <ListItemText primary="RemoveCar" />
            </ListItemButton>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText primary="List Cars" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {settings.carList.map((item, index) => (
                        <ListItem key={index} sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <DirectionsCarIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={`${item.plate}`}
                                secondary={`${item.type} - ${item.fuel}`}
                            />
                        </ListItem>))}
                </List>
            </Collapse>
        </List>*/
    );
        /*
        <View style={styles.container}>
            <View style={styles.imageContainer}>

            </View>
            <Text style={{fontSize: 24, fontWeight: "bold"}}>Register</Text>


            <View style={styles.loginContainer}>
                <View style = {styles.inputContainer}>
                    <TextInput
                        style = {styles.textInput}
                        placeholder="Email"
                        value = {email}
                        onChangeText={(value) => setEmail(value)}
                    />
                    <TextInput
                        style = {styles.textInput}
                        placeholder="Password"
                        value = {password}
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={!passwordVisible}
                    />
                </View>

                <View style = {styles.buttonContainer}>
                    <View style = {styles.button}>
                      {isLoading ? (
                        <Text>Loading...</Text>
                      ) : (
                        <Button title="Sign-Up" onPress={handleRegister} />
                      )}
                    </View>
                    <TouchableOpacity  onPress={() => navigation.navigate("Login")}>
                      <Text style= {{textDecorationStyle: "solid", textDecorationLine: "underline", textDecorationColor: "blue", color: "blue"}}>Already Have an Account?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>);
*/

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer:{
    width: 90,
    height: 90,
    backgroundColor: "blue",
  },
  loginContainer: {
    backgroundColor: "whitemoke",
    width: 300,
    height: 330,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  inputContainer:{
    borderWidth: 1,
    borderColor: "purple",
    height: 100,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput:{
    borderWidth: 1,
    borderColor: "blue",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    backgroundColor: "blue",
    borderRadius: 50,
    width: "80%",
    height: 40,
  },
  buttonContainer:{
    display: "flex",
    flexDirection: "column",
    borderColor: "purple",
    alignItems: "center",
    borderWidth: 1,
    width: "80%",
  },
  button:{
    width: "50%",
    marginBottom: 5,
  },

});

