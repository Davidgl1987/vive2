import { BookHeart, CalendarHeart, ChevronDown, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChallengeProgress } from '../../components/challenge/ChallengeProgress';
import { MemoryCard } from '../../components/plans/MemoryCard';
import { Card } from '../../components/ui/Card';
import { PhotoFallback } from '../../components/ui/PhotoFallback';
import { interpolate, messages } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import type { CompletedPlan } from '../../types/memory';
import { formatLongDate } from '../../utils/format';
import { resolveMemoryPhotos } from '../../utils/memoryPhotos';
import { findPlanById } from '../../utils/plans';

const albumLinkClass =
  'inline-flex w-full items-center justify-center gap-2 rounded-full bg-blush px-5 py-3 text-sm font-semibold text-surface shadow-soft transition hover:bg-blushDark';

export const MemoriesPage = () => {
  const memories = useAppStore((state) => state.memories);
  const activeChallenge = useAppStore((state) => state.activeChallenge);
  const completedChallenges = useAppStore((state) => state.completedChallenges);
  const customPlans = useAppStore((state) => state.customPlans);
  const memoriesById = new Map(memories.map((memory) => [memory.id, memory]));
  const resolveMemories = (memoryIds: string[]) =>
    memoryIds
      .map((memoryId) => memoriesById.get(memoryId))
      .filter((memory): memory is CompletedPlan => Boolean(memory));
  const activeMemories = resolveMemories(activeChallenge.memoryIds).reverse();
  const getMemoryPhotos = (memory: CompletedPlan) =>
    resolveMemoryPhotos(memory, findPlanById(customPlans, memory.planId)?.cover);

  return (
    <div className="space-y-6 pb-4">
      <header className="pt-2">
        <h1 className="font-heading text-[2rem] font-bold leading-none text-ink">{messages.pages.memories.title}</h1>
        <p className="page-subtitle mt-2">{messages.pages.memories.subtitle}</p>
      </header>

      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <CalendarHeart className="text-blushDark" size={18} />
          <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-mist">
            {messages.pages.memories.current.sectionTitle}
          </h2>
        </div>
        <Card className="space-y-5">
          <div>
            <h3 className="font-heading text-2xl font-bold text-ink">
              {formatLongDate(activeChallenge.startedAt)}
            </h3>
            <p className="mt-1 text-sm font-semibold text-mist">
              {interpolate(messages.pages.memories.current.goal, { count: activeChallenge.goal })}
            </p>
          </div>
          <ChallengeProgress completed={activeChallenge.memoryIds.length} goal={activeChallenge.goal} />
          <div className="grid gap-4">
            {activeMemories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                planImage={findPlanById(customPlans, memory.planId)?.cover}
              />
            ))}
            {activeMemories.length === 0 ? (
              <p className="rounded-[20px] bg-eggshell px-4 py-5 text-center text-sm text-mist">
                {messages.pages.memories.current.empty}
              </p>
            ) : null}
          </div>
          <Link className={albumLinkClass} to={`/album?challenge=${activeChallenge.id}`}>
            <BookHeart size={17} />
            {messages.pages.memories.album}
          </Link>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Trophy className="text-blushDark" size={18} />
          <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-mist">
            {messages.pages.memories.completed.sectionTitle}
          </h2>
        </div>
        {completedChallenges.length > 0 ? (
          <div className="grid gap-3">
            {completedChallenges.map((challenge) => {
              const challengeMemories = resolveMemories(challenge.memoryIds);
              const challengePhotos = challengeMemories.flatMap((memory) =>
                getMemoryPhotos(memory).map((photo, index) => ({
                  id: `${memory.id}-${index}`,
                  memoryId: memory.id,
                  photo,
                  title: memory.planTitle,
                })),
              );

              return (
                <Card key={challenge.id} className="!p-0">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
                      <div>
                        <h3 className="font-heading text-xl font-bold leading-tight text-ink">
                          {interpolate(messages.pages.memories.completed.dateRange, {
                            start: formatLongDate(challenge.startedAt),
                            end: formatLongDate(challenge.completedAt),
                          })}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-mist">
                          {interpolate(messages.pages.memories.completed.goal, { count: challenge.goal })}
                        </p>
                      </div>
                      <ChevronDown className="shrink-0 text-mist transition group-open:rotate-180" size={20} />
                    </summary>
                    <div className="space-y-4 border-t border-ink/5 p-5">
                      {challengePhotos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {challengePhotos.map((photo) => (
                            <Link key={photo.id} className="group/photo relative overflow-hidden rounded-[18px]" to={`/memories/${photo.memoryId}`}>
                              <PhotoFallback
                                alt={photo.title}
                                className="h-32 w-full object-cover transition group-hover/photo:scale-105"
                                src={photo.photo}
                              />
                              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-overlay/75 to-transparent px-3 pb-2 pt-8 text-xs font-bold text-surface">
                                {photo.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-sm text-mist">{messages.pages.memories.completed.noPhotos}</p>
                      )}
                      <Link className={albumLinkClass} to={`/album?challenge=${challenge.id}`}>
                        <BookHeart size={17} />
                        {messages.pages.memories.album}
                      </Link>
                    </div>
                  </details>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center">
            <p className="text-sm text-mist">{messages.pages.memories.completed.empty}</p>
          </Card>
        )}
      </section>
    </div>
  );
};
