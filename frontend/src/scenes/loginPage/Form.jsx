import { useState } from "react"
import {
    Box,
    Button, 
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    Select,
    MenuItem
} from "@mui/material"
import { Formik } from "formik"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setLogin } from "state"

// form validator
// .string() ensures that it is a string
// .required ensures that it is required
// .email ensures that it is a correct email or else "invalid email"
const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required")    
})

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),  
})

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    allergens: [],
    gender: "",
}

const initialValuesLogin = {
    email: "",
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
        const formData = new FormData() //this allows us to send form info with image
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append('picturePath', values.picture.name)
        console.log(formData)

        //sending post request 
        // const savedUserResponse = await fetch(
        //     "http://localhost:3001/auth/register",
        //     {
        //         method:"POST",
        //         body: formData
        //     }
        // )
        // const savedUser = await savedUserResponse.json()
        // const errorStatus = await savedUserResponse.status
        const savedUser={"user":"BISLERI"}
        const errorStatus="None"
        
        if(savedUser) {
            if(savedUser.error) {
                console.log(errorStatus)
            }
            else {
                setPageType("login")
                onSubmitProps.resetForm() //make sure our form is reset
            }
        }
    }

    // function to communicate to backend
    const login = async (values, onSubmitProps) => {
        // const loggedInResponse = await fetch(
        //     "http://localhost:3001/auth/login",
        //     {
        //         method:"POST",
        //         headers: {"Content-Type": "application/json"},
        //         body: JSON.stringify(values)
        //     }
        // )
        // const loggedIn = await loggedInResponse.json()
        const loggedIn={
            "user":{
                "__id": "BIS",
                "firstName": "BISLERI",
                "lastName": "NIGGER",
                "occupation": "CODER",
                "location": "PUNE",
                "gender":"Male",
                "allergens":["Rugved","tanish"]
            },
            "token":"testing"
        }

        onSubmitProps.resetForm()
        if (loggedIn) {
            //coming from redux. we are setting the user and state to be used throughout the app
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token
                })
            )
            navigate("/home")
        }
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        values.allergens=allergens
        //console.log(values);
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
                                    helperText={touched.firstName && errors.firstName}
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
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: "span 2" }}
                                />
                                <TextField 
                                    required
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
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
                                    helperText={touched.occupation && errors.occupation}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField 
                                    required
                                    label="Gender"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.gender}
                                    name="gender"
                                    error={Boolean(touched.gender) && Boolean(errors.gender)}
                                    helperText={touched.gender && errors.gender}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <Select
                                    multiple
                                    onBlur={handleBlur}
                                    onChange={(event)=>setAllergens(event.target.value)}
                                    label="Allergens"
                                    name="allergens"
                                    value={allergens}
                                    sx={{ gridColumn: "span 4"}}
                                >
                                    <MenuItem value={"Milk"}>Milk</MenuItem>
                                    <MenuItem value={"Nuts"}>Nuts</MenuItem>
                                    <MenuItem value={"Soy"}>Soy</MenuItem>
                                </Select>
                            </>
                        )}

                        {/**Login */}
                        <TextField 
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
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
                            helperText={touched.password && errors.password}
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