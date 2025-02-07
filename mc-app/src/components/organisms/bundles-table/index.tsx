import React, { useEffect, useState } from 'react';
import DataTable from '@commercetools-uikit/data-table';
import { useIntl } from 'react-intl';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { useConfigurableBundles } from '../../../hooks/use-configurable-bundles';
import { BundleResponse } from '../../../hooks/use-configurable-bundles/types';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import { Link, useHistory } from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const BundlesTable = ({ parentUrl }: { parentUrl: string }) => {
  const { push } = useHistory();
  const { getBundles } = useConfigurableBundles();
  const context = useApplicationContext();
  const getExternalUrl = (id: string) =>
    `/${context.project?.key}/products/${id}`;

  const columns = [
    {
      key: 'type',
      label: 'Type',
      renderItem: (row: BundleResponse) =>
        row.value?.bundleType?.label || NO_VALUE_FALLBACK,
    },
    {
      key: 'key',
      label: 'key',
      renderItem: (row: BundleResponse) => row.key || NO_VALUE_FALLBACK,
    },
    {
      key: 'mainProduct',
      label: 'Main Product',
      renderItem: (row: BundleResponse) => (
        <Link
          to={getExternalUrl(row.value?.mainProductReference?.id || '')}
          target="_blank"
        >
          <ExternalLinkIcon />
        </Link>
      ),
    },
  ];

  const [bundles, setBundles] = useState<BundleResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBundles().then((bundles) => {
      setBundles(bundles);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <ContentNotification type="info">
        <Text.Body>Loading...</Text.Body>
      </ContentNotification>
    );
  }

  if (!bundles?.length) {
    return (
      <ContentNotification type="error">
        <Text.Body>No bundles found</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <DataTable<BundleResponse>
      isCondensed
      columns={columns}
      rows={bundles || []}
      onRowClick={(row) => push(`${parentUrl}/bundle/${row.key}`)}
    />
  );
};

export default BundlesTable;
