import ArrowIcon from "@/assets/Membership/ArrowIcon.svg";
import dynamic from "next/dynamic";
import { useState } from "react";
import ImgComponent from "../Image";
import { Button } from "../ui/button";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false }
);

interface IMoonPayWidgetForMembershipProps {
  price: string;
  token: string;
  address: string;
  onPurchaseComplete: (data: unknown) => Promise<void>;
}

const MoonPayWidgetForMembership: React.FC<
  IMoonPayWidgetForMembershipProps
> = ({ price, token, address, onPurchaseComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  const calculateTotalAmount = (amount: number) => {
    const moonPayFee = amount * 0.045;
    const networkFee = amount * 0.01;
    return amount + moonPayFee + networkFee;
  };

  const totalAmount = calculateTotalAmount(parseFloat(price)).toFixed(2);

  return (
    <div className="flex justify-center">
      <Button
        className="flex items-center bg-[#d9e9ff] rounded-full py-8 text-blue"
        onClick={() => setIsVisible(true)}
      >
        <ImgComponent imgSrc={ArrowIcon} className="mr-8" />
        Purchase
      </Button>
      <MoonPayBuyWidget
        variant="overlay"
        baseCurrencyAmount={totalAmount}
        currencyCode={token}
        visible={isVisible}
        walletAddress={address}
        lockAmount="true"
        onTransactionCompleted={async (data) => {
          if (data.status === "completed") {
            await onPurchaseComplete(data);
            setIsVisible(false);
          }
        }}
      />
    </div>
  );
};

export default MoonPayWidgetForMembership;
