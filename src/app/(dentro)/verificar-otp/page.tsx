export const dynamic = "force-dynamic"; 

import loaddynamic from 'next/dynamic';

const VerificarOTP = loaddynamic(() => import('@/components/verificarotp'), {
  ssr: false,
});

export default function Page() {
  return <VerificarOTP/>;
}