import { motion } from "motion/react";

type SharpiSectionProps = {
    text:string;
    backgroundSize:string;
}

export default function SharpiSection({ text, backgroundSize }:SharpiSectionProps){
    return(
        <>
            <motion.div
            animate={{
                backgroundSize: `${backgroundSize}`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            className="
                bg-gradient-to-r from-gray-900 to-gray-900
                bg-no-repeat bg-[length:0%_100%]
                bg-left-bottom
                cursor-pointer
            "
            style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 100%",
                width: "fit-content",
            }}
            >
                <p className="flex break-words w-fit" >{text}</p>
            </motion.div>
        </>
    )
}