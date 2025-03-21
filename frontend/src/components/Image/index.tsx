import Image from "next/image";

interface ImgComponentProps {
  imgSrc: string;
  className?: string;
  width?: number;
  height?: number;
}

const ImgComponent: React.FC<ImgComponentProps> = ({
  imgSrc,
  className,
  width,
  height,
}) => {
  return (
    <Image
      className={className}
      src={imgSrc}
      alt="image"
      width={width || 0}
      height={height || 0}
      style={{ width: "auto", height: "auto" }}
    />
  );
};

export default ImgComponent;
