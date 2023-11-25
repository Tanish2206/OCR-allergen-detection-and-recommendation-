import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const ResultWidget = ({  name, protein,carbs,fats, 
                       picturePath,  }) => {

    const dispatch = useDispatch()
    const token = useSelector((state) => state.token)
    const loggedInUserId = useSelector((state) => state.user._id)
    const { palette } = useTheme()

    const dark = palette.neutral.dark
    const medium = palette.neutral.medium
    const neutralMain = palette.neutral.main
    const primary = palette.primary.main

    return (
        <WidgetWrapper m="2rem 0" >
            <FlexBetween gap="1rem" >
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
                            {name}
                        </Typography>
                    </Box>
            </FlexBetween>
            <Typography color={neutralMain} sx={{mt: "1rem"}}>
                Protein: {protein}
            </Typography>
            <Typography color={neutralMain} sx={{mt: "1rem"}}>
                Carbs: {carbs}
            </Typography>
            <Typography color={neutralMain} sx={{mt: "1rem"}}>
                Fats: {fats}
            </Typography>
            {picturePath && (
                <img 
                    width="100%" 
                    height="auto" 
                    alt="post" 
                    style={{borderRadius: "0.75rem", marginTop: "0.75rem"}}
                    src={`http://localhost:3000/assets/${picturePath}`}
                />
            )}
            <FlexBetween mt="0.25rem">

            </FlexBetween>
        </WidgetWrapper>
    )
}


export default ResultWidget