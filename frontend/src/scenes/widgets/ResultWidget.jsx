import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const ResultWidget = ({  name, category,ingredients,manufacturer }) => {

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
            <Typography
                            variant="h6"
                            color={dark}
                            fontWeight="500"
                            sx={{mt: "1rem"}}
            >
                {category}
            </Typography>
            <Typography
                            variant="h6"
                            color={dark}
                            fontWeight="500"
                            sx={{mt: "0.2rem"}}
            >
                {manufacturer}
            </Typography>
            <Typography color={neutralMain} sx={{mt: "1rem"}}>
                <b>Ingredients: </b>{ingredients}
            </Typography>
            <FlexBetween mt="0.25rem">

            </FlexBetween>
        </WidgetWrapper>
    )
}


export default ResultWidget