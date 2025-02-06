import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CONTAINER, useSchema } from '../hooks/use-schema';
import { SchemaResponse } from '../hooks/use-schema/types';
import SchemaDetails from '../components/organisms/schema-details';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
type Props = {
  linkToWelcome: string;
};

const SchemaRoute = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const { getSchema } = useSchema();
  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  useEffect(() => {
    getSchema(id).then((schema) => {
      setSchema(schema);
    });
  }, [id]);

  if (!schema) {
    return (
      <ContentNotification type="info">
        <Text.Body>Loading schema...</Text.Body>
      </ContentNotification>
    );
  }

  return <SchemaDetails schema={schema} />;
};

export default SchemaRoute;
