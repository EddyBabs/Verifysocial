import { Suspense } from "react";
import VerifyEmailClient from "./page-client";

const Verify = () => {
  return (
    <Suspense>
      <VerifyEmailClient />;
    </Suspense>
  );
};

export default Verify;
