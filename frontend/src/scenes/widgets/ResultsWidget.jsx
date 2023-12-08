import { useSelector } from "react-redux"
import ResultWidget from "./ResultWidget"

const ResultsWidget = () => {

    const posts=useSelector((state)=>state.alternatives)

    return (
        <>
            {/**Print posts in reverse order to simulate an actual social media site */}
            {posts.slice(0,3).map(  
                //destructure info 
                ({
                    name,
                    Category,
                    Ingredients,
                    Manufacturer
                }) => (
                    <ResultWidget
                        name={name}
                        category={Category}
                        ingredients={Ingredients}
                        manufacturer={Manufacturer}
                    />
                )
            )}
        </>
    )
}

export default ResultsWidget