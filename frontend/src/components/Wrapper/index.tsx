"use client";

import Header from "@/components/Header";
import {
  initializeWepinWidget,
  selectIsInitialized,
} from "@/lib/features/wepin/loginSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import Footer from "../Footer";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  const isInitialized = useAppSelector(selectIsInitialized);

  useEffect(() => {
    if (typeof window !== "undefined") {
      dispatch(initializeWepinWidget());
    }
  }, [dispatch]);

  return (
    <div className="relative max-w-[50rem] min-h-screen m-auto text-[1.4rem]">
      {isInitialized ? (
        <>
          <Header />
          <div className="pb-115">{children}</div>
          <Footer />
        </>
      ) : (
        <div className="flex items-center justify-center h-dvh">Loading...</div>
      )}
    </div>
  );
};

export default Wrapper;
