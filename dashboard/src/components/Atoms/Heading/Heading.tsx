import React from "react";
import cn from "../../../utils/cn";

interface HeadingProps {
    className?: string;
    title: string;
}

const Heading: React.FC<HeadingProps> = ({ className, title }) => {
    return (
        <h2
            className={cn(
                "text-white text-4xl font-bold mb-2",
                className || ""
            )}
        >
            {title}
        </h2>
    );
};

export default Heading;