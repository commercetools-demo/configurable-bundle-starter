import React from 'react';
import { SchemaDetailsPage } from '../components/pages/schema-details-page';

type Props = {
  linkToWelcome: string;
};

const SchemaRoute = (props: Props) => {
  return <SchemaDetailsPage />;
};

export default SchemaRoute;
