import { useState } from "react"
import {
    Box,
    Button, 
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    Select,
    MenuItem,
    InputLabel
} from "@mui/material"
import { Formik } from "formik"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setLogin } from "state"

// form validator
// .string() ensures that it is a string
// .required ensures that it is required
const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    username: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required")    
})

const loginSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required"),  
})

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    username: "",
    email:"",
    password: "",
    location: "",
    occupation: "",
    gender: "Male",
}

const initialValuesLogin = {
    username: "",
    password: "",
}

/**Will handle both login and register forms */
const Form = () => {
    const [allergens,setAllergens]=useState([])
    const [pageType, setPageType] = useState("login")
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isNonMobile = useMediaQuery("(min-width:600px)")
    const isLogin = pageType === "login"
    const isRegister = pageType === "register"

    //function to communicate to backend
    const register = async (values, onSubmitProps) => {
        // every value that is we've created in the text field will show up as values
        // we have a picture image so we have to do sum a lil different
        
        const data={
            "Username":values["username"],
            "Password":values["password"],
            "email":values["email"],
            "Firstname":values["firstName"],
            "Lastname":values["lastName"],
            "Gender":values["gender"],
            "Location":values["location"],
            "Occupation":values["occupation"]
        };
        //console.log(values);
        console.log(data);

        //sending post request 
        const registerResponse = await fetch(
            "/users",
            {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            }
        )
        const savedUser = await registerResponse.json()
        const errorStatus = await registerResponse.status
        
        if(savedUser) {
            if(errorStatus!=201) {
                // console.log(savedUser["error"]);
                alert(savedUser["error"])
            }
            else {
                setPageType("login")
                onSubmitProps.resetForm() //make sure our form is reset
            }
        }
    }

    // function to communicate to backend
    const login = async (values, onSubmitProps) => {

        //console.log(values);
        
        const loggedInResponse = await fetch(
            "/login",
            {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    "Username":values.username,
                    "Password":values.password
                })
            }
        ).catch((e)=>{
            alert("Invalid username or password")
            onSubmitProps.resetForm();
        })
        
        const token = await loggedInResponse.json();

        const user_details_response=await fetch(
            `/user/${values.username}`,
            {
                method:"GET",
                headers: {"Content-Type": "application/json","x-access-token":token["token"]}
            }
        ).catch((e)=>{
            alert("Invalid username or password")
            onSubmitProps.resetForm();
        })

        const data = await user_details_response.json();
        //console.log(data);

        const loggedIn={
            "user":{
                "__id": data["users"]["Username"],
                "firstName": data["users"]["FirstName"],
                "lastName": data["users"]["LastName"],
                "email": data["users"]["Email"],
                "occupation": data["users"]["Occupation"],
                "location": data["users"]["Location"],
                "gender":data["users"]["Gender"],
                "allergens":data["users"]["allergen_list"]
            },
            "token":token
        }

        onSubmitProps.resetForm()
        if (loggedInResponse.status==201 && user_details_response.status==200 ) {
            //coming from redux. we are setting the user and state to be used throughout the app
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token
                })
            )
            navigate("/home")
        }
        else{
            alert("Wrong username or password");
        }
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        ////console.log(values);
        if (isLogin) await login(values, onSubmitProps)
        if (isRegister) await register(values, onSubmitProps)
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}    
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                //handle submit is essentially handleFormSubmit
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        //split our grid into 4 sections, into equal fractions of 4
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"  
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
                        }}  
                    >
                        {/**If the page type is register */}
                        {isRegister && (
                            <>
                                <TextField 
                                    required
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    helpertext={touched.firstName && errors.firstName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField 
                                    required
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helpertext={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField 
                                    required
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={Boolean(touched.email) && Boolean(errors.email)}
                                    helpertext={touched.email && errors.email}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    required
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helpertext={touched.location && errors.location}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    required
                                    label="Occupation"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.occupation}
                                    name="occupation"
                                    error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                                    helpertext={touched.occupation && errors.occupation}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    required
                                    label="Gender"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.gender}
                                    name="gender"
                                    error={Boolean(touched.gender) && Boolean(errors.gender)}
                                    helpertext={touched.gender && errors.gender}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    <MenuItem value={"Male"}>Male</MenuItem>
                                    <MenuItem value={"Female"}>Female</MenuItem>
                                </Select>
                            </>
                        )}

                        {/**Login */}
                        <TextField 
                            label="Username"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.username}
                            name="username"
                            error={Boolean(touched.username) && Boolean(errors.username)}
                            helpertext={touched.username && errors.username}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField 
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helpertext={touched.password && errors.password}
                            sx={{ gridColumn: "span 4" }}
                        />

                    </Box>

                    {/**BUTTONS */}
                    <Box>
                        <Button
                            fullWidth
                            //when we have button type submit it will run the onSubmit={handleSubmit}
                            type="submit"
                            sx={{
                                m: "2rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main }
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>

                        {/**Switch between login and register. Updates pageType state */}
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login")
                                resetForm()
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.dark,
                                }
                            }}
                        >
                            {isLogin 
                                ? "Don't have an account? Sign Up here." 
                                : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default Form