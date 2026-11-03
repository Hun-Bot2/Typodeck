import type { Metadata } from 'next';
import { StudyApp } from '../../components/study/StudyApp';

export const metadata: Metadata = {
  title: '시각 계층 평가 — Typodeck Studio',
};

export default function StudyPage() {
  return <StudyApp />;
}
