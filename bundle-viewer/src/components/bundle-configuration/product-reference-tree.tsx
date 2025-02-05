import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Text from '@commercetools-uikit/text';
import { ProductProjection } from '@commercetools/platform-sdk';
import TreeNode from './tree-node';
import localize from '../../localize';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

// Styled components
const TreeWrapper = styled.div`
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;
const NodeWrapper = styled.div`
  margin-left: 16px;
  margin-top: 16px;
`;

export interface TTreeNode extends Product {
  children: TTreeNode[];
}

interface Product {
  typeId: string;
  id: string;
  obj: ProductProjection;
  parentId?: string;
  parentName?: string;
}

const flattenProductsFromAttributes = (
  data: Product | ProductProjection,
  parentId?: string,
  parentName?: string
): Product[] => {
  if (!data || typeof data !== 'object') {
    return [];
  }

  let products: Product[] = [];

  if ('typeId' in data && data.typeId === 'product' && data.id && data.obj) {
    const product = {
      ...data,
      parentId,
      parentName,
    };
    products.push(product);
    products = products.concat(
      flattenProductsFromAttributes(data.obj, data.id, parentName)
    );
  }

  if ('masterVariant' in data && data.masterVariant?.attributes) {
    data.masterVariant.attributes.forEach((attr) => {
      if (Array.isArray(attr.value)) {
        attr.value.forEach((val) => {
          products = products.concat(
            flattenProductsFromAttributes(val, parentId, attr.name)
          );
        });
      }
    });
  }

  return products;
};

const flattenProductsFromBundle = (
  data: any,
  parentId?: string,
  parentName?: string
): Product[] => {
  if (!data || typeof data !== 'object') {
    return [];
  }

  let products: Product[] = [];

  if (data.typeId === 'product' && data.id && data.obj) {
    const product = {
      ...data,
      parentId,
      parentName,
    };
    products.push(product);
    products = products.concat(
      flattenProductsFromBundle(data.obj, data.id, parentName)
    );
    return products;
  }

  if (data.product && typeof data.product === 'object') {
    return flattenProductsFromBundle(data.product, parentId, parentName);
  }

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        products = products.concat(
          flattenProductsFromBundle(item, parentId, key)
        );
      });
    } else if (typeof value === 'object' && value !== null) {
      products = products.concat(
        flattenProductsFromBundle(value, parentId, key)
      );
    }
  });

  return products;
};

const flattenProducts = (data: Product | ProductProjection): Product[] => {
  if (!data || typeof data !== 'object') {
    return [];
  }

  let products: Product[] = [];

  // Check which path exists and use appropriate method
  if ('resolvedBundle' in data && data.resolvedBundle) {
    products = flattenProductsFromBundle(data);
  } else if (
    'masterVariant' in data &&
    (data as ProductProjection).masterVariant?.attributes
  ) {
    products = flattenProductsFromAttributes(data);
  }

  // Remove duplicates based on product ID
  return Array.from(
    products
      .reduce((map, product) => {
        if (!map.has(product.id)) {
          map.set(product.id, product);
        }
        return map;
      }, new Map())
      .values()
  );
};

const buildTree = (flatProducts: Product[]): TTreeNode[] => {
  const productMap = new Map<string, TTreeNode>();
  const rootNodes: TTreeNode[] = [];

  // First, create all nodes with empty children arrays
  flatProducts.forEach((product) => {
    productMap.set(product.id, { ...product, children: [] });
  });

  // Then, establish parent-child relationships
  flatProducts.forEach((product) => {
    const node = productMap.get(product.id)!;

    if (product.parentId && productMap.has(product.parentId)) {
      const parent = productMap.get(product.parentId)!;
      parent.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
};

const ProductReferenceTree = ({ data }: { data: Product }) => {
  const context = useApplicationContext();
  const treeData = useMemo(() => {
    const flattenedProducts = flattenProducts(data);
    return buildTree(flattenedProducts);
  }, [data]);

  return (
    <TreeWrapper>
      <Text.Headline as="h2">Product Reference Tree</Text.Headline>
      <NodeWrapper>
        <Text.Body>
          {localize({
            obj: data,
            key: 'name',
            language: context.dataLocale,
            fallback: context.project?.languages?.[0],
          }) || data.id}
        </Text.Body>
      </NodeWrapper>
      {treeData.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </TreeWrapper>
  );
};

export default ProductReferenceTree;
