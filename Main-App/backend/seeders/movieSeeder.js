const Movie = require('../models/movie');

// Sample TMDB-style movie and series data
const sampleMovies = [
  {
    tmdbId: 27205,
    title: "Inception",
    desc: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.",
    img: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    year: "2010",
    limit: 13,
    genre: "Sci-Fi",
    isSeries: false,
    featured: true
  },
  {
    tmdbId: 1399,
    title: "Game of Thrones",
    desc: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war.",
    img: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    trailer: "https://www.youtube.com/watch?v=rlR4PJn8b8I",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    year: "2011",
    limit: 18,
    genre: "Fantasy",
    isSeries: true,
    featured: true
  },
  {
    tmdbId: 155,
    title: "The Dark Knight",
    desc: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.",
    img: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    trailer: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    year: "2008",
    limit: 13,
    genre: "Action",
    isSeries: false,
    featured: true
  },
  {
    tmdbId: 66732,
    title: "Stranger Things",
    desc: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    img: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    trailer: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    year: "2016",
    limit: 16,
    genre: "Sci-Fi",
    isSeries: true,
    featured: false
  },
  {
    tmdbId: 680,
    title: "Pulp Fiction",
    desc: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    img: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    trailer: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    year: "1994",
    limit: 18,
    genre: "Crime",
    isSeries: false,
    featured: false
  },
  {
    tmdbId: 4026,
    title: "The Crown",
    desc: "The gripping, decades-spanning inside story of Her Majesty Queen Elizabeth II and the Prime Ministers who shaped Britain's post-war destiny.",
    img: "https://image.tmdb.org/t/p/w500/1M876KQUEYqNttmEsyEDwHbbFBb.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/1M876KQUEYqNttmEsyEDwHbbFBb.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/1M876KQUEYqNttmEsyEDwHbbFBb.jpg",
    trailer: "https://www.youtube.com/watch?v=JWtnJjn6ng0",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    year: "2016",
    limit: 16,
    genre: "Drama",
    isSeries: true,
    featured: false
  },
  {
    tmdbId: 299534,
    title: "Avengers: Endgame",
    desc: "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos.",
    img: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    year: "2019",
    limit: 13,
    genre: "Action",
    isSeries: false,
    featured: true
  },
  {
    tmdbId: 71912,
    title: "The Witcher",
    desc: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    img: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    trailer: "https://www.youtube.com/watch?v=ndl1W4ltcmg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    year: "2019",
    limit: 18,
    genre: "Fantasy",
    isSeries: true,
    featured: false
  },
  {
    tmdbId: 496243,
    title: "Parasite",
    desc: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    img: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    trailer: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    year: "2019",
    limit: 16,
    genre: "Thriller",
    isSeries: false,
    featured: false
  },
  {
    tmdbId: 69050,
    title: "Money Heist",
    desc: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    img: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    trailer: "https://www.youtube.com/watch?v=_InqQJRqGW4",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    year: "2017",
    limit: 16,
    genre: "Crime",
    isSeries: true,
    featured: true
  },
  {
    tmdbId: 157336,
    title: "Interstellar",
    desc: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    year: "2014",
    limit: 13,
    genre: "Sci-Fi",
    isSeries: false,
    featured: false
  },
  {
    tmdbId: 2316,
    title: "The Office",
    desc: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    img: "https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    trailer: "https://www.youtube.com/watch?v=LHOtME2DL4g",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    year: "2005",
    limit: 13,
    genre: "Comedy",
    isSeries: true,
    featured: false
  },
  {
    tmdbId: 475557,
    title: "Joker",
    desc: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City.",
    img: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    trailer: "https://www.youtube.com/watch?v=zAGVQLHvwOY",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    year: "2019",
    limit: 18,
    genre: "Thriller",
    isSeries: false,
    featured: true
  },
  {
    tmdbId: 1668,
    title: "Friends",
    desc: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
    img: "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    trailer: "https://www.youtube.com/watch?v=hDNNmeeJs1Q",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    year: "1994",
    limit: 13,
    genre: "Comedy",
    isSeries: true,
    featured: false
  },
  {
    tmdbId: 438631,
    title: "Dune",
    desc: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet.",
    img: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    imgTitle: "https://image.tmdb.org/t/p/w1280/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    imgSm: "https://image.tmdb.org/t/p/w300/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    trailer: "https://www.youtube.com/watch?v=8g18jFHCLXk",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    year: "2021",
    limit: 13,
    genre: "Sci-Fi",
    isSeries: false,
    featured: true
  }
];

const seedMovies = async () => {
  try {
    console.log('🎬 Starting movie seeding...');
    
    // Clear existing movies
    await Movie.deleteMany({});
    console.log('📚 Cleared existing movies');
    
    // Insert sample movies
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`✅ Inserted ${insertedMovies.length} movies successfully`);
    
    const movieCount = insertedMovies.filter(m => !m.isSeries).length;
    const seriesCount = insertedMovies.filter(m => m.isSeries).length;
    const featuredCount = insertedMovies.filter(m => m.featured).length;
    
    console.log('📊 Summary:');
    console.log(`   🎬 Movies: ${movieCount}`);
    console.log(`   📺 Series: ${seriesCount}`);
    console.log(`   ⭐ Featured: ${featuredCount}`);
    console.log(`   📈 Total: ${insertedMovies.length}`);
    
    return insertedMovies;
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
    throw error;
  }
};

module.exports = { seedMovies, sampleMovies };
