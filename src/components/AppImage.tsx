import { useEffect, useState } from "react";

type ImageProps = {
    id:string;
    fallbackImage:string,
    img:string,
    setHover:Function,
}

export default function AppImage({id, fallbackImage, img, setHover}:ImageProps){
    const [image, setImage] = useState(fallbackImage)

    useEffect(()=>{
        const i = new Image();
        i.src = img;
        // console.log("image is loaded!!", img)

        i.onload = function () {
            setImage(img);
            // console.log("image is loaded!!", img)
        }
    },[image])

    return(
    <img
        key={id}
        className="w-full h-full object-cover"
        src={image}
        alt={image}
        onMouseEnter={() => {
            // console.log("true");
            setHover(true);
        }}
        onMouseLeave={() => {
            // console.log("false");
            setHover(false);
        }}
    />
    )
}