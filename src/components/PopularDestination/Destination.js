
import React, { useState } from 'react';
import "./Destination.css"
import Destinationdata from './Destinationdata'

export default function Destination() {
  const [showAll, setShowAll] = useState(false);

  const destinations = [
    {
      heading: 'Naran Kaghan',
      text: ' Naran and Kaghan are iconic highland valleys known for their awe-inspiring scenery, glacial lakes, alpine meadows, and snow-covered peaks. The crown jewel is Lake Saiful Muluk, a legendary lake surrounded by towering mountains. Visitors can enjoy jeep rides to Babusar Top, stay in riverside hotels, hike through valleys, and witness natural wonders at every turn. Its a favorite for honeymooners, adventurers, and families alike.📍Distance from Peshawar: ~370 km (9–10 hours)',
      img1: "https://historypak.com/wp-content/uploads/2014/03/Narran-Valley.jpg",
      img2: "https://cdn-blog.zameen.com/blog/wp-content/uploads/2024/05/Kaghan-Valley.jpg ",
    },
    {
      heading: 'Kalam (Swat)',
      text: 'Kalam is the crown jewel of Swat, located about 99 km from Mingora. Surrounded by towering snow-covered mountains, alpine forests, and the Swat River, its a serene destination for tourists seeking scenic drives, cool weather, and raw nature. From here, you can explore nearby attractions like Mahodand Lake, Ushu Forest, Blue Water, and Glaciers. The jeep tracks to the upper lakes are a thrilling experience.📍Distance from Peshawar: ~250 km (6–7 hours)',
      img1: "https://burjalswat.com/wp-content/uploads/2022/04/Screenshot_6.jpg",
      img2: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/b0/50/19/caption.jpg?w=1200&h=-1&s=1",
    },
    {
      heading: 'Galiyat',
      text: 'The Galiyat region is a cool, forested escape from city heat, comprising famous hill stations like Nathiagali, Ayubia, and Dunga Gali. Visitors can explore misty pine forests, hike to Mushkpuri Top, or walk the scenic Pipeline Track. With its refreshing climate, colonial-era buildings, and rich wildlife, the Galiyat area is a family-friendly destination, perfect for relaxing stays and mild adventures.📍Distance from Peshawar: ~220 km (5–6 hours)',
       img1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt8u2PgxqpdpxKFHFNDtjkoam5Nl5APPYIYZ3XzS7e-8OMO4x1BlAMn3GrcsrzxtmPaKE&usqp=CAU",
      img2: "https://vepakistan.com/wp-content/uploads/2019/05/Ayubia-galiyat.jpg",
    },
    {
      heading: ' Kumrat Valley',
      text: 'Kumrat Valley in Upper Dir is one of KPK’s best-kept secrets, offering raw and untouched beauty. Covered with thick deodar forests, the valley features roaring rivers, alpine streams, wooden mosques, and camping sites that are a dream for adventure seekers. With spots like Jahaz Banda, Katora Lake, and the majestic Dojanga waterfall, Kumrat feels like a step into a fantasy world. It’s ideal for off-road travelers, hikers, and peace-seekers. Distance from Peshawar: 320km (8–9 hours)',
      img1: "https://www.visitswatvalley.com/images/Kumrat-Valley.jpg",
      img2: "https://naturehikepakistan.pk/wp-content/uploads/2024/03/kumrat-valley-s.jpg",
    },
    {
      heading: 'Malam Jabba',
      text: 'Malam Jabba is Pakistan’s only ski resort, offering a full alpine experience with skiing, snowboarding, chairlifts, and zip-lining. Perched at an elevation of over 9,000 feet, it provides panoramic views of the surrounding hills and valleys blanketed in snow during winter. The resort is equipped with facilities for both professionals and first-timers, making it a go-to winter destination. In summer, its cool climate and hiking trails attract equally passionate visitors. 📍Distance from Peshawar: ~270 km (6–7 hours)',
      img1: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/b9/bc/37/malam-jabba.jpg?w=1200&h=-1&s=1",
      img2: "https://traveloguers.com/wp-content/uploads/2024/02/Malam-Jabba-Swat-KPK-1.webp",
    },
    {
      heading: 'Chitral & Kalash Valleys',
      text: 'Chitral, nestled beneath the shadows of the mighty Tirich Mir peak, is a destination of stunning mountain scenery and unique cultural experiences. The nearby Kalash Valleys—Bumburet, Rumbur, and Birir—are home to the indigenous Kalash people, known for their colorful festivals and centuries-old traditions. Chitral also hosts the world-famous Shandur Polo Festival, held at the world’s highest polo ground. This region offers a perfect mix of culture, heritage, and nature.  📍Distance from Peshawar: ~365 km (10–11 hours)',
     img1: "https://sujag-london.s3.eu-west-2.amazonaws.com/sujag-london/kalasha.JPG",
      img2: "https://res.cloudinary.com/www-travelpakistani-com/image/upload/v1674901981/blogs/ovsgdgnrqr3tximwwftc.jpg",
    },
    {
      heading: 'Shogran & Siri Paye Meadows',
      text: 'Shogran is a beautiful hill station located in the Kaghan Valley, surrounded by forests and cool breezes. From here, visitors can embark on a thrilling jeep ride to Siri Paye Meadows, a magical plateau floating above the clouds. With panoramic views of snow-capped peaks and lush green pastures, it’s a photographer’s dream and an unforgettable destination for couples and families. 📍Distance from Peshawar: ~360 km (8–9 hours)',
      img1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCkCgg6a5wR9t9KL_dW59qHtuqlThrZLCQ1A&s",
      img2: "https://thetravelnorth.com/wp-content/uploads/2024/10/Shogran-Siri-Paye3_11zon.webp",
    },
    {
      heading: ' Ayubia National Park',
      text: 'Located in the Galiyat region, Ayubia National Park is a lush green haven for wildlife and nature lovers. The famous Pipeline Walk between Dunga Gali and Ayubia is a favorite among families, while the Mushkpuri Top trek offers breathtaking views. The park is home to leopards, monkeys, and hundreds of bird species, making it a biodiversity hotspot perfect for hiking, photography, and relaxation. 📍Distance from Peshawar: ~210 km (5 hours)',
       img1: "https://wwfasia.awsassets.panda.org/img/dessan_valley_693935.jpg",
      img2: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Ayubia_National_Park_Pipeline_Track_02.jpg/250px-Ayubia_National_Park_Pipeline_Track_02.jpg",
    },
    {
      heading: 'Alpine Lakes (Dudipatsar, Saidgai, Kundol, Mahodand)',
      text: ' These breathtaking alpine lakes—Dudipatsar, Kundol, Mahodand, and Saidgai—are nestled deep in the mountains and require trekking to reach. Surrounded by lush meadows, wildflowers, and glaciers, they are favorite spots for hikers and nature photographers. The water in these lakes is so clear and still that it mirrors the sky, offering peace and inspiration to those who reach them. 📍Distance from Peshawar: ~340–370 km + hike (8–10 hours + trek)',
     img1: "https://images.unsplash.com/photo-1650493359585-f394207e8460?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWxwaW5lJTIwbGFrZXxlbnwwfHwwfHx8MA%3D%3D",
    img2: "https://i.dawn.com/primary/2017/05/592a95aaabc67.jpg",
    },
    {
      heading: 'Heritage Sites (Takht Bhai, Peshawar, Swabi)',
      text: 'KPK’s rich history comes alive in its heritage sites like Takht Bhai, a UNESCO World Heritage Buddhist monastery dating back to the 1st century AD. Bala Hisar Fort and Qissa Khawani Bazaar in Peshawar offer a glimpse into centuries of trade, war, and storytelling. These cultural sites are perfect for tourists seeking to connect with the ancient Gandharan civilization and colonial history. 📍Distance from Peshawar: 5 km to ~80 km',
       img1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHu3_vCt0SZEJUBr5--BWRJDclEoMliFwhWA&s",
      img2: "https://res.cloudinary.com/www-travelpakistani-com/image/upload/w_900,h_360,c_fill,g_auto,q_30,dpr_1.0,f_auto/blogs/wxzmlwevju3guuqkuwnx.webp",
    },
  ];

  const visibleDestinations = showAll ? destinations : destinations.slice(0, 3);

  return (
    <div className="destination">
      <h1>Popular Destination</h1>
      <p>We give you the opportunity to see a lot</p>

      {visibleDestinations.map((dest, index) => (
        <Destinationdata
          key={index}
          className={index % 2 === 0 ? 'first-desc' : 'first-desc-reverse'}
          heading={dest.heading}
          text={dest.text}
          img1={dest.img1}
          img2={dest.img2}
        />
      ))}

      <div className="see-more-container">
        <button onClick={() => setShowAll(!showAll)} className="see-more-btn">
          {showAll ? 'Show Less' : 'See More'}
        </button>
      </div>
    </div>
  );
}