import React from 'react';
import { useParams } from 'react-router';

type Props = {
  linkToWelcome: string;
};

const SchemaRoute = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  return <div>SchemaRoute</div>;
};

export default SchemaRoute;
