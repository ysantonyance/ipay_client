import VideoHeader from "../components/media/VideoHeader.jsx";
import VideoCard from "../components/media/VideoCard.jsx";
import {useEffect, useState} from "react";
import {seriesApi} from "../api/seriesApi.js";

function AmazonVideo() {
    const [series, setSeries] = useState([]);

    useEffect(() => {
        seriesApi.getAll()
            .then(res => setSeries(res))
            .catch(err => console.error(err));
    }, []);

    return (
        <>
            <div className='bg-[#00050D] text-[white]'>
                <VideoHeader/>
                <div className='flex flex-wrap gap-4 p-20'>
                    {series.map(s => (
                        <VideoCard key={s.id} {...s} />
                    ))}
                </div>
            </div>

        </>
    )
}

export default AmazonVideo;