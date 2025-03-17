import dynamic from "next/dynamic";
import { useState } from "react";

const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false }
);

interface IBuyCryptoWidgetProps {
  price: string;
  onPurchaseComplete: (data: any) => Promise<void>;
}

const BuyCryptoWidget: React.FC<IBuyCryptoWidgetProps> = ({
  price,
  onPurchaseComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(true)}>Buy Crypto</button>
      {/* 돈이 수정 됨, token 받을 주소 지정해야 함 -> 이걸 회사 계정으로 하면 편하게 끝낼 수 있음 방법 찾아봐야 할 듯 */}
      <MoonPayBuyWidget
        variant="overlay"
        baseCurrencyCode="usd"
        baseCurrencyAmount={price}
        defaultCurrencyCode="eth"
        visible={isVisible}
        onTransactionCompleted={async (data) => {
          console.log("Purchase Completed:", data);
          setIsVisible(false);
          await onPurchaseComplete(data); // 구매 완료 후 콜백 호출
        }}
      />
    </div>
  );
};

export default BuyCryptoWidget;
