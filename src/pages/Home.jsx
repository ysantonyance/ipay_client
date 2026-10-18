import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Carousel from "../components/shop/Carousel.jsx";
import {useSearch} from "../context/SearchContext.jsx";
import {useLanguage} from "../context/LanguageContext.jsx";

// Every card on this page links to one of these categories (ids/names from the admin Categories table),
// except the "Deals on top categories" card, which links to the 4-stars-and-up filter.
const CATEGORY_NAMES = {
    2: 'kitchen',
    3: 'beauty',
    4: 'fashion clothing',
    5: 'toys',
    6: 'pc',
    7: 'books',
    8: 'electronics',
    9: 'computers',
    11: 'fitness',
    12: 'Trending Fashion',
    13: 'shoes',
    14: 'pets',
    15: 'games',
    16: 'home bedding',
    17: 'accessories',
    18: 'apparel',
    19: 'theater',
    20: 'home',
};
const TOP_RATED = 'top-rated';

const linkTo = (target) => target === TOP_RATED ? '/products?rating=4' : `/products?category=${target}`;

const image = (file) => `https://m.media-amazon.com/images/I/${file}`;
const bigImage = (id, height) =>
    image(`${id}._AC_AIweblab1431263,T1_FMavif_SF1282.5,${height}_QL54_.jpg?aicid=homepage-single-creative-card`);

const item = (label, category, file) => ({label, category, src: image(file)});

// The big cards in the top carousel: [title, category, image]
const CAROUSEL = [
    {title: "Shop kitchen must-haves", category: 2, src: bigImage('51l7ZOsRo7L', 2052)},
    {title: "Shop all things beauty", category: 3, src: bigImage('61Ld77LHXQL', 1981.5)},
    {title: "Start looking sharp", category: 4, src: bigImage('61R7G24e7dL', 1981.5)},
    {title: "Toys for little ones", category: 5, src: bigImage('61upHi2gzaL', 2052)},
    {title: "Level up your PC here", category: 6, src: bigImage('714RPvHc4LL', 1981.5)},
    {title: "Discover books you can't put down", category: 7, src: bigImage('613fnGHLTYL', 1981.5)},
];

// The 2x2 cards below it: a title (links to `category`) and four items, each with its own category.
const CARDS = [
    {
        title: "Plug in with our electronics", category: 8,
        items: [
            item("Headphones", 8, '417NhPd56zL._SR210,210_.jpg'),
            item("Tablets", 8, '41dMYqsSuGL._SR210,210_.jpg'),
            item("Gaming", 15, '41gk0-eoy4L._SR210,210_.jpg'),
            item("Speakers", 8, '41uuEMle6TL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Score the top PCs & Accessories", category: 9,
        items: [
            item("Desktops", 6, '31aw+nYkUmL._SR210,210_.jpg'),
            item("Laptops", 9, '31hqkoNqvTL._SR210,210_.jpg'),
            item("Hard Drives", 9, '217Arq+nObL._SR210,210_.jpg'),
            item("PC Accessories", 6, '312z6VjcSmL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Gear up to get fit", category: 11,
        items: [
            item("Clothing", 11, '41CutKsrzNL._SR210,210_.jpg'),
            item("Trackers", 11, '41RKKF01YxL._SR210,210_.jpg'),
            item("Equipment", 11, '41MjMjLh9BL._SR210,210_.jpg'),
            item("Deals", 11, '41idnUIEIZL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Apparel under $25", category: 12,
        items: [
            item("Women", 4, '41DNYos4L1L._SR210,210_.jpg'),
            item("Men", 4, '31-zpA1B2zL._SR210,210_.jpg'),
            item("Girl", 4, '41J+KoaCycL._SR210,210_.jpg'),
            item("Boys", 4, '31YRD7rRprL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Fantastic Finds for Home", category: 2,
        items: [
            item("Kitchen", 2, '41opB3I6bHL._SR210,210_.jpg'),
            item("Home Decor", 20, '31zR9dINh6L._SR210,210_.jpg'),
            item("Dining", 2, '41bvMGlDk4L._SR210,210_.jpg'),
            item("Smart Home", 20, '314AasupNAL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Shine brighter with your fashion faves", category: 3,
        items: [
            item("Jewelry", 17, '31iAfM94Q1L._SR210,210_.jpg'),
            item("Handbags", 17, '41RsxdVi8QL._SR210,210_.jpg'),
            item("Footwear", 13, '41wBvSYrvWL._SR210,210_.jpg'),
            item("Beauty", 3, '41Tsj3W9JHL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Unveil your radiance", category: 3,
        items: [
            item("Hair Care", 3, '41+i4d+1YXL._SR210,210_.jpg'),
            item("Fragrances", 3, '4115ssxY8RL._SR210,210_.jpg'),
            item("Make-up", 3, '51F8Stay1iL._SR210,210_.jpg'),
            item("Skin Care", 3, '41hBTWbTOvL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Level up your PC here", category: 9,
        items: [
            item("Laptops", 9, '41SeoNqumwL._SR210,210_.jpg'),
            item("PCs", 6, '41hls0IW3XL._SR210,210_.jpg'),
            item("Hard Drives", 9, '41DUMIpCRRL._SR210,210_.jpg'),
            item("Monitors", 9, '410RcCBLHIL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Fashion trends in Shoes", category: 13,
        items: [
            item("Women's", 13, '41yqgtOqxPL._SR210,210_.jpg'),
            item("Men's", 13, '41wfXsKdqEL._SR210,210_.jpg'),
            item("Kid's", 13, '41-zOL2WhXL._SR210,210_.jpg'),
            item("All Shoes", 13, '4103VPrZvIL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Home harmony", category: 2,
        items: [
            item("Kitchen essentials", 2, '41dEpCmTRFL._SR210,210_.jpg'),
            item("Home comfort", 20, '41cXdDKGU6L._SR210,210_.jpg'),
            item("Decorate with elegance", 20, '41EvbQ64I2L._SR210,210_.jpg'),
            item("Light it Right", 20, '41hJC3LJ2aL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Shoes under $50", category: 13,
        items: [
            item("Women's", 13, '31U967D6S3L._SR210,210_.jpg'),
            item("Men's", 13, '31Wut-0nWqL._SR210,210_.jpg'),
            item("Girl's", 13, '31JVbBrAgDL._SR210,210_.jpg'),
            item("Boy's", 13, '41DEKPASTNL._SR210,210_.jpg'),
        ],
    },
    {
        title: "What you need for furry friends", category: 14,
        items: [
            item("Dogs", 14, '41eLkFePVUL._SR210,210_.jpg'),
            item("Cats", 14, '41OERaEZuaL._SR210,210_.jpg'),
            item("Small pets", 14, '410BX1Aby0L._SR210,210_.jpg'),
            item("Deals", 14, '4172LJHm7gL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Video games & accessories", category: 15,
        items: [
            item("Xbox controllers", 15, '21HndQWZivL._SR100,100_.jpg'),
            item("Nintendo", 15, '31L8hlUOKfL._SR100,100_.jpg'),
            item("VR headsets", 15, '21+Ccbv5f5L._SR100,100_.jpg'),
            item("PS5 accessories", 15, '21DOO2U+rQL._SR100,100_.jpg'),
        ],
    },
    {
        title: "Have more fun with the family", category: 5,
        items: [
            item("Outdoor Play Sets", 5, '31uBBG+KvtL._SR210,210_.jpg'),
            item("Learning Toys", 5, '31QJz8+ereL._SR210,210_.jpg'),
            item("Action Figures", 5, '310Ke5y4pBL._SR210,210_.jpg'),
            item("Pretend Play Toys", 5, '416Kr1IKmgL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Finds in Home", category: 16,
        items: [
            item("Bedsheets", 16, '319RC1dCFNL._SR210,210_.jpg'),
            item("Pillows", 16, '41+4Tvu3E0L._SR210,210_.jpg'),
            item("Duvet Covers", 16, '41u90AplYLL._SR210,210_.jpg'),
            item("Throws", 16, '41iRkfbZX6L._SR210,210_.jpg'),
        ],
    },
    {
        // Not a category: shows only top-rated products (4 stars and up).
        title: "Deals on top categories", category: TOP_RATED,
        items: [
            item("Books", TOP_RATED, '41GibUzBeXL._SR210,210_.jpg'),
            item("Fashion", TOP_RATED, '41YDpSUai3L._SR210,210_.jpg'),
            item("PC", TOP_RATED, '41qG08jk3ML._SR210,210_.jpg'),
            item("Beauty", TOP_RATED, '41QFxGoW7IL._SR210,210_.jpg'),
        ],
    },
    {
        title: "New home arrivals under $50", category: 20,
        items: [
            item("Kitchen & dining", 2, '41I85MytToL._SR210,210_.jpg'),
            item("Home improvement", 20, '41mb6AUCJSL._SR210,210_.jpg'),
            item("Décor", 20, '41J1-iazq6L._SR210,210_.jpg'),
            item("Bedding & bath", 16, '417HmRJ2WJL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Discover the latest arrivals", category: 8,
        items: [
            item("Electronics", 8, '31zLfxfdJ1L._SR100,100_.jpg'),
            item("Home", 20, '31cU8R+ZNFL._SR100,100_.jpg'),
            item("Beauty", 3, '21vZBVKPsDL._SR100,100_.jpg'),
            item("Fashion", 4, '21X3TF86YFL._SR100,100_.jpg'),
        ],
    },
    {
        title: "Accessorize your life", category: 17,
        items: [
            item("Fashion accessories", 17, '413lM0C0PEL._SR210,210_.jpg'),
            item("Men's accessories", 17, '410LHEUGZ5L._SR210,210_.jpg'),
            item("Health and beauty", 3, '41IIOwmruhL._SR210,210_.jpg'),
            item("Sports", 11, '31KVFrr1USL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Step into style", category: 18,
        items: [
            item("Women's clothing", 18, '41Ty8UTzIFL._SR210,210_.jpg'),
            item("Women's shoes", 13, '41WzZLqiLEL._SR210,210_.jpg'),
            item("Men's clothing", 18, '31oxb92GmqL._SR170,170_.jpg'),
            item("Men's shoes", 13, '41iPIZIMh2L._SR170,170_.jpg'),
        ],
    },
    {
        title: "Level up your beauty routine", category: 3,
        items: [
            item("Makeup", 3, '31aJyAdILmL._SR210,210_.jpg'),
            item("Brushes", 3, '41MIeNiwdhL._SR210,210_.jpg'),
            item("Sponges", 3, '31wSz8gA5wL._SR210,210_.jpg'),
            item("Mirrors", 3, '21xHtP1ZnlL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Handpicked home theater", category: 19,
        items: [
            item("Televisions", 19, '41Nldn0FGML._SR210,210_.jpg'),
            item("Speakers", 8, '4198T9z6hjL._SR210,210_.jpg'),
            item("Soundbars", 19, '41Z1yvPi2rL._SR210,210_.jpg'),
            item("Projectors", 19, '41J5MFD8nnL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Curate your space", category: 20,
        items: [
            item("Candles", 20, '415fShfBidL._SR210,210_.jpg'),
            item("Stylish pillows", 16, '41eHYxK1H4L._SR210,210_.jpg'),
            item("Indoor gardening", 20, '41RqiI-5T5L._SR210,210_.jpg'),
            item("Storage organization", 20, '41wRrAnGAJL._SR210,210_.jpg'),
        ],
    },
    {
        title: "Look your best this season", category: 18,
        items: [
            item("For Her", 18, '41u9C4AnoaL._SR210,210_.jpg'),
            item("For Him", 18, '41mhTFj8EhL._SR210,210_.jpg'),
            item("For Teens", 18, '41VUN4-BMYL._SR210,210_.jpg'),
            item("For Kids", 18, '413w78Z-7PL._SR210,210_.jpg'),
        ],
    },
];

function Home() {
    const {t} = useLanguage();
    const {setSearch} = useSearch();
    // Clicking a card fills the header search box with the category name (or clears it) and follows the link.
    const onOpen = (target) => () => setSearch(CATEGORY_NAMES[target] ?? '');

    const [carouselCount, setCarouselCount] = useState(
        window.innerWidth < 640 ? 1.85 : window.innerWidth < 1024 ? 3 : 5
    );
    useEffect(() => {
        const updateCount = () => {
            setCarouselCount(window.innerWidth < 900 ? (window.innerWidth < 600 ? 1.85 : 3) : 5);
        };
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    return (
        <>
            <div className='px-0 sm:px-0 lg:px-15 bg-[#E3E6E6]'>
                <div className='bg-white px-4 py-2'>
                    <Carousel visibleCount={carouselCount}>
                        {CAROUSEL.map((card) => (
                            <div key={card.title} className='relative '>
                                <Link to={linkTo(card.category)} onClick={onOpen(card.category)}>
                                    <img
                                        className='block rounded-2xl w-full aspect-[302/484] object-cover shadow-xl'
                                        src={card.src} alt=""/>
                                </Link>
                                <h1 className='font-bold text-[18px] sm:text-[20px] xl:text-[26px] absolute top-2 left-0 right-0 px-3 leading-tight pointer-events-none'>{t(card.title)}</h1>
                            </div>
                        ))}
                    </Carousel>
                </div>

                <div className='bg-white px-4 py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6'>
                    {CARDS.map((card) => (
                        <div key={card.title} className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                            <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                                <Link
                                    to={linkTo(card.category)}
                                    onClick={onOpen(card.category)}
                                    className='tracking-tight'
                                >
                                    {t(card.title)}
                                </Link>
                            </div>
                            <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                                {card.items.map((entry) => (
                                    <div key={entry.label}>
                                        <Link to={linkTo(entry.category)} onClick={onOpen(entry.category)}>
                                            <img
                                                className='rounded-xl w-full aspect-square object-cover'
                                                src={entry.src} alt=""/>
                                        </Link>
                                        <Link
                                            to={linkTo(entry.category)}
                                            onClick={onOpen(entry.category)}
                                            className='block leading-tight min-h-[2.5rem]'
                                        >
                                            {t(entry.label)}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Home;
