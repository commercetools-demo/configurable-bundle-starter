import React, { useEffect, useState } from 'react';
import { useSchema } from '../hooks/use-schema';
import { SchemaResponse } from '../hooks/use-schema/types';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import SchemaList from '../components/organisms/schema-list';
import { useFeatureFlags } from '../hooks/use-feature-flags';
type Props = {
  linkToWelcome: string;
};

const SchemasRoute = (props: Props) => {
  const { getSchemas } = useSchema();
  const { customObjectBundle } = useFeatureFlags();
  const [schemas, setSchemas] = useState<SchemaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    getSchemas().then((schemas) => {
      setSchemas(schemas);
      setIsLoading(false);
    });
  }, []);

  if (!customObjectBundle) {
    <ContentNotification type="info">
      <Text.Body>Your project is not configured to use this page.</Text.Body>
    </ContentNotification>;
  }

  if (isLoading) {
    return (
      <ContentNotification type="info">
        <Text.Body>Loading schemas...</Text.Body>
      </ContentNotification>
    );
  }

  if (!schemas?.length) {
    return (
      <ContentNotification type="info">
        <Text.Body>No schemas found</Text.Body>
      </ContentNotification>
    );
  }

  return <SchemaList schemas={schemas} />;
};

export default SchemasRoute;
