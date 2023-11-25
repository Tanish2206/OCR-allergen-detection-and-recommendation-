import {
    EditOutlined,
    DeleteOutlined,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


/**
 * @param picturePath: path of the user profile photo
 * 
 * Widget component for creating a new post
 */
const MyPostWidget = ({ picturePath }) => {
    //actual image
    const [image1, setImage1] = useState(null)
    const [image2, setImage2] = useState(null)
    const { palette } = useTheme()
    const medium = palette.neutral.medium

    //handles post api call
    const handlePost = () => {

        let formData=new FormData();

        if (image1) {
            formData.append("image1",image1);
        }
        if (image2) {
            formData.append("image2",image2);
        }

        // const response = await fetch(`http://localhost:3001/posts`, {
        //     method: "POST",
        //     headers: { Authorization: `Bearer ${token}`},
        //     body: formData
        // })
        
        // const posts = await response.json()
        // dispatch(setPosts({ posts })) //set our posts state

        //reset 
        setImage1(null)
        setImage2(null)
    }


    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <Box
                    borderRadius="5px"
                    border={`1px solid ${medium}`}
                    p="1rem"
                >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false} //no multiple files
                        onDrop={(acceptedFiles) => //what we do with file
                            setImage1(acceptedFiles[0])
                        } 
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                    <input {...getInputProps()} />
                                    {/**If the picture does not exist yet then... */}
                                    {!image1 ? (<p>Add Nutrition Image Here</p>) : 
                                    (
                                        <FlexBetween>
                                            <Typography>{image1.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {/**Trash Icon */}
                                {image1 && (
                                    <IconButton
                                        onClick={() => setImage1(null)}
                                        sx={{ width: "15%" }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>

                <Box
                    borderRadius="5px"
                    border={`1px solid ${medium}`}
                    p="1rem"
                >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false} //no multiple files
                        onDrop={(acceptedFiles) => //what we do with file
                            setImage2(acceptedFiles[0])
                        } 
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                    <input {...getInputProps()} />
                                    {/**If the picture does not exist yet then... */}
                                    {!image2 ? (<p>Add Ingredients and Allergen Image Here</p>) : 
                                    (
                                        <FlexBetween>
                                            <Typography>{image2.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {/**Trash Icon */}
                                {image2 && (
                                    <IconButton
                                        onClick={() => setImage2(null)}
                                        sx={{ width: "15%" }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
                
            </FlexBetween>
            
            <Divider sx={{ margin: "1.25rem 0"}} />

            <FlexBetween>
                <Button
                        onClick={handlePost}
                        sx={{
                            color: palette.background.alt,
                            backgroundColor: palette.primary.main,
                            borderRadius: "3rem"
                        }}
                >
                        POST
                </Button>
            </FlexBetween>
        </WidgetWrapper>
    )
}

export default MyPostWidget