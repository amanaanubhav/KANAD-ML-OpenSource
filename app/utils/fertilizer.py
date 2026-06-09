fertilizer_dic = {
    'NHigh': {
        "status": "high",
        "nutrient": "Nitrogen",
        "message": "The N value of soil is high and might give rise to weeds.",
        "suggestions": [
            {"title": "Manure", "description": "Adding manure is one of the simplest ways to amend your soil with nitrogen. Be careful as there are various types of manures with varying degrees of nitrogen."},
            {"title": "Coffee grinds", "description": "Coffee grinds are considered a green compost material which is rich in nitrogen. Once the grounds break down, your soil will be fed with nitrogen. An added benefit is increased drainage to your soil."},
            {"title": "Plant nitrogen fixing plants", "description": "Planting vegetables that are in Fabaceae family like peas, beans and soybeans have the ability to increase nitrogen in your soil."},
            {"title": "Green manure crops", "description": "Plant green manure crops like cabbage, corn and broccoli."},
            {"title": "Use mulch", "description": "Use mulch (wet grass) while growing crops. Mulch can also include sawdust and scrap soft woods."}
        ]
    },

    'Nlow': {
        "status": "low",
        "nutrient": "Nitrogen",
        "message": "The N value of your soil is low.",
        "suggestions": [
            {"title": "Add sawdust or fine woodchips", "description": "The carbon in the sawdust/woodchips love nitrogen and will help absorb and soak up excess nitrogen."},
            {"title": "Plant heavy nitrogen feeding plants", "description": "Tomatoes, corn, broccoli, cabbage and spinach are examples of plants that thrive off nitrogen and will suck the nitrogen dry."},
            {"title": "Water", "description": "Soaking your soil with water will help leach the nitrogen deeper into your soil, effectively leaving less for your plants to use."},
            {"title": "Sugar", "description": "Adding sugar to your soil can help reduce the amount of nitrogen. Sugar is partially composed of carbon, which attracts and soaks up nitrogen in the soil."},
            {"title": "Add composted manure", "description": "Add composted manure to the soil to increase nitrogen levels."},
            {"title": "Plant nitrogen fixing plants", "description": "Plant nitrogen fixing plants like peas or beans."},
            {"title": "Use NPK fertilizers", "description": "Use NPK fertilizers with high N value."},
            {"title": "Do nothing", "description": "If you already have plants producing lots of foliage, let them continue to absorb all the nitrogen to amend the soil for your next crops."}
        ]
    },

    'PHigh': {
        "status": "high",
        "nutrient": "Phosphorus",
        "message": "The P value of your soil is high.",
        "suggestions": [
            {"title": "Avoid adding manure", "description": "Manure contains many key nutrients but typically including high levels of phosphorous. Limiting manure will help reduce phosphorus being added."},
            {"title": "Use phosphorus-free fertilizer", "description": "Limit phosphorous while still providing other key nutrients. Find a fertilizer with numbers such as 10-0-10, where the zero represents no phosphorous."},
            {"title": "Water your soil", "description": "Soaking your soil liberally will aid in driving phosphorous out of the soil. This is recommended as a last ditch effort."},
            {"title": "Plant nitrogen fixing vegetables", "description": "Plant vegetables like beans and peas to increase nitrogen without increasing phosphorous."},
            {"title": "Use crop rotations", "description": "Use crop rotations to decrease high phosphorous levels."}
        ]
    },

    'Plow': {
        "status": "low",
        "nutrient": "Phosphorus",
        "message": "The P value of your soil is low.",
        "suggestions": [
            {"title": "Bone meal", "description": "A fast acting source made from ground animal bones which is rich in phosphorous."},
            {"title": "Rock phosphate", "description": "A slower acting source where the soil needs to convert the rock phosphate into phosphorous that the plants can use."},
            {"title": "Phosphorus fertilizers", "description": "Apply a fertilizer with a high phosphorous content in the NPK ratio (example: 10-20-10)."},
            {"title": "Organic compost", "description": "Adding quality organic compost to your soil will help increase phosphorous content."},
            {"title": "Manure", "description": "Manure can be an excellent source of phosphorous for your plants."},
            {"title": "Clay soil", "description": "Introducing clay particles into your soil can help retain and fix phosphorus deficiencies."},
            {"title": "Ensure proper soil pH", "description": "Having a pH in the 6.0 to 7.0 range has been scientifically proven to have the optimal phosphorus uptake in plants."},
            {"title": "Adjust pH if needed", "description": "If soil pH is low, add lime or potassium carbonate. If pH is high, add organic matter or acidifying fertilizers like ammonium sulfate."}
        ]
    },

    'KHigh': {
        "status": "high",
        "nutrient": "Potassium",
        "message": "The K value of your soil is high.",
        "suggestions": [
            {"title": "Loosen the soil", "description": "Loosen the soil deeply with a shovel, and water thoroughly to dissolve water-soluble potassium. Allow the soil to fully dry, and repeat two or three more times."},
            {"title": "Sift through the soil", "description": "Remove as many rocks as possible using a soil sifter. Minerals in rocks like mica and feldspar slowly release potassium through weathering."},
            {"title": "Stop potassium-rich fertilizer", "description": "Apply only commercial fertilizer that has a '0' in the final number field (potassium). Or stop using commercial fertilizers and use only organic matter."},
            {"title": "Add calcium", "description": "Mix crushed eggshells, crushed seashells, wood ash or soft rock phosphate to add calcium. Mix in up to 10 percent organic compost."},
            {"title": "Use low-K fertilizers", "description": "Use NPK fertilizers with low K levels and organic fertilizers since they have low NPK values."},
            {"title": "Grow cover crops", "description": "Grow a cover crop of legumes that will fix nitrogen in the soil without increasing phosphorus or potassium."}
        ]
    },

    'Klow': {
        "status": "low",
        "nutrient": "Potassium",
        "message": "The K value of your soil is low.",
        "suggestions": [
            {"title": "Muriate of potash", "description": "Mix in muriate of potash or sulphate of potash to increase potassium levels."},
            {"title": "Kelp meal or seaweed", "description": "Try kelp meal or seaweed as an organic potassium source."},
            {"title": "Sul-Po-Mag", "description": "Try Sul-Po-Mag (sulfate of potash magnesia) for a combined nutrient boost."},
            {"title": "Banana peels", "description": "Bury banana peels an inch below the soil surface as a natural potassium source."},
            {"title": "Potash fertilizers", "description": "Use potash fertilizers since they contain high values of potassium."}
        ]
    }
}