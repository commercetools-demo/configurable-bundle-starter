import React from 'react';
import { useParams } from 'react-router';

type Props = {
  linkToWelcome: string;
};

const BundleRoute = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  return <div>BundleRoute</div>;
};

export default BundleRoute;
