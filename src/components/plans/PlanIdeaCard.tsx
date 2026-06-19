import { Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { messages } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const PlanIdeaCard = () => {
  const [idea, setIdea] = useState('');
  const addCustomPlan = useAppStore((state) => state.addCustomPlan);

  const handleAddIdea = (makeNext: boolean) => {
    if (idea.trim().length < 3) return;
    addCustomPlan(idea, makeNext);
    setIdea('');
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-1 text-blush" size={20} />
        <div>
          <h2 className="text-lg font-bold text-ink">{messages.components.planIdeaCard.title}</h2>
          <p className="mt-1 text-sm text-mist">
            {messages.components.planIdeaCard.description}
          </p>
        </div>
      </div>
      <input
        className="field"
        placeholder={messages.components.planIdeaCard.placeholder}
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Button fullWidth={false} type="button" variant="secondary" onClick={() => handleAddIdea(false)}>
          {messages.components.planIdeaCard.add}
        </Button>
        <Button fullWidth={false} type="button" onClick={() => handleAddIdea(true)}>
          {messages.components.planIdeaCard.next}
        </Button>
      </div>
    </Card>
  );
};
