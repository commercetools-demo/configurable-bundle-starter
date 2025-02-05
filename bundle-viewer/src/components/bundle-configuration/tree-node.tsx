import {
  AngleRightIcon,
  AngleDownIcon,
  PagesIcon,
} from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import { useState } from 'react';
import styled from 'styled-components';
import { TTreeNode } from './product-reference-tree';
import localize from '../../localize';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { ExternalLinkIcon } from '@commercetools-uikit/icons';
import { Link } from 'react-router-dom';

const NodeWrapper = styled.div`
  margin-left: 16px;
`;

const NodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
  }
`;

const NodeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ParentInfo = styled(Text.Detail)`
  color: #666;
  margin-left: 8px;
`;

const TreeNode: React.FC<{ node: TTreeNode }> = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children.length > 0;
  const context = useApplicationContext();
  const getExternalUrl = (id: string) =>
    `/${context.project?.key}/products/${id}`;

  return (
    <NodeWrapper>
      <NodeRow onClick={() => setIsExpanded(!isExpanded)}>
        <NodeContent>
          {hasChildren ? (
            isExpanded ? (
              <AngleDownIcon size="small" />
            ) : (
              <AngleRightIcon size="small" />
            )
          ) : (
            <div style={{ width: '16px' }} />
          )}
          <PagesIcon size="small" />
          <Text.Body>
            {localize({
              obj: node.obj,
              key: 'name',
              language: context.dataLocale,
              fallback: context.project?.languages?.[0],
            }) ||
              node.obj?.key ||
              node.id}
          </Text.Body>
          {node.parentName && <ParentInfo>({node.parentName})</ParentInfo>}
          <Link to={getExternalUrl(node?.id)} target="_blank">
            <ExternalLinkIcon color="info" size="10" />
          </Link>
        </NodeContent>
      </NodeRow>

      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </NodeWrapper>
  );
};

export default TreeNode;
