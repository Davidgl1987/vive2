import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { OwnPlanPhotoButton } from '../../components/memories/OwnPlanPhotoButton';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StarRating } from '../../components/ui/StarRating';
import { useAppStore } from '../../store/useAppStore';
import type { CompletedPlan } from '../../types/memory';
import { getTodayDateInput } from '../../utils/format';
import { createId } from '../../utils/id';
import { fileToDataUrl } from '../../utils/files';
import { findPlanById } from '../../utils/plans';

const schema = z.object({
  date: z.string().min(1, 'Elegid una fecha.'),
  locationName: z.string().optional(),
  note: z.string().optional(),
  rating: z.number().min(1).max(5),
});

type CompleteFormValues = z.infer<typeof schema>;

export const CompletePlanPage = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const saveMemory = useAppStore((state) => state.saveMemory);
  const coupleId = useAppStore((state) => state.coupleId);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const customPlans = useAppStore((state) => state.customPlans);
  const plan = findPlanById(customPlans, planId);
  const [ownPhoto, setOwnPhoto] = useState<string>();
  const todayDate = getTodayDateInput();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<CompleteFormValues>({
    defaultValues: {
      date: todayDate,
      locationName: '',
      note: '',
      rating: 5,
    },
    resolver: zodResolver(schema),
  });

  if (!plan) {
    return <div className="pt-10 text-center text-mist">Plan no encontrado.</div>;
  }

  const onSubmit = async (values: CompleteFormValues) => {
    const partnerPhotos = ownPhoto ? { [currentPartnerId]: ownPhoto } : {};
    const photos = ownPhoto ? [ownPhoto] : [];
    const locationName = values.locationName?.trim();
    const note = values.note?.trim();
    const memory: CompletedPlan = {
      id: createId(),
      coupleId,
      planId: plan.id,
      planTitle: plan.plan,
      date: values.date,
      locationName: locationName || undefined,
      locationAddress: locationName || undefined,
      partnerPhotos,
      photos,
      note: note || '',
      rating: values.rating as 1 | 2 | 3 | 4 | 5,
      sharedCount: 0,
      addToAlbum: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveMemory(memory);
    navigate(`/memories/${memory.id}`, {
      state: {
        celebrate: true,
      },
    });
  };

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        backTo={`/plans/${plan.id}`}
        subtitle="Guardad este recuerdo para no olvidar el momento."
        title="Guardad el recuerdo"
      />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Fecha</span>
            <input className="field" type="date" min={todayDate} {...register('date')} />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Lugar opcional</span>
            <input
              className="field"
              placeholder="Parque del Retiro, Madrid"
              {...register('locationName')}
            />
          </label>

          <div>
            <span className="mb-3 block text-sm font-semibold text-ink">Fotos opcionales</span>
            <OwnPlanPhotoButton
              hasPhoto={Boolean(ownPhoto)}
              onSelectPhoto={async (file) => setOwnPhoto(await fileToDataUrl(file))}
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">¿Como ha ido? Opcional</span>
            <textarea
              className="field min-h-32 resize-none"
              maxLength={280}
              placeholder={plan.preguntaRecuerdo}
              {...register('note')}
            />
          </label>

          <div>
            <span className="mb-3 block text-sm font-semibold text-ink">Valoracion</span>
            <StarRating
              value={watch('rating')}
              onChange={(rating) => setValue('rating', rating, { shouldValidate: true })}
            />
          </div>
        </Card>

        <Button disabled={isSubmitting} type="submit">
          Guardar recuerdo
        </Button>
      </form>
    </div>
  );
};
