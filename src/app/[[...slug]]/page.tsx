import '../../index.css';
import { ClientOnly } from './client';

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: [''] },
    { slug: ['projects'] },
    { slug: ['showcase'] },
  ];
}

export default function Page() {
  return <ClientOnly />;
}
