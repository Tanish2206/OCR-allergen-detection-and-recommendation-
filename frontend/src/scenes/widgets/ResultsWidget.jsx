import ResultWidget from "./ResultWidget"

const ResultsWidget = () => {

    const posts=[
        {
            "name":"COKE",
            "Protein":"20g",
            "Carbs":"100g",
            "Fats":"2g",
            "picturePath":"wall.jpg"
        },
        {
            "name":"AMUL",
            "Protein":"20g",
            "Carbs":"100g",
            "Fats":"2g",
            "picturePath":"mlik.jpg"
        }
    ]

    return (
        <>
            {/**Print posts in reverse order to simulate an actual social media site */}
            {posts.slice(0).reverse().map(  
                //destructure info 
                ({
                    name,
                    Protein,
                    Carbs,
                    Fats,
                    picturePath,
                }) => (
                    <ResultWidget
                        name={name}
                        protein={Protein}
                        carbs={Carbs}
                        fats={Fats}
                        picturePath={picturePath}
                    />
                )
            )}
        </>
    )
}

export default ResultsWidget