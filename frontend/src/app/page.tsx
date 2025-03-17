"use client";

import MoonPayWidget from "@/components/MoonPayWidget";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper/Wrapper";
import fetchData from "@/lib/fetchData";

export default function Home() {
  const check = async () => {
    try {
      const moon = await fetchData("/moonpay");
      console.log(moon);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper>
      <Button variant="outline" onClick={check}>
        Button
      </Button>
      <MoonPayWidget
        price="20"
        onPurchaseComplete={async () => console.log("SUCCESS!!!")}
      />
    </Wrapper>
  );
}
