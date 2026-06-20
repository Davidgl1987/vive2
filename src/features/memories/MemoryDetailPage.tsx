import { CalendarDays, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChallengeCelebration } from '../../components/challenge/ChallengeCelebration';
import { OwnPlanPhotoButton } from '../../components/memories/OwnPlanPhotoButton';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { FeedbackModal } from '../../components/ui/FeedbackModal';
import { PageHeader } from '../../components/ui/PageHeader';
import { PhotoFallback } from '../../components/ui/PhotoFallback';
import { useAppStore } from '../../store/useAppStore';
import { interpolate, messages } from '../../i18n';
import { fileToDataUrl } from '../../utils/files';
import { formatLongDate } from '../../utils/format';
import { getPartnerPhotos, resolveMemoryPhotos } from '../../utils/memoryPhotos';
import { findPlanById } from '../../utils/plans';
import { shareMemory } from '../../utils/share';

export const MemoryDetailPage = () => {
  const { memoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pendingCelebrationChallengeId = useAppStore(
    (state) => state.pendingCelebrationChallengeId,
  );
  const celebrationChallenge = useAppStore((state) =>
    state.completedChallenges.find(
      (challenge) => challenge.id === state.pendingCelebrationChallengeId,
    ),
  );
  const dismissChallengeCelebration = useAppStore(
    (state) => state.dismissChallengeCelebration,
  );
  const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(() =>
    (location.state as { celebrate?: boolean } | null)?.celebrate &&
    !pendingCelebrationChallengeId
      ? {
          title: '¡Plan completado!',
          message: 'Ya está guardado como recuerdo para volver a él cuando os apetezca.',
        }
      : null,
  );
  const memory = useAppStore((state) => state.memories.find((item) => item.id === memoryId));
  const preferences = useAppStore((state) => state.preferences);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const saveMemory = useAppStore((state) => state.saveMemory);
  const customPlans = useAppStore((state) => state.customPlans);

  if (!memory) {
    return <div className="pt-10 text-center text-mist">Recuerdo no encontrado.</div>;
  }

  const handleShare = async (target: Parameters<typeof shareMemory>[1]) => {
    const result = await shareMemory(memory, target);
    if (result === 'copied-instagram' || result === 'copied') {
      setFeedback({
        title: 'Texto copiado',
        message:
          result === 'copied-instagram'
            ? 'Lo hemos copiado para que puedas pegarlo en Instagram.'
            : 'Lo hemos copiado para que puedas compartirlo donde quieras.',
      });
    }
  };
  const handleOwnPhoto = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    const partnerPhotos = {
      ...memory.partnerPhotos,
      [currentPartnerId]: dataUrl,
    };
    saveMemory({
      ...memory,
      partnerPhotos,
      photos: Object.values(partnerPhotos).filter(Boolean) as string[],
      updatedAt: new Date().toISOString(),
    });
    const partnerName = currentPartnerId === 'partner_one'
      ? preferences.partnerOneName
      : preferences.partnerTwoName;
    setFeedback({
      title: messages.pages.memoryDetail.photos.updatedTitle,
      message: interpolate(messages.pages.memoryDetail.photos.updatedMessage, {
        name: partnerName,
      }),
    });
  };
  const handleRemoveOwnPhoto = () => {
    const ownPhoto = memory.partnerPhotos?.[currentPartnerId];
    if (!ownPhoto) return;

    const partnerPhotos = { ...memory.partnerPhotos };
    delete partnerPhotos[currentPartnerId];
    saveMemory({
      ...memory,
      partnerPhotos,
      photos: Object.values(partnerPhotos).filter(Boolean) as string[],
      updatedAt: new Date().toISOString(),
    });
    setFeedback({
      title: messages.pages.memoryDetail.photos.removedTitle,
      message: messages.pages.memoryDetail.photos.removedMessage,
    });
  };
  const partnerPhotos = getPartnerPhotos(memory);
  const planImage = findPlanById(customPlans, memory.planId)?.cover;
  const displayPhotos = resolveMemoryPhotos(memory, planImage);

  return (
    <div className="space-y-5 pb-4">
      <PageHeader backTo="/memories" subtitle="Guardado para no olvidar este momento." title={memory.planTitle} />

      <div className="overflow-hidden rounded-[30px] bg-surface shadow-soft">
        {displayPhotos.length >= 2 ? (
          <div className="grid h-64 grid-cols-2">
            {displayPhotos.slice(0, 2).map((photo, index) => (
              <PhotoFallback
                key={`${memory.id}-${index}`}
                alt={memory.planTitle}
                className="h-64 w-full object-cover"
                src={photo}
              />
            ))}
          </div>
        ) : (
          <PhotoFallback
            alt={memory.planTitle}
            className="h-64 w-full object-cover"
            src={displayPhotos[0]}
          />
        )}
        <OwnPlanPhotoButton
          embedded
          hasPhoto={Boolean(memory.partnerPhotos?.[currentPartnerId])}
          onRemovePhoto={handleRemoveOwnPhoto}
          onSelectPhoto={handleOwnPhoto}
        />
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Chip>romantico</Chip>
          <Chip>recuerdo</Chip>
          <Chip>favorito</Chip>
        </div>
        <div className="space-y-3 text-sm text-mist">
          <p className="inline-flex items-center gap-2">
            <CalendarDays size={16} />
            {formatLongDate(memory.date)}
          </p>
          {memory.locationName ? (
            <p className="inline-flex items-center gap-2">
              <MapPin size={16} />
              {memory.locationName}
            </p>
          ) : null}
        </div>
        {memory.note ? <p className="text-base leading-7 text-mist/90">{memory.note}</p> : null}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-ink">Compartir</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" onClick={() => handleShare('instagram')}>
            Instagram
          </Button>
          <Button type="button" variant="secondary" onClick={() => handleShare('whatsapp')}>
            WhatsApp
          </Button>
          <Button type="button" variant="secondary" onClick={() => handleShare('facebook')}>
            Facebook
          </Button>
          <Button type="button" variant="secondary" onClick={() => handleShare('more')}>
            Mas
          </Button>
        </div>
      </Card>

      <FeedbackModal
        message={feedback?.message ?? ''}
        open={Boolean(feedback)}
        title={feedback?.title ?? ''}
        onClose={() => setFeedback(null)}
      />

      <ChallengeCelebration
        challenge={celebrationChallenge}
        onContinue={dismissChallengeCelebration}
        onCreateBook={() => {
          if (!celebrationChallenge) return;
          dismissChallengeCelebration();
          navigate(`/album?challenge=${celebrationChallenge.id}`);
        }}
      />
    </div>
  );
};
