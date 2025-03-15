"use client";

import Header from "@/components/Header";
import {
  initializeWepinWidget,
  selectIsInitialized,
} from "@/lib/features/wepin/loginSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";

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
    <div>
      {isInitialized ? (
        <>
          <Header />
          <div>{children}</div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Wrapper;
