"use client";

import {
  useEffect,
  useState,
} from "react";

interface AnimatedXpCounterProps {
  value: number;

  duration?: number;

  delay?: number;
}

export default function AnimatedXpCounter({
  value,
  duration = 1200,
  delay = 350,
}: AnimatedXpCounterProps) {
  const [
    displayedValue,
    setDisplayedValue,
  ] = useState(0);

  useEffect(() => {
    setDisplayedValue(
      0
    );

    let animationFrameId:
      number | null =
      null;

    const timeoutId =
      window.setTimeout(
        () => {
          const startedAt =
            performance.now();

          function animate(
            currentTime: number
          ): void {
            const elapsed =
              currentTime -
              startedAt;

            const rawProgress =
              Math.min(
                1,
                elapsed /
                  duration
              );

            /*
             * Courbe d'accélération douce :
             * le compteur monte vite au début,
             * puis ralentit à l'approche du total.
             */
            const easedProgress =
              1 -
              Math.pow(
                1 -
                  rawProgress,
                3
              );

            setDisplayedValue(
              Math.round(
                value *
                  easedProgress
              )
            );

            if (
              rawProgress <
              1
            ) {
              animationFrameId =
                window.requestAnimationFrame(
                  animate
                );
            }
          }

          animationFrameId =
            window.requestAnimationFrame(
              animate
            );
        },
        delay
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );

      if (
        animationFrameId !==
        null
      ) {
        window.cancelAnimationFrame(
          animationFrameId
        );
      }
    };
  }, [
    delay,
    duration,
    value,
  ]);

  return (
    <span>
      +{displayedValue}
    </span>
  );
}