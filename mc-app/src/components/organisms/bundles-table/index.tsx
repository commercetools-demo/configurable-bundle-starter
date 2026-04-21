import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import DataTable from '@commercetools-uikit/data-table';
import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { Link, useHistory } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { BundleResponse } from '../../../hooks/use-configurable-bundles/types';
import ReferenceText from '../reference-input/reference-text';

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const Skeleton = styled.div`
  height: 14px;
  width: 120px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const BundlesTable = ({ parentUrl, bundles }: { parentUrl: string, bundles: BundleResponse[]}) => {
  const { push } = useHistory();
  const context = useApplicationContext();
  const getExternalUrl = (id: string) =>
    `/${context.project?.key}/products/${id}`;

  const columns = [
    {
      key: 'product',
      label: 'Product',
      renderItem: (row: BundleResponse) => {
        const id = row.value?.mainProductReference?.id;
        if (!id) return NO_VALUE_FALLBACK;
        return (
          <ReferenceText
            value={{ id, typeId: 'product' }}
            loadingFallback={<Skeleton />}
          />
        );
      },
    },
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
          <ExternalLinkIcon color='primary'/>
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
