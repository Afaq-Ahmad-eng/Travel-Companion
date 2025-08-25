import React from "react";
import "./PersonalizedRecommendations.css";

function PersonalizedRecommendations() {
    // Data containing places with images and descriptions
    const placesData = {
        kpk: {
            historical: [
                { name: "Qila Bala Hisar", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Bala_Hissar%2C_Peshawar.jpg/800px-Bala_Hissar%2C_Peshawar.jpg", description: "A historic fort located in Peshawar, offering a great view of the city and the surrounding areas." },
                { name: "Takht-i-Bahi", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Takht-i-Bahi_Mardan.jpg/800px-Takht-i-Bahi_Mardan.jpg", description: "An ancient Buddhist monastery in Mardan, known for its well-preserved ruins." },
                { name: "Gorkhatri", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Gorkhatri_Peshawar.jpg/800px-Gorkhatri_Peshawar.jpg", description: "A historical site in Peshawar, known for its archaeological significance as a Buddhist center." },
                { name: "Jamrud Fort", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Jamrud_Fort.jpg/800px-Jamrud_Fort.jpg", description: "A historic fort built by the British during the 19th century, located at the entrance of the Khyber Pass." },
            ],
            adventure: [
                { name: "Kumrat Valley", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kumrat_Valley.jpg/800px-Kumrat_Valley.jpg", description: "A beautiful valley in the Upper Dir District, famous for its lush green meadows and scenic views." },
                { name: "Malam Jabba", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Malam_Jabba.jpg/800px-Malam_Jabba.jpg", description: "A popular ski resort located in the Swat Valley, offering thrilling winter sports and great snow-covered landscapes." },
                { name: "Swat Valley", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Swat_Valley.jpg/800px-Swat_Valley.jpg", description: "A stunning valley known as the 'Switzerland of Pakistan,' famous for its rivers, lakes, and lush hills." },
                { name: "Kalash Valley", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kalash_Valley.jpg/800px-Kalash_Valley.jpg", description: "A remote valley famous for its unique Kalash people and their distinct cultural heritage." },
            ],
            nature: [
                { name: "Lake Saiful Muluk", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Saiful_Muluk_Lake.jpg/800px-Saiful_Muluk_Lake.jpg", description: "A breathtaking alpine lake located in the Kaghan Valley, known for its crystal-clear water and surrounding snow-capped mountains." },
                { name: "Kundol Lake", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Kundol_Lake.jpg/800px-Kundol_Lake.jpg", description: "A serene high-altitude lake located in the Upper Dir District, perfect for nature lovers and trekkers." },
                { name: "Shogran", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Shogran.jpg/800px-Shogran.jpg", description: "A hilltop area in the Kaghan Valley, offering panoramic views of the surrounding mountains and lush forests." },
                { name: "Thandiani", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Thandiani.jpg/800px-Thandiani.jpg", description: "A cool hill station located in the Abbottabad District, offering beautiful views of the Himalayas and pine forests." },
            ],
        },
    };

    return (
        <div className="recommendations-container">
            <h2>Personalized Recommendations</h2>

            {["historical", "adventure", "nature"].map((category) => (
                <div key={category} className="category">
                    <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Places</h3>
                    <div className="places-list">
                        {placesData.kpk[category].map((place, index) => (
                            <div key={index} className="place-card">
                                <img src={place.image} alt={place.name} />
                                <h4>{place.name}</h4>
                                <p>{place.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PersonalizedRecommendations;
