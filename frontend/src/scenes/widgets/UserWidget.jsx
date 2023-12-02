//left side user box/widget
import {
    ManageAccountsOutlined,
    MaleOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
    ElderlyOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const UserWidget = ({ userId, picturePath }) => {
    const [user, setUser] = useState(null)
    const { palette } = useTheme()
    const navigate = useNavigate()
    const token = useSelector((state) => state.token)
    const dark = palette.neutral.dark
    const medium = palette.neutral.medium
    const main = palette.neutral.main 
    const data = useSelector((state) => state.user)

    const getUser = async () => {
        // const response = await fetch(`http://localhost:3001/users/${userId}`, {
        //     method: "GET",
        //     headers: { Authorization: `Bearer ${token}` }, //this is for our middleware auth.js
        // })
        // const data = await response.json()

        // const data={
        //         "__id": "BIS",
        //         "firstName": "BISLERI",
        //         "lastName": "NIGGER",
        //         "occupation": "CODER",
        //         "location": "PUNE",
        //         "gender":"Male",
        //         "allergens":["Rugved","tanish"]
        //     }
        //console.log(data);
        setUser(data)
    }

    //when we enter this page and since we have an empty dependency array,
    //useEffect will be called once when we enter this page
    useEffect(() => {
        getUser()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) {
        return null
    }

    //extract from user
    const {
        firstName,
        lastName,
        location,
        occupation,
        gender,
        allergens: allergens
    } = user

    return (
        <WidgetWrapper>
            {/**FIRST ROW */}
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem" //padding bottom
            >
                {/**Photo, Name, Followers */}
                <FlexBetween gap="1rem" >
                    <UserImage image={userId} />
                    <Box>
                        <Typography
                            variant="h4"
                            color={dark}
                            fontWeight="500"
                            sx={{
                                "&:hover" : {
                                    color: palette.primary.main,
                                    cursor: "pointer"
                                }
                            }}
                        >
                            {firstName} {lastName}
                        </Typography>
                        <Typography color={medium} >
                            {allergens.length} allergens
                        </Typography>
                    </Box>
                </FlexBetween>
                {/**Manage Button */}
                <ManageAccountsOutlined sx={{
                    "&:hover": {
                        color: palette.primary.main,
                        cursor: "pointer"
                        }
                    }}

                    onClick={()=>navigate("/update")}
                />
            </FlexBetween>

            <Divider />

            {/**SECOND ROW*/}
            <Box p="1rem 0">
                <Box display="flex" alignItems="center" gap="1rem">
                    <MaleOutlined fontSize="large" sx={{color: main}} />
                    <Typography color={medium}>{gender}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                    <LocationOnOutlined fontSize="large" sx={{color: main}} />
                    <Typography color={medium}>{location}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                    <WorkOutlineOutlined fontSize="large" sx={{color: main}} />
                    <Typography color={medium}>{occupation}</Typography>
                </Box>
            </Box>

            <Divider />

            {/**THIRD ROW */}
            <Box p="1rem 0">
                <Typography color={main} fontWeight="500">
                                ALLERGENS
                </Typography>
                {allergens.map((i)=><FlexBetween key={i} mb="0.2rem">
                    <Typography color={medium}>
                        {i}
                    </Typography>
                </FlexBetween>)}
            </Box>

        </WidgetWrapper>
    )
}

export default UserWidget