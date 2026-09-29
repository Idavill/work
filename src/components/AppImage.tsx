import { useEffect, useRef, useState } from "react";

type ImageProps = {
    id:string;
    fallbackImage:string,
    img:string,
    setHover:Function,
    alt?:string,
    eager?:boolean,
}

export default function AppImage({id, fallbackImage, img, setHover, alt, eager}:ImageProps){
    const [loaded, setImageLoaded] = useState(false);
    const ref = useRef<HTMLImageElement>(null);

    useEffect(()=>{
        setImageLoaded(false);
        const el = ref.current;
        if (el?.complete && el.naturalWidth > 0) setImageLoaded(true);
    },[img]);

    return(
    <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${fallbackImage})` }}
    >
        <img
            ref={ref}
            key={id}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            src={img}
            alt={alt ?? ""}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onMouseEnter={() => {
                setHover(true);
            }}
            onMouseLeave={() => {
                setHover(false);
            }}
        />
    </div>
    )
}
