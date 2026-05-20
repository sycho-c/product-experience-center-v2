import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Stage } from '@/stage/Stage';
import { TopBar } from '@/stage/TopBar';
import { PlaybackControls } from '@/stage/PlaybackControls';
import { Button } from '@/components/ui/button';
import { loadScenario } from '@/scenarios/_registry';
import { useScenarioStore } from '@/features/scenario-v2/store';
import { useKeyboardControls, useScenarioRunner } from '@/features/scenario-v2/runner';

export function ScenarioStageRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setScenario = useScenarioStore((s) => s.setScenario);
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useScenarioRunner();
  useKeyboardControls();

  useEffect(() => {
    let cancelled = false;
    if (!id) return;
    setLoaded(false);
    setNotFound(false);
    loadScenario(id)
      .then((s) => {
        if (cancelled) return;
        if (!s) {
          setNotFound(true);
          return;
        }
        setScenario(s);
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id, setScenario]);

  useEffect(() => {
    return () => {
      useScenarioStore.getState().setScenario(null);
      useScenarioStore.getState().setPlaying(false);
    };
  }, []);

  if (notFound) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-20 text-center">
        <AlertCircle className="h-10 w-10 text-accent-danger" />
        <h2 className="text-xl font-bold text-ink-primary">시나리오를 찾을 수 없습니다.</h2>
        <p className="text-sm text-ink-secondary">
          요청한 시나리오(<code>{id}</code>)가 레지스트리에 없습니다.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" /> 시나리오 목록으로
        </Button>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        {loaded ? (
          <Stage />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
            <span className="text-sm text-ink-muted">시나리오 로딩 중...</span>
          </div>
        )}
      </div>
      <div className="border-t border-surface-border bg-white/70 backdrop-blur">
        <PlaybackControls />
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-6 pb-3 text-xs text-ink-muted">
          <Link to="/" className="hover:text-ink-primary">
            ← 다른 시나리오 선택
          </Link>
        </div>
      </div>
    </div>
  );
}
