import FooterBgImg from "@/assets/Footer/FooterBgImg.svg";
import SmallLogo from "@/assets/Footer/SmallLogo.svg";
import TelegramLogo from "@/assets/Footer/TelegramLogo.svg";
import XLogo from "@/assets/Footer/XLogo.svg";
import Link from "next/link";
import ImgComponent from "../Image";

const Footer: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${FooterBgImg.src})`,
      }}
      className="absolute bottom-0 bg-cover bg-center bg-no-repeat w-full max-w-[50rem] h-100 py-16"
    >
      <div className="mx-20">
        <ImgComponent imgSrc={SmallLogo} className="mb-10" />
        <div className="text-default-secondary text-[1rem]">
          <div className="flex items-center gap-10 mb-4">
            <div>Social link</div>
            <div className="flex items-center gap-8">
              <Link href="https://x.com/yat_club" target="_blank">
                <ImgComponent imgSrc={XLogo} width={12} height={12} />
              </Link>
              <Link href="https://t.me/yatclub_public" target="_blank">
                <ImgComponent imgSrc={TelegramLogo} width={12} height={12} />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div>On Chain</div>
            <Link
              href="https://raydium.io/swap/?inputMint=sol&outputMint=HkRJ1HjXQveNZqx9ZrXNvY82KxMEhfcQ5fJE184Zpump"
              className="underline"
              target="_blank"
            >
              $YAT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
