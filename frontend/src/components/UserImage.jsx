import { Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom";

const UserImage = ({size = "60px" }) => {
    
    const navigate = useNavigate();

    return (
        <Box width={size} height={size}>
            <img 
                style={{ objectFit: "cover", borderRadius: "50%" }}
                width={size}
                height={size}
                alt="user"
                src="assets/user.jpg"
            />
        </Box>
    )
} 

export default UserImage