import dynamic from "next/dynamic";
import { useState } from "react";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false }
);

interface IBuyCryptoWidgetProps {
  price: string;
  token: string;
  address: string;
  onPurchaseComplete: (data: unknown) => Promise<void>;
}

const BuyCryptoWidget: React.FC<IBuyCryptoWidgetProps> = ({
  price,
  token,
  address,
  onPurchaseComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const calculateTotalAmount = (amount: number) => {
    const moonPayFee = amount * 0.045;
    const networkFee = amount * 0.01;
    return amount + moonPayFee + networkFee;
  };

  const totalAmount = calculateTotalAmount(parseFloat(price)).toFixed(2);

  return (
    <div>
      <button onClick={() => setIsVisible(true)}>Buy Crypto</button>
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

export default BuyCryptoWidget;
