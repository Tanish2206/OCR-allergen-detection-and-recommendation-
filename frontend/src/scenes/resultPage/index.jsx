import { Box, useMediaQuery } from "@mui/material"
import { useSelector } from "react-redux"
import Navbar from "scenes/navbar"
import UserWidget from "scenes/widgets/UserWidget"
import ResultsWidget from "scenes/widgets/ResultsWidget"
import { useEffect } from "react"

const ResultPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    const { _id, picturePath } = useSelector((state) => state.user)
    const alternatives=useSelector((state)=>state.alternatives)

    useEffect(()=>{
        console.log(alternatives);
    },[]);

    return (
        <Box>
            <Navbar />
            <Box
                width="80%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                {/**Side Box*/}
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget userId={_id} picturePath={picturePath}/>
                </Box>

                {/**Actual Posts */}
                <Box
                    flexBasis={isNonMobileScreens ? "52%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <ResultsWidget user={_id} />
                </Box>
            </Box>
        </Box>
    )
}

export default ResultPage