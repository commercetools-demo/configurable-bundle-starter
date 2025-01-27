import React from 'react';
import BundleListPage from '../components/pages/bundle-list-page';

type Props = {
  linkToWelcome: string;
};

const BundleListRoute = (props: Props) => {
  return <BundleListPage />;
};

export default BundleListRoute;
