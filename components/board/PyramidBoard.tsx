"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import PyramidCard from "./PyramidCard";

import type {
  PlayerGameState,
} from "@/lib/gameEngine/publicTypes";

interface PyramidBoardProps {
  state: PlayerGameState;
}

type PyramidCardSize =
  | "small"
  | "medium";

const MOBILE_BREAKPOINT = 640;

/**
 * Espace vertical maximal accordé à la pyramide.
 *
 * On conserve une marge pour le titre,
 * les bordures et les autres éléments
 * présents sur la page de jeu.
 */
const VIEWPORT_VERTICAL_MARGIN = 190;

export default function PyramidBoard({
  state,
}: PyramidBoardProps) {
  const frameRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const pyramidRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    scale,
    setScale,
  ] = useState(1);

  const [
    scaledHeight,
    setScaledHeight,
  ] =
    useState<number | null>(
      null
    );

  const [
    cardSize,
    setCardSize,
  ] =
    useState<PyramidCardSize>(
      "small"
    );

  /**
   * state.current.row utilise l’ordre logique
   * du moteur : la ligne du bas correspond à 0.
   *
   * state.pyramid utilise l’ordre visuel :
   * le sommet est stocké en premier.
   */
  const currentVisualRow =
    state.current.card
      ? (
          state.pyramid.length -
          1 -
          state.current.row
        )
      : null;

  const currentColumn =
    state.current.card
      ? state.current.column
      : null;

  const recalculateScale =
    useCallback((): void => {
      const frame =
        frameRef.current;

      const pyramid =
        pyramidRef.current;

      if (
        !frame ||
        !pyramid
      ) {
        return;
      }

      const naturalWidth =
        pyramid.scrollWidth;

      const naturalHeight =
        pyramid.scrollHeight;

      if (
        naturalWidth <= 0 ||
        naturalHeight <= 0
      ) {
        return;
      }

      const availableWidth =
        frame.clientWidth;

      const availableHeight =
        Math.max(
          320,
          window.innerHeight -
            VIEWPORT_VERTICAL_MARGIN
        );

      const widthScale =
        availableWidth /
        naturalWidth;

      const heightScale =
        availableHeight /
        naturalHeight;

      const nextScale =
        Math.min(
          1,
          widthScale,
          heightScale
        );

      setScale(
        nextScale
      );

      setScaledHeight(
        naturalHeight *
          nextScale
      );
    }, []);

  useEffect(() => {
    function updateCardSize():
      void {
      const nextCardSize:
        PyramidCardSize =
          window.innerWidth <
          MOBILE_BREAKPOINT
            ? "small"
            : "medium";

      setCardSize(
        nextCardSize
      );
    }

    updateCardSize();

    window.addEventListener(
      "resize",
      updateCardSize
    );

    window.addEventListener(
      "orientationchange",
      updateCardSize
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateCardSize
      );

      window.removeEventListener(
        "orientationchange",
        updateCardSize
      );
    };
  }, []);

  useLayoutEffect(() => {
    recalculateScale();

    const frame =
      frameRef.current;

    const pyramid =
      pyramidRef.current;

    if (
      !frame ||
      !pyramid
    ) {
      return;
    }

    const resizeObserver =
      new ResizeObserver(() => {
        recalculateScale();
      });

    resizeObserver.observe(
      frame
    );

    resizeObserver.observe(
      pyramid
    );

    window.addEventListener(
      "resize",
      recalculateScale
    );

    window.addEventListener(
      "orientationchange",
      recalculateScale
    );

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        recalculateScale
      );

      window.removeEventListener(
        "orientationchange",
        recalculateScale
      );
    };
  }, [
    cardSize,
    recalculateScale,
    state.pyramid,
  ]);

  return (
    <section className="w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 px-2 py-5 sm:px-6 sm:py-8">
      <h2 className="mb-5 text-center text-2xl font-black text-yellow-400 sm:mb-8 sm:text-3xl">
        Pyramide
      </h2>

      <div
        ref={frameRef}
        className="relative w-full overflow-hidden"
        style={{
          height:
            scaledHeight !== null
              ? `${scaledHeight}px`
              : "auto",
        }}
      >
        <div
          ref={pyramidRef}
          className="absolute left-1/2 top-0 flex w-max origin-top flex-col items-center gap-2.5 sm:gap-4"
          style={{
            transform:
              `translateX(-50%) scale(${scale})`,
          }}
        >
          {state.pyramid.map(
            (
              row,
              rowIndex
            ) => (
              <div
                key={rowIndex}
                className="flex w-max justify-center gap-1.5 sm:gap-3"
              >
                {row.map(
                  (
                    pyramidCard,
                    columnIndex
                  ) => {
                    const isActive =
                      currentVisualRow ===
                        rowIndex &&
                      currentColumn ===
                        columnIndex &&
                      !pyramidCard.hidden;

                    const isPrevious =
                      !pyramidCard.hidden &&
                      !isActive;

                    return (
                      <PyramidCard
                        key={`${rowIndex}-${columnIndex}`}
                        card={
                          pyramidCard.card
                        }
                        hidden={
                          pyramidCard.hidden
                        }
                        active={
                          isActive
                        }
                        dimmed={
                          isPrevious
                        }
                        size={
                          cardSize
                        }
                        label={
                          pyramidCard.hidden
                            ? `Carte cachée, ligne ${rowIndex + 1}, colonne ${columnIndex + 1}`
                            : isActive
                              ? `Carte active, ligne ${rowIndex + 1}, colonne ${columnIndex + 1}`
                              : `Carte révélée, ligne ${rowIndex + 1}, colonne ${columnIndex + 1}`
                        }
                      />
                    );
                  }
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}