import React from "react";

const TooFast = () => {
  return (
    <main className="root-container flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-bebas-neue text-5xl font-bold text-light-100">
        You have hit the rate limit
      </h1>
      <p className="mt-3 max-w-xl text-center text-light-400">
        You have made too many requests in a short period of time. Please try
        again in some time.
      </p>
    </main>
  );
};

export default TooFast;
