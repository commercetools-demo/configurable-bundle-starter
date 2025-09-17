import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import DataTable from '@commercetools-uikit/data-table';
import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { Link, useHistory } from 'react-router-dom';
import { BundleResponse } from '../../../hooks/use-configurable-bundles/types';

const BundlesTable = ({ parentUrl, bundles }: { parentUrl: string, bundles: BundleResponse[]}) => {
  const { push } = useHistory();
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
