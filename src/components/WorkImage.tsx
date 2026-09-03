import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  images?: string[];
  alt?: string;
  video?: string;
  link?: string;
  featuredCard?: boolean;
  mobileCard?: boolean;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");

  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  return (
    <div className="work-image">
      <a
        className={`work-image-in${props.featuredCard ? " work-image-featured-card" : ""}${props.mobileCard ? " work-image-mobile-card" : ""}`}
        href={props.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        data-cursor={"disable"}
      >
        {props.link && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}
        {props.images && props.images.length > 1 ? (
          <div className="work-image-pair">
            {props.images.slice(0, 3).map((img, index) => (
              <img
                key={`${img}-${index}`}
                src={img}
                alt={`${props.alt} ${index + 1}`}
                className="work-pair-image"
              />
            ))}
          </div>
        ) : (
          <img src={props.image} alt={props.alt} />
        )}
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;
