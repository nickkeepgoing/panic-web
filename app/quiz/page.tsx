import { getProjects } from '@/lib/data';
import { QuizFlow } from '@/components/QuizFlow';

export const revalidate = 60;

export default async function QuizPage() {
  const projects = await getProjects();
  return (
    <div className="mx-auto max-w-3xl">
      <QuizFlow projects={projects} />
    </div>
  );
}
