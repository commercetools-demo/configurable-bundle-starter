import React from 'react';
import CreateNewSchemaPage from '../components/pages/create-new-schema-page';

type Props = {
  linkToWelcome: string;
};

const CreateSchemaRoute = (props: Props) => {
  return <CreateNewSchemaPage />;
};

export default CreateSchemaRoute;
