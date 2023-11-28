import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"
import UpdateForm from "./Form"
import Navbar from "scenes/navbar"

const UpdateInfoPage = () => {
    const theme = useTheme()
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")
    return (
        <Box>
            <Navbar/>
            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                {/**Welcome sign */}
                <Typography 
                    fontWeight="500" 
                    variant="h5" 
                    sx={{ mb: "1.5rem" }}
                    >
                        Update Information
                </Typography>

                {/**Form component */}
                <UpdateForm />
            </Box>
        </Box>
    )
}

export default UpdateInfoPage