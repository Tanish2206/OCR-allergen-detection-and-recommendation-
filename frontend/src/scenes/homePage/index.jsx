import { Box, useMediaQuery } from "@mui/material"
import { useSelector } from "react-redux"
import Navbar from "scenes/navbar"

import FlexBetween from "components/FlexBetween"
import UploadImageWidget from "scenes/widgets/UploadImageWidget"
import UserWidget from "scenes/widgets/UserWidget"

const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const { _id, picturePath } = useSelector((state) => state.user)

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent={"center"}
            >
                <FlexBetween>
                    <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                        <UserWidget userId={_id} picturePath={picturePath}/>
                    </Box>
                    <Box
                        flexBasis={isNonMobileScreens ? "52%" : undefined}
                        mt={isNonMobileScreens ? undefined : "2rem"}
                    >
                        <UploadImageWidget picturePath={picturePath} />
                    </Box>
                </FlexBetween>
            </Box>
        </Box>
    )
}

export default HomePage