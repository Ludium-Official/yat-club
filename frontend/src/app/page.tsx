"use client";

import MoonPayWidget from "@/components/MoonPayWidget";
import Wrapper from "@/components/Wrapper/Wrapper";

export default function Home() {
  return (
    <Wrapper>
      <MoonPayWidget
        price="50"
        token="eth"
        address="0x791631270d994c556E263E3bc9C5B2CA7B9d4758"
        onPurchaseComplete={async () => alert("SUCCESS!!!")}
      />
    </Wrapper>
  );
}
