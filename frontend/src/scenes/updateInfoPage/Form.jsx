import { useEffect, useState } from "react"
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
import { useDispatch, useSelector } from "react-redux"
import { setLogin, setLogout } from "state"

// form validator
// .string() ensures that it is a string
// .required ensures that it is required
const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required")    
})



/**Will handle both login and register forms */
const UpdateForm = () => {
    const [selected_allergens,set_selected_allergens]=useState([])
    const [avail_allergens,setAllergens]=useState([])
    const user = useSelector((state) => state.user)
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isNonMobile = useMediaQuery("(min-width:600px)")

    // //console.log(user)

    const initialValuesRegister = {
        firstName: user["firstName"],
        lastName: user["lastName"],
        email:user["email"],
        location: user["location"],
        occupation: user["occupation"],
        allergens: user["allergens"]
    }

    const token = useSelector((state) => state.token)
    // //console.log(token);

    //function to communicate to backend
    const infoUpdate = async (values, onSubmitProps) => {
        
        const data={
            "email":values["email"],
            "Firstname":values["firstName"],
            "Lastname":values["lastName"],
            "Location": values["location"],
            "Occupation": values["occupation"]
        };
        //console.log(values);

        const updateDetails = await fetch(
            `/user/${user["__id"]}`,
            {
                method:"PATCH",
                headers: {"Content-Type": "application/json","x-access-token":token["token"]},
                body: JSON.stringify(data)
            }
        )
        const savedUser = await updateDetails.json()
        const errorStatus = await updateDetails.status
        
        values['allergens'].forEach(element => {
            fetch(
                `/user/${user["__id"]}`,
                {
                    method:"POST",
                    headers: {"Content-Type": "application/json","x-access-token":token["token"]},
                    body: JSON.stringify({
                        "allergenid":element
                    })
                }
            )
        });

        // "allergens": values["allergens"],
        
        if(savedUser) {
            if(errorStatus!=201) {
                // //console.log(savedUser);
                alert(savedUser["error"])
            }
            else {
                dispatch(setLogout());
            }
        }
    }

    const handleFormSubmit = async(values, onSubmitProps) => {
        values.allergens=selected_allergens
        await infoUpdate(values,onSubmitProps);
    }

    const getAllergens=async()=>{
        await fetch("/users",{
                method:"GET",
                headers: {"x-access-token":token["token"]}
            }).then((resp)=>resp.json()).then((obj)=>{
                // //console.log(obj);
                setAllergens(obj["allergyType"]);
        });
    }

    useEffect(()=>{
        getAllergens()
    },[])

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesRegister}
            validationSchema={registerSchema}    
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
                        {
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
                                <InputLabel>Add Allergens</InputLabel>
                                <Select
                                    multiple
                                    onBlur={handleBlur}
                                    onChange={(event)=>set_selected_allergens(event.target.value)}
                                    label="Allergens"
                                    name="allergens"
                                    value={selected_allergens}
                                    sx={{ gridColumn: "span 4"}}
                                >
                                    {avail_allergens.map((i)=><MenuItem value={i["id"]}>{i["name"]}</MenuItem>)}
                                </Select>
                            </>
                        }

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
                            Update
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default UpdateForm