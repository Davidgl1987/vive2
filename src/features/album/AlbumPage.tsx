import { BookHeart, Download, Printer } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FeedbackModal } from '../../components/ui/FeedbackModal';
import { PageHeader } from '../../components/ui/PageHeader';
import { PhotoFallback } from '../../components/ui/PhotoFallback';
import { useAppStore } from '../../store/useAppStore';
import { findPlanById } from '../../utils/plans';

export const AlbumPage = () => {
  const [searchParams] = useSearchParams();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const preferences = useAppStore((state) => state.preferences);
  const allMemories = useAppStore((state) => state.memories);
  const activeChallenge = useAppStore((state) => state.activeChallenge);
  const completedChallenges = useAppStore((state) => state.completedChallenges);
  const customPlans = useAppStore((state) => state.customPlans);
  const challengeId = searchParams.get('challenge');
  const selectedChallenge = activeChallenge.id === challengeId
    ? activeChallenge
    : completedChallenges.find((challenge) => challenge.id === challengeId);
  const selectedMemoryIds = new Set(selectedChallenge?.memoryIds ?? []);
  const memories = selectedChallenge
    ? allMemories.filter((memory) => selectedMemoryIds.has(memory.id))
    : allMemories;
  const albumImages = useMemo(
    () =>
      memories.flatMap((memory) => {
        const partnerPhotos = Object.values(memory.partnerPhotos ?? {}).filter(Boolean) as string[];
        const uploadedPhotos = partnerPhotos.length > 0 ? partnerPhotos : memory.photos;
        if (uploadedPhotos.length > 0) {
          return uploadedPhotos.map((src, index) => ({
            id: `${memory.id}-${index}`,
            alt: memory.planTitle,
            src,
            title: memory.planTitle,
          }));
        }

        const planImage = findPlanById(customPlans, memory.planId)?.cover;
        return planImage
          ? [{
              id: `${memory.id}-fallback`,
              alt: memory.planTitle,
              src: planImage,
              title: memory.planTitle,
            }]
          : [];
      }),
    [customPlans, memories],
  );

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        backTo="/memories"
        subtitle={
          selectedChallenge
            ? `Los ${selectedChallenge.goal} recuerdos de este reto, juntos.`
            : 'Cread un libro con vuestros mejores recuerdos.'
        }
        title={selectedChallenge ? `Libro del reto de ${selectedChallenge.goal}` : 'Album / libro'}
      />

      <section className="solid-card motion-card overflow-hidden rounded-[30px]">
        <div className="space-y-5 bg-gradient-to-br from-eggshell via-card to-primarySoft p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blush">
                Portada Vive2
              </p>
              <h2 className="mt-3 font-heading text-[2.35rem] font-bold leading-none text-ink">
                Nuestros momentos
              </h2>
              <p className="mt-3 text-sm font-semibold text-mist">
                {memories.length} recuerdos para {preferences.coupleName}
              </p>
            </div>
            <div className="rounded-[22px] bg-icyAqua p-3 text-accentDark shadow-[0_8px_0_rgb(var(--color-overlay)/0.05)]">
              <BookHeart size={28} />
            </div>
          </div>

          <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
            {albumImages.map((image) => (
              <PhotoFallback
                key={image.id}
                alt={image.alt}
                className="h-56 w-40 flex-none rounded-[24px] object-cover shadow-[0_10px_24px_rgb(var(--color-overlay)/0.12)]"
                src={image.src}
              />
            ))}
            {albumImages.length === 0 ? (
              <div className="flex h-56 w-40 flex-none items-center justify-center rounded-[24px] border-2 border-dashed border-ink/10 bg-eggshell text-center text-xs font-bold uppercase tracking-[0.18em] text-mist">
                Siguiente recuerdo
              </div>
            ) : null}
          </div>

          <p className="rounded-[22px] bg-surface p-4 text-sm font-semibold leading-relaxed text-mist">
            Un libro visual, cálido y listo para crecer con cada plan completado.
          </p>
        </div>
      </section>

      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <Printer className="text-blush" size={20} />
          <div>
            <h2 className="text-lg font-bold text-ink">Preparado para imprimir</h2>
            <p className="text-sm text-mist">MVP listo para exportar a PDF en una fase siguiente.</p>
          </div>
        </div>
        <div className="grid gap-3">
          <Button type="button" onClick={() => setFeedbackOpen(true)}>
            <Download className="mr-2 inline-block" size={16} />
            Crear libro
          </Button>
          <a
            className="text-center text-sm font-semibold text-blush"
            href="https://www.hofmann.es/"
            rel="noreferrer"
            target="_blank"
          >
            Imprimir con Hofmann desde 19,95 EUR
          </a>
        </div>
      </Card>

      <FeedbackModal
        message="La exportación PDF queda preparada para conectarla en la siguiente iteración."
        open={feedbackOpen}
        title="Libro preparado"
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
};
