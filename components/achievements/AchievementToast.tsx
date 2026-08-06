"use client";

import type {
  AchievementDefinition,
} from "@/lib/profileProgress/types";

interface AchievementToastProps {
  achievement:
    AchievementDefinition | null;

  visible: boolean;
}

export default function AchievementToast({
  achievement,
  visible,
}: AchievementToastProps) {
  if (!achievement) {
    return null;
  }

  return (
    <div
      className={`
        fixed
        left-1/2
        top-6
        z-[200]
        w-[92%]
        max-w-sm
        -translate-x-1/2
        rounded-3xl
        border
        border-yellow-400/40
        bg-zinc-900
        p-5
        shadow-2xl
        transition-all
        duration-300
        ${
          visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 pointer-events-none opacity-0"
        }
      `}
    >
      <div className="flex items-center gap-4">
        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-yellow-400
            text-3xl
          "
          aria-hidden="true"
        >
          {achievement.icon}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-widest
              text-yellow-400
            "
          >
            Nouveau succès
          </p>

          <h2
            className="
              mt-1
              text-lg
              font-black
              text-white
            "
          >
            {achievement.title}
          </h2>

          <p
            className="
              mt-1
              text-sm
              leading-5
              text-zinc-400
            "
          >
            {achievement.description}
          </p>

          <p
            className="
              mt-2
              text-xs
              font-black
              text-yellow-400
            "
          >
            +{achievement.xpReward} XP
          </p>
        </div>
      </div>
    </div>
  );
}