import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function IndexPage() {
  const { push } = useRouter();

  useEffect(() => {
    push('/api/graphql');
  }, []);

  return <div>Redirect in progress</div>;
}
