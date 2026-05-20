import { Link, useNavigate } from 'react-router-dom';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/Logo';
import { useScenarioStore } from '@/features/scenario-v2/store';
import { BeforeAfterToggle } from '@/features/comparison/BeforeAfterToggle';
import { togglePresentation } from '@/lib/presentation-mode';

export function TopBar() {
  const scenario = useScenarioStore((s) => s.scenario);
  const presentation = useScenarioStore((s) => s.presentation);
  const navigate = useNavigate();

  if (presentation) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-surface-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark className="h-7 w-7" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-ink-primary">
              PRODUCT EXPERIENCE CENTER
            </span>
            <span className="text-[10px] font-medium text-ink-muted">v2 · Cowork+</span>
          </div>
          <Badge variant="brand" className="ml-1">
            Beta
          </Badge>
        </Link>

        {scenario && (
          <div className="ml-4 hidden flex-col leading-none md:flex">
            <span className="text-sm font-semibold text-ink-primary">
              {scenario.title}
            </span>
            {scenario.subtitle && (
              <span className="text-xs text-ink-muted">{scenario.subtitle}</span>
            )}
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          {scenario && <BeforeAfterToggle />}
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            다른 시나리오 체험
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePresentation}
            aria-label="발표 모드"
          >
            {presentation ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
